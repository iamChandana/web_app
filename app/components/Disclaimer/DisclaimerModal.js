import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Parser from 'html-react-parser';
import Modal from 'components/Modal';

import TermContent from 'utils/TermsContent/disclaimer';

function DisclaimerModal(props) {
  const { open, handleClose } = props;

  return (
    <Modal showClose open={open} handleClose={handleClose} zIndex={999999}>
      <Grid container direction="column" justify="flex-start">
        <Grid item xs={12}>
          {Parser(TermContent)}
        </Grid>
      </Grid>
    </Modal>
  );
}

DisclaimerModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default DisclaimerModal;
