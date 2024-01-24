import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import update from 'immutability-helper';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';
import AmlaWarningModal from 'components/AmlaWarning';
import LoadingOverlay from 'components/LoadingOverlay';
import OtpBox from 'components/OtpBox';
import { toast } from 'react-toastify';
import Disclaimer from 'containers/ClientDetails/TransactionModal/Disclaimer';
import CWADisclaimer from 'containers/ClientDetails/TransactionModal/CWADisclaimer';
import WholeSaleDisclaimer from 'containers/ClientDetails/TransactionModal/WholeSaleDisclaimer';
import PaymentSelection from 'components/PaymentSelectionModal';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';
import Button from 'components/Button';
import { RowGridCenter, RowGridSpaceBetween, RowGridRight } from 'components/GridContainer';
import {
  execAfterOTPFundTransactionSuccess,
  execAfterOTPFundTransactionFail,
  openModalFundTransactionOtp,
  resetOtp,
  callWholeSaleDisclaierAcknowledgeApi,
  resetError,
  resetEmailOtpState,
} from 'containers/ClientDetails/actions';
import {
  saveFunds,
  getCustomer,
  addProductToPortfolio,
  checkAmlaFailOnAddFund,
  clearAddedPortfolioErrors,
  getDefaultSalesChargeRequest,
  removeCampaignCode,
} from 'containers/OnBoarding/actions';
import {
  makeSelectShowModalFundTransactionOtp,
  makeSelectInitFundTransactionOtpSuccessData,
  makeSelectAllTransactionOTPSuccess,
  makeSelectInitFundTransactionOtpError,
  makeSelectIsTxnDoneUsingOnlinePayment,
  makeSelectClientDetails,
  makeSelectIsProcessingTaskCreatePaymentRequestWithDoc,
  makeSelectErrorCreatePaymentRequestWithDocAfterOtp,
  makeSelectError,
  makeSelectOnlineTxnSuccess,
  makeSelectSetSubscribeAccountId,
  makeSelectPaymentSucceeded,
  makeSelectIsEmailVerificationSent,
  makeSelectGetSelectionAccount,
} from 'containers/ClientDetails/selectors';

import {
  makeSelectSelectedFunds,
  makeSelectInitialInvestment,
  makeSelectCustomer,
  makeSelectProcessing,
  makeSelectAddedToPortfolio,
  makeSelectRiskProfiles,
  makeSelectAddedFunds,
  makeSelectPaymentRequestSucceeded,
  makeSelectPaymentDocsUploadedData,
  makeSelectFunds,
  makeSelectAddToPortfolioError,
  makeSelectAmlaFailObj,
  makeSelectIsQueryISAFAmlaError,
} from 'containers/OnBoarding/selectors';
import AddNewFundsHeader from '../AddNewFundsHeader';
import AddFundsBtnIcon from '../images/addBtn.svg';
import FundCard from '../../OnBoarding/SelectFunds/AllocateFunds/FundCard';
import { findJointAccountHolderNames } from '../utils/getAccountHolderType';
import EmailVerificationConfirmationModal from '../TransactionModal/VerificationOptionModal/EmailVerificationConfirmationModal';
import { CampaignErrorModal } from 'containers/onBoarding/SelectFunds/AllocateFunds/CampaignErrorModal';
import QueryISAFAmlaErrorModal from '../Funds/QueryISAFAmlaErrorModal';

const DisclaimerContainer = styled(Grid)`
  width: 100%;
  margin: 24px 0 28px;
  // background-color: rgba(216, 35, 42, 0.5);
`;

const Container = styled(RowGridCenter)`
  padding: 0 40px;
  width: 100% !important;
  margin: 0;
  .--offset-right {
    margin-right: 10%;
  }
`;

const SyledButton = styled(Button)`
  width: 160px;
  margin: 0 4px;
`;

const AddFundsBtn = styled(Button)`
  width: 144px;
  img {
    margin-right: 8px;
  }
`;

