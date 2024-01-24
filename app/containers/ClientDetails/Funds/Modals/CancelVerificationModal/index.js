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
import { cancelPendingTrxRequest } from '../../../actions';
import {
  makeSelectPendingVerificationTrxRequests,
  makeSelectIsCancelPendingVerificationSuccessful,
  makeSelectProductBreakdown,
} from '../../../selectors';
import { ButtonWrapper, FundsWrapper, Ul } from '../styles';

const getTrxRequest = (trxRequests, fundCode) => {
  if (trxRequests.length === 1) {
    return trxRequests;
  }

  //  find trxRequest by fundCode
  const transactionRequest = trxRequests.find((trx) => trx.transactionPartnerProductId === fundCode);

  // map back trxRequest to get product that belongs to the same trxRequestId
  const transactions = trxRequests.filter(
    (trx) => trx !== undefined && trx.transactionRequestId === transactionRequest.transactionRequestId,
  );

  return transactions;
};

const getTrxType = (transactionType) => {
  let text = '-';

  switch (transactionType) {
    case 'S':
      text = 'Initial Subscription';
      break;
    case 'T':
      text = 'Top Up';
      break;
    case 'SW':
      text = 'Switch';
      break;
    case 'R':
      text = 'Redeem';
      break;
    default:
      text = '-';
  }

  return text;
};

const getProduct = (productBreakdown, fundCode) => productBreakdown.find((product) => product.partnerProductId === fundCode);

class CancelVerificationModal extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (
      this.props.isCancelPendingVerificationSuccessful.toString() !== prevProps.isCancelPendingVerificationSuccessful.toString()
    ) {
      if (this.props.isCancelPendingVerificationSuccessful) {
        const delayInMilliseconds = 800;

        setTimeout(() => {
          // your code to be executed after 1 second
          window.location.reload();
        }, delayInMilliseconds);
      }
    }
  }

  render() {
    const {
      open,
      handleClose,
      partnerAccountNo,
      accountType,
      trxRequests,
      fundCode,
      handleCancelPendingTrxRequest,
      productBreakdown,
    } = this.props;

    if (trxRequests.length === 0) {
      return null;
    }

    const trxRequest = getTrxRequest(trxRequests, fundCode);
    const trxTypeText = getTrxType(trxRequest[0].transactionRefPrefix);

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
              You have initiated to cancel the verification request for a{' '}
              <span style={{ fontWeight: 'bold' }}>{trxTypeText}</span> transaction for the following funds for account{' '}
              <AccountNumber partnerAccountNo={partnerAccountNo} accountType={accountType} />
            </Text>
          </Grid>
          <Grid item xs={12}>
            <FundsWrapper>
              {trxRequest.length > 0 ? (
                <Ul>
                  {trxRequest.map((trx) => {
                    const product = getProduct(productBreakdown, trx.transactionPartnerProductId);

                    return (
                      <li key={trx.transactionPartnerProductId}>
                        <Text align="left">
                          • {product.fund.fundcode} {product.fund.name}
                        </Text>
                      </li>
                    );
                  })}
                </Ul>
              ) : null}
            </FundsWrapper>
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
                      handleCancelPendingTrxRequest(trxRequest[0].transactionRequestId);
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

CancelVerificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  partnerAccountNo: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  trxRequests: PropTypes.array.isRequired,
  fundCode: PropTypes.string.isRequired,
  handleCancelPendingTrxRequest: PropTypes.func.isRequired,
  isCancelPendingVerificationSuccessful: PropTypes.bool.isRequired,
  productBreakdown: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  trxRequests: makeSelectPendingVerificationTrxRequests(),
  isCancelPendingVerificationSuccessful: makeSelectIsCancelPendingVerificationSuccessful(),
  productBreakdown: makeSelectProductBreakdown(),
});

const mapDispatchToProps = (dispatch) => ({
  handleCancelPendingTrxRequest: (trxRequestId) => dispatch(cancelPendingTrxRequest({ trxRequestId })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(CancelVerificationModal);
