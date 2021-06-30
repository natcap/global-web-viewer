import sys
import os
import argparse
import math
import logging
from osgeo import osr
from osgeo import gdal
import numpy

import pygeoprocessing
import taskgraph

logging.basicConfig(
    level=logging.DEBUG,
    format=(
        '%(asctime)s (%(relativeCreated)d) %(levelname)s %(name)s'
        ' [%(funcName)s:%(lineno)d] %(message)s'),
    stream=sys.stdout)
LOGGER = logging.getLogger(__name__)

def new_rasterize_raster(base_raster_path, target_raster_path, vector_path):
    """ """
    raster_info = pygeoprocessing.get_raster_info(base_raster_path)
    # create mask for differentiating nodata in ocean and nodata covered by
    # land polygons. rasterize gadm0 layer onto input path
    pygeoprocessing.new_raster_from_base(
        base_raster_path, target_raster_path, raster_info['datatype'], [255])

    pygeoprocessing.rasterize(
        vector_path, target_raster_path, burn_values=[0.0])

if __name__ == "__main__":

    LOGGER.debug("Starting Reprojecting Processing")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data', 'pixel-data')

    gadm_0_1_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'GADM36_levels_0_1',
        'GADM36_levels_0_1', 'clipped_gadm36_0_lat60')
    gadm0_path = os.path.join(gadm_0_1_directory, 'gadm36_0_clipped.gpkg')

    sed_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Sediment-Retention',
        'realized_sedimentdeposition_nathab_md5_96c3424924c752e9b1f7ccfffe9b102a.tif')
    nit_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Nitrogen-Retention',
        'realized_nitrogenretention_nathab_md5_7656b23f9ad0eb1d55b18367bad00635.tif')

    raster_service_id_list = ['sed', 'nit']
    raster_service_path_list = [sed_retention_path, nit_retention_path]

    # create mask for differentiating nodata in ocean and nodata covered by
    # land polygons. rasterize gadm0 layer onto input path
    land_ocean_mask_dir = os.path.join(
        output_root_dir, 'land_ocean_mask_workspace')
    if not os.path.exists(land_ocean_mask_dir):
        os.mkdir(land_ocean_mask_dir)

    ### TaskGraph Set Up
    taskgraph_working_dir = os.path.join(
        land_ocean_mask_dir, '_taskgraph_working_dir')

    n_workers = -1
    task_graph = taskgraph.TaskGraph(taskgraph_working_dir, n_workers)
    ###

    for service_idx, pct_service in enumerate(raster_service_id_list):
        rasterize_dir = os.path.join(
            land_ocean_mask_dir, pct_service)
        if not os.path.exists(rasterize_dir):
            os.mkdir(rasterize_dir)

        rasterize_path = os.path.join(
            rasterize_dir, 'gadm36_0_clipped_rasterize.tif')

        input_rasterize_path = raster_service_path_list[service_idx]

        new_rasterize_task = task_graph.add_task(
            func=new_rasterize_raster,
            args=(
                input_rasterize_path, rasterize_path, gadm0_path
            ),
            target_path_list=[rasterize_path],
            task_name=f'new_rasterize_{service_idx}_task')

        new_rasterize_task.join()

        #rasterize_info = pygeoprocessing.get_raster_info(rasterize_path)
        #rasterize_nodata = rasterize_info['nodata'][0]

        input_raster_info = pygeoprocessing.get_raster_info(input_rasterize_path)
        input_nodata = input_raster_info['nodata'][0]

        input_nodata_path = os.path.join(
            rasterize_dir, f'{pct_service}_gadm36_0_clipped_nodata_mask.tif')

        rasterize_value = 0.0

        def nodata_op(base_array, rasterize_array):
            result_array = numpy.full_like(base_array, input_nodata)
            base_nodata_mask = numpy.isclose(base_array, input_nodata)
            rasterize_value_mask = numpy.isclose(rasterize_array, rasterize_value)
            result_value_mask = base_nodata_mask & rasterize_value_mask
            result_array[~base_nodata_mask] = base_array[~base_nodata_mask]
            result_array[result_value_mask] = rasterize_array[result_value_mask]

            return result_array

        nodata_mask_task = task_graph.add_task(
            func=pygeoprocessing.raster_calculator,
            args=(
                [(input_rasterize_path, 1), (rasterize_path, 1)], nodata_op,
                input_nodata_path, input_raster_info['datatype'], input_nodata,
                ),
            kwargs={
                'calc_raster_stats': False
            },
            target_path_list=[input_nodata_path],
            dependent_task_list=[new_rasterize_task],
            task_name=f'nodata_mask_{service_idx}_task')

        nodata_mask_task.join()

