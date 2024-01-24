/**
 *
 * Modal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Modal from 'react-modal';
import Button from 'components/Button';
import Text from 'components/Text';
import CloseIcon from './close.svg';

export const CloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

export const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const ModalImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
`;
export const ContentWrapper = styled.div`
  font-size: 14px;
  padding-top: 20px;
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

export const ModalFooter = styled.div`
  button {
    margin: 0 auto;
  }
`;

const ImageWrap = styled.div`
  text-align: center;
  margin-bottom: 33px;
`;

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function StyledModal(props) {
  const {
    open,
    width,
    height,
    children,
    handleClose,
    title,
    withoutPadding,
    showClose,
    zIndex,
    modalWidth,
    paddingTop,
    imageWidth,
    modalImage,
    modalImgAlt,
    paddingBottom,
    hideClose,
  } = props;
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: zIndex || 1000,
    },
    content: {
      position: 'relative',
      width: `${modalWidth || '100%'}`,
      maxWidth: `${width || 960}px`,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      borderRadius: '5px',
      maxHeight: `${height || 560}px`,
      paddingTop: `${paddingTop || 32}px`,
      paddingBottom: `${paddingBottom || 32}px`,
      paddingLeft: withoutPadding ? 0 : '32px',
      paddingRight: withoutPadding ? 0 : '32px',
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
  };

  return (
    <Modal isOpen={open} style={customStyles}>
      {!hideClose && (
        <CloseBtn onClick={handleClose}>
          <img src={CloseIcon} alt="Close" />
        </CloseBtn>
      )}
      {modalImage && (
        <ModalImageWrapper>
          {' '}
          <img src={modalImage} alt={`${modalImgAlt}`} width={imageWidth} />{' '}
        </ModalImageWrapper>
      )}
      <ModalTitle>
        <Text size="19px" weight="bold" color="#1d1d26">
          {title}
        </Text>
      </ModalTitle>
      <ContentWrapper>{children}</ContentWrapper>
      {showClose && (
        <ModalFooter>
          <Button primary onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}

StyledModal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  withoutPadding: PropTypes.bool,
  showClose: PropTypes.bool,
};

export default StyledModal;
