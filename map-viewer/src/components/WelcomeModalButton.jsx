import React  from 'react';
import ReactDOM from 'react-dom';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const WelcomeModalButton = (props) => {
  return (
    <Col>
      <Button 
        className="welcomeButton"
        onClick={props.onClick}
      >
        Welcome Screen
      </Button>
    </Col>
  );
}

export default WelcomeModalButton;
