import os
import sys
import math
import argparse
from osgeo import osr
import logging

import pygeoprocessing

logging.basicConfig(
    level=logging.DEBUG,
    format=(
        '%(asctime)s (%(relativeCreated)d) %(levelname)s %(name)s'
        ' [%(funcName)s:%(lineno)d] %(message)s'),
    stream=sys.stdout)
LOGGER = logging.getLogger(__name__)

if __name__ == "__main__":

    LOGGER.debug("Starting Reprojecting Processing")

    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--src',
        help="The input vector to reproject.", required=True)
    parser.add_argument('-d', '--dst',
            help="The reprojected output vector path.", required=True)

    args = vars(parser.parse_args())
    LOGGER.info(f"Source: {args['src']}, Dest: {args['dst']}")

    input_path = args['src']
    input_basename = os.path.splitext(os.path.basename(input_path))[0]

    out_path = args['dst']
    out_dir = os.path.dirname(out_path)
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    projection_srs = osr.SpatialReference()
    projection_srs.ImportFromEPSG(3857)
    projection_wkt = projection_srs.ExportToWkt()

    pygeoprocessing.reproject_vector(
        input_path, projection_wkt, out_path,
        driver_name='GeoJSONSeq')
