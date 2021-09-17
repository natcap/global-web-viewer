import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { BsInfoCircle} from 'react-icons/bs';

const ServicePopover = (props) => {
  const sourceArray = Array.isArray(props.content.source);

  const renderSource = (sourceObj, i) => {
    let sourceResult = "N/A";
    if(sourceObj.type === "text") {
      sourceResult = <span key={`source-${i}`}>{sourceObj.text}</span>
    }
    else if(sourceObj.type === "link") {
      sourceResult = <a key={`source-${i}`} href={sourceObj.link}>{sourceObj.linkText}</a>
    }
    else if(sourceObj.type === "break") {
      sourceResult = <br/>
    }
    return sourceResult;
  };

  const popover = (
    <Popover id="popover-service" className="popover-service">
      <Popover.Title className="popover-service-title">
        {props.title}
      </Popover.Title>
      <Popover.Content>
        <h5>Metric</h5>
        {props.content.metric}
        <h5>Desciption</h5>
        {props.content.text}
        <h5>Source</h5>
        {sourceArray
          ? props.content.source.map(renderSource)
          : props.content.source
        }
        <h5>Resolution</h5>
        {props.content.resolution}
        <h5>Data Date</h5>
        {props.content.date}
        <h5>Geographic coverage</h5>
        {props.content.coverage}
        <h5>License</h5>
        <a href={props.content.license.link}>{props.content.license.text}</a>
        <h5>Citation</h5>
        <a href={props.content.citation.link}>{props.content.citation.text}</a>
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" rootClose={true} placement="right" overlay={popover}>
      <Button variant="info" className="button-info" bsPrefix="info-btn">
        <BsInfoCircle />
      </Button>
    </OverlayTrigger>
  );
};

ServicePopover.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
}

export default ServicePopover;
