/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Dialog from 'components/Dialog';
import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';
import defaultFont from 'utils/StylesHelper/font';

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${(props) => props.btnBgColor};
  border: 1px solid ${Color.C_LIGHT_BLUE};
  margin-top: 32px;
  color: ${(props) => props.btnFontColor};
  font-family: ${defaultFont.primary.name};
  outline: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

function EmailVerification(props) {
  const email = props.newEmail ? props.newEmail : props.account && props.account.AccEmail;
  return (
    <React.Fragment>
      <Dialog
        open={props.isOpenDialogConfirmEmailResend}
        closeHandler={props.openDialogConfirmEmailResend}
        title="Confirm to resend email?"
        maxWidth="sm"
        content={
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
              <Grid item xs={12}>
                <Text size="14px" fontStyle="italic" weight="bolder">
                  Resend a confirmation email to
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="14px" style={{ wordWrap: 'break-word' }} weight="bolder">
                  {email || '-'}
                </Text>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 5 }}>
                <Grid container spacing={16} justify="center" alignItems="center">
                  <Grid item xs={6} align="right">
                    <StyledBtn
                      onClick={props.openDialogConfirmEmailResend}
                      btnBgColor="#ffffff"
                      btnFontColor={Color.C_LIGHT_BLUE}>
                      Cancel
                    </StyledBtn>
                  </Grid>
                  <Grid item xs={6} align="left">
                    <StyledBtn
                      onClick={props.submitResendConfirmationEmail}
                      btnBgColor={Color.C_LIGHT_BLUE}
                      btnFontColor="#ffffff"
                      disabled={!email}>
                      Submit
                    </StyledBtn>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      />
    </React.Fragment>
  );
}

EmailVerification.propTypes = {
  newEmail: PropTypes.string,
  account: PropTypes.object,
  openDialogConfirmEmailResend: PropTypes.func,
  submitResendConfirmationEmail: PropTypes.func,
  isOpenDialogConfirmEmailResend: PropTypes.bool,
};

export default EmailVerification;
