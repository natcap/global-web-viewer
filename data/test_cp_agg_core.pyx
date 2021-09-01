# cython: profile=False
# cython: language_level=3

import logging

import numpy
cimport numpy
cimport cython
from osgeo import gdal

import pygeoprocessing

LOGGER = logging.getLogger(__name__)


def find_close(cv_raster_path, dist_trans_list, dist_trans_name_list, dist_trans_id_list):
    stats_dict = {}

    raster_info = pygeoprocessing.get_raster_info(cv_raster_path)
    cdef double nodata = raster_info['nodata'][0]

    cv_raster = gdal.OpenEx(cv_raster_path)
    cv_band = cv_raster.GetRasterBand(1)

    LOGGER.info("Run through iterblocks")
    for offset_dict in pygeoprocessing.iterblocks((cv_raster_path, 1), offset_only=True):
        cv_block = cv_band.ReadAsArray(**offset_dict)
        valid_cv_array = ~numpy.isclose(cv_block, nodata)
        valid_idx = numpy.argwhere(valid_cv_array == 1)

        dist_trans_blocks = []
        for dist_trans_path in dist_trans_list:
            dist_raster = gdal.OpenEx(dist_trans_path)
            dist_band = dist_raster.GetRasterBand(1)
            dist_block = dist_band.ReadAsArray(**offset_dict)
            dist_trans_blocks.append(numpy.copy(dist_block))

        LOGGER.info(f"number of valid pixels: {len(valid_idx)}")
        for idx in valid_idx:
            cv_val = cv_block[idx[0], idx[1]]
            dist_block = dist_trans_blocks[0]
            min_val = dist_block[idx[0], idx[1]]
            min_id = dist_trans_id_list[0]
            min_name = dist_trans_name_list[0]

            for dist_idx, dist_block in enumerate(dist_trans_blocks[1:]):
                dist_val = dist_block[idx[0], idx[1]]
                dist_id = dist_trans_id_list[dist_idx + 1]
                dist_name = dist_trans_name_list[dist_idx + 1]
                if dist_val < min_val:
                    min_val = dist_val
                    min_id = dist_id
                    min_name = dist_name

            if min_name not in stats_dict:
                stats_dict[min_name] = {"count": 1, "sum": cv_val}
            else:
                stats_dict[min_name]["count"] += 1
                stats_dict[min_name]["sum"] += cv_val

    return stats_dict
