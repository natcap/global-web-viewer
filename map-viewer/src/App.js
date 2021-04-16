//import logo from './logo.svg';
import './App.css';

import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Table from 'react-bootstrap/Table';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import React, { useSate } from 'react';

import Map from './Map';

function MapViewer(props) {

  return (
    <div> MapViewer Here </div>
  );
}

function TopBar(props) {

  return (
    <h1 className="header">NatCap Viewer Title</h1>
  );
}

function MapLayer(props) {

  return (
    <Form.Check type="checkbox" label="Layer" className="layer"/>
  );
}

function StatsSummary(props) {

  return (
    <Form.Check type='checkbox' label='Stat Select'/>
  );
}

function SideBar(props) {

  // const [layer, setLayer] = useState();
  
  return (
    <div>
      <MapLayer />
      <MapLayer />
      <MapLayer />
      <StatsSummary />
      <StatsSummary />
    </div>
  );
}

function ExportMaps(props) {

  return (
    <div>
      Export
    </div>
  );
}


function App() {
    return (
      <Container className="p-3" fluid>
        <Row className="banner">
          <TopBar />
        </Row>
        <Row>
          <Form>
            <Col className="side-bar">
              <SideBar />
              <ExportMaps />
            </Col>
          </Form>
          <Col className="map-col">
            <Map />
          </Col>
        </Row>
      </Container>
    );
}

export default App;