const BoxedInput = styled(NumberFormat)`
  display: block;
  min-width: 200px;
  height: 40px;
  margin-left: 16px;
  border-radius: 5px;
  border: solid 1px #cacaca;
  font-size: 18px;
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #10151a;
  padding: 8px 12px;
`;

const TextError = styled.span`
  font-size: 12px;
  color: ${Color.C_RED};
`;

const TotalAmtGrid = styled(Grid)`
  position: relative;
`;

const ErrorRoot = styled.div`
  position: absolute;
  left: 1rem;
`;

class AllocateFunds extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFunds: props.selectedFunds,
      totalInitialInvestment: props.initialInvestment,
      error: false,
      originalTotal: 0,
      acknowledge: false,
      cwaAcknowledge: false,
      showPaymentSelection: false,
      transactionData: {},
      toastId: null,
    };
    this.erroCreatingAddFunds = false;
    // this.closeFund = this.closeFund.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.setInitialInvestment = this.setInitialInvestment.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.onClose = this.onClose.bind(this);
    this.cancel = this.cancel.bind(this);
    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.togglePaymentSelection = this.togglePaymentSelection.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.wholeSaleAcknowledge = this.wholeSaleAcknowledge.bind(this);
  }

  toastId = null;

  notify = (message) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
        onClose: () => {
          if (this.erroCreatingAddFunds) {
            this.setState(
              {
                keepLoadingIcon: false,
              },
              () => {
                this.props.resetError();
                this.props.history.push(`/clients/${this.props.clientDetails.info.id}/funds`);
              },
            );
          }
        },
      });
    }
  };

  componentWillMount() {
    const id = this.props.match.params.id;
    let portfolioId;
    if (this.props.addedFunds && !_isEmpty(this.props.addedFunds)) {
      portfolioId = this.props.subscribeAccountId
        ? this.getPorfolioId(this.props.subscribeAccountId)
        : this.getPorfolioId(this.props.addedFunds.transactionRequests.accountId);
    } else {
      portfolioId = this.props.subscribeAccountId
        ? this.getPorfolioId(this.props.subscribeAccountId)
        : this.props.match.params.portfolioId;
    }
    this.processUrlParam();
    this.props.getCustomer({ id, portfolioId });
    this.calculateInitialInvestment();
    this.props.resetOtp();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.handleResetEmailOtpState();
    if (this.props.selectedAccount) this.props.getDefaultSalesCharge(this.props.selectedAccount.UTRACCOUNTTYPE);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initFundTransactionOtpError) {
      if (
        nextProps.initFundTransactionOtpError !== this.props.initFundTransactionOtpError &&
        nextProps.initFundTransactionOtpError !== ''
      ) {
        if (typeof nextProps.initFundTransactionOtpError === 'string') {
          // this.notify(nextProps.initFundTransactionOtpError);
          this.setState({
            keepLoadingIcon: false,
          });
        }
      }
    }
    if (this.props.isAddedToPortfolio !== nextProps.isAddedToPortfolio && nextProps.isAddedToPortfolio) {
      this.setState(
        {
          transactionData: nextProps.addedFunds,
        },
        () => {
          this.setState({
            showPaymentSelection: true,
          });
        },
      );
      // this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
    }
    if (
      nextProps.paymentRequestSucceeded &&
      this.props.paymentDocsUploadedData !== nextProps.paymentDocsUploadedData &&
      !_isEmpty(nextProps.paymentDocsUploadedData)
    ) {
      toast.success('Payment documents successfully submitted.', {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
      this.cancel();
    }

    if (
      nextProps.amlaFailObj &&
      nextProps.amlaFailObj.amlaFail === true &&
      (nextProps.amlaFailObj.RiskProfile === 'HIGH' ||
        nextProps.amlaFailObj.RiskProfile === 'BLOCKED' ||
        nextProps.amlaFailObj.name === 'HIGH' ||
        nextProps.amlaFailObj.name === 'BLOCKED')
    ) {
      this.setState({
        showPaymentSelection: false,
        keepLoadingIcon: false,
      });
    }

    if (
      nextProps.amlaFailObj &&
      nextProps.amlaFailObj.amlaFail === true &&
      nextProps.amlaFailObj.RiskProfile !== 'HIGH' &&
      nextProps.amlaFailObj.RiskProfile !== 'BLOCKED' &&
      nextProps.amlaFailObj.name !== 'HIGH' &&
      nextProps.amlaFailObj.name !== 'BLOCKED'
    ) {
      let msg = nextProps.amlaFailObj.message;
      if (typeof msg !== 'string') {
        msg = nextProps.amlaFailObj.message.message;
      }
      this.notify(msg);
      this.props.checkAmlaFailOnAddFund({});
      this.setState({
        keepLoadingIcon: false,
      });
    }

    if (this.props.isTxnDoneUsingOnlinePaymentSuccess) {
      this.setState(
        {
          isTxnDoneUsingOnlinePayment: true,
        },
        () => {},
      );
    }

    if (
      !this.props.errorCreatePaymentRequestWithDocAfterOtp &&
      nextProps.errorCreatePaymentRequestWithDocAfterOtp &&
      typeof nextProps.errorCreatePaymentRequestWithDocAfterOtp === 'string'
    ) {
      this.notify(nextProps.errorCreatePaymentRequestWithDocAfterOtp);
      // this.setState({
      //   keepLoadingIcon: false,
      // });
    }

    if (!this.props.error && nextProps.error && typeof nextProps.error === 'string') {
      this.notify(nextProps.error);
      this.setState({
        keepLoadingIcon: false,
      });
    }

    if (!this.props.allTransactionOTPSuccess && nextProps.allTransactionOTPSuccess) {
      if (this.props.isTxnDoneUsingOnlinePaymentSuccess) {
        this.props.history.replace(`/clients/${this.props.match.params.id}/funds/isTxnDoneUsingOnlinePayment`);
      } else {
        this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
      }
    }

    if (this.props.addToPortfolioError !== nextProps.addToPortfolioError) {
      if (Object.keys(nextProps.addToPortfolioError).length) {
        this.setState({ isModalOpen: true, portfolioError: nextProps.addToPortfolioError.errorMessage });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedFunds !== this.props.selectedFunds) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selectedFunds: this.props.selectedFunds,
      });
    }

    if (this.props.allTransactionOTPSuccess !== prevProps.allTransactionOTPSuccess && this.props.allTransactionOTPSuccess) {
      if (this.state.isTxnDoneUsingOnlinePayment) {
        this.props.history.replace(`/clients/${this.props.match.params.id}/funds/isTxnDoneUsingOnlinePayment`);
      } else {
        this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
      }
    }
  }

  getPorfolioId(subscribeAccountId) {
    const {
      clientDetails: { portfolio },
    } = this.props;
    return portfolio.find((portfolioItem) => parseInt(portfolioItem.accountId) === parseInt(subscribeAccountId)).id;
  }

  processUrlParam() {
    if (!this.props.location || !this.props.location.search) {
      return;
    }
    let isFundTransactionOtp = false;
    let isFundTransactionOtpSuccess = false;
    let type = '';
    let portfolioId = this.props.match.params.portfolioId;

    if (this.props.location.pathname.indexOf(`/allocate-funds/${portfolioId}`) > 0) {
      isFundTransactionOtp = true;
      type = 'topup';
      if (this.props.location.pathname.indexOf(`/allocate-funds/${portfolioId}/otpy`) > 0) {
        isFundTransactionOtpSuccess = true;
        if (this.props.isTxnDoneUsingOnlinePaymentSuccess) {
          this.setState(
            {
              keepLoadingIcon: true,
            },
            () => {
              this.props.history.push(`/clients/${this.props.clientDetails.info.id}/funds`);
            },
          );
        } else {
          this.setState(
            {
              keepLoadingIcon: true,
            },
            () => {
              const { errorCreatePaymentRequestWithDocAfterOtp, paymentSucceeded } = this.props;
              console.log('calling this', errorCreatePaymentRequestWithDocAfterOtp, paymentSucceeded);
              this.erroCreatingAddFunds = true;
              if (errorCreatePaymentRequestWithDocAfterOtp || paymentSucceeded) {
                this.notify(errorCreatePaymentRequestWithDocAfterOtp);
                this.props.history.push(`/clients/${this.props.clientDetails.info.id}/funds`);
              }
            },
          );
        }
      }

      if (this.props.location.pathname.indexOf(`/allocate-funds/${portfolioId}/otpn`) > 0) {
        isFundTransactionOtpSuccess = false;

        toast.error('You have entered an invalid OTP', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }

    const locationSearch = this.props.location.search;

    const urlParams = locationSearch.split('?');

    if (isFundTransactionOtp && locationSearch) {
      const queryParam = urlParams[1].split('=')[1];
      if (isFundTransactionOtpSuccess) {
        this.props.execAfterOTPFundTransactionSuccess({ queryParam, type });
      } else {
        this.props.execAfterOTPFundTransactionFail(queryParam);
      }
    }
  }

  acknowledge() {
    this.setState((prevState) => ({
      acknowledge: !prevState.acknowledge,
    }));
  }

  cwaAcknowledge() {
    this.setState((prevState) => ({
      cwaAcknowledge: !prevState.cwaAcknowledge,
    }));
  }

  wholeSaleAcknowledge() {
    this.setState((prevState) => ({
      wholeSaleAcknowledge: !prevState.wholeSaleAcknowledge,
    }));
  }
  cancel() {
    this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
  }

  onClose(data) {
    if (this.state.selectedFunds.length < 1) {
      this.setState({
        totalInitialInvestment: 0,
      });
    } else {
      const dataIndex = _findIndex(this.state.selectedFunds, { id: data.id });

      const newData = update(this.state.selectedFunds, { $splice: [[dataIndex, 1]] });

      this.setState(
        {
          selectedFunds: newData,
        },
        () => {
          this.props.saveFunds(this.state.selectedFunds);
          this.props.clearAddedPortfolioErrors();
          this.calculateInitialInvestment();
          // this.setState({
          //   totalInitialInvestment: this.state.selectedFunds.reduce(
          //     (total, obj) => (obj.initialInvestment ? Number(obj.initialInvestment) : 0 + Number(total)),
          //     0,
          //   ),
          // });
        },
      );
    }
  }

  togglePaymentSelection() {
    this.setState(
      (prevState) => ({
        showPaymentSelection: !prevState.showPaymentSelection,
      }),
      () => {
        this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
      },
    );
  }

  setInitialInvestment(value) {
    if (parseFloat(value) < this.state.originalTotal) {
      this.setState(
        {
          error: true,
        },
        () => {
          this.setState({
            totalInitialInvestment: this.state.originalTotal,
            error: false,
          });
        },
      );
    } else {
      this.setState({
        totalInitialInvestment: value,
        error: false,
      });
    }
  }

  calculateInitialInvestment() {
    let totalInitialInvestment = 0;
    this.state.selectedFunds.map((fund) => {
      totalInitialInvestment += fund.initialInvestment ? parseFloat(fund.initialInvestment) : 0;
    });
    this.setState({
      totalInitialInvestment,
      originalTotal: totalInitialInvestment,
    });
  }

  next() {
    this.state.selectedFunds.map((data) => {
      if (data.initialInvestment < data.minInitialInvestmentAmt) {
        data.initialInvestment = data.minInitialInvestmentAmt;
      }
      update(data, { initialInvestment: { $set: data.initialInvestment } });
    });

    const {
      match: { params },
      clientDetails: { portfolio },
    } = this.props;
    const selectedAccountIndex = _findIndex(portfolio, ['id', parseInt(params.portfolioId)]);
    const payload = {
      customerId: portfolio[selectedAccountIndex].customerId,
      accountId: portfolio[selectedAccountIndex].accountId,
      productBreakdown: [],
    };
    this.props.selectedFunds.map((data) => {
      payload.productBreakdown.push({
        investmentProductId: data.id,
        investmentPartnerProductId: data.fundcode,
        switchorredeemPartnerProductId: '',
        productType: 'Fund',
        value: data.initialInvestment,
        unitType: 'value',
        units: '',
        campaignCodeId: data.campaignCodeId,
        campaignCode: data.campaignCode,
        defaultRate: data.defaultSalesCharge || 0,
        defaultRateId: data.defaultRateId,
        campaignCodeSalesCharge: data.campaignCodeSalesCharge,
        lowerSalesCharge: data.campaignSalesCharge || data.defaultSalesCharge || 0,
      });
    });
    if (this.state.wholeSaleAcknowledge) {
      this.props.callWholeSaleDisclaierAcknowledgeApi({ customerId: payload.customerId });
    }
    this.props.addProductToPortfolio({ req: payload, portfolioId: this.props.match.params.portfolioId });
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
  }

  back() {
    // this.props.history.goBack();
    // this.props.history.push(`/clients/${this.props.match.params.id}/add-funds/create`);
  }

  addFunds() {
    this.props.history.push(`/clients/${this.props.match.params.id}/add-funds/${this.props.match.params.portfolioId}`);
  }

  sliderChange(data, value, min, max) {
    if (!value) {
      const selected = _find(this.state.selectedFunds, { id: data.id });
      const newArray = [...this.state.selectedFunds];
      const updatedData = newArray.map((fund) => {
        if (fund.id === selected.id) {
          fund.initialInvestment = null;
        }
        return fund;
      });
      this.setState(
        {
          selectedFunds: updatedData,
        },
        () => {
          let updatedTotalInitialInvestment = 0;
          this.state.selectedFunds.map((fund) => {
            updatedTotalInitialInvestment += fund.initialInvestment ? parseFloat(fund.initialInvestment) : 0;
          });
          this.setState({
            totalInitialInvestment: updatedTotalInitialInvestment,
          });
        },
      );
      return;
    }
    if (value < min) {
      this.setState({
        error: true,
      });
    } else {
      this.setState({
        error: false,
      });
    }
    if (value > max) {
      value = max;
    }
    const selected = _find(this.state.selectedFunds, { id: data.id });
    const newArray = [...this.state.selectedFunds];
    const updatedData = newArray.map((fund) => {
      if (fund.id === selected.id) {
        fund.initialInvestment = value;
      }
      return fund;
    });
    this.setState(
      {
        selectedFunds: updatedData,
      },
      () => {
        let updatedTotalInitialInvestment = 0;
        this.state.selectedFunds.map((fund) => {
          updatedTotalInitialInvestment += fund.initialInvestment ? parseFloat(fund.initialInvestment) : 0;
        });
        this.setState({
          totalInitialInvestment: updatedTotalInitialInvestment,
        });
      },
    );
  }

  handleCloseOtpModal() {
    this.props.openModalFundTransactionOtp(false);
  }

  renderModalOtp() {
    if (this.props.initFundTransactionOtpSuccessData) {
      return (
        <OtpBox
          handleClose={this.handleCloseOtpModal}
          openModal={this.props.showModalFundTransactionOtp}
          url={this.props.initFundTransactionOtpSuccessData ? this.props.initFundTransactionOtpSuccessData.otpiFrameUrl : null}
          error={this.props.initFundTransactionOtpError}
        />
      );
    }
    return null;
  }

  validateFundAndGetTotal() {
    let valid = true;
    let total = 0;
    this.props.selectedFunds.map((item) => {
      total += parseFloat(item.initialInvestment);
      if (parseFloat(item.initialInvestment) < item.minInitialInvestmentAmt) {
        valid = false;
      }
    });

    return { valid, total };
  }

  navigateTo(url) {
    this.props.checkAmlaFailOnAddFund({});
    this.setState({
      showPaymentSelection: false,
    });
    this.cancel();
  }

  backToCurrentPageClick() {
    this.props.checkAmlaFailOnAddFund({});
  }

  getCustomerFromAccountList(account) {
    const {
      clientDetails: { portfolio },
      match: { params },
    } = this.props;
    let customer;

    const selectedAccount = portfolio.filter((portfolioItem) => parseInt(portfolioItem.id) === parseInt(params.portfolioId))[0];

    if (!selectedAccount) return {};

    customer = account.filter((accountItem) => {
      if (_has(accountItem, 'partnerAccountMappingId')) {
        return accountItem.partnerAccountMappingId === selectedAccount.accountId;
      }
    })[0];
    return customer;
  }

  checkForSophisticatedFund() {
    const { selectedFunds } = this.props;
    return selectedFunds.filter((fund) => fund.fundSubType === 'W').length > 0;
  }

  render() {
    const { isEmailVerificationSent, selectedAccount, handleRemoveCampaignCode, isQueryISAFAmlaError } = this.props;
    const { selectedFunds, totalInitialInvestment, transactionData } = this.state;
    const { valid, total } = this.validateFundAndGetTotal();
    if (_isEmpty(this.props.customer)) {
      return <LoadingOverlay show={this.props.processing} />;
    }
    const paymentRequestType = this.props.match.params.portfolioId === 'create' ? 'CREATE_NEW' : 'ADD_FUNDS';
    let showAmlaDialog = false,
      amlaErrorObj = {};
    if (
      this.props.amlaFailObj &&
      this.props.amlaFailObj.amlaFail === true &&
      (this.props.amlaFailObj.RiskProfile === 'HIGH' ||
        this.props.amlaFailObj.RiskProfile === 'BLOCKED' ||
        this.props.amlaFailObj.name === 'HIGH' ||
        this.props.amlaFailObj.name === 'BLOCKED')
    ) {
      showAmlaDialog = true;
      amlaErrorObj = {
        error: {
          name: this.props.amlaFailObj.name,
          message: this.props.amlaFailObj.message,
        },
      };
    }

    const {
      clientDetails: { portfolio },
      match: { params },
    } = this.props;

    // Total investment validation for KWSP account types
    let minError = false;
    if (portfolio) {
      // eslint-disable-next-line eqeqeq
      const selectedAccDetails = portfolio.find((item) => item.id == params.portfolioId);
      if (selectedAccDetails && selectedAccDetails.partnerAccountType === 'KW') {
        if (totalInitialInvestment < 1000) {
          minError = true;
        } else {
          minError = false;
        }
      }
    }

    return (
      <React.Fragment>
        {!_isEmpty(transactionData) && (
          <PaymentSelection
            open={this.state.showPaymentSelection}
            handleClose={this.togglePaymentSelection}
            transactions={
              _has(transactionData, 'transactionRequests')
                ? transactionData.transactionRequests
                : transactionData.transactionRequest
            }
            type={paymentRequestType}
            customer={this.getCustomerFromAccountList(this.props.clientDetails.info.account)}
            selectedFunds={selectedFunds}
          />
        )}
        {this.renderModalOtp()}
        <LoadingOverlay show={this.props.processing || this.state.keepLoadingIcon} />
        <AddNewFundsHeader customer={this.props.customer} cancel={this.cancel} riskProfiles={this.props.riskProfiles} />
        <Container spacing={24}>
          <Grid item xs={12}>
            <RowGridSpaceBetween>
              <Grid item>
                <Text size="18px" weight="600" color="#000" align="left">
                  Allocate Funds
                </Text>
              </Grid>
              <Grid item>
                <AddFundsBtn onClick={this.addFunds}>
                  <img src={AddFundsBtnIcon} alt="Add Funds" />
                  Add Funds
                </AddFundsBtn>
              </Grid>
            </RowGridSpaceBetween>
          </Grid>
          {selectedFunds.map((data) => {
            const errorMessage = this.props.addToPortfolioError;
            let filteredError = errorMessage;
            if (!_isEmpty(errorMessage) && typeof errorMessage === 'object' && Array.isArray(errorMessage.message)) {
              filteredError = errorMessage.message.filter((errorItem) => errorItem.investmentProductId === data.id);
            }
            return (
              <Grid item xs={12} key={data.id}>
                <FundCard
                  data={data}
                  onClose={this.onClose}
                  onSliderChange={this.sliderChange}
                  selectedFunds={selectedFunds}
                  allFunds={this.props.allFunds.Funds.res}
                  handleRemoveCampaignCode={() => {
                    handleRemoveCampaignCode(data.fundcode);
                  }}
                  accountType={selectedAccount.UTRACCOUNTTYPE}
                />
              </Grid>
            );
          })}
          <Grid item xs={12} className="--offset-right">
            <RowGridRight>
              <Grid>
                <Text color="#1d1d26">Total Initial Investment</Text>
              </Grid>
              <TotalAmtGrid>
                <BoxedInput
                  value={totalInitialInvestment || ''}
                  decimalScale={2}
                  displayType={'text'}
                  thousandSeparator
                  prefix={'RM '}
                />
                {minError && (
                  <ErrorRoot>
                    <TextError>The minimum total investment for KWSP transactions is RM 1,000.</TextError>
                  </ErrorRoot>
                )}
              </TotalAmtGrid>
            </RowGridRight>
          </Grid>
          <DisclaimerContainer className="verified">
            <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} />
            <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} />
            {this.checkForSophisticatedFund() && (
              <WholeSaleDisclaimer
                secondaryHolderNameIfAvailable={findJointAccountHolderNames(
                  this.getCustomerFromAccountList(this.props.clientDetails.info.account),
                )}
                fullName={this.props.clientDetails.info.fullName}
                acknowledge={this.state.wholeSaleAcknowledge}
                onChange={this.wholeSaleAcknowledge}
              />
            )}
          </DisclaimerContainer>
          <Grid item xs={12}>
            <RowGridCenter>
              <SyledButton onClick={this.addFunds}>Back</SyledButton>
              <SyledButton
                primary
                onClick={this.next}
                disabled={
                  !this.state.acknowledge ||
                  !this.state.cwaAcknowledge ||
                  (this.checkForSophisticatedFund() && !this.state.wholeSaleAcknowledge) ||
                  this.state.error ||
                  !valid ||
                  !total ||
                  totalInitialInvestment < total ||
                  minError
                }>
                Next
              </SyledButton>
            </RowGridCenter>
          </Grid>
          {showAmlaDialog === true && (
            <AmlaWarningModal
              isOpen={showAmlaDialog}
              data={amlaErrorObj}
              navigateTo={this.navigateTo}
              fromPage={'ADD FUND'}
              backButtonClick={() => this.backToCurrentPageClick()}
              isFromTransaction
            />
          )}
          {isQueryISAFAmlaError ? (
            <QueryISAFAmlaErrorModal
              open={isQueryISAFAmlaError}
              isFromClientsFundPage={false}
              navigateToClientFundPage={() => this.props.history.push(`/clients/${this.props.match.params.id}/funds`)}
            />
          ) : null}
        </Container>
        {isEmailVerificationSent ? (
          <EmailVerificationConfirmationModal open={isEmailVerificationSent} handleClose={this.togglePaymentSelection} />
        ) : null}

        <CampaignErrorModal
          campaignErrorMessage={this.state.portfolioError}
          open={this.state.isModalOpen}
          handleCloseModal={() => {
            this.setState({ isModalOpen: false });
          }}
        />
      </React.Fragment>
    );
  }
}

