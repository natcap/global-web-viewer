import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

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
  function styleLegend(serviceType) {
    const serviceStops = props.legend[serviceType].colorStops;
    const colors = props.legend[serviceType].colors;
    console.log("styleLegend");
    console.log(serviceStops);
    const returnItems = serviceStops.map((stop, i) =>
      <div>
        <span className='legend-key' style={{ backgroundColor:colors[i] }}/>
        <span>{stop}</span>
      </div>
    );
    return (
      <div>{returnItems}</div>
    );
  }

  const renderLegend = (layer, i) => {
    return (
      <div key={`legendStyle-${i}`} className="legend-container">
        <Form.Label
          //onChange={() => props.changeVisibilityState(i)}
          //onChange={handleChange}
          id={`legendStyle-${i}`}
          className="legend-label"
        >
          {layer.mapLayer.layout.visibility === 'visible' &&
              styleLegend(layer.serviceType)
              //<h2> Hello! </h2>
          }
        </Form.Label>
      </div>
    );
  };

  console.log("Legend");

  return (
    <Form className="legend-group">
      {props.layers.map(renderLegend)}
    </Form>
  );
};

export default Legend;
