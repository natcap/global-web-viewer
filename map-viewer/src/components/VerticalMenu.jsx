import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FaGlobe } from 'react-icons/fa';
import { GiAfrica } from 'react-icons/gi';
import { BiPolygon, BiMapPin } from 'react-icons/bi';
import { IoSearchSharp } from 'react-icons/io5';
import { FaChevronCircleUp, FaChevronCircleDown } from 'react-icons/fa';


import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

import LayerSelect from './LayerSelect';
import { scales } from '../ScaleDefinitions';
import InfoPopover from './InfoPopover';
import { serviceMenuDetails, supportMenuDetails } from '../ScaleDefinitions';

const IconMap = {
  faglobe: <FaGlobe className="labelIcons"/>,
  giafrica: <GiAfrica className="labelIcons"/>,
  bipolygon: <BiPolygon className="labelIcons"/>,
  bimappin: <BiMapPin className="labelIcons"/>,
}

const VerticalMenu = (props) => {
  const [scaleOpen, setScaleOpen] = useState(true);
  const [layersOpen, setLayersOpen] = useState(true);
  const [otherOpen, setOtherOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const disabledSearch = () => {
    return (
      <InputGroup className="disabled-search">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">
            <IoSearchSharp color="#949494" className="search-icon"/>
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          id="searchDisable"
          placeholder="Search"
          disabled={true}
        />
      </InputGroup>
    );
  }

  useEffect(() => {
    props.geocoderNational.addTo('#geocoder-national');
    props.geocoderAdmin.addTo('#geocoder-admin');
  }, []);

  function handleScaleChange(event) {
    const { id, checked } = event.target;
    props.changeScaleState(id, checked);
  }
  const hiddenAdminStyle = () => {
    if (props.scaleState === 'admin') {
      return {visibility: "visible"};
    }
    else {
      return {visibility: "hidden", display: "none"};
    }
  }
  const hiddenNationalStyle = () => {
    if (props.scaleState === 'national') {
      return {visibility: "visible"};
    }
    else {
      return {visibility: "hidden", display: "none"};
    }
  }

  //<span className="menu-desc-text">{scaleObj.label}</span>
  return (
    <Form className="vertical-menu">
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0" className="accordion-header" onClick={() => setScaleOpen(!scaleOpen)}>
            <Row>
              <Col>1) Select Area of Focus</Col>
              <Col xs="auto">
                {scaleOpen ? <FaChevronCircleDown/> : <FaChevronCircleUp/> }
              </Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0" className="accordion-header scale-accordion">
            <Card.Body>
              {scales.map((scaleObj) => (
                <div key={`form-${scaleObj.id}`}>
                  <Form.Row key={`form-row-${scaleObj.id}`} className="align-items-center">
                    <Col key={`form-col-check-${scaleObj.id}`}>
                      <Form.Check
                        key={`radio-key-${scaleObj.id}`}
                        type="radio"
                        onChange={handleScaleChange}
                        defaultChecked={scaleObj.defaultChecked}
                        id={scaleObj.id}
                        name="radio-scales"
                            //<p className="menu-desc-text">{scaleObj.label}</p>
                            //{IconMap[`${scaleObj.iconKey}`]}
                        label={
                            <span className="menu-main-label">
                              {IconMap[`${scaleObj.iconKey}`]}
                              <span className="menu-main-text">{scaleObj.name}</span>
                            </span>
                        }
                      />
                    </Col>
                    <Col xs="auto" key={`form-col-popover-${scaleObj.id}`}>
                      <InfoPopover
                        key={`scale-popover-${scaleObj.id}`}
                        title={scaleObj.name}
                        content={scaleObj.label}
                      />
                    </Col>
                  </Form.Row>
                  {scaleObj.id === 'admin' &&//props.scaleState &&
                    <div style={hiddenAdminStyle()} key={`geocoder-${scaleObj.id}`} id={`geocoder-${scaleObj.id}`}> </div>
                  }
                  {scaleObj.id === 'national' &&//props.scaleState &&
                    <div style={hiddenNationalStyle()} key={`geocoder-${scaleObj.id}`} id={`geocoder-${scaleObj.id}`}> </div>
                  }
                  {scaleObj.id === 'admin' && props.scaleState !== 'admin' &&
                    disabledSearch()
                  }
                  {scaleObj.id === 'national' && props.scaleState !== 'national' &&
                    disabledSearch()
                  }
                </div>
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1" className="accordion-header" onClick={() => setLayersOpen(!layersOpen)}>
            <Row>
              <Col>2) Explore Ecosystem Services</Col>
              <Col xs="auto">
                {layersOpen ? <FaChevronCircleDown/> : <FaChevronCircleUp/> }
              </Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1" className="accordion-header">
            <Card.Body>
              <LayerSelect
                changeVisibilityState={props.changeVisibilityState}
                layerDetails={serviceMenuDetails}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="2" className="accordion-header" onClick={() => setOtherOpen(!otherOpen)}>
            <Row>
              <Col>3) Explore Other Layers</Col>
              <Col xs="auto">
                {otherOpen ? <FaChevronCircleDown/> : <FaChevronCircleUp/> }
              </Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="2" className="accordion-header">
            <Card.Body>
              <LayerSelect
                changeVisibilityState={props.changeVisibilityState}
                layerDetails={supportMenuDetails}
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="3" className="accordion-header" onClick={() => setDiscoverOpen(!discoverOpen)}>
            <Row>
              <Col>Discover and Case Studies<br/>[ Coming Soon ]</Col>
              <Col xs="auto">
                {discoverOpen ? <FaChevronCircleDown/> : <FaChevronCircleUp/> }
              </Col>
            </Row>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="3" className="accordion-header">
            <Card.Body>
              <div> More soon. </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

    </Form>
  );
};

VerticalMenu.propTypes = {
  changeScaleState: PropTypes.func.isRequired,
  changeVisibilityState: PropTypes.func.isRequired,
  geocoderNational: PropTypes.object.isRequired,
  geocoderAdmin: PropTypes.object.isRequired,
  scaleState: PropTypes.string.isRequired,
}

export default VerticalMenu;
