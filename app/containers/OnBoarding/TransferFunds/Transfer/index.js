import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';
import Color from 'utils/StylesHelper/color';
import update from 'immutability-helper';
import LoadingOverlay from 'components/LoadingOverlay';
import _uniq from 'lodash/uniq';
import { toast } from 'react-toastify';
import _isEmpty from 'lodash/isEmpty';
import Text from 'components/Text';
import Button from 'components/Button';
import OtpBox from 'components/OtpBox';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { reset as ResetForm } from 'redux-form';
import {
  setTitle,
  setStep,
  reset,
  createPaymentDocs,
  resetError,
  resetPaymentDocsUploadedData,
  setPaymentMethod,
} from 'containers/OnBoarding/actions';
import {
  makeSelectInitFundTransactionOtpSuccessData,
  makeSelectInitFundTransactionOtpError,
  makeSelectAllTransactionOTPSuccess,
  makeSelectPaymentSucceeded,
  makeSelectProcessing as clientDetailsProcessing,
  makeSelectClientDetails,
  makeSelectIsTxnDoneUsingOnlinePayment,
  makeSelectIsProcessingTaskCreatePaymentRequestWithDoc,
  makeSelectDataTransaction,
  makeSelectErrorCreatePaymentRequestWithDocAfterOtp,
  makeSelectIsEmailVerificationSent,
} from 'containers/ClientDetails/selectors';
import {
  initFundTransactionOtp,
  getCustomerDetails,
  execAfterOTPFundTransactionSuccess,
  resetOtp,
  resetPreviousDoneTxnPaymentType,
  setErrorMessage,
  resetSuccess,
  resetEmailOtpState,
} from 'containers/ClientDetails/actions';
import { RowGridCenter } from 'components/GridContainer';
import {
  makeSelectSelectedFunds,
  makeSelectInitialInvestment,
  makeSelectAccount,
  makeSelectOrder,
  makeSelectProcessing,
  makeSelectPaymentRequestSucceeded,
  makeSelectError,
  makeSelectPaymentDocsUploadedData,
  makeSelectPaymentMethod,
  makeSelectPersonalDetails,
  makekwspCashIntroDetails,
  makeSelectOrderTrxRequestId,
} from 'containers/OnBoarding/selectors';
import getSalesCharge from 'utils/getSalesCharge';
import VerificationOptionModal from 'containers/ClientDetails/TransactionModal/VerificationOptionModal';
import EmailVerificationConfirmationModal from 'containers/ClientDetails/TransactionModal/VerificationOptionModal/EmailVerificationConfirmationModal';

import CheckIcon from './check-success.svg';
import TableHeader from '../Utility/TableHeader';
import TableItem from '../Utility/TableItem';
import FundBox from './FundBox';
import Dialog from 'components/Dialog';
import EmailSentIcon from 'containers/ClientDetails/images/email-sent.svg';
import Grid from 'material-ui/Grid';
import KwspConfirmationPopUp from '../../../../components/Kwsp/Modal/kwspConfirmationModal';

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;

  @media (max-width: 699px) {
    max-width: 100%;
  }
`;

const StyledNumberFormat = styled(NumberFormat)`
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: ${Color.C_GRAY};
`;

const CheckImg = styled.img`
  margin-left: 10px;
  margin-bottom: 6px;
`;
const SyledButton = styled(Button)`
  width: 200px;
  margin: 40px 4px;
