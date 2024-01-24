/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { createStructuredSelector } from 'reselect';

import Button from 'components/Button';
import Modal from 'components/Modal';
import Text from 'components/Text';
import { ListOfFundsWithSelection } from 'components/PaymentSelectionModal/ListOfFundsWithSelection';

import { AccountNumber } from '../../AccountNumber';
import AlertImg from '../../../../../images/alert.png';
import { ButtonWrapper, FundsWrapper } from '../styles';
import { getPendingTransactions, savePendingTransactions, callCancelPendingTransactions } from '../../../actions';
import { makeSelectPendingTransactionsResponse, makeSelectIsCancelPendingVerificationSuccessful } from '../../../selectors';
import { getMappableFunds, generatePayloadForCancelTransaction } from '../helpers';

function CancelOnlinePaymentModal(props) {
  const {
    open,
    handleClose,
    partnerAccountNo,
    accountType,
    fundCode,
    handleGetPendingTransactions,
    pendingTransactionsResponse,
    handleSavePendingTransactions,
    isRspPayment,
    rspRefNo,
    handleCallCancelPendingTransactions,
    rspStatus,
    isCancelPendingVerificationSuccessful,
  } = props;

  const [selectedFunds, setSelectedFunds] = React.useState([]);

  React.useEffect(() => {
    handleGetPendingTransactions(fundCode, partnerAccountNo, isRspPayment, rspRefNo);

    return () => {
      handleSavePendingTransactions({ data: undefined, error: undefined });
    };
  }, []);

  React.useEffect(() => {
    const { data, error } = pendingTransactionsResponse;
    if (error && !data) {
      handleClose();
    }
  }, [pendingTransactionsResponse]);

  React.useEffect(() => {
    if (isCancelPendingVerificationSuccessful) {
      const delayInMilliseconds = 800;

      setTimeout(() => {
        // your code to be executed after 1 second
        window.location.reload();
      }, delayInMilliseconds);
    }
  }, [isCancelPendingVerificationSuccessful]);

  const handleSubmit = () => {
    const { data } = pendingTransactionsResponse;
    handleCallCancelPendingTransactions(
      generatePayloadForCancelTransaction({ pendingTrxData: isRspPayment ? data : selectedFunds, isRspPayment }),
      isRspPayment,
    );
    // handleClose();
    setSelectedFunds([]);
  };

  const handleSaveSelectedFunds = (value) => {
    const alreadyExists = selectedFunds.find((item) => item.transactionRequestId === value.transactionRequestId);
    if (!alreadyExists) {
      setSelectedFunds([...selectedFunds, value]);
    } else {
      const filteredFunds = selectedFunds.filter((item) => item.transactionRequestId !== value.transactionRequestId);
      setSelectedFunds([...filteredFunds]);
    }
  };

  const getContent = () => {
    if (isRspPayment) {
      return rspStatus && rspStatus.toLowerCase() === 'pending' ? 'Set up RSP' : 'Edit RSP';
    }
    return 'Online Payment';
  };

  return (
    <Modal
      modalWidth={isRspPayment ? '600px' : '650px'}
      handleClose={handleClose}
      open={open}
      title={`Cancel ${getContent()} link`}
      modalImage={AlertImg}
      modalImgAlt="Alert"
      imageWidth="45px">
      <Grid spacing={16} container>
        <Grid item xs={12}>
          <Text align="center">
            You have initiated to cancel the {getContent()} link for the following funds <br />
            for account <AccountNumber partnerAccountNo={partnerAccountNo} accountType={accountType} />
          </Text>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 12 }}>
          <FundsWrapper style={{ marginLeft: '8px' }}>
            <ListOfFundsWithSelection
              handleSaveSelectedFunds={handleSaveSelectedFunds}
              funds={getMappableFunds(pendingTransactionsResponse.data)}
              selectedFunds={selectedFunds}
              showCheckBox={!isRspPayment}
              showRefId
            />
          </FundsWrapper>
        </Grid>
        <Grid item xs={12}>
          <Text align="center">Would you like to proceed?</Text>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <ButtonWrapper>
                <Button onClick={handleSubmit} disabled={isRspPayment ? false : !selectedFunds.length}>
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

CancelOnlinePaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  partnerAccountNo: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  fundCode: PropTypes.string.isRequired,
  handleGetPendingTransactions: PropTypes.func.isRequired,
  pendingTransactionsResponse: PropTypes.object.isRequired,
  handleSavePendingTransactions: PropTypes.func.isRequired,
  isRspPayment: PropTypes.bool.isRequired,
  rspRefNo: PropTypes.string,
  handleCallCancelPendingTransactions: PropTypes.func.isRequired,
  rspStatus: PropTypes.string,
  isCancelPendingVerificationSuccessful: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pendingTransactionsResponse: makeSelectPendingTransactionsResponse(),
  isCancelPendingVerificationSuccessful: makeSelectIsCancelPendingVerificationSuccessful(),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetPendingTransactions: (fundCode, utrAccountNo, isRspPayment, rspRefNo) =>
    dispatch(getPendingTransactions({ fundCode, utrAccountNo, isRspPayment, rspRefNo })),
  handleSavePendingTransactions: (payload) => dispatch(savePendingTransactions(payload)),
  handleCallCancelPendingTransactions: (payload, isRspPayment) => dispatch(callCancelPendingTransactions(payload, isRspPayment)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(CancelOnlinePaymentModal);