AllocateFunds.propTypes = {
  processing: PropTypes.bool,
  history: PropTypes.object,
  selectedFunds: PropTypes.array,
  saveFunds: PropTypes.func,
  initialInvestment: PropTypes.number,
  customer: PropTypes.object,
  isAddedToPortfolio: PropTypes.bool,
  addProductToPortfolio: PropTypes.func,
  getCustomer: PropTypes.func,
  execAfterOTPFundTransactionSuccess: PropTypes.func,
  execAfterOTPFundTransactionFail: PropTypes.func,
  openModalFundTransactionOtp: PropTypes.func,
  allFunds: PropTypes.object,
  addToPortfolioError: PropTypes.object,
  riskProfiles: PropTypes.array,
  match: PropTypes.object,
  location: PropTypes.object,
  initFundTransactionOtpError: PropTypes.object,
  isEmailVerificationSent: PropTypes.bool.isRequired,
  handleResetEmailOtpState: PropTypes.func.isRequired,
  getDefaultSalesCharge: PropTypes.func.isRequired,
  selectedAccount: PropTypes.object.isRequired,
  handleRemoveCampaignCode: PropTypes.func.isRequired,
};

AllocateFunds.defaultProps = {
  funds: [],
};

AllocateFunds.propTypes = {
  clientDetails: PropTypes.any,
  isQueryISAFAmlaError: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  selectedFunds: makeSelectSelectedFunds(),
  initialInvestment: makeSelectInitialInvestment(),
  customer: makeSelectCustomer(),
  processing: makeSelectProcessing(),
  isAddedToPortfolio: makeSelectAddedToPortfolio(),
  riskProfiles: makeSelectRiskProfiles(),
  addedFunds: makeSelectAddedFunds(),
  showModalFundTransactionOtp: makeSelectShowModalFundTransactionOtp(),
  initFundTransactionOtpSuccessData: makeSelectInitFundTransactionOtpSuccessData(),
  allTransactionOTPSuccess: makeSelectAllTransactionOTPSuccess(),
  paymentRequestSucceeded: makeSelectPaymentRequestSucceeded(),
  paymentDocsUploadedData: makeSelectPaymentDocsUploadedData(),
  allFunds: makeSelectFunds(),
  addToPortfolioError: makeSelectAddToPortfolioError(),
  amlaFailObj: makeSelectAmlaFailObj(),
  initFundTransactionOtpError: makeSelectInitFundTransactionOtpError(),
  // isTxnDoneUsingOnlinePayment: makeSelectIsTxnDoneUsingOnlinePayment(),
  isTxnDoneUsingOnlinePaymentSuccess: makeSelectOnlineTxnSuccess(),
  clientDetails: makeSelectClientDetails(),
  isProcessingTaskCreatePaymentRequestWithDoc: makeSelectIsProcessingTaskCreatePaymentRequestWithDoc(),
  errorCreatePaymentRequestWithDocAfterOtp: makeSelectErrorCreatePaymentRequestWithDocAfterOtp(),
  error: makeSelectError(),
  subscribeAccountId: makeSelectSetSubscribeAccountId(),
  paymentSucceeded: makeSelectPaymentSucceeded(),
  isEmailVerificationSent: makeSelectIsEmailVerificationSent(),
  selectedAccount: makeSelectGetSelectionAccount(),
  isQueryISAFAmlaError: makeSelectIsQueryISAFAmlaError(),
});

