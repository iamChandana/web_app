/**
 *
 * ConfirmRiskModal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from 'components/Modal';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Parser from 'html-react-parser';
import Button from 'components/Button';
import Disclaimer from 'components/Disclaimer';

import ErrorIcon from './moderate-error.svg';

export const ModalBtn = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 4px;
`;

const ImageWrap = styled.div`
  text-align: center;
  margin-bottom: 33px;
`;

function ConfirmRiskModal(props) {
  const { open, handleClose, riskProfileType, modalMessage, selectedData, handleAccept, data, modalWidth } = props;
  return (
    <Modal open={open} handleClose={handleClose} modalWidth={modalWidth}>
      <ImageWrap>
        <img src={ErrorIcon} alt="Error" />
        <Text size="18px" color="#1d1d26" weight="600">
          {riskProfileType}
        </Text>
      </ImageWrap>

      <Text color="#1d1d26" weight="bold">
        {modalMessage}
      </Text>

      <Disclaimer />

      <Grid container direction="row" justify="center" alignItems="center">
        <ModalBtn onClick={handleClose}>Back</ModalBtn>
        <ModalBtn primary onClick={() => handleAccept(data)}>
          Accept & Continue
        </ModalBtn>
      </Grid>

    </Modal>
  );
}

ConfirmRiskModal.propTypes = {};

export default ConfirmRiskModal;
