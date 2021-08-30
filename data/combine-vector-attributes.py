import os
import sys
import time
import logging
import numpy
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


def combine_vector_attributes(
        base_vector_path, combine_vector_path, attr_list):
    """Add fields from ``combine_vector_path`` to ``base_vector_path``.

    Args:
        base_vector_path (string): path to a GDAL vector file. Used as the
            base for the output vector.
        combine_vector_path (string): path to a GDAL vector file. Used as the
            base for the output vector.
        attr_list (list): list of ``combine_vector_path`` attributes to add to
         ``base_vector_path``.

    Returns:
        None
    """
    LOGGER.debug("Add attributes to vector")
    base_vector_info = pygeoprocessing.get_vector_info(base_vector_path)

    base_vector = gdal.OpenEx(base_vector_path, gdal.GA_Update | gdal.OF_VECTOR)
    combine_vector = gdal.OpenEx(combine_vector_path, gdal.OF_VECTOR)

    layer = base_vector.GetLayer(0)
    layer_dfn = layer.GetLayerDefn()
    number_features = layer.GetFeatureCount()

    combine_layer = combine_vector.GetLayer(0)
    combine_layer_dfn = combine_layer.GetLayerDefn()

    LOGGER.info(f'Attrs to add: {attr_list}')
    field_names = [field.name for field in layer.schema]
    for field_key in attr_list:
        if field_key in field_names:
            continue
        target_field = ogr.FieldDefn(field_key, ogr.OFTReal)
        layer.CreateField(target_field)

    # Copy all of the features in layer to the new shapefile
    last_time = time.time()
    layer.StartTransaction()
    for feature_index, feature in enumerate(layer):
        last_time = pygeoprocessing._invoke_timed_callback(
            last_time, lambda: LOGGER.info(
                f'{(feature_index / number_features):.2f} processed'), 30.0)

        fid = feature.GetFID()
        feat_name = feature.GetFieldAsString('GID_1')

        # for RCP, not guaranteed we have the same FIDs / feature count
        # because I didn't use the masked antartica shape file when gathering
        # stats
        feature_match = False
        for combine_feature in combine_layer:
            comb_name = combine_feature.GetFieldAsString('GID_1')
            if comb_name == feat_name:
                feature_match = True
                break
        if not feature_match:
            continue

        for field_name in attr_list:
            combine_value = combine_feature.GetFieldAsDouble(field_name)
            fld_idx = feature.GetFieldIndex(field_name)
            if combine_value is None:
                combine_value = 0.0

            feature.SetField(fld_idx, float(combine_value))

        layer.SetFeature(feature)
        combine_layer.ResetReading()
        feature = None
        combine_feature = None

    layer.CommitTransaction()

    layer =  None
    vector = None
    combine_layer = None
    combine_vector = None

def copy_vector(base_vector_path, target_vector_path):
    """ """
    LOGGER.debug("Copying vector")
    base_vector = gdal.OpenEx(base_vector_path, gdal.OF_VECTOR)

    layer = base_vector.GetLayer(0)
    layer_dfn = layer.GetLayerDefn()

    # if this file already exists, then remove it
    if os.path.isfile(target_vector_path):
        os.remove(target_vector_path)

    # create a new shapefile from the orginal_datasource
    target_driver = ogr.GetDriverByName('GPKG')
    target_vector = target_driver.CreateDataSource(target_vector_path)
    target_vector.CopyLayer(layer, layer_dfn.GetName())

    layer = None
    base_vector = None
    target_vector = None


if __name__ == "__main__":

    LOGGER.debug("Starting Processing")

    output_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'processed-data')

    gadm0_root_dir = os.path.join(
        output_root_dir, 'gadm_stats_vectors', 'gadm36_0_clipped_stats')
    gadm1_root_dir = os.path.join(
        output_root_dir, 'gadm_stats_vectors', 'gadm36_1_clipped_stats')
    hybas_root_dir = os.path.join(output_root_dir, 'hybas_stats_vectors')

    #combine_vector_dir = os.path.join(gadm0_root_dir, 'combined_dir')
    combine_vector_dir = os.path.join(gadm1_root_dir, 'combined_dir')
    #combine_vector_dir = os.path.join(hybas_root_dir, 'combined_dir')
    if not os.path.exists(combine_vector_dir):
        os.mkdir(combine_vector_dir)

    ### TaskGraph Set Up
    #taskgraph_working_dir = os.path.join(
    #    combine_vector_dir, '_stats_taskgraph_working_dir')

    #n_workers = -1
    #task_graph = taskgraph.TaskGraph(taskgraph_working_dir, n_workers)
    ###

    #base_vector_path = os.path.join(
    #    gadm0_root_dir, 'gadm36_0_clipped_sed_stats.gpkg')
    combined_out_path = os.path.join(
        combine_vector_dir, 'gadm1_all_stats.gpkg')
    #base_vector_path = os.path.join(
    #    gadm1_root_dir, 'gadm36_1_clipped_sed_perc.gpkg')
    #combined_out_path = os.path.join(
    #    combine_vector_dir, 'gadm1_all_stats.gpkg')
    #base_vector_path = os.path.join(
    #    hybas_root_dir, 'merged_sed_vectors', 'hybas_all_sed.shp')
    #combined_out_path = os.path.join(
    #    combine_vector_dir, 'hybas_all_service_stats.gpkg')

    #copy_vector(base_vector_path, combined_out_path)

    # created the base with sed, so not needed again
    #service_id_list = ['nit', 'acc', 'crop']
    #service_id_list = ['nit', 'acc']
    service_id_list = ['rcp']

    for service_id in service_id_list:
        #service_vector_path = os.path.join(
        #    gadm0_root_dir, f'gadm36_0_clipped_{service_id}_stats.gpkg')
        #service_vector_path = os.path.join(
        #    gadm1_root_dir, f'gadm36_1_clipped_{service_id}_perc.gpkg')
        #service_vector_path = os.path.join(
        #    hybas_root_dir, f'merged_{service_id}_vectors', 
        #    f'hybas_all_{service_id}.shp')
        #attr_list = [f'{service_id}_mean', f'{service_id}_pct']

        # Add RCP attributes
        #service_vector_path = os.path.join(
        #    output_root_dir, 'coastal_protection_stats_vectors',
        #    'results_gadm36_1', 'gadm36_1_rcp_stats.gpkg')
        service_vector_path = os.path.join(
            output_root_dir, 'coastal_protection_stats_vectors',
            'gadm36_1_rcp_stats.gpkg')
        attr_list = [
            f'{service_id}-mean', f'{service_id}-count', f'{service_id}-sum']

        combine_vector_attributes(
            combined_out_path, service_vector_path, attr_list)

