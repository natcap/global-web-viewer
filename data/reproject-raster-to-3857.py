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
        vector_path, target_raster_path, burn_values=[199])

def _m2_area_of_wg84_pixel(pixel_size, center_lat):
    """Calculate m^2 area of a square wgs84 pixel.
    Adapted from: https://gis.stackexchange.com/a/127327/2397
    Args:
        pixel_size (float): length of side of a square pixel in degrees.
        center_lat (float): latitude of the center of the pixel. Note this
            value +/- half the `pixel-size` must not exceed 90/-90 degrees
            latitude or an invalid area will be calculated.
    Returns:
        Area of square pixel of side length `pixel_size` centered at
        `center_lat` in m^2.
    """
    a = 6378137  # meters
    b = 6356752.3142  # meters
    e = math.sqrt(1 - (b/a)**2)
    area_list = []
    for f in [center_lat+pixel_size/2, center_lat-pixel_size/2]:
        zm = 1 - e*math.sin(math.radians(f))
        zp = 1 + e*math.sin(math.radians(f))
        area_list.append(
            math.pi * b**2 * (
                math.log(zp/zm) / (2*e) +
                math.sin(math.radians(f)) / (zp*zm)))
    return abs(pixel_size / 360. * (area_list[0] - area_list[1]))

def gdaldem_color_relief(input_raster_path, color_file_path, out_raster_path):
    """Conver input raster to a stylized RGB raster using gdaldem.

    Args:
        input_raster_path (string):
        color_file_path (string):
        out_raster_path (string):

    Returns:
        None
    """
    gdaldem_options = gdal.DEMProcessingOptions(
        colorFilename=color_file_path, format="GTiff", addAlpha=True,
        #creationOptions=["COMPRESS=LZW","TILED=YES","BLOCKXSIZE=256","BLOCKYSIZE=256"])
        creationOptions=["COMPRESS=LZW"])
    gdal.DEMProcessing(
        out_raster_path, input_raster_path, "color-relief",
        options=gdaldem_options)

