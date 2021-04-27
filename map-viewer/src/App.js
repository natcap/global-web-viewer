import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React, { useSate } from 'react';

import Map from './Map';
import './App.css';


function App() {
    return (
      <Container className="p-3" fluid>
        <Row className="banner">
          <Col>
            <h1 className="header">NatCap Viewer Title</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Map />
          </Col>
        </Row>
      </Container>
    );
}

export default App;
