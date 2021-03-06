import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

import { FaChevronCircleUp, FaChevronCircleDown } from 'react-icons/fa';

import SortableItem from './SortableItem';

import {
  sortableContainer,
  sortableElement,
  //sortableHandle,
} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

const legendStyle = {
  'sediment': {
    id: 'sediment',
    name: 'Sediment Deposition Pct',
    desc: 'Sediment retention for downstream users',
    type: 'sequential',
    colorStops: ['0', '100'],
    colors: ['#f2f2e6', '#664830'],
    info: `Low = 1st percentile, Medium = 50th percentile, High = 99th
      percentile, scaled based on the chosen area of focus.`
    },
  'nitrogen': {
    id: 'nitrogen',
    name: 'Nitrogen Pct',
    desc: 'Nitrogen retention for downstream users',
    type: 'sequential',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#dae1f2', '#114cab'],
    info: `Low = 1st percentile, Medium = 50th percentile, High = 99th
      percentile, scaled based on the chosen area of focus.`
  },
  'natureAccess': {
    id: 'natureAccess',
    name: 'Access to Nature Pct',
    desc: 'Number of people near natural lands',
    type: 'sequential',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#e5f2da', '#0e5720'],
    info: `Low = 1st percentile, Medium = 50th percentile, High = 99th
      percentile, scaled based on the chosen area of focus.`
  },
  'coastalProtection': {
    id: 'coastalProtection',
    name: 'Coastal Protection',
    desc: 'Risk reduction for coastal communities',
    type: 'sequential',
    colorStops: [
      '0-4.6', '4.6-29.3', '29.3-101.1', '101.1-284.4', '284.4-732.2',
      '732.2-1790.7', '1790.7-4555.7', '4555.7-14861.5'],
    colors: [
      '#f3deff', '#e2c7ec', '#d1afdc', '#c098cd', '#ae81bd', '#9d69ad',
      '#8c529d', '#7b3a8d', '#500066'],
    info: 'Low = 0-4.6, Medium = 284.4-732.2, High = 14861.5+',
  },
  'lulc': {
    id: 'lulc',
    name: 'Land use/land cover type',
    desc: 'Land use/land cover type',
    type: 'ordinal',
    colorKeys: [
      'Bare areas', 'Cropland', 'Grassland/herbaceous', 'Shrubland',
      'Snow/ice', 'Tree cover', 'Urban areas', 'Water bodies', 'Wetland'],
    colors: [
      '#f7f0e4', '#bf96d6', '#c7d79e', '#ccb078', '#f5f5f5', '#637838',
      '#000000', '#7a8ef5', '#444f89'],
    info: 'Land use/land cover type',
  },
  'population': {
    id: 'population',
    name: 'Population',
    desc: 'Population counts',
    type: 'sequential',
    colorStops: [
      '0-1', '1-5', '5-25', '25-250', '250-1000', '1000-5000',
      '5000-25000', '25000+'],
    colors: [
      '#ffffff', '#ffffd4', '#fee9ac', '#fed080', '#feab46', '#f38821',
      '#de6712', '#be4d0a'],
    info: `Number of people per pixel. Population counts representing an
    average, or ambient, population distribution.
    Low = 0-5, Medium = 250-1000, High = 25000+`,
  },
  'coastal-habitat': {
    id: 'coastal-habitat',
    name: 'Coastal habitat types',
    desc: 'Coastal habitat types',
    type: 'ordinal',
    colorKeys: [
      'Coastal Forest / Scrub', 'Coral Reefs', 'Mangroves', 'Saltmarsh',
      'Seagrass', 'Wetland'],
    colors: [
      '#D4B577', '#FC8D62', '#FFEC42', '#CA7AF5', '#99CF78', '#6FACED'],
    info: 'Coastal and marine habitats',
  },
  'protected-areas': {
    id: 'protected-areas',
    name: 'Protected areas',
    desc: 'Protected areas',
    type: 'ordinal',
    colorKeys: ['Protected'],
    colors: ['#fbfcac'],
    info: 'Terrestrial and coastal protected areas',
  },
}


const ItemSortable = sortableElement(({value, index, handleVisibilityChange, scaleState}) => (
  <SortableItem
    value={value}
    index={index}
    legendStyle={legendStyle}
    scaleState={scaleState}
    handleVisibilityChange={handleVisibilityChange}
  />
));

const SortableContainer = sortableContainer(({children}) => {
  return <ul className="sortable-container">{children}</ul>;
});


const Legend = (props) => {
  const [legendOpen, setLegendOpen] = useState(true);

  function handleDragEnd({oldIndex, newIndex}) {
    const sortedServices = arrayMoveImmutable(props.services, oldIndex, newIndex);
    props.changeLayerOrder(sortedServices, oldIndex, newIndex);
  }
  function handleVisibilityChange(serviceValue, visibilityBool) {
    console.log("Legend vis change: ", serviceValue, visibilityBool);
    props.handleVisibilityChange(serviceValue, visibilityBool);
  }

  const renderLegend = (serviceType, i) => {
      return (
        <ItemSortable
          className="sortable-item"
          key={`item-${serviceType}-${i}`}
          index={`${i}`}
          value={serviceType}
          scaleState={props.scaleState}
          handleVisibilityChange={handleVisibilityChange}/>
      );
  };

  if (props.services.length > 0) {
    return (
      <Form className="legend-form">
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0" className="accordion-header" onClick={() => setLegendOpen(!legendOpen)}>
              <Row>
                <Col>Legend</Col>
                <Col xs="auto">
                  {legendOpen ? <FaChevronCircleDown/> : <FaChevronCircleUp/> }
                </Col>
              </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className="accordion-header">
              <Card.Body className="card-body-legend">
                <ListGroup variant="flush" className="legend-group">
                  <SortableContainer
                    onSortEnd={handleDragEnd}
                    helperClass="sortable-container-helper"
                    axis='y'
                    //lockAxis='y'
                    //lockToContainerEdges={true}
                    lockOffset='0%'
                    transitionDuration={600}
                    useDragHandle>
                    {props.services.map(renderLegend)}
                  </SortableContainer>
                </ListGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Form>
    );
  }
  else {
    return null;
  }
};

Legend.propTypes = {
  layers: PropTypes.object.isRequired,
  services: PropTypes.array.isRequired,
  changeLayerOrder: PropTypes.func.isRequired,
  handleVisibilityChange: PropTypes.func.isRequired,
  scaleState: PropTypes.string.isRequired,
}

export default Legend;
