import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';

const StyledBtnDoNotAccept = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 4px;
  color: ${Color.C_LIGHT_BLUE};
  border-color: ${Color.C_LIGHT_BLUE};
`;

const StyledBtnAccept = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 4px;
  border-color: ${Color.C_LIGHT_BLUE};
  background-color: ${Color.C_LIGHT_BLUE};
`;

function AgreementBtn(props) {
  const { handleAccept, handleClose } = props;
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <StyledBtnDoNotAccept onClick={handleClose}>
        I Do Not Accept
      </StyledBtnDoNotAccept>
      <StyledBtnAccept primary onClick={handleAccept}>
        I Accept
      </StyledBtnAccept>
    </Grid>
  );
}

AgreementBtn.propTypes = {
  handleAccept: PropTypes.func,
  handleClose: PropTypes.func,
};

export default AgreementBtn;
