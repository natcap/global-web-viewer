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
    },
  'nitrogen': {
    id: 'nitrogen',
    name: 'Nitrogen Pct',
    desc: 'Nitrogen retention for downstream users',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#dae1f2', '#114cab'],
  },
  'natureAccess': {
    id: 'natureAccess',
    name: 'Access to Nature Pct',
    desc: 'Number of people near natural lands',
    colorStops: ['0-26', '26-51', '51-76', '76-100', '101+'],
    colors: ['#e5f2da', '#0e5720'],
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
                content={
                  `Low = 1st percentile, Medium = 50th percentile, High = 99th
                  percentile, scaled based on the chosen area of focus.`}
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
