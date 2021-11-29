import os
import pickle
import json

from osgeo import gdal, ogr

def iterateFeatures(vector_path, out_path):
    """Genearate and save a JSON object in the carmen geojson format.

    The JSON output is to be used with a mapbox localGeocder.

    Args:
        vector_path (string): path to gadm1 vector
        out_path (string): output json path

    Returns:
        None
    """
    vector = gdal.OpenEx(vector_path, gdal.OF_VECTOR)

    layer = vector.GetLayer(0)

    # if this file already exists, then remove it
    if os.path.isfile(out_path):
        os.remove(out_path)

#    "features": [
#        {
#            "type": "Feature",
#            "id": "place.4201",
#            "text": "Austin",
#            "place_name": "Austin, Texas, United States",
#            "place_type": [ "place" ],
#            "bbox": [-97.9383829999999, 30.098659, -97.5614889999999, 30.516863],
#            "center": [-97.7559964, 30.3071816],
#            "geometry": {
#                "type": "Point",
#                "coordinates": [-97.7559964, 30.3071816]
#            },
#            "properties": {
#                "title": "Austin",
#                "type": "city",
#                "score": 600000790107194.8
#            },
#            "context": [
#                {
#                    "id": "province.293",
#                    "text": "Texas"
#                },
#                {
#                    "id": "country.51",
#                    "text": "United States"
#                }
#            ]
#        },
#        ...
#    ]

    json_list = []
    for feat in layer:
        country_name = feat.GetFieldAsString('NAME_0')
        admin_name = feat.GetFieldAsString('NAME_1')

        geom = feat.GetGeometryRef()
        envelope = geom.GetEnvelope()
        bbox = [envelope[0], envelope[2], envelope[1], envelope[3]]
        center = [envelope[0]]

        feat_dict = {
            "type": "Feature",
            "text": admin_name,
            "place_name": f"{admin_name}, {country_name}",
            "place_type": [ "place" ],
            "bbox": bbox,
            "geometry": {
                "type": "MultiPolygon",
            },
            "properties": {
                "title": admin_name,
                "type": "region",
            },
        }

        json_list.append(feat_dict)

        feat = None

    layer = None
    vector = None

    with open(out_path, 'w') as f:
        json.dump(json_list, f, indent=2)


if __name__ == "__main__":

    data_common_root_dir = os.path.join(
        'C:', os.sep, 'Users', 'ddenu', 'Workspace', 'NatCap', 'Repositories',
        'global-web-viewer', 'data')

    gadm_0_1_directory = os.path.join(
        data_common_root_dir, 'boundaries', 'GADM36_levels_0_1')

    gadm1_path = os.path.join(
        gadm_0_1_directory, 'GADM36_levels_0_1', 'clipped_gadm36_1_antarctica',
        'gadm36_1_clipped.gpkg')

    out_path = os.path.join(gadm_0_1_directory, 'gadm1-carmen-geojson.json')

    iterateFeatures(gadm1_path, out_path)
