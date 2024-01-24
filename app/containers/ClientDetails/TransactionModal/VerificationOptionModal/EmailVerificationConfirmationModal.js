import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import Text from 'components/Text';
import EmailIcon from './assets/ic-email-send.svg';
import Modal from '../Modal';
import { makeSelectEmail } from '../../selectors';

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ModalContentWrapper = styled.div`
  padding-bottom: 24px;
`;

export class EmailVerificationConfirmationModal extends React.PureComponent {
  render() {
    const { open, email, handleClose } = this.props;

    return (
      <Modal
        id="email-verification-confirmation-modal"
        title="Verification request sent"
        open={open}
        handleClose={handleClose}
        scroller={false}>
        <ModalContentWrapper>
          <Grid spacing={8} alignItems="center" container>
            <Grid item xs={12}>
              <ImgWrapper>
                <img src={EmailIcon} alt="email" width={85} height={40} />
              </ImgWrapper>
            </Grid>
            <Grid item xs={12}>
              <Text>We have sent a verification link along with the transaction details to</Text>
            </Grid>
            <Grid item xs={12}>
              <Text weight="bold">{email}</Text>
            </Grid>
            <Grid item xs={12}>
              <Text>Please be informed that the verification link will expire in 48 hrs.</Text>
            </Grid>
          </Grid>
        </ModalContentWrapper>
      </Modal>
    );
  }
}

EmailVerificationConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  email: makeSelectEmail(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(EmailVerificationConfirmationModal);
