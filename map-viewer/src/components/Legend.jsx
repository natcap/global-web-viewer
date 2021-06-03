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

  const renderLegend = (legend, i) => {
    return (
      <div key={i} className="legend-container">
        <Form.Label
          //onChange={() => props.changeVisibilityState(i)}
          //onChange={handleChange}
          id={i}
          className="legend-label"
        >
          Legend
        </Form.Label>
      </div>
    );
  };

  return (
    <Form className="legend-group">
      {props.legend.map(renderLegend)}
    </Form>
  );
};

export default Legend;
