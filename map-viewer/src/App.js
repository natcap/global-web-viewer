import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import React, { useSate, useEffect } from 'react';

import Map from './Map';
import WelcomeModal from './components/WelcomeModal';
import WelcomeModalButton from './components/WelcomeModalButton';
import './App.css';


function App() {
  const [modalShow, setModalShow] = React.useState(false);

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
      <Row>
        <Col className="banner">Natural Capital Project Global Viewer
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