if __name__ == "__main__":

    LOGGER.debug("Starting Reprojecting Processing")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    color_dir = os.path.join(
        data_common_root_dir, 'pixel-data', 'color-styling')

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data')

    #pct_scale_dirs = ['global_pct_rasters', 'gadm_pct_rasters', 'hybas_pct_rasters']
    #pct_scale_dirs = [
    #    'global_pct_rasters', 'gadm_pct_rasters', 'gadm_pct_rasters']
    #pct_scale_names = ['global', 'gadm0', 'gadm1']
    #pct_scale_dirs = [
    #    'gadm_pct_rasters', 'gadm_pct_rasters', 'hybas_pct_rasters']
    #pct_scale_names = ['gadm0', 'gadm1', 'hybas_lev08']
    pct_scale_dirs = ['hybas_pct_rasters']
    pct_scale_names = ['hybas_lev08']

    gadm_0_1_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'GADM36_levels_0_1',
        'GADM36_levels_0_1', 'clipped_gadm36_0_antarctica')
    gadm0_path = os.path.join(gadm_0_1_directory, 'gadm36_0_clipped.gpkg')

    #raster_service_id_list = ['sed', 'nit', 'graz', 'acc', 'crop']
    raster_service_id_list = ['sed', 'nit', 'acc']
    #color_path_list = [
    #    'sediment_color.txt', 'nitrogen_color.txt', 'nature_access_color.txt',
    #    'crop_color.txt']
    color_path_list = [
        'sediment_color.txt', 'nitrogen_color.txt', 'nature_access_color.txt']

    # create mask for differentiating nodata in ocean and nodata covered by
    # land polygons. rasterize gadm0 layer onto input path
    land_ocean_mask_dir = os.path.join(
        output_root_dir, 'land_ocean_mask')
    if not os.path.exists(land_ocean_mask_dir):
        os.makedirs(land_ocean_mask_dir)

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
            os.makedirs(rasterize_dir)

        rasterize_path = os.path.join(
            rasterize_dir, 'gadm36_0_clipped_rasterize.tif')

        input_rasterize_path = os.path.join(
            output_root_dir, 'global_pct_rasters', pct_service,
            f'global_{pct_service}_percentile.tif')

        new_rasterize_task = task_graph.add_task(
            func=new_rasterize_raster,
            args=(
                input_rasterize_path, rasterize_path, gadm0_path
            ),
            target_path_list=[rasterize_path],
            task_name=f'new_rasterize_{service_idx}_task')

        new_rasterize_task.join()

        rasterize_info = pygeoprocessing.get_raster_info(rasterize_path)
        rasterize_nodata = rasterize_info['nodata'][0]

    for group_idx, pct_group in enumerate(pct_scale_dirs):
        scale_name = pct_scale_names[group_idx]
        for service_idx, pct_service in enumerate(raster_service_id_list):
            if scale_name == 'global':
                pct_base_dir = os.path.join(
                    output_root_dir, pct_group, pct_service)
                input_pct_path = os.path.join(
                    pct_base_dir, f'global_{pct_service}_percentile.tif')
            elif scale_name == 'gadm0' or scale_name == 'gadm1':
                pct_base_dir = os.path.join(
                    output_root_dir, pct_group, pct_service)
                input_pct_path = os.path.join(
                    pct_base_dir,
                    f'{pct_service}_{scale_name}_pct_stitched.tif')
            elif scale_name == 'hybas_lev08':
                pct_base_dir = os.path.join(
                    output_root_dir, pct_group, pct_service)
                input_pct_path = os.path.join(
                    pct_base_dir,
                    f'{pct_service}_{scale_name}_pct_stitched.tif')
            else:
                continue

            rasterize_path = os.path.join(
                land_ocean_mask_dir, pct_service,
                'gadm36_0_clipped_rasterize.tif')

            input_raster_info = pygeoprocessing.get_raster_info(input_pct_path)
            input_nodata = input_raster_info['nodata'][0]

            input_nodata_path = os.path.join(
                pct_base_dir, f'{scale_name}_clipped_nodata_mask.tif')

            rasterize_value = 199

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
                    [(input_pct_path, 1), (rasterize_path, 1)], nodata_op,
                    input_nodata_path, input_raster_info['datatype'], input_nodata,
                    ),
                kwargs={
                    'calc_raster_stats': False
                },
                target_path_list=[input_nodata_path],
                dependent_task_list=[new_rasterize_task],
                task_name=f'nodata_mask_{group_idx}_{scale_name}_{service_idx}_task')


            nodata_mask_task.join()

            pct_reprojected_path = os.path.join(
                pct_base_dir,
                f'{pct_service}_{scale_name}_percentile_3857.tif')

            projection_srs = osr.SpatialReference()
            projection_srs.ImportFromEPSG(3857)
            projection_wkt = projection_srs.ExportToWkt()

            input_info = pygeoprocessing.get_raster_info(input_nodata_path)
            input_pixel = input_info['pixel_size']

            meters_squared = _m2_area_of_wg84_pixel(abs(input_pixel[0]), 0.0)

            scale_x = input_pixel[0] / abs(input_pixel[0])
            scale_y = input_pixel[1] / abs(input_pixel[1])

            target_pixel_size = (
                math.sqrt(meters_squared) * scale_x, math.sqrt(meters_squared) * scale_y)

            input_bb = input_info['bounding_box']
            if input_bb[1] < -87:
                input_bb[1] = -86
            if input_bb[3] > 87:
                input_bb[3] = 86

            bb_task = task_graph.add_task(
                func=pygeoprocessing.transform_bounding_box,
                args=(
                    input_bb, input_info['projection_wkt'], projection_wkt,
                ),
                store_result=True,
                task_name=f'bb_{group_idx}_{scale_name}_{service_idx}_task')

            target_bb = bb_task.get()

            reproject_task = task_graph.add_task(
                func=pygeoprocessing.warp_raster,
                args=(
                    input_nodata_path, target_pixel_size, pct_reprojected_path, 'near',
                ),
                kwargs={
                    'target_bb': target_bb, 'target_projection_wkt': projection_wkt
                },
                target_path_list=[pct_reprojected_path],
                task_name=f'warp_{group_idx}_{scale_name}_{service_idx}_task')

            color_path = os.path.join(
                color_dir, color_path_list[service_idx])
            LOGGER.debug(f"COLOR PATH: {color_path}")
            gdaldem_out_path = os.path.join(
                pct_base_dir, 
                f'{pct_service}_{scale_name}_percentile_3857_rgb.tif')
            # Convert percentile raster to styled RGB
            gdaldem_task = task_graph.add_task(
                func=gdaldem_color_relief,
                args=(pct_reprojected_path, color_path, gdaldem_out_path),
                target_path_list=[gdaldem_out_path],
                task_name=f'gdaldem_{group_idx}_{scale_name}_{service_idx}_task',
                dependent_task_list=[reproject_task])

            gdaldem_task.join()

    task_graph.close()
    task_graph.join()

