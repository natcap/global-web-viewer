import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React, { useState, useEffect } from 'react';

import Map from './Map';
import WelcomeModal from './components/WelcomeModal';
import WelcomeModalButton from './components/WelcomeModalButton';
import './App.css';


function App() {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    let visited_status = localStorage.getItem('visited_status')
    if(!visited_status) {
      setModalShow(true);
      localStorage.setItem('visited_status', 1);
    }
  },[])

  return (
    <Container fluid className="appContainer vh-100 d-flex flex-column">
      <WelcomeModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Row className="row-banner">
        <Col id="banner" className="banner">
          Prototype Natural Capital World Viewer
        </Col>
        <Col xs="auto">
          <img 
            src="./icons/NatCap-Logo-2016.jpg" 
            alt="NatCap"
            className="img-fluid banner-logo"
          />
        </Col>
      </Row>
      <Row className="h-100">
        <Map />
      </Row>
      <Row className="footer align-items-center">
        <WelcomeModalButton
          onClick={() => setModalShow(true)}
        />
      </Row>
    </Container>
  );
}

export default App;
