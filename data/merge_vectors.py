import os
import sys
import logging
import pickle
import subprocess

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

def build_vector_path_list(vector_directory):
    vector_list = []
    for file in os.listdir(vector_directory):
        if file.endswith(".shp"):
            vector_list.append(os.path.join(vector_directory, file))
        if file.endswith(".gpkg"):
            vector_list.append(os.path.join(vector_directory, file))

    return vector_list

if __name__ == "__main__":

    LOGGER.debug("Starting Merge Processing")

    hybas_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data', 'hybas_stats_vectors')

    hybas_process_dir = os.path.join(
        hybas_root_dir, 'hybas_sed_processed_vectors')

    hybas_path_list = build_vector_path_list(hybas_process_dir)

    # Refine hydro files by level
    file_matcher = 'sed_perc'
    hybas_selected_path_list = [x for x in hybas_path_list if file_matcher in x]
    LOGGER.debug(f'hydro basin paths {hybas_selected_path_list}')

    hybas_id = 'sed'

    merged_out_dir = os.path.join(hybas_root_dir, f'merged_{hybas_id}_vectors')
    if not os.path.isdir(merged_out_dir):
        os.makedirs(merged_out_dir)

    merged_out_path = os.path.join(
        merged_out_dir, f"hybas_all_{hybas_id}.shp")
    # if this file already exists, then remove it
    if os.path.isfile(merged_out_path):
        os.remove(merged_out_path)

    number_of_vectors = len(hybas_selected_path_list)

    for idx, hybas_path in enumerate(hybas_selected_path_list):
        if idx == 0:
            # ogr2ogr -f "ESRI Shapefile" merged a.ship
            # ogr2ogr -f "GeoJSONSeq" merged a.ship
            subprocess.run(
                ["ogr2ogr", "-f", "ESRI Shapefile", merged_out_path, hybas_path])
        else:
            # ogr2ogr -f "ESRI Shapefile" -append -update merged b.ship
            subprocess.run(
                ["ogr2ogr", "-f", "ESRI Shapefile", "-append", "-update",
                 merged_out_path, hybas_path])

        LOGGER.debug(f"{idx + 1} out of {number_of_vectors} merged")
