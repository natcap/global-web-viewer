import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React, { useSate } from 'react';

import Map from './Map';
import './App.css';


function App() {
    return (
      <Container fluid>
        <Row>
          <Col className="banner">Natural Capital Project Global Viewer
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
