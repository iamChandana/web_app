import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
import LockIcon from '../images/lock.svg';

const StyledButton = styled.button`
  height: 40px;
  border-radius: 5px;
  background-color: ${Color.C_LIGHT_BLUE};
  color: #fff;
  font-family: ${defaultFont.primary.name};
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
  }
`;
const StyledImage = styled.img`
  margin-right: 8px;
  margin-bottom: 2px;
`;
const ButtonWrapper = styled.div`
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 42px;
  display: block;
`;

function NextButton(props) {
  const { processing, proceed, label, withIcon } = props;
  const disable = typeof processing === 'boolean' ? processing : !processing;
  const buttonLabel = typeof processing === 'boolean' && processing ? 'Processing...' : label;
  if (proceed && typeof proceed === 'function') {
    return (
      <Grid item xs={12}>
        <ButtonWrapper>
          <StyledButton disabled={disable} type="button" onClick={proceed}>
            {withIcon && <StyledImage src={LockIcon} alt="Lock" />}
            {buttonLabel}
          </StyledButton>
        </ButtonWrapper>
      </Grid>
    );
  }
  return (
    <Grid item xs={12}>
      <ButtonWrapper>
        <StyledButton disabled={disable} type="submit">
          {withIcon && <StyledImage src={LockIcon} alt="Lock" />}
          {buttonLabel}
        </StyledButton>
      </ButtonWrapper>
    </Grid>
  );
}

NextButton.propTypes = {
  processing: PropTypes.any,
  proceed: PropTypes.func,
  label: PropTypes.string,
  withIcon: PropTypes.bool,
};

export default NextButton;
