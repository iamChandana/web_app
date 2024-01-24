import React, { Component } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import Button from 'components/Button';
import BlockedCategoryMessage from './BlockedCategoryMessage';
import HighCategoryMessage from './HighCategoryMessage';
import Color from 'utils/StylesHelper/color';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 150,
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

const ContentWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
`;

const ModalContent = styled(Text)`
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  color: #1d1d26;
`;

const StyledButton = styled(Button)`
  width: 200px;
  height: 40px;
  background: ${Color.C_LIGHT_BLUE};
  align-self: center;
  color: #fff;
  margin: 0 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 39px;
`;

class AmlaWarningModal extends Component {
  constructor() {
    super();
    this.state = {
      openCustomerCare: false,
      openBranch: false,
      openContactInfo: false,
    };
    this.toggleBranch = this.toggleBranch.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
  }

  toggleInfo() {
    this.setState((prevState) => ({
      openContactInfo: !prevState.openContactInfo,
    }));
  }

  toggleBranch() {
    this.setState((prevState) => ({
      openBranch: !prevState.openBranch,
    }));
  }
  render() {
    const {
      data: { error },
      fromPage,
      backButtonClick,
      isFromTransaction,
    } = this.props;
    if(!error) {
      console.error('AMLA check return no error');
    }
    const message =
      error && error.name === 'BLOCKED' ? (
        <BlockedCategoryMessage toggleInfo={this.toggleInfo} open={this.state.openContactInfo} message={error.message} />
      ) : (
        <HighCategoryMessage
          toggleInfo={this.toggleInfo}
          open={this.state.openContactInfo}
          toggleBranch={this.toggleBranch}
          openBranch={this.state.openBranch}
          message={error && error.message?error.message:''}
        />
      );

    if (!isFromTransaction) {
      return (
        <Modal isOpen={this.props.isOpen} style={customStyles}>
          <ContentWrapper>
            {/* <Icon src={DangerIcon} alt="Danger Icon" />
              <ModalTitle>Warning</ModalTitle> */}
            <ModalContent>{message}</ModalContent>
            <ButtonWrapper>
              <StyledButton onClick={() => this.props.navigateTo('/')}>Back to Dashboard</StyledButton>
              <StyledButton
                onClick={() => {
                  backButtonClick();
                  this.props.navigateTo('home');
                }}>{`Back to ${fromPage}`}</StyledButton>
            </ButtonWrapper>
          </ContentWrapper>
        </Modal>
      );
    } else {
      return (
        <Modal isOpen={this.props.isOpen} style={customStyles}>
          <ContentWrapper>
            {/* <Icon src={DangerIcon} alt="Danger Icon" />
            <ModalTitle>Warning</ModalTitle> */}
            <ModalContent>{message}</ModalContent>
            <ButtonWrapper>
              <StyledButton onClick={() => this.props.navigateTo('/clients')}>Back to Client Fund Page</StyledButton>
            </ButtonWrapper>
          </ContentWrapper>
        </Modal>
      );
    }
  }
}

AmlaWarningModal.propTypes = {
  navigateTo: PropTypes.func,
  isOpen: PropTypes.bool,
  data: PropTypes.object,
  fromPage: PropTypes.string,
};

export default AmlaWarningModal;
