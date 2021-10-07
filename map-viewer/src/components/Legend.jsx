import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import D3Legend from './D3Legend';
import InfoPopover from './InfoPopover';

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

import { GrDrag } from 'react-icons/gr';

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
    info: `Population counts representing an average, or ambient, population
    distribution. Low = 0-5, Medium = 250-1000, High = 25000+`,
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
    colors: ['#8cd11d'],
    info: 'Terrestrial and coastal protected areas',
  },
}

const DragHandle = sortableHandle(() => 
  <span>{<GrDrag/>}</span>);

const SortableItem = sortableElement(({value, index}) => (
    <ListGroup.Item key={`legendStyle-${index}`} className="legend-item">
      <Row>
        <Col className="drag-handle" xs="auto">
          <DragHandle />
        </Col>
        <Col className="legend-desc" xs="auto">
          {legendStyle[value].desc}
        </Col>
      </Row>
      <Row>
        <Col>
          <D3Legend serviceType={value} legendStyle={legendStyle}/>
        </Col>
        <Col xs="auto">
          <InfoPopover
            key={`legend-popover-${value}`}
            title={legendStyle[value].name}
            content={legendStyle[value].info}
          />
        </Col>
      </Row>
    </ListGroup.Item>
));

const SortableContainer = sortableContainer(({children}) => {
  return <ul className="sortable-container">{children}</ul>;
});


const Legend = (props) => {

  function handleDragEnd({oldIndex, newIndex}) {
    const sortedServices = arrayMoveImmutable(props.services, oldIndex, newIndex);
    props.changeLayerOrder(sortedServices, oldIndex, newIndex);
  }

  const renderLegend = (serviceType, i) => {
      return (
        <SortableItem
          className="sortable-item"
          key={`item-${serviceType}-${i}`}
          index={i}
          value={serviceType} />
      );
  };

  if (props.services.length > 0) {
    return (
      <ListGroup variant="flush" className="legend-group">
        <SortableContainer
          onSortEnd={handleDragEnd}
          helperClass="sortable-container-helper"
          axis='y'
          //lockAxis='y'
          //lockToContainerEdges={true}
          lockOffset='0%'
          transitionDuration='600'
          useDragHandle>
          {props.services.map(renderLegend)}
        </SortableContainer>
      </ListGroup>
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
}

export default Legend;
