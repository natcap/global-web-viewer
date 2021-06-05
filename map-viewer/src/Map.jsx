import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

// eslint-disable-next-line import/no-webpack-loader-syntax
//import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import mapboxgl from 'mapbox-gl';
// Had to npm install @mapbox/mapbox-gl-geocoder and import like below
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import './Map.css';

import VerticalMenu from './components/VerticalMenu';
import Legend from './components/Legend';
import BasemapControl from './components/BasemapControl';

// import MyComponent from './components/MyComponent';

//mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw';


const Map = () => {

  let layers = [
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
      layerID: 'gadm0-sed-pct',
      name: 'GADM0 Sed Dep Pct',
      mapLayer: {
        id: 'gadm0-sed-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'gadm0-sed-pct',
      },
    },
    {
      layerID: 'gadm0-nit-pct',
      name: 'GADM0 Nit Dep Pct',
      mapLayer: {
        id: 'gadm0-nit-pct',
        type: 'raster',
        layout: {
          visibility: 'none',
        },
        source: 'gadm0-nit-pct',
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
    {
      layerID: 'hybas-sed-stats',
      name: 'Hybas Lev08 Sed',
      mapLayer: {
        id: 'hybas-sed-stats',
        type: 'fill',
        source: 'hybas-sed-stats',
        'source-layer': 'hybas_sed_stats',
        paint: {
          'fill-color': 'rgba(99, 99, 99, 0.0)',
          'fill-outline-color': 'rgba(43, 140, 190, 1.0)',
        },
        layout: {
          visibility: 'none',
        },
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

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(16.8);
  const [lat, setLat] = useState(30.0);
  const [zoom, setZoom] = useState(1.64);
  const [mapLayers, setLayers] = useState(layers);

  function addSources(map) {
    map.addSource('sed-pct-global', {
      type: 'raster',
      url: 'mapbox://ddenu.sed-pct-global'
    });
    map.addSource('global-nit-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.global_nit_pct'
    });
    map.addSource('gadm0-sed-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.gadm0_sed_pct'
    });
    map.addSource('gadm0-nit-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.gadm0_nit_pct'
    });
    map.addSource('gadm1-sed-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.gadm1_sed_pct'
    });
    map.addSource('gadm1-nit-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.gadm1_nit_pct'
    });
    map.addSource('hybas-sed-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.hybas_sed_pct'
    });
    map.addSource('hybas-nit-pct', {
      type: 'raster',
      url: 'mapbox://ddenu.hybas_nit_pct'
    });

    map.addSource('hybas-sed-stats', {
      type: 'vector',
      url: 'mapbox://ddenu.hybas-sed-stats'
    });

    setMap(map);
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 1.6,
      maxZoom: 9.1,
    });

    // Add the control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      console.log("LOAD EVENT");
      addSources(map);
      mapLayers.forEach((layer) => {
        map.addLayer(layer.mapLayer);
      });

      setMap(map);
      const sedLayer = map.getLayer('sed-pct-global');
      console.log(sedLayer);
    });

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'dem-stats', function (e) {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`Max Dem Value: ${e.features[0].properties.max}`)
    .addTo(map);
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'hybas-sed-stats', function (e) {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`Sed mean Value: ${e.features[0].properties.sed_mean} <br/> Sed Pct Value: ${e.features[0].properties.pcttile} `)
    .addTo(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line-react-hooks/exhaustive-deps

  const changeVisibilityState = (i, checked) => {
    console.log("i ", i);
    console.log("checked ", checked);
    if(!checked) {
      map.setLayoutProperty(mapLayers[i]['layerID'], 'visibility', 'none');
      let tmpLayers = mapLayers;
      tmpLayers[i]['mapLayer']['layout']['visibility'] = 'none';
      setLayers(tmpLayers);
    }
    else {
      map.setLayoutProperty(mapLayers[i]['layerID'], 'visibility', 'visible');
      let tmpLayers = mapLayers;
      tmpLayers[i]['mapLayer']['layout']['visibility'] = 'visible';
      setLayers(tmpLayers);
    }
    setMap(map);
  };

  async function changeBasemapState(basemapId, checked){
    console.log("basemapId ", basemapId);
    console.log("checked ", checked);
    await map.setStyle('mapbox://styles/mapbox/' + basemapId);
    setTimeout(() => {
      addSources(map);
      mapLayers.forEach((layer) => {
        map.addLayer(layer.mapLayer);
      });
    }, 1000);

    setMap(map);
  };

  return (
      <Col className="map-container" ref={mapContainer} >
        <VerticalMenu
          layers={layers}
          changeVisibilityState={changeVisibilityState}
        />
        <Legend
          legend={legend}
          //changeVisibilityState={changeVisibilityState}
        />
        <BasemapControl className="basemap-control"
          basemaps={basemaps}
          changeBasemapState={changeBasemapState}
          lng={lng}
          lat={lat}
          zoom={zoom}
        />
      </Col>
  );
};

export default Map;
