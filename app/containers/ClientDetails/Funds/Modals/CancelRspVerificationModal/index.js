import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { createStructuredSelector } from 'reselect';

import Button from 'components/Button';
import Modal from 'components/Modal';
import Text from 'components/Text';
import { AccountNumber } from '../../AccountNumber';
import AlertImg from '../../../../../images/alert.png';
import { cancelPendingRspRequest } from '../../../actions';
import { makeSelectIsCancelPendingVerificationSuccessful } from '../../../selectors';
import rspStatuses from '../../../../ClientDetails/TransactionModal/rspStatuses';
import { ButtonWrapper } from '../styles';

const getRspStatusText = (rspStatus) => {
  let text = '-';

  switch (rspStatus) {
    case rspStatuses.pendingVerification:
      text = 'Setup RSP';
      break;
    case rspStatuses.editPendingVerification:
      text = 'Edit RSP';
      break;
    case rspStatuses.terminatePendingVerification:
      text = 'Cancel RSP';
      break;
    default:
      text = '';
  }

  return text;
};

class CancelRspVerificationModal extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (
      this.props.isCancelPendingVerificationSuccessful.toString() !== prevProps.isCancelPendingVerificationSuccessful.toString()
    ) {
      if (this.props.isCancelPendingVerificationSuccessful) {
        window.location.reload();
      }
    }
  }

  render() {
    const {
      open,
      handleClose,
      partnerAccountNo,
      accountType,
      handleCancelPendingRspRequest,
      fund,
      rspStatus,
      rspRefNo,
    } = this.props;
    const rspStatusText = getRspStatusText(rspStatus);

    return (
      <Modal
        modalWidth="572px"
        handleClose={handleClose}
        open={open}
        title="Pending Verification"
        modalImage={AlertImg}
        modalImgAlt="Alert"
        imageWidth="45px">
        <Grid spacing={16} container>
          <Grid item xs={12}>
            <Text align="center">
              You have initiated to cancel the verification request for an{' '}
              <span style={{ fontWeight: 'bold' }}>{rspStatusText}</span> transaction for the following funds for account{' '}
              <AccountNumber partnerAccountNo={partnerAccountNo} accountType={accountType} />
            </Text>
          </Grid>
          <Grid item xs={12}>
            <ul>
              <li>
                <Text align="center">
                  • {fund.fundcode} {fund.name}
                </Text>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <Text align="center">Would you like to proceed?</Text>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <ButtonWrapper>
                  <Button
                    onClick={() => {
                      handleCancelPendingRspRequest({ rspRefNo, accountId: partnerAccountNo, fundCode: fund.fundcode });
                    }}>
                    Yes
                  </Button>
                </ButtonWrapper>
              </Grid>
              <Grid item xs={12} md={6}>
                <ButtonWrapper>
                  <Button onClick={handleClose} primary>
                    No
                  </Button>
                </ButtonWrapper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    );
  }
}

CancelRspVerificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  partnerAccountNo: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  fund: PropTypes.object.isRequired,
  handleCancelPendingRspRequest: PropTypes.func.isRequired,
  isCancelPendingVerificationSuccessful: PropTypes.bool.isRequired,
  rspStatus: PropTypes.string.isRequired,
  rspRefNo: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isCancelPendingVerificationSuccessful: makeSelectIsCancelPendingVerificationSuccessful(),
});

const mapDispatchToProps = (dispatch) => ({
  handleCancelPendingRspRequest: ({ rspRefNo, accountId, fundCode }) =>
    dispatch(cancelPendingRspRequest({ rspRefNo, accountId, fundCode })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(CancelRspVerificationModal);