`;

const FUND_DETAILS = {
  docs: {},
  BankName: '',
  ChequeOrDDAmount: '',
  ChequeOrDDNumber: '',
};

class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.selectedPaymentMethod = null;
    this.state = {
      selectedFilter:
        props.kwspCashIntroDetails && props.kwspCashIntroDetails.createKwspAccountParams.AccountType === 'KW' ? '9N' : 'Select',
      totalPayment: 0,
      transferDetails: [FUND_DETAILS],
      backTriggered: false,
      chequeErrorMessage: '',
      submitCount: 0,
      paymentsucceeded: false,
      done: false,
      otpShow: false,
      openDialogEmailSentOnlinePayment: false,
      isTxnDoneUsingOnlinePayment: false,
      isVerificationOptionModalOpen: false,
    };

    this.redirect = this.redirect.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateDocs = this.updateDocs.bind(this);
    this.onChangeChequeAmount = this.onChangeChequeAmount.bind(this);
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
    this.handleCloseDialogEmailSentOnlinePayment = this.handleCloseDialogEmailSentOnlinePayment.bind(this);
    this.onChangeKwspApplicationNumber = this.onChangeKwspApplicationNumber.bind(this);
    this.onChangeKwspApplicationDate = this.onChangeKwspApplicationDate.bind(this);
    this.toggleKwspConfirmationPopUp = this.toggleKwspConfirmationPopUp.bind(this);
    this.handleOpenVerificationOpenModal = this.handleOpenVerificationOpenModal.bind(this);
    this.initOtp = this.initOtp.bind(this);
    this.handleCloseVerificationOpenModal = this.handleCloseVerificationOpenModal.bind(this);
  }

  toastId = null;

  notifySuccess = (message) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  notifyFail = (message) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  componentWillMount() {
    this.props.resetOtp();
    this.props.setErrorMessage({
      errorName: 'errorCreatePaymentRequestWithDocAfterOtp',
      message: null,
    });
    // don't allow back button
    history.pushState(null, null, location.href);
    window.onpopstate = () => {
      this.setState(
        {
          backTriggered: true,
        },
        () => {
          history.go(1);
        },
      );
    };
    this.props.setStep(7);
    this.props.setTitle("Great! Let's start funding your investment.");
    // todo: refactor this

    const { account } = this.props;
    if (account && account.profile) {
      this.props.getCustomerDetails({ idParam: account.profile.id, url: 'profile' });
    }
    const locationSearch = this.props.location.search;
    if (this.props.location.pathname.indexOf('/onboarding/transfer-funds/transfer/otpy') !== -1) {
      const urlParams = locationSearch.split('?');
      const queryParam = urlParams[1].split('=')[1];
      const type = 'topup';
      this.props.execAfterOTPFundTransactionSuccess({ queryParam, type });
    }
    if (this.props.location.pathname.indexOf('/onboarding/transfer-funds/transfer/otpn') !== -1) {
      this.notifyFail('Payment failed to be submitted.');
      this.setState({
        transferDetails: [FUND_DETAILS],
        paymentsucceeded: false,
        done: false,
      });
      this.props.execAfterOTPFundTransactionFail(queryParam);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (
    //   nextProps.paymentRequestSucceeded &&
    //   this.props.paymentDocsUploadedData !== nextProps.paymentDocsUploadedData &&
    //   !_isEmpty(nextProps.paymentDocsUploadedData)
    // ) {
    //   toast.success('Payment documents successfully submitted.', {
    //     position: toast.POSITION.TOP_RIGHT,
    //     className: {},
    //   });
    //   this.setState({
    //     transferDetails: [FUND_DETAILS],
    //   });
    // }
    if (nextProps.initFundTransactionOtpSuccessData) {
      this.setState({ otpShow: true });
    }

    if (
      nextProps.initFundTransactionOtpError !== '' &&
      this.props.initFundTransactionOtpError !== nextProps.initFundTransactionOtpError
    ) {
      if (typeof nextProps.initFundTransactionOtpError === 'string') {
        this.notifyFail(nextProps.initFundTransactionOtpError);
      }
    }
    if (this.props.paymentSucceeded !== nextProps.paymentSucceeded && nextProps.paymentSucceeded) {
      this.setState(
        {
          transferDetails: [FUND_DETAILS],
          paymentsucceeded: true,
          done: true,
        },
        () => {
          const { account } = this.props;
          if (this.props.paymentMethod !== 'IB') {
            this.notifySuccess('Payment documents successfully submitted.');
          }
        },
      );

      if (this.props.paymentMethod === 'IB') {
        this.setState(
          {
            isTxnDoneUsingOnlinePayment: true,
            openDialogEmailSentOnlinePayment: true,
          },
          () => {},
        );
      }
    }

    if (!this.props.errorCreatePaymentRequestWithDocAfterOtp && nextProps.errorCreatePaymentRequestWithDocAfterOtp) {
      this.notifyFail(nextProps.errorCreatePaymentRequestWithDocAfterOtp);
    }
  }

  componentDidMount() {
    this.props.handleResetEmailOtpState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isEmailVerificationSent.toString() !== this.props.isEmailVerificationSent.toString()) {
      if (this.props.isEmailVerificationSent) {
        this.handleCloseVerificationOpenModal();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          done: true,
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.resetOtp();
    this.props.setErrorMessage({
      errorName: 'errorCreatePaymentRequestWithDocAfterOtp',
      message: null,
    });
  }

  updateDocs(data, i) {
    if (_isEmpty(data)) {
      this.setState({
        transferDetails: update(this.state.transferDetails, { [i]: { docs: { $set: {} } } }),
      });
    } else if (data.fileName) {
      this.setState({
        transferDetails: update(this.state.transferDetails, { [i]: { docs: { $set: data } } }),
      });
    } else if (data.TransactionDocId) {
      this.setState({
        transferDetails: update(this.state.transferDetails, {
          [i]: { docs: { TransactionDocId: { $set: data.TransactionDocId } } },
        }),
      });
    }
  }

  redirect(url) {
    // this.props.history.replace(url);
    const investmentPartnerProductIds = [];

    if (this.props.dataTransaction && this.props.dataTransaction.transactions) {
      for (const transaction of this.props.dataTransaction.transactions) {
        investmentPartnerProductIds.push(transaction.investmentPartnerProductId);
      }
    }

    this.props.reset();
    this.props.resetForm();

    this.props.history.push({
      pathname: url,
      state: { investmentPartnerProductIds },
    });
  }

  addFunds() {
    const currentFunds = [...this.state.transferDetails];
    currentFunds.push(FUND_DETAILS);
    this.setState({
      transferDetails: currentFunds,
    });
  }

  changeFilter(e) {
    const {
      clientDetails: {
        info: { account },
      },
    } = this.props;
    let updatedTransferDetails = { ...FUND_DETAILS };
    if (e.target.value === 'VA' && account && account[0].partnerAccountMappingId) {
      updatedTransferDetails = {
        ...FUND_DETAILS,
        ChequeOrDDNumber: `99${account[0].partnerAccountMappingId}`,
      };
    } else {
      updatedTransferDetails = { ...FUND_DETAILS };
    }
    this.setState(
      {
        transferDetails: [updatedTransferDetails],
        selectedFilter: e.target.value,
        chequeErrorMessage: '',
      },
      () => {
        this.props.setPaymentMethod(e.target.value);
      },
    );
  }

  handleChange(e, i) {
    const { value, name } = e.target;
    this.setState({
      transferDetails: update(this.state.transferDetails, {
        [i]: { [name]: { $set: value } },
      }),
    });
  }

  onChangeChequeAmount(e, i) {
    const { value, name } = e.target;
    let enteredValue = value;
    if ((enteredValue.toString().match(/\./g) || []).length > 1) {
      // if user enter more than 1 period
      return;
    }
    const { selectedFilter } = this.state;
    let paymentTypeText = selectedFilter === 'CQ' ? 'Cheque' : 'Remittance';
    if (selectedFilter === 'BD') {
      paymentTypeText = '';
    }
    const isNum = /^[0-9.]+$/.test(enteredValue);
    if (!isNum) {
      this.setState({
        chequeErrorMessage: `No comma separator allowed for entered ${paymentTypeText} amount`,
      });
      enteredValue = enteredValue.replace(/,/g, '');
    } else {
      this.setState({
        chequeErrorMessage: '',
      });
    }
    const initialInvestment = this.props.initialInvestment ? this.props.initialInvestment.toFixed(2) : 0;

    if (isNum || enteredValue === '') {
      const amount = parseFloat(enteredValue);
      this.setState(
        {
          transferDetails: update(this.state.transferDetails, { [i]: { [name]: { $set: enteredValue } } }),
        },
        () => {
          if (parseFloat(amount) !== parseFloat(initialInvestment)) {
            this.setState({
              chequeErrorMessage: `${paymentTypeText} amount should be equal to investment amount`,
            });
          } else {
            this.setState({
              chequeErrorMessage: '',
            });
          }
        },
      );
    }
  }

  onChangeKwspApplicationNumber(element) {
    this.setState({
      kwspApplicationNumber: element.target.value,
    });
  }
  onChangeKwspApplicationDate(dateValue) {
    this.setState({
      effectiveDate: dateValue,
    });
  }

  submit() {
    const paymentRequestData = [];
    const { account, orderCreated, funds, initialInvestment } = this.props;
    const investmentPartnerProductIds = funds.map((fund) => fund.fundcode);
    let totalPayment = 0;
    const arrAssetclass = funds ? funds.map((o) => o.assetclass) : [];
    let data;
    let genericData;
    this.state.transferDetails.map((data) => {
      const { ChequeOrDDNumber, BankName, ChequeOrDDAmount, docs } = data;
      totalPayment += parseInt(ChequeOrDDAmount, 10);
      const objData = {
        UTRAccountNO: account.Account.partnerAccountMappingId,
        CustomerId: account.profile.id,
        RequestStatus: 'Created',
        ChequeDDStatus: 'New',
        ChequeOrDDNumber,
        PaymentType: this.selectedPaymentMethod,
        ChequeOrDDAmount: ChequeOrDDAmount || initialInvestment,
        TransactionRequestId: orderCreated.transactionRequest.id,
        ChequeOrBDFileName: docs.fileName,
        BankName,
        TransactionDocId: docs.TransactionDocId,
        assetclass: JSON.stringify(_uniq(arrAssetclass)),
      };
      paymentRequestData.push(objData);
    });
    genericData = {
      CustomerId: account.profile.id,
      PaymentRequest: paymentRequestData,
      createOrder: true,
      investmentPartnerProductIds,
      accountType: account.Account.UTRACCOUNTTYPE,
    };
    data =
      account.Account.UTRACCOUNTTYPE === 'CS'
        ? genericData
        : {
            ...genericData,
            accountType: account.Account.UTRACCOUNTTYPE,
            serialNumber: this.state.kwspApplicationNumber,
            applicationDate: moment(this.state.effectiveDate).format('DD/MM/YYYY'),
          };
    this.setState(
      {
        totalPayment,
        initFundTransactionOtpPayload: {
          requestOtpType: 'INITIAL_SUBSCRIPTION',
          data,
        },
      },
      () => {
        if (account.Account.UTRACCOUNTTYPE === 'KW') {
          this.toggleKwspConfirmationPopUp(false);
        } else {
          // this.initOtp();
          this.handleOpenVerificationOpenModal();
        }
      },
    );
    // this.props.createPaymentDocs({ PaymentRequest: paymentRequestData });
  }

  handleCloseOtpModal() {
    this.setState({ otpShow: false }, () => {
      this.props.resetOtp();
    });
  }

  renderModalOtp() {
    if (this.props.initFundTransactionOtpSuccessData) {
      return (
        <OtpBox
          handleClose={this.handleCloseOtpModal}
          openModal={this.state.otpShow}
          url={this.props.initFundTransactionOtpSuccessData ? this.props.initFundTransactionOtpSuccessData.otpiFrameUrl : null}
          error={this.props.initFundTransactionOtpError}
        />
      );
    }
    return null;
  }

  handleCloseDialogEmailSentOnlinePayment() {
    this.setState(
      {
        openDialogEmailSentOnlinePayment: false,
        isTxnDoneUsingOnlinePayment: false,
      },
      () => {
        window.location.reload();
        this.props.resetPreviousDoneTxnPaymentType();
      },
    );
  }

  redirectToFunds = (account) => {
    this.props.resetSuccess();
    this.redirect(`/clients/${account ? account.profile.id : '0'}/funds/fromFundTransferAfterOnBoarding`);
  };

  initOtp() {
    this.props.initFundTransactionOtp({
      ...this.state.initFundTransactionOtpPayload,
    });
  }

  toggleKwspConfirmationPopUp(isContinue) {
    this.setState(
      {
        showKwspDataConfirmationPopUp: !this.state.showKwspDataConfirmationPopUp,
      },
      () => {
        if (isContinue) {
          // this.initOtp();
          this.handleOpenVerificationOpenModal();
        }
      },
    );
  }

  handleOpenVerificationOpenModal() {
    this.setState({
      isVerificationOptionModalOpen: true,
    });
  }

  handleCloseVerificationOpenModal() {
    this.setState({
      isVerificationOptionModalOpen: false,
    });
  }

  render() {
    const {
      funds,
      initialInvestment,
      account,
      orderCreated,
      processing,
      lov,
      clientDetailsProcessing,
      trxRequestId,
      isEmailVerificationSent,
      handleResetEmailOtpState,
    } = this.props;
    const { isVerificationOptionModalOpen } = this.state;
    // const done = !!(
    //   (parseInt(this.state.totalPayment, 10) === parseInt(initialInvestment, 10) && this.props.paymentRequestSucceeded) ||
    //   (this.props.paymentRequestSucceeded && this.state.backTriggered)
    // );

    const status =
      this.props.paymentRequestSucceeded && this.props.paymentDocsUploadedData
        ? this.props.paymentDocsUploadedData.RequestStatus
        : '';

    let selectedPaymentMethod;
    if (
      this.props.lov &&
      this.props.lov.Dictionary &&
      this.props.lov.Dictionary[20].datadictionary.some((o) => o.codevalue === this.props.paymentMethod)
    ) {
      selectedPaymentMethod = this.props.paymentMethod;
    } else if (this.props.kwspCashIntroDetails.createKwspAccountParams.AccountType === 'KW') {
      selectedPaymentMethod = '9N';
    } else {
      selectedPaymentMethod = this.state.selectedFilter;
    }
    this.selectedPaymentMethod = selectedPaymentMethod;
    return (
      <Container>
        <KwspConfirmationPopUp
          open={this.state.showKwspDataConfirmationPopUp}
          toggleKwspConfirmationPopUp={this.toggleKwspConfirmationPopUp}
        />
        <LoadingOverlay show={processing || clientDetailsProcessing || this.props.isProcessingTaskCreatePaymentRequestWithDoc} />
        <FundBox
          initialInvestment={initialInvestment}
          value={selectedPaymentMethod}
          onChange={this.changeFilter}
          data={this.state.transferDetails}
          addFunds={this.addFunds}
          orderCreated={orderCreated}
          onInputChange={this.handleChange}
          onSubmit={this.submit}
          updateDocs={this.updateDocs}
          done={this.state.done}
          status={status}
          documentsList={lov}
          onChangeChequeAmount={this.onChangeChequeAmount}
          succeeded={this.props.paymentSucceeded}
          errorMessage={this.state.chequeErrorMessage}
          email={this.props.personalDetails.email}
          account={this.props.clientDetails ? this.props.clientDetails.info.account[0] : {}}
          selectedFilter={this.state.selectedFilter}
          kwspCashIntroDetails={this.props.kwspCashIntroDetails}
          onChangeKwspApplicationNumber={this.onChangeKwspApplicationNumber}
          onChangeKwspApplicationDate={this.onChangeKwspApplicationDate}
          kwspApplicationNumber={this.state.kwspApplicationNumber}
          effectiveDate={this.state.effectiveDate}
        />
        <Table style={{ marginTop: -25 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableHeader>FUND NAME</TableHeader>
              </TableCell>
              <TableCell>
                <TableHeader>INITIAL INVESTMENT</TableHeader>
              </TableCell>
              <TableCell>
                <TableHeader>SALES CHARGE</TableHeader>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funds &&
              funds.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    <TableItem>
                      {n.fundcode} {n.name}
                    </TableItem>
                  </TableCell>
                  <TableCell>
                    <StyledNumberFormat
                      value={n.initialInvestment}
                      decimalSeparator={'.'}
                      decimalScale={2}
                      fixedDecimalScale
                      displayType={'text'}
                      thousandSeparator
                      prefix={'RM '}
                    />
                  </TableCell>
                  <TableCell>
                    <StyledNumberFormat
                      value={getSalesCharge(n.campaignCodeSalesCharge, n.defaultSalesCharge)}
                      displayType={'text'}
                      thousandSeparator
                      suffix="%"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                <Text color={Color.C_GRAY} size="12px" opacity="0.4" lineHeight="1.6" align="right">
                  Total Initial Invesment
                </Text>
              </TableCell>
              <TableCell>
                <StyledNumberFormat
                  decimalSeparator={'.'}
                  decimalScale={2}
                  fixedDecimalScale
                  value={initialInvestment}
                  displayType={'text'}
                  thousandSeparator
                  prefix={'RM '}
                />
                {this.state.done && <CheckImg src={CheckIcon} />}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* <Grid item xs={12}>
          <Text color={Color.C_GRAY} lineHeight="1.38" weight="bold" size="16px">
            {account.Account.virtualAccountNo
              ? account.Account.virtualAccountNo.slice(
                  account.Account.virtualAccountNo.length - 6,
                  account.Account.virtualAccountNo.length,
                )
              : ''}{' '}
            (CIMB Bank)
          </Text>
        </Grid> */}

        <RowGridCenter>
          <SyledButton primary onClick={() => this.redirect('/')}>
            Back To Dashboard
          </SyledButton>
          <SyledButton primary onClick={() => this.redirectToFunds(account)}>
            View Client Profile
          </SyledButton>
        </RowGridCenter>
        {this.renderModalOtp()}
        {this.state.isTxnDoneUsingOnlinePayment ? (
          <Dialog
            open={this.state.openDialogEmailSentOnlinePayment}
            closeHandler={this.handleCloseDialogEmailSentOnlinePayment}
            maxWidth="sm"
            content={
              <Grid container direction="column" justify="center" alignItems="center">
                <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
                  <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                    <img src={EmailSentIcon} />
                  </Grid>
                  <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                    <Text size="14px" weight="bold">
                      Payment request sent
                    </Text>
                  </Grid>
                  <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                    <Text size="14px" color="#1d1d26">
                      We have sent a payment link along with invoice details to
                    </Text>
                    <Text size="14px" color="#1d1d26" weight="bold">
                      {this.props.personalDetails.email}
                    </Text>
                  </Grid>
                  <Grid item xs={12}>
                    <Text size="14px" size="14px">
                      Please be informed that the payment link will expire in 48 hrs.
                    </Text>
                  </Grid>
                </Grid>
              </Grid>
            }
          />
        ) : null}
        {isVerificationOptionModalOpen ? (
          <VerificationOptionModal
            open={isVerificationOptionModalOpen}
            handleSubmitViaOtp={this.initOtp}
            handleClose={this.handleCloseVerificationOpenModal}
            trxPayload={this.state.initFundTransactionOtpPayload}
            trxRequestId={trxRequestId}
          />
        ) : null}
        {isEmailVerificationSent ? (
          <EmailVerificationConfirmationModal open={isEmailVerificationSent} handleClose={handleResetEmailOtpState} />
        ) : null}
      </Container>
    );
  }
}

Transfer.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  orderCreated: PropTypes.object,
  resetForm: PropTypes.func,
  reset: PropTypes.func,
  createPaymentDocs: PropTypes.func,
  account: PropTypes.object,
  processing: PropTypes.bool,
  paymentRequestSucceeded: PropTypes.bool,
  initialInvestment: PropTypes.any,
  funds: PropTypes.array,
  paymentDocsUploadedData: PropTypes.object,
  resetPaymentDocsUploadedData: PropTypes.func,
  paymentMethod: PropTypes.string,
  setPaymentMethod: PropTypes.func,
  paymentSucceeded: PropTypes.bool,
  initFundTransactionOtpError: PropTypes.objectaccount,
  resetOtp: PropTypes.func,
  trxRequestId: PropTypes.string.isRequired,
  isEmailVerificationSent: PropTypes.bool.isRequired,
  handleResetEmailOtpState: PropTypes.func.isRequired,
  clientDetails: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  funds: makeSelectSelectedFunds(),
  initialInvestment: makeSelectInitialInvestment(),
  account: makeSelectAccount(),
  orderCreated: makeSelectOrder(),
  processing: makeSelectProcessing(),
  paymentRequestSucceeded: makeSelectPaymentRequestSucceeded(),
  error: makeSelectError(),
  paymentDocsUploadedData: makeSelectPaymentDocsUploadedData(),
  lov: makeSelectLOV(),
  paymentMethod: makeSelectPaymentMethod(),
  initFundTransactionOtpSuccessData: makeSelectInitFundTransactionOtpSuccessData(),
  initFundTransactionOtpError: makeSelectInitFundTransactionOtpError(),
  allOTPSuccess: makeSelectAllTransactionOTPSuccess(),
  paymentSucceeded: makeSelectPaymentSucceeded(),
  clientDetailsProcessing: clientDetailsProcessing(),
  personalDetails: makeSelectPersonalDetails(),
  clientDetails: makeSelectClientDetails(),
  isTxnDoneUsingOnlinePayment: makeSelectIsTxnDoneUsingOnlinePayment(),
  isProcessingTaskCreatePaymentRequestWithDoc: makeSelectIsProcessingTaskCreatePaymentRequestWithDoc(),
  dataTransaction: makeSelectDataTransaction(),
  errorCreatePaymentRequestWithDocAfterOtp: makeSelectErrorCreatePaymentRequestWithDocAfterOtp(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
  trxRequestId: makeSelectOrderTrxRequestId(),
  isEmailVerificationSent: makeSelectIsEmailVerificationSent(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    reset: () => dispatch(reset()),
    createPaymentDocs: (payload) => dispatch(createPaymentDocs(payload)),
    resetError: () => dispatch(resetError()),
    resetForm: () => dispatch(ResetForm()),
    resetPaymentDocsUploadedData: () => dispatch(resetPaymentDocsUploadedData()),
    setPaymentMethod: (payload) => dispatch(setPaymentMethod(payload)),
    initFundTransactionOtp: (payload) => dispatch(initFundTransactionOtp(payload)),
    getCustomerDetails: (payload) => dispatch(getCustomerDetails(payload)),
    execAfterOTPFundTransactionSuccess: (payload) => dispatch(execAfterOTPFundTransactionSuccess(payload)),
    resetOtp: () => dispatch(resetOtp()),
    resetPreviousDoneTxnPaymentType: () => dispatch(resetPreviousDoneTxnPaymentType()),
    setErrorMessage: (payload) => dispatch(setErrorMessage(payload)),
    resetSuccess: () => dispatch(resetSuccess()),
    handleResetEmailOtpState: () => dispatch(resetEmailOtpState()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transfer);
