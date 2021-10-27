import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import D3Legend from './D3Legend';
import InfoPopover from './InfoPopover';

import { GrDrag } from 'react-icons/gr';

import {
//  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

const SortableItem = (props) => {
  const [checked, setChecked] = useState(true);

  function handleVisibilityChange(event) {
    setChecked(event.currentTarget.checked);
    console.log("eye event: ", event.target);
    const { value, checked } = event.currentTarget;
    console.log("eye target: ", value, checked);
    props.handleVisibilityChange(value, checked);
  }

  const DragHandle = sortableHandle(() =>
    <span>{<GrDrag/>}</span>);

  return (
    <ListGroup.Item key={`legendStyle-${props.index}`} className="legend-item">
      <Row>
        <Col className="drag-handle" xs="auto">
          <DragHandle />
        </Col>
        <Col className="legend-desc">
          {props.legendStyle[props.value].desc}
        </Col>
        <Col xs="auto">
          <ButtonGroup toggle>
            <ToggleButton
              id={props.value}
              type="checkbox"
              variant="secondary"
              checked={checked}
              value={props.value}
              onChange={handleVisibilityChange}
              className="button-eye"
              bsPrefix="info-btn"
             >
              {checked ? <AiOutlineEye/> : <AiOutlineEyeInvisible/>}
            </ToggleButton>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="d3-legend-row">
        <Col>
          <D3Legend serviceType={props.value} legendStyle={props.legendStyle}/>
        </Col>
        <Col xs="auto">
          <InfoPopover
            key={`legend-popover-${props.value}`}
            title={props.legendStyle[props.value].name}
            content={props.legendStyle[props.value].info}
          />
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

SortableItem.propTypes = {
  value: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  legendStyle: PropTypes.object.isRequired,
  handleVisibilityChange: PropTypes.func.isRequired,
}

export default SortableItem;
