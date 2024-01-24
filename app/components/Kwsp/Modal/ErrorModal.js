/**
 *
 * Modal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';

import Modal from 'react-modal';
import Button from 'components/Button';
import Text from 'components/Text';
import CloseIcon from 'components/Modal/close.svg';
import IconWarning from 'components/Modal/alert.png';
import { RowGridCenter } from 'components/GridContainer';

const StyledText = styled(Text)`
  max-width: 570px;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  font-size: 14px;
  h5 {
    font-weight: normal;
    font-size: 14px;
  }
  ul {
    list-style-type: circle;
    margin-top: 10px;
    margin-left: 10px;
  }
`;

const ModalFooter = styled.div`
margin-top:20px;
  button {
    margin: 0 auto;
  }
`;

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function ErrorModal(props) {
  const { open, width, height, children, handleClose, title, withoutPadding, showClose, zIndex, modalWidth } = props;
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: zIndex || 1000,
    },
    content: {
      position: 'relative',
      width: `${modalWidth || '720px'}`,
      maxWidth: `${width || 960}px`,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      borderRadius: '0',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      maxHeight: `${height || 560}px`,
      paddingTop: '32px',
      paddingBottom: '32px',
      paddingLeft: withoutPadding ? 0 : '32px',
      paddingRight: withoutPadding ? 0 : '32px',
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
      overflowX: 'hidden',
      overflowY: 'auto',
      borderWidth: '3px',
    },
  };

  return (
    <Modal isOpen={open} style={customStyles}>
      <CloseBtn onClick={handleClose}>
        <img src={CloseIcon} alt="Close" />
      </CloseBtn>
      <ContentWrapper>
        <div style={{ marginBottom: '20px' }}>
          <RowGridCenter >
            <Grid item>
              <img src={IconWarning} />
            </Grid>
          </RowGridCenter>
        </div>

        <RowGridCenter>
          <Grid item>
            <StyledText size="15px" color="#1d1d26" lineHeight="1.43" weight="bold" align="center">
              {props.msg}
            </StyledText>
          </Grid>
        </RowGridCenter>
      </ContentWrapper>
      {showClose && (
        <ModalFooter>
          <Button primary onClick={handleClose}>
            Back
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}

ErrorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  withoutPadding: PropTypes.bool,
  showClose: PropTypes.bool,
};

export default ErrorModal;
