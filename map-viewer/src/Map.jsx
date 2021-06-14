import React, { useRef, useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';

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
import mapLayers from './LayerDefinitions';

// import MyComponent from './components/MyComponent';

//mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw';


const Map = () => {

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
  }

  const mapContainer = useRef(null);
  //If you are using hooks, you also created a map useRef to store the
  //initialize the map. The ref will prevent the map from reloading when the
  //user interacts with the map.
  //const map = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(16.8);
  const [lat, setLat] = useState(30.0);
  const [zoom, setZoom] = useState(1.64);
  //const [mapLayers, setLayers] = useState(layers);
  const [scale, setScale] = useState('global');
  const [selectedServices, setServices] = useState([]);
  const [visibleLayers, setLayers] = useState({});

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
  //By using this Hook, you tell React that your component needs to do
  //something after render.
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
    });
    map.addControl(draw);

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        console.log(e);
        console.log(data);
        /*
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
        */
      }

    }

    map.on('load', () => {
      console.log("LOAD EVENT");
      addSources(map);
      mapLayers.forEach((layer) => {
        map.addLayer(layer.mapLayer);
      });

      setMap(map);
    });

    map.on('mousemove', function (e) {
      setLng(e.lngLat.lng.toFixed(2));
      setLat(e.lngLat.lat.toFixed(2));
    });
    /*
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(2));
      setLat(map.getCenter().lat.toFixed(2));
      setZoom(map.getZoom().toFixed(2));
    });
    */

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
    if (map == null || !map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(2));
      setLat(map.current.getCenter().lat.toFixed(2));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });


  useEffect(() => {
    console.log("mapLayers change");

  }, [visibleLayers]);

  const changeScaleState = (scaleResult, checked) => {
    console.log("scaleResult ", scaleResult);
    console.log("checked ", checked);
    setScale(scaleResult);
    let visibleLayersUpdate = {};
    let visibleVar = 'none';
    mapLayers.forEach((layer) => {
      if(layer.scaleID === scaleResult && selectedServices.includes(layer.serviceType)) {
        visibleLayersUpdate[layer.serviceType] = layer;
        visibleVar = 'visible';
      }
      map.setLayoutProperty(layer.layerID, 'visibility', visibleVar);
    });
    console.log("scale state: ", scale);
    console.log("layers state: ", visibleLayersUpdate);
    setLayers({...visibleLayersUpdate});
    setMap(map);
  };

  const changeVisibilityState = (serviceResult, checked) => {
    console.log("service ", serviceResult);
    console.log("checked ", checked);
    let visibleLayersUpdate = visibleLayers;
    let selectedServicesUpdate = selectedServices;
    if(!checked) {
      const removeIndex = selectedServicesUpdate.indexOf(serviceResult);
      if (removeIndex > -1) {
        selectedServicesUpdate.splice(removeIndex, 1);
      }
      setServices([...selectedServicesUpdate]);

      const layer = visibleLayers[serviceResult];
      map.setLayoutProperty(layer.layerID, 'visibility', 'none');
      delete visibleLayersUpdate[serviceResult];
      setLayers({...visibleLayersUpdate});
    }
    else {
      selectedServicesUpdate.push(serviceResult);
      //You're calling setNumbers and passing it the array it already has.
      //You've changed one of its values but it's still the same array, and
      //I suspect React doesn't see any reason to re-render because state
      //hasn't changed; the new array is the old array. 
      //One easy way to avoid this is by spreading the array into a new array:
      setServices([...selectedServicesUpdate]);
      mapLayers.forEach((layer) => {
        if(layer.scaleID === scale && layer.serviceType === serviceResult) {
          map.setLayoutProperty(layer.layerID, 'visibility', 'visible');
          visibleLayersUpdate[serviceResult] = layer;
          setLayers({...visibleLayersUpdate});
          console.log("add visible layer: ");
          console.log(visibleLayersUpdate);
        }
      });
    }
    console.log("selectedServices: after visibility change ", selectedServices);
    setMap(map);
  };

  async function changeBasemapState(basemapId, checked){
    console.log("basemapId ", basemapId);
    console.log("checked ", checked);
    await map.setStyle('mapbox://styles/mapbox/' + basemapId);
    setTimeout(() => {
      addSources(map);
      for (const key in visibleLayers) {
        map.addLayer(visibleLayers[key]);
        map.setLayoutProperty(visibleLayers[key].layerID, 'visibility', 'visible');
      }
    }, 1000);

    setMap(map);
  }

  return (
      <Col className="map-container" ref={mapContainer} >
        <VerticalMenu
          //scale={scale}
          //layers={visibleLayers}
          changeVisibilityState={changeVisibilityState}
          changeScaleState={changeScaleState}
        />
        <Legend
          layers={visibleLayers}
          services={selectedServices}
          //svgLegends={legends}
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
