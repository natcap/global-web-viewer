import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

import LayerSelect from './LayerSelect';

const VerticalMenu = (props) => {
  
  function handleChange(event) {
    const { id, checked } = event.target;
    console.log("event value: ", checked);
    props.changeBasemapState(id, checked);
  };

  return (
    <Form className="vertical-menu">
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0" className="accordion-header">
            Data Scale v
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0" className="accordion-header">
            <Card.Body>
              {['Global', 'Country', 'Admin'].map((label) => (
                <Form.Check
                  key={`radio-key-${label}`}
                  type="radio"
                  id={`radio-${label}`}
                  name="radio-scales"
                  label={`${label}`}
                />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1" className="accordion-header">
            Layers Select v
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="accordion-header">
            <Card.Body>
              <LayerSelect
                layers={props.layers}
                changeVisibilityState={props.changeVisibilityState}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      
        <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1" className="accordion-header">
            Basemap Settings v
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="accordion-header">
            <Card.Body>
              {props.basemaps.map((basemap) => (
                <Form.Check
                  defaultChecked={basemap.layerID == 'streets-v11'}
                  key={`radio-key-${basemap.layerID}`}
                  type="radio"
                  id={`${basemap.layerID}`}
                  name="radio-basemaps"
                  label={`${basemap.name}`}
                  onChange={handleChange}
                  inline
                />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Form>
  );
};

export default VerticalMenu;
