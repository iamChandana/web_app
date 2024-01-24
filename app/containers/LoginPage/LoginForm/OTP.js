/**
 *
 * Otpbox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Text from 'components/Text';
import Modal from 'components/Modal';
import LoadingIndicator from 'components/LoadingIndicator';

function Otpbox(props) {
  const { handleClose, openModal, url, error } = props;

  let modalTitle = 'One Time Password';

  if (error) {
    modalTitle = error;
  }

  if (url) {
    return (
      <Modal open={openModal} height={300} width={700} handleClose={handleClose} title={modalTitle}>
        <iframe title="OTP-iframe" src={url} height={300} width={700} frameBorder="0" />
      </Modal>
    );
  }
  if (!error) {
    return (
      <Modal open={openModal} height={300} width={700} handleClose={handleClose} title={modalTitle}>
        <LoadingIndicator />
      </Modal>
    );
  }
    // else
  return (
    <Modal open={openModal} height={300} width={700} handleClose={handleClose} title={modalTitle}>
      <Text />
    </Modal>
  );
}

Otpbox.propTypes = {
  handleClose: PropTypes.func,
  openModal: PropTypes.bool,
  url: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default Otpbox;
