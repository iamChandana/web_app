import React from 'react';
import PropTypes from 'prop-types';

import { Button } from './Atoms';
import SpeechBubble from '../images/speech-bubble.svg';

function HelpButton(props) {
  return (
    <Button onClick={props.onClickHandler}>
      <img src={SpeechBubble} alt="speechbubble-ic" />
      Need Help?
    </Button>
  );
}

HelpButton.propTypes = {
  onClickHandler: PropTypes.func,
};

export default HelpButton;
