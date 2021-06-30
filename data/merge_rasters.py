import os
import shutil
import sys
import logging
import numpy
import json
import tempfile
import pickle
from rtree import index
import shapely
import shapely.wkb
import shapely.speedups

from osgeo import gdal, osr, ogr

import pygeoprocessing
import taskgraph

logging.basicConfig(
    level=logging.DEBUG,
    format=(
        '%(asctime)s (%(relativeCreated)d) %(levelname)s %(name)s'
        ' [%(funcName)s:%(lineno)d] %(message)s'),
    stream=sys.stdout)
LOGGER = logging.getLogger(__name__)

logging.getLogger('taskgraph').setLevel('DEBUG')

def stitch_rasters_wrapper(
        input_path_band_list, target_base_path, output_path):
    """ """
    raster_out_dtype = gdal.GDT_Byte
    target_nodata_list = [255]
    pygeoprocessing.new_raster_from_base(
        target_base_path, output_path, raster_out_dtype, target_nodata_list)

    resample_method_list = len(input_path_band_list) * ['near']

    pygeoprocessing.stitch_rasters(
        input_path_band_list, resample_method_list, (output_path, 1))


if __name__ == "__main__":
    LOGGER.debug("Starting calculate_raster_percentiles Processing.")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data')

    if not os.path.exists(output_root_dir):
        os.makedirs(output_root_dir)

    hydro_basin_dir = os.path.join(output_root_dir, 'hybas_pct_rasters')

    sed_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Sediment-Retention',
        'realized_sedimentdeposition_nathab_md5_96c3424924c752e9b1f7ccfffe9b102a.tif')

    nit_retention_path = os.path.join(
        data_common_root_dir, 'pixel-data', 'Nitrogen-Retention',
        'realized_nitrogenretention_nathab_md5_7656b23f9ad0eb1d55b18367bad00635.tif')

    input_raster_path_list = [sed_retention_path, nit_retention_path]
    raster_service_id_list = ['sed', 'nit']

    ### TaskGraph Set Up
    taskgraph_working_dir = os.path.join(
        output_root_dir, '_taskgraph_merge_working_dir')

    n_workers = 4
    task_graph = taskgraph.TaskGraph(taskgraph_working_dir, n_workers)
    ###

    hybas_zones = ['af', 'ar', 'as', 'au', 'eu', 'gr', 'na', 'sa', 'si']

    for service_id, service_raster_path in zip(raster_service_id_list, input_raster_path_list):
        hybas_raster_path_list = [
            os.path.join(hydro_basin_dir, f'{service_id}_hybas_{x}_lev08_pct_stitched.tif') for x in hybas_zones]
        hybas_path_band_list = [(x, 1) for x in hybas_raster_path_list]

        # Merge individual pct rasters into one
        stitched_pct_out_path = os.path.join(
            hydro_basin_dir,
            f'{service_id}_hybas_lev08_pct_stitched.tif')

        stitch_percentiles_task = task_graph.add_task(
            func=stitch_rasters_wrapper,
            args=(
                hybas_path_band_list, service_raster_path,
                stitched_pct_out_path),
            target_path_list=[stitched_pct_out_path],
            task_name=f'{service_id}_hybas_lev08_stitch_task',
        )

    task_graph.close()
    task_graph.join()
