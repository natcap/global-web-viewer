import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import D3Legend from './D3Legend';
import InfoPopover from './InfoPopover';

const legendStyle = {
  'sediment': {
    id: 'sediment',
    name: 'Sediment Deposition Pct',
    desc: 'Sediment retention for downstream users',
    colorStops: ['0', '100'],
    colors: ['#f2f2e6', '#664830'],
    info: `Low = 1st percentile, Medium = 50th percentile, High = 99th
      percentile, scaled based on the chosen area of focus.`
    },
  'nitrogen': {
    id: 'nitrogen',
    name: 'Nitrogen Pct',
    desc: 'Nitrogen retention for downstream users',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#dae1f2', '#114cab'],
    info: `Low = 1st percentile, Medium = 50th percentile, High = 99th
      percentile, scaled based on the chosen area of focus.`
  },
  'natureAccess': {
    id: 'natureAccess',
    name: 'Access to Nature Pct',
    desc: 'Number of people near natural lands',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#e5f2da', '#0e5720'],
    info: `Low = 1st percentile, Medium = 50th percentile, High = 99th
      percentile, scaled based on the chosen area of focus.`
  },
  'coastalProtection': {
    id: 'coastalProtection',
    name: 'Coastal Protection',
    desc: 'Risk reduction for coastal communities',
    colorStops: [
      '0-4.6', '4.6-29.3', '29.3-101.1', '101.1-284.4', '284.4-732.2',
      '732.2-1790.7', '1790.7-4555.7', '4555.7-14861.5'],
    colors: [
      '#f3deff', '#e2c7ec', '#d1afdc', '#c098cd', '#ae81bd', '#9d69ad',
      '#8c529d', '#7b3a8d', '#500066'],
    info: 'Low = 0-4.6, Medium = 284.4-732.2, High = 14861.5+',
  },
}


const Legend = (props) => {

  const renderLegend = (serviceType, i) => {
      return (
        <ListGroup.Item key={`legendStyle-${i}`} className="legend-container">
          <div className="legend-desc">{legendStyle[serviceType].desc}</div>
          <Row>
            <Col>
              <D3Legend serviceType={serviceType} legendStyle={legendStyle}/>
            </Col>
            <Col xs="auto">
              <InfoPopover
                key={`legend-popover-${serviceType}`}
                content={legendStyle[serviceType].info}
              />
            </Col>
          </Row>
        </ListGroup.Item>
      );
  };

  if (props.services.length > 0) {
    return (
      <ListGroup variant="flush" className="legend-group">
        {props.services.map(renderLegend)}
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
}

export default Legend;
