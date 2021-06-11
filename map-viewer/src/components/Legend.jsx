import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import * as d3 from "d3";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

import D3Legend from './D3Legend';


const Legend = (props) => {

  //function handleChange(event) {
  //  const { id, checked } = event.target;
  //  console.log("event value: ", checked);
  //  props.changeVisibilityState(parseInt(id.slice(id.length - 1)), checked);
  //};
  /*
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
      serviceID: 'nitrogen',
      name: 'Nitrogen Pct',
      colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
      colors = ['#f7fcf5', '#caeac3', '#7bc87c', '#2a924a', '#00441b'],
    },
    for (i = 0; i < serviceStops.length; i++) {
      const stop = serviceStops[i];
      const color = colors[i];
      var item = document.createElement('div');
      var key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;

      var value = document.createElement('span');
      value.innerHTML = layer;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);

    }
    key={`radio-key-${scaleObj.scale}`}
      //<span className='legend-key' style="background-color:${colors[i]}">
        <div>Hello!</div>
      //</span>
    */

  const renderLegend = (layer, i) => {
    if(layer.mapLayer.layout.visibility === 'visible'){
      return (
        <ListGroup.Item key={`legendStyle-${i}`} className="legend-container">
          <div>{layer.name}</div>
          <D3Legend serviceType={layer.serviceType}/>
        </ListGroup.Item>
      );
    }
    return (
      null
    );
  };

  return (
    <ListGroup variant="flush" className="legend-group">
      {props.layers.map(renderLegend)}
    </ListGroup>
  );
};

export default Legend;
