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
      imageIcon: 'light.png',
    },
    {
      layerID: 'dark-v10',
      name: 'dark',
      imageIcon: 'dark.png',
    },
    {
      layerID: 'streets-v11',
      name: 'streets',
      imageIcon: 'streets.png',
    },
    {
      layerID: 'satellite-v9',
      name: 'satellite',
      imageIcon: 'satellite.png',
    },
  ]

  const clickPopupKey = {
    sediment: {name: 'Sediment retention', key: 'sed_'},
    nitrogen: {name: 'Nitrogen retention', key: 'nit_'},
    natureAccess: {name: 'Access to Nature', key: 'acc_'},
  }

  //const meanStatsList = ['sed_mean', 'nit_mean', 'acc_mean'];
  //const pctStatsList = ['sed_pct', 'nit_pct', 'acc_pct'];

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
  //const [scale, _setScale] = useState('global');
  //const [scale, setScale] = useState('global');
  //const [selectedServices, setServices] = useState([]);
  const [visibleLayers, setLayers] = useState({});

  const [selectedServices, _setServices] = useState([]);
  const servicesRef = useRef(selectedServices);
  const setServices = (data) => {
    servicesRef.current = data;
    _setServices(data);
  };


  //const scaleRef = React.useRef(scale);
  const scale = React.useRef(null);

  const geocoderNational = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country',
    mapboxgl: mapboxgl,
    //collapsed: true,
  });
  const geocoderAdmin = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'region',
    mapboxgl: mapboxgl
  });


  /*
  const setScale = x => {
    scaleRef.current = x; // keep updated
    _setScale(x);
  };
  */

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

    map.on('draw.create', highlightSelected);
    map.on('draw.delete', removeHighlight);
    //map.on('draw.update', updateArea);

    function highlightSelected(e) {
      console.log("draw.create")
      console.log(e);
      const data = draw.getAll();
      if (data.features.length > 0) {
        const geoms = data.features[0].geometry.coordinates[0];
        let arrayX = [];
        let arrayY = [];
        geoms.forEach((point) => {
          const pointLike = map.project(point);
          arrayX.push(pointLike.x);
          arrayY.push(pointLike.y);
        });

        const bbox = [[Math.min(...arrayX), Math.max(...arrayY)], [Math.max(...arrayX), Math.min(...arrayY)]];
        // The geometry of the query region in pixels: either a single point
        // or bottom left and top right points describing a bounding box,
        // where the origin is at the top left.
        var features = map.queryRenderedFeatures(bbox, {
          layers: ['stats-hybas']
        });
        let featList = [];
        features.forEach((feat) => {
          const featID = feat.properties.HYBAS_ID;
          featList.push(featID);
        });

        map.setPaintProperty(
          'stats-hybas', 'fill-opacity', [
            'match', ['get', 'HYBAS_ID'], [...featList], 0.0, 0.8]);

        //map.setFeatureState(
        //  { source: 'stats-hybas', sourceLayer: 'hybas_all_stats', id: featId },
        //  { hover: true }
        //);
      }

    }

    function removeHighlight(e) {
      console.log("draw.delete")
      console.log(e)
      map.setPaintProperty(
        'stats-hybas', 'fill-opacity', 0.8);
      /*
      const data = draw.getAll();
      if (data.features.length > 0) {
        console.log(e);
        console.log(data);
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
      */

    }
    //var hoveredStateId = null;

    map.on('load', () => {
      scale.current = 'global';
      console.log("LOAD EVENT");

      // Add geocoder result to container.
      geocoderNational.on('result', function (e) {
        if(scale.current !== 'national') {
          return;
        }
        //results.innerText = JSON.stringify(e.result, null, 2);
        console.log(e);
        const countryName = e.result.place_name;
        console.log(countryName);
        const lngLatBbox = e.result.bbox;
        map.fitBounds(lngLatBbox, {padding:40});
        const resultCenter = e.result.center;
        const centerPointLike = map.project(resultCenter);

        // The geometry of the query region in pixels: either a single point
        // or bottom left and top right points describing a bounding box,
        // where the origin is at the top left.
        var features = map.queryRenderedFeatures(centerPointLike, {
          layers: ['stats-gadm0']
        });
        const featID = features[0].properties.NAME_0;

        map.setPaintProperty(
          'stats-gadm0', 'fill-opacity', [
            'match', ['get', 'NAME_0'], featID, 0.0, 0.8]);
      });
      geocoderAdmin.on('result', function (e) {
        if(scale.current !== 'admin') {
          return;
        }
        //results.innerText = JSON.stringify(e.result, null, 2);
        console.log(e);
        const countryName = e.result.place_name;
        console.log(countryName);
        const lngLatBbox = e.result.bbox;
        map.fitBounds(lngLatBbox, {padding:40});
        const resultCenter = e.result.center;
        const centerPointLike = map.project(resultCenter);

        // The geometry of the query region in pixels: either a single point
        // or bottom left and top right points describing a bounding box,
        // where the origin is at the top left.
        var features = map.queryRenderedFeatures(centerPointLike, {
          layers: ['stats-gadm1']
        });
        const featID = features[0].properties.NAME_1;

        map.setPaintProperty(
          'stats-gadm1', 'fill-opacity', [
            'match', ['get', 'NAME_1'], featID, 0.0, 0.8]);
      });


      let originLayers = map.getStyle().layers;
      let firstSymbolId = '';
      for (let i = 0; i < originLayers.length; i++) {
        if (originLayers[i].type === 'symbol') {
          firstSymbolId = originLayers[i].id;
          break;
        }
      }
      mapLayers.forEach((layer) => {
        map.addLayer(layer.mapLayer, firstSymbolId);
      });

      // Turns all road layers in basemap non-visible
      map.getStyle().layers.map(function (layer) {
        if (layer.id.indexOf('road') >= 0) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      setMap(map);
    });

    map.on('mousemove', function (e) {
      setLng(e.lngLat.lng.toFixed(2));
      setLat(e.lngLat.lat.toFixed(2));
    });

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(2));
      setLat(map.getCenter().lat.toFixed(2));
      setZoom(map.getZoom().toFixed(2));
    });


    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'stats-gadm0', function (e) {
      // Only pop up info if gadm1 scale is selected
      console.log("clicked scale: ", scale.current);
      //scale.current = 'global;
      if (scale.current === 'national') {
        console.log("click stats-gadm0");
        console.log(selectedServices);
        let htmlString = `<h3>${e.features[0].properties.NAME_0}</h3>`;
        let currentServices = [...servicesRef.current];
        if (currentServices.length > 0) {
          currentServices.forEach((service) => {
            console.log(service);
            const attrKey = clickPopupKey[service].key;
            htmlString = htmlString + `
             <h4><u>${clickPopupKey[service].name}</u></h4>
             <h5>Mean:  ${e.features[0].properties[attrKey+'mean'].toExponential(3)}</h5>
            `
          });
          new mapboxgl.Popup({closeButton:true})
          .setLngLat(e.lngLat)
          .setHTML(htmlString)
          .addTo(map);
        }
        else {
          htmlString = htmlString + `<h5>Select a service layer to see 
          aggregated statistics.</h5>`
          new mapboxgl.Popup({closeButton:true})
          .setLngLat(e.lngLat)
          .setHTML(htmlString)
          .addTo(map);
        }
      }
    });
    map.on('click', 'stats-gadm1', function (e) {
      // Only pop up info if gadm1 scale is selected
      if (scale.current === 'admin') {
        console.log("click stats-gadm1");
        let htmlString = `<h3>${e.features[0].properties.NAME_1}</h3>`;
        let currentServices = [...servicesRef.current];
        if (currentServices.length > 0) {
          currentServices.forEach((service) => {
            const attrKey = clickPopupKey[service].key;
            htmlString = htmlString + `
             <h4><u>${clickPopupKey[service].name}</u></h4>
             <h5>Mean:  ${e.features[0].properties[attrKey+'mean'].toExponential(3)}</h5>
             <h5>Percentile*:  ${e.features[0].properties[attrKey+'pct'].toFixed(2)}</h5>
            `
          });
          new mapboxgl.Popup({closeButton:true})
          .setLngLat(e.lngLat)
          .setHTML(
            htmlString + `<br/><h5>* percentile is in comparison with the mean value
            of other regions within the same country.</h5>`)
          .addTo(map);
        }
        else {
          htmlString = htmlString + `<h5>Select a service layer to see 
          aggregated statistics.</h5>`
          new mapboxgl.Popup({closeButton:true})
          .setLngLat(e.lngLat)
          .setHTML(htmlString)
          .addTo(map);
        }
      }
    });
    map.on('click', 'stats-hybas', function (e) {
      if (scale.current === 'local' && draw.getMode() === 'simple_select') {
        console.log("click stats-hybas");
        console.log(e);
        let htmlString = `
          <h3>${e.features[0].properties.NAME_0}<br/>
            <span>HydroBASIN ID ${e.features[0].properties.HYBAS_ID}</span>
          </h3>`;
        let currentServices = [...servicesRef.current];
        if (currentServices.length > 0) {
          currentServices.forEach((service) => {
            const attrKey = clickPopupKey[service].key;
            htmlString = htmlString + `
             <h4><u>${clickPopupKey[service].name}</u></h4>
             <h5>Mean:  ${e.features[0].properties[attrKey+'mean'].toExponential(3)}</h5>
             <h5>Percentile*:  ${e.features[0].properties[attrKey+'pct'].toFixed(2)}</h5>
            `
          });
          new mapboxgl.Popup({closeButton:true})
          .setLngLat(e.lngLat)
          .setHTML(
            htmlString + `<br/><h5>* percentile is in comparison with the mean value
            of other regions within the same country.</h5>`)
          .addTo(map);
        }
        else {
          htmlString = htmlString + `<h5>Select a service layer to see 
          aggregated statistics.</h5>`
          new mapboxgl.Popup({closeButton:true})
          .setLngLat(e.lngLat)
          .setHTML(htmlString)
          .addTo(map);
        }
      }
    });

    console.log("main useeffect");
    // Clean up on unmount
    return () => map.remove();
  }, []);
  //}, [lng, lat, zoom]); // eslint-disable-line-react-hooks/exhaustive-deps

  /*
  useEffect(() => {
    if (map == null || !map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(2));
      setLat(map.current.getCenter().lat.toFixed(2));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  */


  useEffect(() => {
    console.log("mapLayers change");

  }, [visibleLayers]);

  const changeScaleState = (scaleResult, checked) => {
    console.log("scaleResult ", scaleResult);
    console.log("checked ", checked);
    scale.current = scaleResult;
    //handleScale(scaleResult);
    //scaleState = scaleResult;
    let visibleLayersUpdate = {};
    let visibleVar = 'none';
    const currentServices = [...selectedServices];
    mapLayers.forEach((layer) => {
      if(layer.scaleID === scaleResult && currentServices.includes(layer.serviceType)) {
        visibleLayersUpdate[layer.serviceType] = layer;
        visibleVar = 'visible';
      }
      if(layer.serviceType === 'all') {
        visibleVar = 'visible';
      }
      map.setLayoutProperty(layer.layerID, 'visibility', visibleVar);
      visibleVar = 'none';
    });
    if(scaleResult === 'local') {
      map.setPaintProperty('stats-hybas', 'fill-opacity', 0.60);
      map.setPaintProperty('stats-gadm0', 'fill-opacity', 0.00);
      map.setPaintProperty('stats-gadm1', 'fill-opacity', 0.00);
    }
    else if(scaleResult === 'national') {
      map.setPaintProperty('stats-hybas', 'fill-opacity', 0.00);
      map.setPaintProperty('stats-gadm0', 'fill-opacity', 0.60);
      map.setPaintProperty('stats-gadm1', 'fill-opacity', 0.00);
    }
    else if(scaleResult === 'admin') {
      map.setPaintProperty('stats-hybas', 'fill-opacity', 0.00);
      map.setPaintProperty('stats-gadm0', 'fill-opacity', 0.00);
      map.setPaintProperty('stats-gadm1', 'fill-opacity', 0.60);
    }
    else {
      map.setPaintProperty('stats-hybas', 'fill-opacity', 0.00);
      map.setPaintProperty('stats-gadm0', 'fill-opacity', 0.00);
      map.setPaintProperty('stats-gadm1', 'fill-opacity', 0.00);
    }
    setLayers({...visibleLayersUpdate});
    setMap(map);
  };

  const changeVisibilityState = (serviceResult, checked) => {
    console.log("service ", serviceResult);
    console.log("checked ", checked);
    let visibleLayersUpdate = visibleLayers;
    let selectedServicesUpdate = [...selectedServices];
    console.log("servicesRef current: ", selectedServicesUpdate);
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
      console.log("change Vis State: ", scale.current);
      mapLayers.forEach((layer) => {
        if(layer.scaleID === scale.current && layer.serviceType === serviceResult) {
          map.setLayoutProperty(layer.layerID, 'visibility', 'visible');
          visibleLayersUpdate[serviceResult] = {...layer};
          setLayers({...visibleLayersUpdate});
        }
      });
    }
    console.log("selectedServices: after visibility change ", [...selectedServices]);
    setMap(map);
  };

  async function changeBasemapState(basemapId, checked){
    console.log("basemapId ", basemapId);
    console.log("checked ", checked);
    await map.setStyle('mapbox://styles/mapbox/' + basemapId);
    setTimeout(() => {
      let originLayers = map.getStyle().layers;
      let firstSymbolId = '';
      for (let i = 0; i < originLayers.length; i++) {
        if (originLayers[i].type === 'symbol') {
          firstSymbolId = originLayers[i].id;
          break;
        }
      }
      //addSources(map);
      mapLayers.forEach((layer) => {
        map.addLayer(layer.mapLayer, firstSymbolId);
      });
      for (const serviceType in visibleLayers) {
        map.setLayoutProperty(visibleLayers[serviceType].layerID, 'visibility', 'visible');
      }
    }, 1000);

    console.log("change BM visible layers:");
    console.log(visibleLayers);

    setMap(map);
  }

  return (
      <Col className="map-container" ref={mapContainer} >
        <VerticalMenu
          changeVisibilityState={changeVisibilityState}
          changeScaleState={changeScaleState}
          geocoderNational={geocoderNational}
          geocoderAdmin={geocoderAdmin}
        />
        <Legend
          layers={visibleLayers}
          services={selectedServices}
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
