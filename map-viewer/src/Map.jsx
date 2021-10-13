import React, { useRef, useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FaChevronCircleUp, FaChevronCircleDown } from 'react-icons/fa';

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
import { coastalHabitats } from './ScaleDefinitions';
import { protectedLayers } from './ScaleDefinitions';

//mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1IjoiZGRlbnUiLCJhIjoiY2ttZjQwamU2MTE1bjJ3bGpmZGZncG52NCJ9.u2cSHaEPPDgZH7PYBZNhWw';

const multiFileLayers = {
  'coastal-habitat': coastalHabitats,
  'protected-areas': protectedLayers,
};
const statsScaleMap = {
  local: 'stats-hybas',
  admin: 'stats-gadm1',
  national: 'stats-gadm0',
};

const protectedIds = [
  'protected-points', 'protected-asia-pacific-fill',
  'protected-la-caribbean-fill', 'protected-af-polar-wa-fill',
  'protected-north-america-fill', 'protected-eu-0-fill',
  'protected-eu-1-fill', 'protected-eu-2-fill'];


const Map = () => {

  function getMapStyleSymbolId() {
      //let originLayers = map.getStyle().layers;
      let firstSymbolId = 'building';
      /*
      for (let i = 0; i < originLayers.length; i++) {
        if (originLayers[i].type === 'symbol') {
          firstSymbolId = originLayers[i].id;
          console.log("fist symbol id: ", firstSymbolId);
          break;
        }
      }
      */
    return firstSymbolId;
  }

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
    natureAccess: {name: 'Access to nature', key: 'acc_'},
    coastalProtection: {name: 'Realized coastal protection', key: 'rcp-'},
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
  const [basemapId, setBasemap] = useState('streets-v11');
  const [basemapControl, setBasemapControl] = useState(true);
  const [basemapChev, setBasemapChev] = useState(true);
  //const [mapLayers, setLayers] = useState(layers);
  //const [scale, _setScale] = useState('global');
  //const [scale, setScale] = useState('global');
  //const [selectedServices, setServices] = useState([]);
  const [visibleLayers, _setLayers] = useState({});
  const layersRef = useRef(visibleLayers);
  const setLayers = (data) => {
    layersRef.current = data;
    _setLayers(data);
  };

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
    //if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 1.6,
      maxZoom: 11.1,
      logoPosition: "top-right",
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
        const countryName = e.result.place_name;
        const lngLatBbox = e.result.bbox;
        map.fitBounds(lngLatBbox, {padding:40}).once('moveend', () => {
        //const resultCenter = e.result.center;
        //const centerPointLike = map.project(resultCenter);
          const bbXYMinLike = map.project([lngLatBbox[0], lngLatBbox[1]]);
          const bbXYMaxLike = map.project([lngLatBbox[2], lngLatBbox[3]]);
          const bbXYLike = [
            [bbXYMinLike.x, bbXYMinLike.y],
            [bbXYMaxLike.x, bbXYMaxLike.y]
          ];

          // The geometry of the query region in pixels: either a single point
          // or bottom left and top right points describing a bounding box,
          // where the origin is at the top left.
          const features = map.queryRenderedFeatures(bbXYLike, {
            layers: ['stats-gadm0']
          });

          features.forEach((feat) => {
            const featID = feat.properties.NAME_0;
            if(featID === countryName) {
              map.setPaintProperty(
                'stats-gadm0', 'fill-opacity', [
                  'match', ['get', 'NAME_0'], featID, 0.0, 0.8]);
            }
          });
        });
        setMap(map);
      });
      geocoderAdmin.on('result', function (e) {
        if(scale.current !== 'admin') {
          return;
        }
        // Get only the admin name, separate from associated country
        const adminName = e.result.place_name.split(',')[0];
        const lngLatBbox = e.result.bbox;
        map.fitBounds(lngLatBbox, {padding:40}).once('moveend', () => {
        //const resultCenter = e.result.center;
        //const centerPointLike = map.project(resultCenter);
          const bbXYMinLike = map.project([lngLatBbox[0], lngLatBbox[1]]);
          const bbXYMaxLike = map.project([lngLatBbox[2], lngLatBbox[3]]);
          const bbXYLike = [
            [bbXYMinLike.x, bbXYMinLike.y],
            [bbXYMaxLike.x, bbXYMaxLike.y]
          ];

          // The geometry of the query region in pixels: either a single point
          // or bottom left and top right points describing a bounding box,
          // where the origin is at the top left.
          const features = map.queryRenderedFeatures(bbXYLike, {
            layers: ['stats-gadm1']
          });

          features.forEach((feat) => {
            const featID = feat.properties.NAME_1;
            if(featID === adminName) {
              map.setPaintProperty(
                'stats-gadm1', 'fill-opacity', [
                  'match', ['get', 'NAME_1'], featID, 0.0, 0.8]);
            }
          });
        });
        setMap(map);
      });
