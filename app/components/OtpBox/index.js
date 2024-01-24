/**
 *
 * Otpbox
 *
 */

import React from 'react';
import styled from 'styled-components';
import Text from 'components/Text';
import Modal from 'components/Modal';
import _isEmpty from 'lodash/isEmpty';
import LoadingIndicator from 'components/LoadingIndicator';

class Otpbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleClose, openModal, url, error } = this.props;

    const modalTitle = 'One Time Password';

    // since every otp box should have one particular message i.e. <One Time Password> and nothing else
    // if (!_isEmpty(error)) {
    //   modalTitle = error;
    // }

    if (url) {
      return (
        <Modal withoutPadding width={700} open={openModal} handleClose={handleClose} title={modalTitle} zIndex={10000}>
          <iframe src={url} height={290} width={700} frameBorder="0" scrolling="no" />
        </Modal>
      );
    }
    if (_isEmpty(error)) {
      return (
        <Modal withoutPadding width={700} open={openModal} handleClose={handleClose} title={modalTitle} zIndex={10000}>
          <LoadingIndicator />
        </Modal>
      );
    }
    return (
      <Modal withoutPadding width={700} open={openModal} handleClose={handleClose} title={modalTitle} zIndex={10000}>
        <Text />
      </Modal>
    );
  }
}

export default Otpbox;
