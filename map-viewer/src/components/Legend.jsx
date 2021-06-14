import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';

import D3Legend from './D3Legend';


const Legend = (props) => {

  const renderLegend = (serviceType, i) => {
      //console.log("Legend service type: ", serviceType);
      return (
        <ListGroup.Item key={`legendStyle-${i}`} className="legend-container">
          <div>{props.layers[serviceType].name}</div>
          <D3Legend serviceType={serviceType}/>
        </ListGroup.Item>
      );
  };

  return (
    <ListGroup variant="flush" className="legend-group">
      {props.services.map(renderLegend)}
    </ListGroup>
  );
};

Legend.propTypes = {
  layers: PropTypes.object.isRequired,
  services: PropTypes.array.isRequired,
}

export default Legend;