//      if (map.getLayer('rcp-points')) {
//        map.setPaintProperty('rcp-points', 'circle-radius', [
//          'interpolate',
//          ['linear'],
//          ['zoom'],
//          2,
//          2,
//          9,
//          4
//        ]);
//      }

      const firstSymbolId = getMapStyleSymbolId(map);
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

    const highlightClickHandler = (e, layerId, featName) => {
      const resultCenter = e.lngLat;
      const centerPointLike = map.project(resultCenter);

      // The geometry of the query region in pixels: either a single point
      // or bottom left and top right points describing a bounding box,
      // where the origin is at the top left.
      const features = map.queryRenderedFeatures(centerPointLike, {
        layers: [layerId]
      });
      console.log("highlight click feats: ", features);

      const featID = features[0].properties[featName];
      map.setPaintProperty(
        layerId, 'fill-opacity', [
          'match', ['get', featName], featID, 0.0, 0.8]);
    };

    const clickPopupDialogHandler = (e) => {
      console.log("scale current: ", scale.current);
      console.log("clickPopup e: ", e);
      let currentServices = [...servicesRef.current];
      if (currentServices.length === 1 && 'coastal-habitat' in currentServices) {
        const feat = map.queryRenderedFeatures(e.point, { layers: ['stats-gadm0'] });
        let htmlString = `<h3>${feat[0].properties.NAME_0}</h3>`;
        htmlString = htmlString + `<h5>Select a service layer to see
        aggregated statistics.</h5>`
        return htmlString;
      }
      if (currentServices.length > 0) {
        if ('national' === scale.current) {
          highlightClickHandler(e, 'stats-gadm0', 'NAME_0');
          const feat = map.queryRenderedFeatures(e.point, { layers: ['stats-gadm0'] });
          let htmlString = `<h3>Unidentied area</h3>`;
          if(feat.length) {
            htmlString = `<h3>${feat[0].properties.NAME_0}</h3>`;
          }
          currentServices.forEach((service) => {
            if(service === 'coastal-habitat') {
              return;
            }
            else if(service === 'protected-areas') {
              const protFeat = map.queryRenderedFeatures(e.point, { layers: protectedIds });
              if(protFeat.length) {
                htmlString = htmlString + `
                 <h4><u>Protected area</u></h4>
                 <h5>Name:  ${protFeat[0].properties.NAME}</h5>
                `
              }
            }
            else {
              if(feat.length) {
                const attrKey = clickPopupKey[service].key;
                htmlString = htmlString + `
                 <h4><u>${clickPopupKey[service].name}</u></h4>
                 <h5>Mean:  ${feat[0].properties[attrKey+'mean'].toExponential(3)}</h5>
                `
              }
            }
          });
          if (!htmlString.includes('h4')) {
              htmlString = htmlString + `
                <h5>No active layer selected. Select a service layer
                to see aggregated statistics.</h5>`;
          }
          return htmlString;
        }
        else if('admin' === scale.current) {
          highlightClickHandler(e, 'stats-gadm1', 'NAME_1');
          const feat = map.queryRenderedFeatures(e.point, { layers: ['stats-gadm1'] });
          let htmlString = `<h3>Unidentied area</h3>`;
          if(feat.length) {
            htmlString = `<h3>${feat[0].properties.NAME_1}</h3>`;
          }
          let pctNotice = false;
          currentServices.forEach((service) => {
            if(service === 'coastal-habitat') {
              return;
            }
            else if(service === 'protected-areas') {
              const protFeat = map.queryRenderedFeatures(e.point, { layers: protectedIds });
              if(protFeat.length) {
                htmlString = htmlString + `
                 <h4><u>Protected area</u></h4>
                 <h5>Name:  ${protFeat[0].properties.NAME}</h5>
                `
              }
            }
            else {
              if(feat.length) {
                const attrKey = clickPopupKey[service].key;
                htmlString = htmlString + `
                 <h4><u>${clickPopupKey[service].name}</u></h4>
                 <h5>Mean:  ${feat[0].properties[attrKey+'mean'].toExponential(3)}</h5>
                `
                if(service !== 'coastalProtection') {
                  htmlString = htmlString + `
                    <h5>Percentile*:  ${feat[0].properties[attrKey+'pct'].toFixed(2)}</h5>
                  `
                  pctNotice = true;
                }
              }
            }
          });
          if(pctNotice) {
            htmlString = htmlString + `
              <br/><h5>* percentile is in comparison with the mean value
              of other regions within the same country.</h5>
            `
          }
          if (!htmlString.includes('h4')) {
              htmlString = htmlString + `
                <h5>No active layer selected. Select a service layer
                to see aggregated statistics.</h5>`;
          }
          return htmlString;
        }
        else if('local' === scale.current && draw.getMode() === 'simple_select') {
          highlightClickHandler(e, 'stats-hybas', 'HYBAS_ID');
          const feat = map.queryRenderedFeatures(e.point, { layers: ['stats-hybas'] });
          let htmlString = `<h3>Unidentied area</h3>`;
          if(feat.length) {
            htmlString = `
              <h3>${feat[0].properties.NAME_0}<br/>
                <span>HydroBASIN ID ${feat[0].properties.HYBAS_ID}</span>
              </h3>`;
          }
          let pctNotice = false;
          currentServices.forEach((service) => {
            if(service === 'coastal-habitat') {
              return;
            }
            else if(service === 'protected-areas') {
              const protFeat = map.queryRenderedFeatures(e.point, { layers: protectedIds });
              if(protFeat.length) {
                htmlString = htmlString + `
                 <h4><u>Protected area</u></h4>
                 <h5>Name:  ${protFeat[0].properties.NAME}</h5>
                `
              }
            }
            else {
              if(feat.length) {
                const attrKey = clickPopupKey[service].key;
                htmlString = htmlString + `
                 <h4><u>${clickPopupKey[service].name}</u></h4>
                 <h5>Mean:  ${feat[0].properties[attrKey+'mean'].toExponential(3)}</h5>
                 <h5>Percentile*:  ${feat[0].properties[attrKey+'pct'].toFixed(2)}</h5>
                `
                pctNotice = true;
              }
            }
          });
          if(pctNotice) {
            htmlString + `<br/><h5>* percentile is in comparison with the mean value
            of other regions within the same country.</h5>`;
          }
          if (!htmlString.includes('h4')) {
              htmlString = htmlString + `
                <h5>No active layer selected. Select a service layer
                to see aggregated statistics.</h5>`;
          }
          return htmlString;
        }
        else {
          const feat = map.queryRenderedFeatures(e.point, { layers: ['stats-gadm0'] });
          let htmlString = `<h3>Unidentied area</h3>`;
          if(feat.length) {
            htmlString = `<h3>${feat[0].properties.NAME_0}</h3>`;
          }
          currentServices.forEach((service) => {
            if(service === 'coastal-habitat') {
              return;
            }
            else if(service === 'protected-areas') {
              const protFeat = map.queryRenderedFeatures(e.point, { layers: protectedIds });
              if(protFeat.length) {
                htmlString = htmlString + `
                 <h4><u>Protected area</u></h4>
                 <h5>Name:  ${protFeat[0].properties.NAME}</h5>
                `;
              }
              else {
                htmlString = htmlString + `
                <h5>No active layer selected. Select a service layer and
                non global scale to see aggregated statistics.</h5>`;
              }
            }
            else {
              htmlString = htmlString + `
              <h5>No active layer selected. Select a service layer and
              non global scale to see aggregated statistics.</h5>`;
            }
          });
          return htmlString;
        }
      }
      else {
        const feat = map.queryRenderedFeatures(e.point, { layers: ['stats-gadm0'] });
        let htmlString = `<h3>Unidentied area</h3>`;
        if(feat.length) {
          htmlString = `<h3>${feat[0].properties.NAME_0}</h3>`;
        }
        htmlString = htmlString + `<h5>No active layer selected. Select a service layer to see
        aggregated statistics.</h5>`;
        return htmlString;
      }
    }

    // Handle click events on the map. When a click event occurs on a feature
    // layer open a popup at the location of the click, with description HTML
    // from its properties.
    map.on('click', function (e) {
      const htmlString = clickPopupDialogHandler(e);
      new mapboxgl.Popup({closeButton:true})
      .setLngLat(e.lngLat)
      .setHTML(htmlString)
      .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    //  map.on('mouseenter', 'protected-points', () => {
    //  map.getCanvas().style.cursor = 'pointer';
    //});

    // Change it back to a pointer when it leaves.
    //  map.on('mouseleave', 'protected-points', () => {
    //  map.getCanvas().style.cursor = '';
    //});

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
    if (map == null) return; // wait for map to initialize
    console.log('rcp-points radius useffect');
    //if (map.getLayer('rcp-points')) {
//      map.setPaintProperty('rcp-points', 'circle-radius', [
//        'interpolate',
//        ['linear'],
//        ['zoom'],
//        2,
//        2,
//        9,
//        4
//      ]);
  //  }
  }, [visibleLayers]);


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
    console.log("change scale sel serv: ", currentServices);
    console.log("change scale vis lay: ", layersRef.current);
    mapLayers.forEach((layer) => {
      if(layer.scaleID === scaleResult && currentServices.includes(layer.serviceType)) {
        visibleLayersUpdate[layer.serviceType] = layer;
        visibleVar = 'visible';
      }
      // This is the case for coastal protection. Show the same output across
      // scales
      if(layer.scaleID === 'all' && currentServices.includes(layer.serviceType)) {
        visibleLayersUpdate[layer.serviceType] = layer;
        visibleVar = 'visible';
      }
      if(layer.serviceType === 'all') {
        visibleVar = 'visible';
      }
      map.setLayoutProperty(layer.layerID, 'visibility', visibleVar);
      visibleVar = 'none';
      setMap(map);
      setLayers({...visibleLayersUpdate});
    });

    const firstSymbolId = getMapStyleSymbolId(map);
    //changeLayerOrder(currentServices);
    let zIndex = [];
    if(basemapId !== 'satellite-v9') {
      zIndex = [firstSymbolId];
    }
    else {
      zIndex = ['none'];
    }

    currentServices.forEach((serviceType, i) => {
      let curIds = [];
      // Add all layers from a service type if there are multiple of them
      if(serviceType in multiFileLayers) {
        multiFileLayers[serviceType].forEach((childLayer) => {
          curIds.push(childLayer.id);
          if(zIndex[i] !== 'none') {
            map.moveLayer(childLayer.id, zIndex[i]);
          }
          else {
            map.moveLayer(childLayer.id);
          }
        });
        zIndex.push(curIds[0]);
      }
      else {
        curIds.push(visibleLayersUpdate[serviceType].layerID);
        if(zIndex[i] !== 'none') {
          map.moveLayer(visibleLayersUpdate[serviceType].layerID, zIndex[i]);
        }
        else {
          map.moveLayer(visibleLayersUpdate[serviceType].layerID);
        }
        zIndex.push(visibleLayersUpdate[serviceType].layerID);
      }
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
    if(scaleResult !== 'global') {
      if(basemapId !== 'satellite-v9') {
        map.moveLayer(statsScaleMap[scaleResult], firstSymbolId);
      }
      else {
        map.moveLayer(statsScaleMap[scaleResult]);
      }
    }
    setLayers({...visibleLayersUpdate});
    setMap(map);
  };

  const changeVisibilityState = (serviceResult, checked) => {
    console.log("service ", serviceResult);
    console.log("checked ", checked);
    let visibleLayersUpdate = {...layersRef.current};
    console.log("change vis vis: ", visibleLayersUpdate);
    let selectedServicesUpdate = [...selectedServices];
    console.log("servicesRef current: ", selectedServicesUpdate);
    if(!checked) {
      const removeIndex = selectedServicesUpdate.indexOf(serviceResult);
      if (removeIndex > -1) {
        selectedServicesUpdate.splice(removeIndex, 1);
      }
      setServices([...selectedServicesUpdate]);

      const layer = layersRef.current[serviceResult];
      if(serviceResult in multiFileLayers) {
        console.log("vis layer update: ", visibleLayersUpdate);
        multiFileLayers[serviceResult].forEach((childLayer) => {
            map.setLayoutProperty(childLayer.id, 'visibility', 'none');
            //delete visibleLayersUpdate[serviceResult][childLayer.id];
        });
        delete visibleLayersUpdate[serviceResult];
        console.log("vis layer update: ", visibleLayersUpdate);
        setLayers({...visibleLayersUpdate});
      }
      else {
        map.setLayoutProperty(layer.layerID, 'visibility', 'none');
        delete visibleLayersUpdate[serviceResult];
      }
      setLayers({...visibleLayersUpdate});
    }
    else {
      //Using concat because we want newly added things in front of array 
      selectedServicesUpdate = [serviceResult].concat(selectedServicesUpdate);
      //You're calling setNumbers and passing it the array it already has.
      //You've changed one of its values but it's still the same array, and
      //I suspect React doesn't see any reason to re-render because state
      //hasn't changed; the new array is the old array. 
      //One easy way to avoid this is by spreading the array into a new array:
      setServices([...selectedServicesUpdate]);
      console.log("change Vis State sel serv: ", selectedServicesUpdate);
      console.log("change Vis State: ", scale.current);
      mapLayers.forEach((layer) => {
        // Check 'all' for coastal protection case where we want this one 
        // layer visible across all scales
        if((layer.scaleID === scale.current || layer.scaleID === 'all') && layer.serviceType === serviceResult) {
          map.setLayoutProperty(layer.layerID, 'visibility', 'visible');
          visibleLayersUpdate[serviceResult] = {...layer};
          console.log("change vis update layer : ", layer.layerID);

          setLayers({...visibleLayersUpdate});
        }
      });
      changeLayerOrder(selectedServicesUpdate);
    }
    console.log("selectedServices: after visibility change ", [...selectedServices]);
    setMap(map);
  };

  async function changeBasemapState(newBasemapId, checked){
    console.log("new basemapId ", newBasemapId);
    setBasemap(newBasemapId);
    console.log("checked ", checked);
    map.setStyle('mapbox://styles/mapbox/' + newBasemapId).once('styledata', () => {
      // Turns all road layers in basemap non-visible
      map.getStyle().layers.map(function (layer) {
        if (layer.id.indexOf('road') >= 0) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
      setMap(map);
      const firstSymbolId = getMapStyleSymbolId(map);
      //addSources(map);
      mapLayers.forEach((layer) => {
        map.addLayer(layer.mapLayer);
      });
      console.log("change basemap sel serv: ", selectedServices);
      const reversedServices = selectedServices.slice().reverse();
      console.log("change base vis layers: ", layersRef.current);
      reversedServices.forEach((serviceType) => {
        const layerId = layersRef.current[serviceType].layerID;
        // Add all layers from a service type if there are multiple of them
        if(serviceType in multiFileLayers) {
          multiFileLayers[serviceType].forEach((childLayer) => {
            map.setLayoutProperty(childLayer.id, 'visibility', 'visible');
            if(newBasemapId !== 'satellite-v9') {
              map.moveLayer(childLayer.id, firstSymbolId);
            }
            else {
              map.moveLayer(childLayer.id);
            }
          });
        }
        else {
          map.setLayoutProperty(layerId, 'visibility', 'visible');
          if(newBasemapId !== 'satellite-v9') {
            map.moveLayer(layerId, firstSymbolId);
          }
          else {
            map.moveLayer(layerId);
          }
        }
      });
      // Make sure to move the stats vector mask up front.
      console.log("scale.current is ", scale.current);
      if(scale.current !== 'global') {
        map.setLayoutProperty(statsScaleMap[scale.current], 'visibility', 'visible');
        map.setPaintProperty(statsScaleMap[scale.current], 'fill-opacity', 0.60);
        if(newBasemapId !== 'satellite-v9') {
          console.log("basemap move mask: ", statsScaleMap[scale.current]);
          map.moveLayer(statsScaleMap[scale.current], firstSymbolId);
        }
        else {
          map.moveLayer(statsScaleMap[scale.current]);
        }
      }
    });
    console.log("change BM visible layers:");
    console.log(layersRef.current);

    setMap(map);
  }

  const changeLayerOrder = (servicesSorted) => {
    console.log("change order");
    console.log("change order serv: ", servicesSorted);
    console.log("change order vis lay: ", layersRef.current);
    const firstSymbolId = getMapStyleSymbolId(map);
    let zIndex = [];
    if(basemapId !== 'satellite-v9') {
      zIndex = [firstSymbolId];
    }
    else {
      zIndex = ['none'];
    }
    console.log("change order zindex: ", zIndex);

    servicesSorted.forEach((serviceType, i) => {
      let curIds = [];
      // Add all layers from a service type if there are multiple of them
      if(serviceType in multiFileLayers) {
        multiFileLayers[serviceType].forEach((childLayer) => {
          curIds.push(childLayer.id);
          if(zIndex[i] !== 'none') {
            map.moveLayer(childLayer.id, zIndex[i]);
          }
          else {
            map.moveLayer(childLayer.id);
          }
        });
        zIndex.push(curIds[0]);
      }
      else {
        curIds.push(layersRef.current[serviceType].layerID);
        if(zIndex[i] !== 'none') {
          map.moveLayer(layersRef.current[serviceType].layerID, zIndex[i]);
        }
        else {
          map.moveLayer(layersRef.current[serviceType].layerID);
        }
        zIndex.push(layersRef.current[serviceType].layerID);
      }
    });
    // Need to bring any vector masks up front
    if(scale.current !== 'global') {
      if(basemapId !== 'satellite-v9') {
        map.moveLayer(statsScaleMap[scale.current], firstSymbolId);
      }
      else {
        map.moveLayer(statsScaleMap[scale.current]);
      }
    }

    setServices([...servicesSorted]);
    console.log("servicesSorted ", servicesSorted);
    setMap(map);
  };

  const changeBasemapControl = () => {
    setBasemapControl(!basemapControl);
    setBasemapChev(!basemapChev);
  }


  return (
      <Col className="map-container" >
        <div ref={mapContainer}></div>
        <VerticalMenu
          changeVisibilityState={changeVisibilityState}
          changeScaleState={changeScaleState}
          geocoderNational={geocoderNational}
          geocoderAdmin={geocoderAdmin}
        />
        <Legend
          layers={visibleLayers}
          services={selectedServices}
          changeLayerOrder={changeLayerOrder}
        />
        <Button
          onClick={changeBasemapControl}
          bsPrefix="basemap-control-button"
        >
          <span className="basemap-ctrl-name">Basemap Control</span>
          {basemapChev ? <FaChevronCircleDown/> : <FaChevronCircleUp/> }
        </Button>
        <BasemapControl className="basemap-control"
          basemaps={basemaps}
          changeBasemapState={changeBasemapState}
          showBasemapControl={basemapControl}
          lng={lng}
          lat={lat}
          zoom={zoom}
        />
      </Col>
  );
};

export default Map;
