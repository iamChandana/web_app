/**
 *
 * Modal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/Dialog';
import DialogIE from 'components/DialogIE';
import { isIE } from 'react-device-detect';

function StyledModal(props) {
  const { open, children, handleClose, title, subtitle, dialogminwidth, editProfile, scroller } = props;
  if (!isIE) {
    return (
      <Dialog
        open={open}
        closeHandler={handleClose}
        content={children}
        title={title}
        editProfile={editProfile}
        subtitle={subtitle}
        scroller={scroller}
        dialogminwidth={dialogminwidth}
      />
    );
  }
  return <DialogIE open={open} closeHandler={handleClose} content={children} title={title} subtitle={subtitle} scroller />;
}

StyledModal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  scroller: PropTypes.bool,
};

StyledModal.defaultProps = {
  scroller: true,
};

export default StyledModal;
