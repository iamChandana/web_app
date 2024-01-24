import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';

import OnIcon from './images/on.svg';
import OffIcon from './images/off.svg';

const StyledImg = styled.img`
  cursor: pointer;
  margin-left: 8px;
`;

const SwitchGrid = styled(Grid)`
  display: flex;
  align-items: center;
`;

function ShariahFundSwitch(props) {
  const { currentState, changeFilter, isShariahDisabled } = props;
  let disabledStyles = {};
  
  if (isShariahDisabled) {
    disabledStyles = {
      pointerEvents: 'none',
      opacity: 0.4,
    };
  } else {
    disabledStyles = {};
  }

  return (
    <SwitchGrid item>
      <Text color="#979797000" weight="600" size="12px">
        Only show Shariah Funds
      </Text>
      {currentState && <StyledImg style={disabledStyles} src={OnIcon} onClick={() => changeFilter(false, 'fundFilter')} />}
      {!currentState && <StyledImg style={disabledStyles} src={OffIcon} onClick={() => changeFilter(true, 'fundFilter')} />}
    </SwitchGrid>
  );
}

ShariahFundSwitch.propTypes = {
  currentState: PropTypes.any,
  changeFilter: PropTypes.func,
  isShariahDisabled: PropTypes.bool,
};

export default ShariahFundSwitch;