function mapDispatchToProps(dispatch) {
  return {
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    getCustomer: (payload) => dispatch(getCustomer(payload)),
    addProductToPortfolio: (payload) => dispatch(addProductToPortfolio(payload)),
    execAfterOTPFundTransactionSuccess: (payload) => dispatch(execAfterOTPFundTransactionSuccess(payload)),
    execAfterOTPFundTransactionFail: (payload) => dispatch(execAfterOTPFundTransactionFail(payload)),
    openModalFundTransactionOtp: (payload) => dispatch(openModalFundTransactionOtp(payload)),
    checkAmlaFailOnAddFund: (payload) => dispatch(checkAmlaFailOnAddFund(payload)),
    resetOtp: () => dispatch(resetOtp()),
    clearAddedPortfolioErrors: () => dispatch(clearAddedPortfolioErrors()),
    callWholeSaleDisclaierAcknowledgeApi: (payload) => dispatch(callWholeSaleDisclaierAcknowledgeApi(payload)),
    resetError: () => dispatch(resetError()),
    handleResetEmailOtpState: () => dispatch(resetEmailOtpState()),
    getDefaultSalesCharge: (accountType) => dispatch(getDefaultSalesChargeRequest(accountType)),
    handleRemoveCampaignCode: (fundCode) => dispatch(removeCampaignCode(fundCode)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AllocateFunds);
