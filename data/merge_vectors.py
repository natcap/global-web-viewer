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

def build_vector_recursive_path_list(vector_directory):
    vector_list = []
    for root, dirs, files in os.walk(vector_directory):
        for file in files:
            if file.endswith(".shp") and "protected_points" not in file:
                vector_list.append(os.path.join(root, file))
            if file.endswith(".gpkg"):
                vector_list.append(os.path.join(root, file))
    #LOGGER.info(vector_list)
    return vector_list
    #return []

if __name__ == "__main__":

    LOGGER.debug("Starting Merge Processing")

    hybas_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data', 'hybas_stats_vectors')

    gadm0_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data', 'gadm_stats_vectors')

    protected_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data', 'boundaries', 'Global-Protected-Areas')
    protected_sub_dir = "all"

    #protected_sub_dir = "Africa"
    #protected_sub_dir = "Asia_and_Pacific"
    #protected_sub_dir = "Europe"
    #protected_sub_dir = "LatinAmerica_Caribbean"
    #protected_sub_dir = "NorthAmerica"
    #protected_sub_dir = "Polar"
    protected_sub_dir = "WestAsia"
    protected_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data', 'boundaries', 'Global-Protected-Areas',
        f'WDPA_WDOECM_Mar2021_Public_{protected_sub_dir}_shp')

    gadm0_process_dir = os.path.join(
        gadm0_root_dir, 'gadm36_0_clipped_stats')

    protected_process_dir = os.path.join(
        protected_root_dir, f'protected_polys_merged_{protected_sub_dir}')
    #protected_process_dir = os.path.join(
    #    protected_root_dir, f'protected_points_merged_{protected_sub_dir}')

    gadm0_path_list = build_vector_path_list(gadm0_process_dir)
    protected_path_list = build_vector_recursive_path_list(protected_root_dir)

    merge_hybas = False
    merge_gadm0 = False
    merge_protected = True
    geom_type = "polygons"
    #geom_type = "points"


    if merge_hybas:
        hybas_id = 'acc'
        hybas_process_dir = os.path.join(
            hybas_root_dir, f'hybas_{hybas_id}_processed_vectors')
        hybas_path_list = build_vector_path_list(hybas_process_dir)

        # Refine hydro files by level
        file_matcher = f'{hybas_id}_perc'
        hybas_selected_path_list = [x for x in hybas_path_list if file_matcher in x]
        LOGGER.debug(f'hydro basin paths {hybas_selected_path_list}')


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

    if merge_gadm0:
        merged_out_dir = os.path.join(
            gadm0_process_dir, f'merged_vectors')
        if not os.path.isdir(merged_out_dir):
            os.makedirs(merged_out_dir)

        merged_out_path = os.path.join(
            merged_out_dir, f"gadm_0_all_services.shp")
        # if this file already exists, then remove it
        if os.path.isfile(merged_out_path):
            os.remove(merged_out_path)

        number_of_vectors = len(gadm0_path_list)

        for idx, gadm_path in enumerate(gadm0_path_list):
            if idx == 0:
                # ogr2ogr -f "ESRI Shapefile" merged a.ship
                # ogr2ogr -f "GeoJSONSeq" merged a.ship
                subprocess.run(
                    ["ogr2ogr", "-f", "ESRI Shapefile", merged_out_path, gadm_path])
            else:
                # ogr2ogr -f "ESRI Shapefile" -append -update merged b.ship
                subprocess.run(
                    ["ogr2ogr", "-f", "ESRI Shapefile", "-append", "-update",
                     merged_out_path, gadm_path])

            LOGGER.debug(f"{idx + 1} out of {number_of_vectors} merged")
    
    if merge_protected:
        merged_out_dir = os.path.join(
            protected_process_dir, f'merged_vectors')
        if not os.path.isdir(merged_out_dir):
            os.makedirs(merged_out_dir)

        merged_out_path = os.path.join(
            merged_out_dir, f"protected_{geom_type}_{protected_sub_dir}.shp")
        # if this file already exists, then remove it
        if os.path.isfile(merged_out_path):
            os.remove(merged_out_path)
        
        file_matcher = f'{geom_type}'
        protected_selected_path_list = [x for x in protected_path_list if file_matcher in x]

        number_of_vectors = len(protected_selected_path_list)

        for idx, protected_path in enumerate(protected_selected_path_list):
            if idx == 0:
                # ogr2ogr -f "ESRI Shapefile" merged a.ship
                # ogr2ogr -f "GeoJSONSeq" merged a.ship
                subprocess.run(
                    ["ogr2ogr", "-f", "ESRI Shapefile", merged_out_path, protected_path])
            else:
                # ogr2ogr -f "ESRI Shapefile" -append -update merged b.ship
                subprocess.run(
                    ["ogr2ogr", "-f", "ESRI Shapefile", "-append", "-update",
                     merged_out_path, protected_path])

            LOGGER.debug(f"{idx + 1} out of {number_of_vectors} merged")
