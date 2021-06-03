const layers = [
    {
      layerID: 'dem-stats',
      name: 'Max DEM',
      mapLayer: {
        id: 'dem-stats',
        type: 'fill',
        source: 'dem-stats',
        'source-layer': 'hello_world', // layer name from Tilesets > hello world > Vector Layers
        paint: {
          'fill-outline-color': 'rgba(200, 100, 240, 1)',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'max'],
            -600,
            '#F2F12D',
            0,
            '#EED322',
            1000,
            '#E6B71E',
            2000,
            '#DA9C20',
            3000,
            '#CA8323',
            5000,
            '#B86B25',
            7000,
            '#A25626',
          ],
          'fill-opacity': 0.75
        },
        layout: {
          visibility: 'none',
        },
      }
    },
    {
      layerID: 'hybas-lev06-seddep',
      name: 'HyBasin SedDep Sum',
      mapLayer: {
        id: 'hybas-lev06-seddep',
        type: 'fill',
        source: 'hybas-lev06-seddep',
        //hybas_lev06_seddep
        'source-layer': 'hybas_lev06_seddep', // layer name from Tilesets > hello world > Vector Layers
        paint: {
          'fill-outline-color': 'rgba(200, 100, 240, 1)',
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'sum'],
            0,
            '#4ce0fa',
            700000,
            '#047f95',
          ],
          'fill-opacity': 0.75
        },
        layout: {
          visibility: 'none',
        },
      }
    },
    {
      layerID: 'sed-pct-global',
      name: 'Sediment Deposition Pct',
      mapLayer: {
        id: 'sed-pct-global',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'sed-pct-global',
      },
    },
    {
      layerID: 'global-nit-pct',
      name: 'Nitrogen Pct',
      mapLayer: {
        id: 'global-nit-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'global-nit-pct',
      },
    },
    {
      layerID: 'gadm1-sed-pct',
      name: 'GADM1 Sed Dep Pct',
      mapLayer: {
        id: 'gadm1-sed-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'gadm1-sed-pct',
      },
    },
    {
      layerID: 'gadm1-nit-pct',
      name: 'GADM1 Nit Dep Pct',
      mapLayer: {
        id: 'gadm1-nit-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'gadm1-nit-pct',
      },
    },
    {
      layerID: 'hybas-sed-pct',
      name: 'HYBAS Sed Dep Pct',
      mapLayer: {
        id: 'hybas-sed-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'hybas-sed-pct',
      },
    },
    {
      layerID: 'hybas-nit-pct',
      name: 'HYBAS Nit Dep Pct',
      mapLayer: {
        id: 'hybas-nit-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'hybas-nit-pct',
      }
    },
  ]

  let legend = [
    {
      legendID: 'sed-pct-global',
      name: 'Sediment Deposition Pct',
    },
  ]

  const basemaps = [
    {
      layerID: 'light-v10',
      name: 'light',
    },
    {
      layerID: 'dark-v10',
      name: 'dark',
    },
    {
      layerID: 'streets-v11',
      name: 'streets',
    },
    {
      layerID: 'satellite-v9',
      name: 'satellite',
    },
  ]

export default layers;
