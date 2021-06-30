import React  from 'react';
import PropTypes from 'prop-types';

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

WelcomeModalButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default WelcomeModalButton;
