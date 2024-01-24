/* eslint-disable react/jsx-closing-bracket-location */

import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Text from 'components/Text';
import { StyledButton } from 'styles/style';
import { RowGridCenter } from 'components/GridContainer';

import Alert from '../../../../images/alert.png';

function MMFundWarningModal({ handleClose, handleContinue, zIndex, open }) {
  return (
    <Modal
      open={open}
      modalWidth="800px"
      title={''}
      handleClose={handleClose}
      modalImage={Alert}
      modalImgAlt="Alert"
      imageWidth="50px"
      zIndex={zIndex}
      paddingBottom="54">
      <Grid container direction="column" xs={12} justify="center" spacing={24}>
        <Grid item>
          <Text weight="700">
            An Investor who participates in EPF’s Members Investment Scheme (MIS) is not allowed to stay invested in any money
            market fund through the scheme for more than six (6) consecutive months.
          </Text>
        </Grid>
        <Grid item>
          <Text weight="700">
            The balance investment amount in the money market fund will be auto-redeemed at the expiry of the 6 months and
            returned back into the Investor’s EPF(KWSP) Account.
          </Text>
        </Grid>
        <Grid item>
          <RowGridCenter>
            <StyledButton onClick={handleClose}>Back</StyledButton>
            <StyledButton primary onClick={handleContinue}>
              Continue
            </StyledButton>
          </RowGridCenter>
        </Grid>
      </Grid>
    </Modal>
  );
}

MMFundWarningModal.propTypes = {
  open: PropTypes.bool,
  zIndex: PropTypes.string,
  handleContinue: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default MMFundWarningModal;
