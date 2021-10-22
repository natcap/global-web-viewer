const mapLayers = [
  {
    layerID: 'sed-pct-global',
    name: 'Sediment Deposition Pct',
    serviceType: 'sediment',
    scaleID: 'global',
    mapLayer: {
      id: 'sed-pct-global',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.33r0lkjs'
      },
    },
  },
  {
    layerID: 'nit-pct-global',
    name: 'Nitrogen Pct',
    serviceType: 'nitrogen',
    scaleID: 'global',
    mapLayer: {
      id: 'nit-pct-global',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.9q9phcqp'
      },
    },
  },
  {
    layerID: 'acc-pct-global',
    name: 'Access to Nature Pct',
    serviceType: 'natureAccess',
    scaleID: 'global',
    mapLayer: {
      id: 'acc-pct-global',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.arhkdcnr'
      },
    },
  },
  {
    layerID: 'sed-pct-gadm0',
    name: 'GADM0 Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'national',
    mapLayer: {
      id: 'sed-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.7bd8mt7n'
      },
    },
  },
  {
    layerID: 'nit-pct-gadm0',
    name: 'GADM0 Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'national',
    mapLayer: {
      id: 'nit-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.ah2yvpwa'
      },
    },
  },
  {
    layerID: 'acc-pct-gadm0',
    name: 'Access to Nature Gadm0',
    serviceType: 'natureAccess',
    scaleID: 'national',
    mapLayer: {
      id: 'acc-pct-gadm0',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.81vt2qno',
      },
    },
  },
  {
    layerID: 'sed-pct-gadm1',
    name: 'GADM1 Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'admin',
    mapLayer: {
      id: 'sed-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.5gp8uedb'
      },
    },
  },
  {
    layerID: 'nit-pct-gadm1',
    name: 'GADM1 Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'admin',
    mapLayer: {
      id: 'nit-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.80hd6f8c'
      },
    },
  },
  {
    layerID: 'acc-pct-gadm1',
    name: 'Access to Nature Gadm1',
    serviceType: 'natureAccess',
    scaleID: 'admin',
    mapLayer: {
      id: 'acc-pct-gadm1',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.avvpojjm',
      },
    },
  },
  {
    layerID: 'sed-pct-hybas',
    name: 'HydroBASIN Sed Dep Pct',
    serviceType: 'sediment',
    scaleID: 'local',
    mapLayer: {
      id: 'sed-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.4nnudyg3',
      },
    },
  },
  {
    layerID: 'nit-pct-hybas',
    name: 'HydroBASIN Nit Dep Pct',
    serviceType: 'nitrogen',
    scaleID: 'local',
    mapLayer: {
      id: 'nit-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.188ctii9',
      },
    }
  },
  {
    layerID: 'acc-pct-hybas',
    name: 'Access to Nature HydroBASIN',
    serviceType: 'natureAccess',
    scaleID: 'local',
    mapLayer: {
      id: 'acc-pct-hybas',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.99qy4mlp',
      },
    }
  },
  {
    layerID: 'stats-gadm0',
    name: 'Service Stats Gadm0',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-gadm0',
      type: 'fill',
      'source-layer': 'gadm0_all_stats_rcp',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgb(245, 245, 245)',
        'fill-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.4c107okb',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-gadm1',
    name: 'Service Stats Gadm1',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-gadm1',
      type: 'fill',
      'source-layer': 'gadm1_all_stats_rcp',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgb(245, 245, 245)',
        'fill-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.bn0gvfer',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-hybas-line',
    name: 'HydroBASIN Lev08 Sed',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-hybas-line',
      minzoom: 5,
      type: 'line',
      'source-layer': 'hybas_all_stats',
      paint: {
        'line-color': '#fcf99f',
        'line-width': 2,
        'line-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.cme0lyel',
        generatedId: true
      },
    }
  },
  {
    layerID: 'stats-hybas',
    name: 'HydroBASIN Lev08 Sed',
    serviceType: 'all',
    scaleID: 'none',
    mapLayer: {
      id: 'stats-hybas',
      minzoom: 5,
      type: 'fill',
      'source-layer': 'hybas_all_stats',
      paint: {
        'fill-color': 'rgb(9, 9, 9)',
        'fill-outline-color': 'rgb(245, 245, 245)',
        'fill-opacity': 0.00,
      },
      layout: {
        visibility: 'visible',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.cme0lyel',
        generatedId: true
      },
    }
  },
  {
    layerID: 'rcp-points',
    name: 'Realized Coastal Protection',
    serviceType: 'coastalProtection',
    scaleID: 'all',
    mapLayer: {
      id: 'rcp-points',
      minzoom: 1,
      type: 'circle',
      'source-layer': 'realized_coastal_protection_points',
      paint: {
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'grid_code'],
          0,
          '#f3deff',
          4.6,
          '#e2c7ec',
          29.3,
          '#d1afdc',
          101.1,
          '#c098cd',
          284.4,
          '#ae81bd',
          732.2,
          '#9d69ad',
          1790.7,
          '#8c529d',
          4555.7,
          '#7b3a8d',
          14861.5,
          '#500066'
        ],
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 0.25,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.38tijv0y',
        generatedId: true
      },
    }
  },
  {
    layerID: 'lulc',
    name: 'ESA Land Use Land Cover',
    serviceType: 'lulc',
    scaleID: 'all',
    mapLayer: {
      id: 'lulc',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.9x3nkjh1',
      },
    }
  },
  {
    layerID: 'population',
    name: 'LandScan Population 2017',
    serviceType: 'population',
    scaleID: 'all',
    mapLayer: {
      id: 'population',
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        url: 'mapbox://ddenu.1x4xnqfg',
      },
    }
  },
  {
    layerID: 'forest-scrub',
    name: 'Coastal Forest/Scrub',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'forest-scrub',
      'source-layer': 'Coastal_forest_scrub_natural_ESA_CV',
      type: 'fill',
      paint: {
        'fill-color': '#D4B577',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.c27wlmyx',
      },
    }
  },
  {
    layerID: 'wetland',
    name: 'Wetlands',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'wetland',
      'source-layer': 'Wetland_ESA_CV',
      type: 'fill',
      paint: {
        'fill-color': '#6FACED',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.djwp4p9g',
      },
    }
  },
  {
    layerID: 'seagrass',
    name: 'Seagrass',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'seagrass',
      'source-layer': 'Seagrass',
      type: 'fill',
      paint: {
        'fill-color': '#99CF78',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.4m9y52by',
      },
    }
  },
  {
    layerID: 'saltmarsh',
    name: 'Saltmarsh',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'saltmarsh',
      'source-layer': 'saltmarsh_v2',
      type: 'fill',
      paint: {
        'fill-color': '#CA7AF5',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.aiac232r',
      },
    }
  },
  {
    layerID: 'mangroves',
    name: 'Mangroves',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'mangroves',
      'source-layer': 'Mangroves_2016_v2',
      type: 'fill',
      paint: {
        'fill-color': '#FFEC42',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.55cle2yq',
      },
    }
  },
  {
    layerID: 'coral-reef',
    name: 'Coral Reefs',
    serviceType: 'coastal-habitat',
    scaleID: 'all',
    parentID: 'coastal-habitat',
    mapLayer: {
      id: 'coral-reef',
      'source-layer': 'Coral_reefs',
      type: 'fill',
      paint: {
        'fill-color': '#FC8D62',
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.40utsiiz',
      },
    }
  },
  {
    layerID: 'protected-points',
    name: 'Protected points',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-points',
      'source-layer': 'protected_points_all_no_duplicatesgeojsonl',
      type: 'circle',
      paint: {
        'circle-color': '#8cd11d',
        'circle-opacity': 0,
        'circle-stroke-color': '#8cd11d',
        'circle-stroke-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.b29f9oyl',
      },
    }
  },
  {
    layerID: 'protected-asia-pacific',
    name: 'Protected Asia and Pacific',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-asia-pacific',
      'source-layer': 'protected_polygons_Asia_and_Pacific',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.9es2n1jq',
      },
    }
  },
  {
    layerID: 'protected-asia-pacific-fill',
    name: 'Protected Asia and Pacific',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-asia-pacific-fill',
      'source-layer': 'protected_polygons_Asia_and_Pacific',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.9es2n1jq',
      },
    }
  },
  {
    layerID: 'protected-la-caribbean',
    name: 'Protected Latin America and Caribbean',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-la-caribbean',
      'source-layer': 'protected_polygons_LatinAmerica_Caribbean',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.d4a9sff0',
      },
    }
  },
  {
    layerID: 'protected-la-caribbean-fill',
    name: 'Protected Latin America and Caribbean',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-la-caribbean-fill',
      'source-layer': 'protected_polygons_LatinAmerica_Caribbean',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.d4a9sff0',
      },
    }
  },
  {
    layerID: 'protected-af-polar-wa',
    name: 'Protected Africa, Polar, West Asia',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-af-polar-wa',
      'source-layer': 'protected_polygons_Africa_Polar_WestAsia',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.71dz1ont',
      },
    }
  },
  {
    layerID: 'protected-af-polar-wa-fill',
    name: 'Protected Africa, Polar, West Asia',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-af-polar-wa-fill',
      'source-layer': 'protected_polygons_Africa_Polar_WestAsia',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.71dz1ont',
      },
    }
  },
  {
    layerID: 'protected-north-america',
    name: 'Protected North America',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-north-america',
      'source-layer': 'protected_polygons_NorthAmerica',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.77rrl311',
      },
    }
  },
  {
    layerID: 'protected-north-america-fill',
    name: 'Protected North America',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-north-america-fill',
      'source-layer': 'protected_polygons_NorthAmerica',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.77rrl311',
      },
    }
  },
  {
    layerID: 'protected-eu-0',
    name: 'Protected Europe 0',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-eu-0',
      'source-layer': 'protected_polygon_Europe_0',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.8yydsukv',
      },
    }
  },
  {
    layerID: 'protected-eu-0-fill',
    name: 'Protected Europe 0',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-eu-0-fill',
      'source-layer': 'protected_polygon_Europe_0',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.8yydsukv',
      },
    }
  },
  {
    layerID: 'protected-eu-1',
    name: 'Protected Europe 1',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-eu-1',
      'source-layer': 'protected_polygon_Europe_1',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.9hiyxrqz',
      },
    }
  },
  {
    layerID: 'protected-eu-1-fill',
    name: 'Protected Europe 1',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-eu-1-fill',
      'source-layer': 'protected_polygon_Europe_1',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.9hiyxrqz',
      },
    }
  },
  {
    layerID: 'protected-eu-2',
    name: 'Protected Europe 2',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-eu-2',
      'source-layer': 'protected_polygon_Europe_2',
      type: 'line',
      paint: {
        'line-color': '#8cd11d',
        'line-width': 1,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.protected-EU-2',
      },
    }
  },
  {
    layerID: 'protected-eu-2-fill',
    name: 'Protected Europe 2',
    serviceType: 'protected-areas',
    scaleID: 'all',
    mapLayer: {
      id: 'protected-eu-2-fill',
      'source-layer': 'protected_polygon_Europe_2',
      type: 'fill',
      paint: {
        'fill-color': '#8cd11d',
        'fill-opacity': 0,
      },
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'vector',
        url: 'mapbox://ddenu.protected-EU-2',
      },
    }
  },
]

export default mapLayers;
