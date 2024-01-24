import React, { Component } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Text from 'components/Text';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';

import CheckIcon from './check.svg';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    maxWidth: '720px',
    top: '50%',
    width: '100%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    maxHeight: '560px',
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
    overflow: 'auto',
  },
};

const Icon = styled.img`
  width: 48px;
  height: 48px;
  align-self: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
`;

const ModalTitle = styled(Text)`
  align-items: center;
  margin-top: 24px;
  font-size: 14px;
  font-weight: bold;
`;

const ModalContent = styled(Text)`
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  color: #1d1d26;
`;

const StyledButton = styled(Button)`
  width: 160px;
  height: 40px;
  background: ${Color.C_LIGHT_BLUE};
  align-self: center;
  color: #fff;
  margin-top: 30px;
`;

class ConfirmationModal extends Component {
  render() {
    const { accountType } = this.props;
    const accountLabel = accountType === 'CS' ? 'Cash' : 'KWSP';
    return (
      <Modal isOpen={this.props.isOpen} style={customStyles}>
        <ContentWrapper>
          <Icon src={CheckIcon} alt="Tick Icon" />
          <ModalTitle>{`Your Client's ${accountLabel} account has been created.`}</ModalTitle>
          <ModalContent>
            Please ensure that the client&apos;s email address has been verified in order to make <br /> investment payment via
            Online Bank Transfer.
          </ModalContent>
          <StyledButton onClick={this.props.continue}>Continue</StyledButton>
          <Text size="14px" fontStyle="italic" style={{ marginTop: '25px' }}>
            If client did not receive the email verification, you may resend the email verification
            <br /> via the PDA profile page.
          </Text>
        </ContentWrapper>
      </Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  continue: PropTypes.func,
  isOpen: PropTypes.bool,
  accountType: PropTypes.string,
};

export default ConfirmationModal;
