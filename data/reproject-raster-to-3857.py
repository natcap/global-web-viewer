import sys
import os
import math
import logging
from osgeo import osr

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

if __name__ == "__main__":

    LOGGER.debug("Starting Reprojecting Processing")

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer')

    input_path = os.path.join(
        data_common_root_dir, 'data', 'pixel-data',
        'realized_sedimentdeposition_nathab_md5_96c3424924c752e9b1f7ccfffe9b102a.tif')

    out_dir = os.path.join(
        data_common_root_dir, 'processed-data', 'pixel-processed')

    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    out_path = os.path.join(
        out_dir, 'realized_sedimentdeposition_3857.tif')

    ### TaskGraph Set Up
    taskgraph_working_dir = os.path.join(
        data_common_root_dir, 'processed-data', '_taskgraph_working_dir')

    n_workers = 4
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

    input_bb = [-180.0, -86.0, 180.0, 86.0]
    target_bb = pygeoprocessing.transform_bounding_box(
        input_bb, input_info['projection_wkt'], projection_wkt)

    LOGGER.debug(f"input_bb : {input_info['bounding_box']}")
    LOGGER.debug(f"target_bb : {target_bb}")

    pygeoprocessing.warp_raster(
        input_path, target_pixel_size, out_path, 'near',
        target_bb=target_bb, target_projection_wkt=projection_wkt)

