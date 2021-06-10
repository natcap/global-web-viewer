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
// Had to npm install @mapbox/mapbox-gl-draw and import like below
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
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

  const layers = [
    {
      layerID: 'sed-pct-global',
      name: 'Sediment Deposition Pct',
      serviceType: 'sediment',
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
      serviceType: 'nitrogen',
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
      serviceType: 'sediment',
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
      serviceType: 'nitrogen',
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
      serviceType: 'sediment',
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
      serviceType: 'nitrogen',
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
      serviceType: 'sediment',
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
      serviceType: 'nitrogen',
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
      serviceType: 'sediment',
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

  let legendStyle = {
    'sediment': {
      name: 'Sediment Deposition Pct',
      colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
      colors: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
      },
    'nitrogen': {
      name: 'Nitrogen Pct',
      colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
      colors: ['#f7fcf5', '#caeac3', '#7bc87c', '#2a924a', '#00441b'],
    },
  }

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
  //If you are using hooks, you also created a map useRef to store the
  //initialize the map. The ref will prevent the map from reloading when the
  //user interacts with the map.
  //const map = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(16.8);
  const [lat, setLat] = useState(30.0);
  const [zoom, setZoom] = useState(1.64);
  const [mapLayers, setLayers] = useState(layers);

  /*
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 1.6,
      maxZoom: 9.1,
    });
  });
  */

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

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon',
    });
    map.addControl(draw);

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        console.log(data);
        let minY = 100.0;
        let minX = 200.0;
        let maxY = -100.0;
        let maxX = -200.0;
        const geoms = data.features[0].geometry.coordinates[0];
        console.log(geoms);
        let arrayX = [];
        let arrayY = [];
        geoms.forEach((point) => {
          arrayX.push(point[0]);
          arrayY.push(point[1]);
        });

        const bbox = [Math.min(...arrayX), Math.min(...arrayY), Math.max(...arrayX), Math.max(...arrayY)];
        console.log(bbox);
      }

    }

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

    /*
    useEffect(() => {
      if (!map.current) return; // wait for map to initialize
      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    });
    */

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(2));
      setLat(map.getCenter().lat.toFixed(2));
      setZoom(map.getZoom().toFixed(2));
    });

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'hybas-sed-stats', function (e) {
      new mapboxgl.Popup({closeButton:false})
      .setLngLat(e.lngLat)
      .setHTML(`Sed mean Value: ${e.features[0].properties.sed_mean.toFixed(2)} <br/> Sed Pct Value: ${e.features[0].properties.pcttile} `)
      .addTo(map);
    });

    console.log("main useeffect");
    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line-react-hooks/exhaustive-deps

  useEffect(() => {
    console.log("mapLayers change");

  }, [mapLayers]);

  const changeVisibilityState = (i, checked) => {
    console.log("i ", i);
    console.log("checked ", checked);
    if(!checked) {
      map.setLayoutProperty(mapLayers[i]['layerID'], 'visibility', 'none');
      const tmpLayers = mapLayers;
      tmpLayers[i]['mapLayer']['layout']['visibility'] = 'none';
      setLayers([...tmpLayers]);
    }
    else {
      map.setLayoutProperty(mapLayers[i]['layerID'], 'visibility', 'visible');
      const tmpLayers = mapLayers;
      tmpLayers[i]['mapLayer']['layout']['visibility'] = 'visible';
      //You're calling setNumbers and passing it the array it already has.
      //You've changed one of its values but it's still the same array, and
      //I suspect React doesn't see any reason to re-render because state
      //hasn't changed; the new array is the old array. 
      //One easy way to avoid this is by spreading the array into a new array:
      setLayers([...tmpLayers]);
      console.log(mapLayers);
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
          layers={mapLayers}
          changeVisibilityState={changeVisibilityState}
        />
        <Legend
          legend={legendStyle}
          layers={mapLayers}
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
