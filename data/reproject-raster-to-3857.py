import sys
import os
import argparse
import math
import logging
from osgeo import osr
from osgeo import gdal

import pygeoprocessing
import taskgraph

logging.basicConfig(
    level=logging.DEBUG,
    format=(
        '%(asctime)s (%(relativeCreated)d) %(levelname)s %(name)s'
        ' [%(funcName)s:%(lineno)d] %(message)s'),
    stream=sys.stdout)
LOGGER = logging.getLogger(__name__)

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
        creationOptions=["COMPRESS=LZW"])
    gdal.DEMProcessing(
        out_raster_path, input_raster_path, "color-relief",
        options=gdaldem_options)

if __name__ == "__main__":

    LOGGER.debug("Starting Reprojecting Processing")

    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--src',
        help="The input raster to reproject.", required=True)
    parser.add_argument('-d', '--dst',
            help="The reprojected output raster path.", required=True)
    parser.add_argument('-c', '--color-file',
            help="The color style file for the raster.", required=True)

    args = vars(parser.parse_args())
    LOGGER.info(f"Source: {args['src']}, Dest: {args['dst']}")

    input_path = args['src']
    input_basename = os.path.splitext(os.path.basename(input_path))[0]

    out_path = args['dst']
    out_dir = os.path.dirname(out_path)
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    ### TaskGraph Set Up
    taskgraph_working_dir = os.path.join(
        out_dir, '_taskgraph_working_dir')

    n_workers = -1
    task_graph = taskgraph.TaskGraph(taskgraph_working_dir, n_workers)
    ###

    projection_srs = osr.SpatialReference()
    projection_srs.ImportFromEPSG(3857)
    projection_wkt = projection_srs.ExportToWkt()

    input_info = pygeoprocessing.get_raster_info(input_path)
    input_pixel = input_info['pixel_size']
    LOGGER.debug(f"input_pixel : input_pixel")

    meters_squared = _m2_area_of_wg84_pixel(abs(input_pixel[0]), 0.0)
    LOGGER.debug(f"meters_squared : {meters_squared}")

    scale_x = input_pixel[0] / abs(input_pixel[0])
    scale_y = input_pixel[1] / abs(input_pixel[1])
    LOGGER.debug(f"scale_x : scale_y || {scale_x}:{scale_y}") 

    target_pixel_size = (
        math.sqrt(meters_squared) * scale_x, math.sqrt(meters_squared) * scale_y)
    LOGGER.debug(f"target_pixel_size : {target_pixel_size}")

    input_bb = input_info['bounding_box']
    if input_bb[1] < -87:
        input_bb[1] = -86
    if input_bb[3] > 87:
        input_bb[3] = 86

    LOGGER.debug(f"Actual input_bb : {input_info['bounding_box']}")
    LOGGER.debug(f"Used input_bb : {input_bb}")

    bb_task = task_graph.add_task(
        func=pygeoprocessing.transform_bounding_box,
        args=(
            input_bb, input_info['projection_wkt'], projection_wkt,
        ),
        store_result=True,
        task_name=f'bb_{input_basename}_task')

    target_bb = bb_task.get()

    LOGGER.debug(f"target_bb : {target_bb}")

    reproject_task = task_graph.add_task(
        func=pygeoprocessing.warp_raster,
        args=(
            input_path, target_pixel_size, out_path, 'near',
        ),
        kwargs={
            'target_bb': target_bb, 'target_projection_wkt': projection_wkt
        },
        target_path_list=[out_path],
        task_name=f'warp_{input_basename}_task')

    gdaldem_out_path = os.path.splitext(out_path)[0] + '_rgb.tif'
    # Convert percentile raster to styled RGB
    gdaldem_task = task_graph.add_task(
        func=gdaldem_color_relief,
        args=(out_path, args['color_file'], gdaldem_out_path),
        target_path_list=[gdaldem_out_path],
        task_name=f'gdaldem_{input_basename}_task',
        dependent_task_list=[reproject_task])

    task_graph.close()
    task_graph.join()

