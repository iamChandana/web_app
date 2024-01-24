/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable func-names */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import update from 'immutability-helper';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';
import _forEach from 'lodash/forEach';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import { toast } from 'react-toastify';
import OtpBox from 'components/OtpBox';
import Button from 'components/Button';
import { RowGridCenter } from 'components/GridContainer';
import Modal from 'components/Modal';
import Text from 'components/Text';
import { StyledButton } from 'styles/style';
import {
  initRspOtp,
  initEditRspOtp,
  topUpOrRedeem,
  resetTransaction,
  addBank,
  initFundTransactionOtp,
  openModalFundTransactionOtp,
  resetSwitchFundSuccess,
  showModalSwitchFund,
  clearOTPError,
  clearTopupError,
  checkAmlaFail,
  checkAmlaSubscribe,
  showPaymentSelection,
  showTxnOtpWindows,
  resetPreviousDoneTxnPaymentType,
  setUpRsp,
  editRsp,
  initialRspResponse,
  clearRspOtpData,
  clearInitRspOTPErr,
  callWholeSaleDisclaierAcknowledgeApi,
} from 'containers/ClientDetails/actions';
import {
  makeSelectRspResponse,
  makeSelectInitEditRspOtpSuccessData,
  makeSelectInitEditRspOtpError,
  makeSelectTransactions,
  makeSelectPaymentSucceeded,
  makeSelectClientDetails,
  makeSelectAddedBank,
  makeSelectSwitchFundError,
  makeSelectShowModalFundTransactionOtp,
  makeSelectInitFundTransactionOtpSuccessData,
  makeSelectInitFundTransactionOtpError,
  makeSelectTopUpTransactionError,
  makeSelectAmlaFailObj,
  makeSelectShowPaymentSelection,
  makeSelectInitRspOtpSuccessData,
  makeSelectInitRspOtpError,
  makeSelectisProcessingSetUpRsp,
  makeSelectisOTPCalled,
  makeSelectSetUpRspSuccess,
  makeSelectSetUpRspFailure,
  selectIsSubscriptionDisabled,
  makeSelectIsEmailVerificationSent,
  makeSelectSalesCharges,
} from 'containers/ClientDetails/selectors';
import ErrorModal from 'components/Kwsp/Modal/ErrorModal';
import CheckAgeEligibility from 'containers/ClientDetails/Profile/Utility/CheckAgeEligibility';
import { selectUserInfo } from 'containers/LoginPage/selectors';
import AmlaWarningModal from 'components/AmlaWarning';
import JointAccountOtpModal from './JointAccountOtpConsentModal';
import TopUp from '../TransactionModal/TopUp/index';
import Switch from '../TransactionModal/Switch/index';
import Redeem from '../TransactionModal/Redeem/index';
import PaymentSelection from '../TransactionModal/PaymentSelection/index';
import EmailVerificationConfirmationModal from '../TransactionModal/VerificationOptionModal/EmailVerificationConfirmationModal';
import { ValidateRedemption, ValidateTopUp, ValidateSwitch, ValidateRsp } from './Utility';
import RegularSavingPlan from '../TransactionModal/RegularSavingPlan/index';
import rspStatuses from '../../ClientDetails/TransactionModal/rspStatuses';
import { filterJointAccountsFunds, findOtpSelectedAccounts } from '../utils/filterJointAccountParams';
import RspVerificationConfirmationModal from '../TransactionModal/VerificationOptionModal/RspVerificationConfirmationModal';
import AlertImg from '../../../images/alert.png';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 72px;
  background-color: #ffffff;
  box-shadow: 0 -4px 12px 0 rgba(0, 0, 0, 0.15);
`;

const DrawerBtn = styled(Button)`
  margin: 0 4px;
`;

const ageEligibleMsg =
  'Unable to transact since Client does not fulfil the age requirement for KWSP. Age eligibility for KWSP account - less than 55 years or not turning 55 years in 10 days before creation of transactions. However, Client is eligible for Cash transactions.';

class TransactionActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTopUp: false,
      isRedeemFormCleared: false,
      data: props.data.map((data) => ({
        ...data,
        FullIndicator: false,
      })),
      isOpenDialogEmailSent: false,
      showSwitch: false,
      showRedeem: false,
      showPaymentSelection: false,
      action: null,
      clientDetails: props.clientDetails,
      redemptionErrorMessage: '',
      topUpErrorMessage: '',
      serverErrorMessage: '',
      rspErrorMessage: '',
      redeemPurpose: '',
      arrayCountToSwitch: 1,
      totalSection: [{ amountToSwitch: 0, fundToSwitchTo: '' }],
      selectedRedeemBankId: '',
      showAmlaError: false,
      toastId: null,
      showPaymentSelectionDialog: false,
      rspValue: null,
      showModalRspOtp: false,
      showModalEditRspOtp: false,
      ageEligible: false,
      wholeSaleAcknowledge: false,
      isRspVerificationConfirmationModalOpen: false,
      preStepRedeemModalOpen: false,
    };
    this.toggleTopUp = this.toggleTopUp.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.toggleRedeem = this.toggleRedeem.bind(this);
    this.toggleSubscription = this.toggleSubscription.bind(this);
    this.addFields = this.addFields.bind(this);
    this.togglePaymentSelection = this.togglePaymentSelection.bind(this);
    this.handleTopUpChange = this.handleTopUpChange.bind(this);
    this.updateAddedFields = this.updateAddedFields.bind(this);
    this.topUpFund = this.topUpFund.bind(this);
    this.redeemFund = this.redeemFund.bind(this);
    this.submitSwitchFund = this.submitSwitchFund.bind(this);
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
    this.handleCloseOtpModalForRsp = this.handleCloseOtpModalForRsp.bind(this);
    this.closeAllTransactionModal = this.closeAllTransactionModal.bind(this);
    this.handleSwitchToChange = this.handleSwitchToChange.bind(this);
    this.clearAddAmount = this.clearAddAmount.bind(this);
    this.handleRedeemChange = this.handleRedeemChange.bind(this);
    this.changeSelectedBankId = this.changeSelectedBankId.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.handleRSPAmount = this.handleRSPAmount.bind(this);
    this.handleRSPSubmit = this.handleRSPSubmit.bind(this);
    this.handleEditRSPSubmit = this.handleEditRSPSubmit.bind(this);
    this.handleCloseDialogEmailSent = this.handleCloseDialogEmailSent.bind(this);
    this.handleCloseEmailModal = this.handleCloseEmailModal.bind(this);
    this.updateNewRspFields = this.updateNewRspFields.bind(this);
    this.toggleRSP = this.toggleRSP.bind(this);
    this.addNewFieldsForEditRsp = this.addNewFieldsForEditRsp.bind(this);
    this.updateNewRspFieldsForEdit = this.updateNewRspFieldsForEdit.bind(this);
    this.toggleAgeEligible = this.toggleAgeEligible.bind(this);
    this.closeJointAccountOtpSelectionModal = this.closeJointAccountOtpSelectionModal.bind(this);
    this.handleJointAccountOtpConsentPopUp = this.handleJointAccountOtpConsentPopUp.bind(this);
    this.wholeSaleAcknowledge = this.wholeSaleAcknowledge.bind(this);
    this.clearRedemptionProps = this.clearRedemptionProps.bind(this);
    this.handleOpenRspVerificationConfirmationModal = this.handleOpenRspVerificationConfirmationModal.bind(this);
    this.handleCloseRspVerificationConfirmationModal = this.handleCloseRspVerificationConfirmationModal.bind(this);
    this.handleClickSetRSP = this.handleClickSetRSP.bind(this);
    this.checkTransactionStatus = this.checkTransactionStatus.bind(this);
    this.checkIfPortfolioStatusPending = this.checkIfPortfolioStatusPending.bind(this);
    this.handlePreStepRedeemModal = this.handlePreStepRedeemModal.bind(this);
    this.checkIfAnyFundisClosed = this.checkIfAnyFundisClosed.bind(this);
    this.checkIfAnyFundisSuspended = this.checkIfAnyFundisSuspended.bind(this);
  }

  componentWillMount() {
    this.props.openModalFundTransactionOtp(undefined);
    this.props.clearRspOtpData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.initRspOtpError !== prevProps.initRspOtpError && this.props.initRspOtpError) {
      this.setState({ serverErrorMessage: this.props.initRspOtpError });
    }

    if (this.props.initEditRspOtpError !== prevProps.initEditRspOtpError && this.props.initEditRspOtpError) {
      this.setState({ serverErrorMessage: this.props.initEditRspOtpError });
    }

    if (prevProps.currentEditingFundForRSP !== this.props.currentEditingFundForRSP) {
      this.setState({ currentEditingFundForRSP: this.props.currentEditingFundForRSP }, () => {
        this.addNewFieldsForEditRsp(this.state.currentEditingFundForRSP);
      });
    }

    if (
      this.props.showRSPDialog !== prevProps.showRSPDialog &&
      this.props.showRSPDialog &&
      !this.props.currentEditingFundForRSP
    ) {
      const dataClone = this.state.data.map((item) => ({
        ...item,
        newAmount: item.fund.fundcode === '187' ? '500' : item.newAmount,
      }));
      this.setState({ data: dataClone });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.setUpRspFailureErr && nextProps.setUpRspFailureErr) {
      this.setState({ rspResError: true });
    }

    if (nextProps.initEditRspOtpSuccessData) {
      this.setState({ showModalEditRspOtp: true });
    }

    if (nextProps.initRspOtpSuccessData) {
      this.setState({
        showModalRspOtp: true,
      });
    }

    if (this.props.data !== nextProps.data) {
      this.setState({
        data: nextProps.data.map((data) => ({
          ...data,
          FullIndicator: false,
        })),
      });
    }
    if (this.props.data !== nextProps.data && !_isEmpty(nextProps.data)) {
      this.addFields(
        nextProps.data.map((data) => ({
          ...data,
          FullIndicator: false,
        })),
      );
    }

    if (this.props.transactions !== nextProps.transactions && !_isEmpty(nextProps.transactions)) {
      if (this.state.action === 'topup') {
        this.toggleTopUp();
        this.togglePaymentSelection();
      }

      if (this.state.action === 'redeem') {
        this.toggleRedeem();
        this.setState({
          data: null,
          action: '',
        });
      }
    }

    if (this.props.paymentSucceeded !== nextProps.paymentSucceeded && nextProps.paymentSucceeded) {
      if (this.state.action === 'topup') {
        this.props.resetTransaction();
        this.togglePaymentSelection();
        this.setState({
          data: null,
          action: '',
        });
      }
    }
    if (this.props.addedBank !== nextProps.addedBank) {
      this.callRedeem(nextProps.addedBank);
    }

    if (this.props.switchFundSuccess) {
      this.toggleSwitch();
    }
    if (
      this.props.initFundTransactionOtpSuccessData !== nextProps.initFundTransactionOtpSuccessData &&
      nextProps.showModalFundTransactionOtp &&
      _has(nextProps.initFundTransactionOtpSuccessData, 'otpiFrameUrl')
    ) {
      this.closeAllTransactionModal();
    }
    if (
      nextProps.amlaFailObj &&
      nextProps.amlaFailObj.amlaFail === true &&
      (nextProps.amlaFailObj.RiskProfile === 'HIGH' ||
        nextProps.amlaFailObj.RiskProfile === 'BLOCKED' ||
        nextProps.amlaFailObj.name === 'HIGH' ||
        nextProps.amlaFailObj.name === 'BLOCKED')
    ) {
      this.closeAllTransactionModal();
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
      this.props.checkAmlaFail({});
    }

    if (!this.props.showPaymentSelectionDialog && nextProps.showPaymentSelectionDialog) {
      this.setState({
        showPaymentSelectionDialog: true,
      });
    }
  }

  handleOpenRspVerificationConfirmationModal() {
    this.setState({
      isRspVerificationConfirmationModalOpen: true,
    });
  }

  handleCloseRspVerificationConfirmationModal() {
    this.setState({
      isRspVerificationConfirmationModalOpen: false,
    });
  }

  notify = (message) => {
    if (!toast.isActive(this.state.toastId)) {
      const toastId = toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
      this.setState({
        toastId,
      });
    }
  };

  closeAllTransactionModal() {
    this.setState({
      showSwitch: false,
      showTopUp: false,
      showRedeem: false,
    });
  }

  changeSelectedBankId({ target }) {
    this.setState({
      selectedRedeemBankId: target.value,
    });
  }

  handleCloseOtpModalForRsp() {
    this.setState({ showModalRspOtp: false, showModalEditRspOtp: false }, () => {
      this.addFields(this.props.data, 'rsp');
      this.props.toggleSetupRSP(false);
      this.props.clearRspOtpData();
    });
    // this.props.clearRspOtpData();
  }

  addNewFieldsForEditRsp(data) {
    if (data) {
      const resultData = data.map((item) => {
        const value = item.rspMaxAmount;
        return update(item, {
          newAmount: { $set: `${value}` },
          errorMessage: { $set: '' },
        });
      });
      this.setState({ currentEditingFundForRSP: resultData });
    }
  }

  addFields(data, action) {
    let errorMessage = '';
    const updatedData = data.map((item) => {
      let value =
        action === 'topup' && item.units > 0
          ? item.fund.minAdditionalInvestmentAmt
          : action === 'topup' && !item.units
          ? item.fund.minInitialInvestmentAmt
          : action === 'rsp'
          ? item.fund.minAdditionalInvestmentAmt
          : action === 'redeem'
          ? item.fund.minRedemptionUnits
          : item.fund.minRedemptionUnits;

      value = action ? value : item.fund.minAdditionalInvestmentAmt;

      if (action === 'switch') {
        errorMessage = ValidateSwitch(null, item);
      } else if (action === 'redeem') {
        errorMessage = ValidateRedemption(null, item);
      }
      return update(item, {
        newAmount: { $set: `${value}` },
        minUnits: { $set: value },
        errorMessage: { $set: errorMessage },
        switchToInfo: { $set: [{ amountToSwitch: value, fundToSwitchTo: '', errorMessage }] },
        FullIndicator: { $set: false },
      });
    });
    this.setState(
      {
        data: updatedData,
      },
      () => {
        if (action === 'switch') {
          this.setState((prevState) => ({
            showSwitch: !prevState.showSwitch,
          }));
        }
        if (action === 'redeem') {
          this.setState((prevState) => ({
            showRedeem: !prevState.showRedeem,
          }));
        }
      },
    );
  }

  toggleAgeEligible() {
    this.setState({ ageEligible: !this.state.ageEligible });
  }

  toggleRSP() {
    this.setState({ serverErrorMessage: '', wholeSaleAcknowledge: false }, () => this.props.clearInitRspOTPErr());
    this.addFields(this.props.data, 'rsp');
    this.props.toggleSetupRSP(false);
  }

  toggleTopUp() {
    const { info } = this.props.clientDetails;
    const { data } = this.props;
    if (data[0].accountType === 'KW' && CheckAgeEligibility(info.birthDate) >= 55) {
      this.toggleAgeEligible();
      return;
    }
    const cashIndex = _findIndex(info.account, ['UTRACCOUNTTYPE', 'CS']);
    if (cashIndex !== -1) {
      const mobileFormat = /^[+]?[0-9- ]+$/;
      if (!info.account[cashIndex].AccMobileNo || !info.account[cashIndex].AccMobileNo.match(mobileFormat)) {
        toast.error('Please update your mobile number to continue with transactions', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    }

    this.setState(
      (prevState) => ({
        showTopUp: !prevState.showTopUp,
        wholeSaleAcknowledge: false,
      }),
      () => {
        if (this.state.showTopUp) {
          this.setState(
            {
              action: 'topup',
            },
            () => {
              this.addFields(this.props.data, 'topup');
            },
          );
        } else {
          this.clearAddAmount();

          if (this.props.topUpTransactionError.length > 0) {
            this.props.clearTopupError();
          }
        }
      },
    );
  }

  toggleSwitch() {
    const { info } = this.props.clientDetails;
    const { data } = this.props;
    if (data[0].accountType === 'KW' && CheckAgeEligibility(info.birthDate) >= 55) {
      this.toggleAgeEligible();
    } else {
      const cashIndex = _findIndex(info.account, ['UTRACCOUNTTYPE', 'CS']);
      if (cashIndex !== -1) {
        const mobileFormat = /^[+]?[0-9- ]+$/;
        if (!info.account[cashIndex].AccMobileNo || !info.account[cashIndex].AccMobileNo.match(mobileFormat)) {
          toast.error('Please update your mobile number to continue with transactions', {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }
      }
      // action to switch -> validate message -> show switch modal -> clearAdd amount
      this.setState(
        {
          action: 'switch',
          wholeSaleAcknowledge: false,
        },
        () => {
          this.addFields(this.props.data, 'switch');
          this.props.clearOTPError();
          if (this.state.showSwitch) {
            this.clearAddAmount();
          }
        },
      );
      // this.setState(
      //   (prevState) => ({
      //     showSwitch: !prevState.showSwitch,
      //   }),
      //   () => {
      //     this.setState(
      //       {
      //         action: 'switch',
      //       },
      //       () => {
      //         this.addFields(this.props.data, 'switch');
      //         if (this.state.showSwitch) {
      //           this.clearAddAmount();
      //         }
      //       },
      //     );
      //   },
      // );

      this.props.resetSwitchFundSuccess();
    }
  }

  showModalSwitchFund() {
    this.props.showModalSwitchFund();
  }

  clearRedemptionProps() {
    this.setState({
      selectedRedeemBankId: '',
      isRedeemFormCleared: true,
    });
  }

  toggleRedeem() {
    const { info } = this.props.clientDetails;
    const { data } = this.props;
    if (data[0].accountType === 'KW' && CheckAgeEligibility(info.birthDate) >= 55) {
      this.toggleAgeEligible();
    } else {
      const cashIndex = _findIndex(info.account, ['UTRACCOUNTTYPE', 'CS']);
      if (cashIndex !== -1) {
        const mobileFormat = /^[+]?[0-9- ]+$/;
        if (!info.account[cashIndex].AccMobileNo || !info.account[cashIndex].AccMobileNo.match(mobileFormat)) {
          toast.error('Please update your mobile number to continue with transactions', {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }
      }
      this.setState(
        {
          action: 'redeem',
        },
        () => {
          this.props.clearOTPError();
          this.addFields(this.props.data, 'redeem');
          if (this.state.showRedeem) {
            this.clearAddAmount();
            this.setState(
              {
                redemptionErrorMessage: '',
              },
              () => {
                this.clearRedemptionProps();
              },
            );
          }
        },
      );
    }
  }

  toggleSubscription() {
    const { portfolio, info } = this.props.clientDetails;
    const mobileFormat = /^[+]?[0-9- ]+$/;
    const accountIdObj = this.getTransactionDetails();
    let accountId = null;

    if (accountIdObj) {
      accountId = accountIdObj.partnerAccountNO;
      const accountIdIndex = _findIndex(info.account, ['partnerAccountMappingId', accountId]);
      const accountType = info.account[accountIdIndex].UTRACCOUNTTYPE;

      if (accountType === 'KW' && CheckAgeEligibility(info.birthDate) >= 55) {
        this.toggleAgeEligible();
        return;
      }

      if (!info.account[0].AccMobileNo || !info.account[0].AccMobileNo.match(mobileFormat)) {
        toast.error("Please update the Client's Mobile Number to continue with transactions", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      this.props.subscribeButtonClick(portfolio.transactionRequest);
      this.setState({ action: 'subscribe' }, () => {
        this.props.checkAmlaSubscribe({ accountId });
      });
    }
  }

  togglePaymentSelection() {
    this.props.showPaymentSelection(!this.props.showPaymentSelectionDialog);
    this.setState((prevState) => ({
      showPaymentSelectionDialog: !prevState.showPaymentSelectionDialog,
    }));
  }

  handleRedeemChange(data, value) {
    this.setState(
      {
        redemptionErrorMessage: ValidateRedemption(value, data),
      },
      () => {
        this.updateAddedFields(data, value);
      },
    );
  }

  handleTopUpChange(data, value) {
    const { salesCharges } = this.props;

    this.setState(
      {
        topUpErrorMessage: ValidateTopUp(value, data, salesCharges),
      },
      () => {
        this.updateAddedFields(data, value);
      },
    );
  }

  updateAddedFields(data, value) {
    value = value || '';
    const index = _findIndex(this.state.data, ['investmentProductId', data.investmentProductId]);
    const { action, topUpErrorMessage, redemptionErrorMessage } = this.state;
    const errorMessage = action === 'topup' ? topUpErrorMessage : action === 'redeem' ? redemptionErrorMessage : '';
    this.setState({
      data: update(this.state.data, {
        [index]: { newAmount: { $set: value }, errorMessage: { $set: errorMessage } },
      }),
    });
  }

  // eslint-disable-next-line no-undef
  toggleFullRedemption = (data) => {
    const index = _findIndex(this.state.data, ['investmentProductId', data.investmentProductId]);

    this.setState((prevState) => ({
      data: update(this.state.data, {
        [index]: {
          FullIndicator: {
            $set: !prevState.data[index].FullIndicator,
          },
          newAmount: {
            $set: !prevState.data[index].FullIndicator
              ? this.state.data[index].availableRedeemSwitchUnits
              : this.state.data[index].minUnits,
          },
          errorMessage: {
            $set: !prevState.data[index].FullIndicator ? '' : ValidateRedemption(null, data),
          },
        },
      }),
    }));
  };

  // eslint-disable-next-line no-undef
  toggleFullSwitch = (data, selectedIndex, type) => {
    const index = _findIndex(this.state.data, ['investmentProductId', data.investmentProductId]);

    this.setState(
      (prevState) => ({
        data: update(this.state.data, {
          [index]: {
            FullIndicator: {
              $set: !prevState.data[index].FullIndicator,
            },
            switchToInfo: {
              [selectedIndex]: {
                [type]: {
                  $set: !prevState.data[index].FullIndicator
                    ? this.state.data[index].availableRedeemSwitchUnits
                    : this.state.data[index].minUnits,
                },
                errorMessage: {
                  $set: !prevState.data[index].FullIndicator
                    ? ''
                    : ValidateSwitch(this.state.data[index].minUnits, this.state.data[index], selectedIndex),
                },
              },
            },
          },
        }),
      }),
      () => {
        const errorMessage = this.state.data[index].FullIndicator
          ? ''
          : ValidateSwitch(
              this.state.data[index].switchToInfo[selectedIndex].amountToSwitch,
              this.state.data[index],
              selectedIndex,
            );

        this.setState({
          data: update(this.state.data, {
            [index]: {
              switchToInfo: {
                [selectedIndex]: {
                  errorMessage: { $set: errorMessage },
                },
              },
            },
          }),
        });
      },
    );
  };

  clearAddAmount() {
    const cloneState = { ...this.state };
    const { data } = cloneState;
    data.forEach((item) => {
      // item.newAmount = '';
      item.errorMessage = '';
      item.switchToInfo = [{ amountToSwitch: '', fundToSwitchTo: '', errorMessage: '' }];
    });
    this.setState({
      data,
    });
  }

  topUpFund() {
    const { data } = this.state;
    const {
      portfolio,
      clientDetails: { info },
    } = this.props;
    const { id } = portfolio;
    // if (!info.bank || !info.bank[0]) {
    //   this.notify('Client`s bank account info is missing. Please setup client`s bank account info first!');
    //   return;
    // }
    // const { bankAcctNumber, bankName, id: bankId } = info.bank[0];
    const reqPayload = {
      portofolioId: portfolio.id,
      accountId: portfolio.accountId,
      customerId: info.id,
      productBreakdown: [],
    };

    let payload = {};
    _forEach(data, (item) => {
      payload = {
        portofolioid: id,
        unitType: 'value',
        txType: 'topUp',
        partnerAccountNo: item.partnerAccountNo,
        investmentProductId: item.investmentProductId,
        investmentPartnerProductId: item.fund.fundcode,
        productType: 'Fund',
        value: item.newAmount ? parseFloat(item.newAmount) : 0,
        customerId: info.id,
        // bankAcctNumber,
        // bankName,
        // bankId,
      };
      reqPayload.productBreakdown.push(payload);
    });
    if (this.state.wholeSaleAcknowledge) {
      this.props.callWholeSaleDisclaierAcknowledgeApi({ customerId: info.id });
    }
    this.props.topUpOrRedeem(reqPayload);
  }

  redeemFund(stateData, selectedVerificationOption) {
    const {
      clientDetails: {
        info: { account },
      },
    } = this.props;
    // set purpose of redeem
    this.setState(
      {
        redeemPurpose: stateData.purposeOfRedemption,
      },
      () => {
        if (!_isEmpty(stateData.bankAcctNumber)) {
          const { bankAcctNumber, bankCode, branchCode, bankName, source, bankAcctName, iban, swift_bic_code } = stateData;
          const payload = {
            bank: {
              bankAcctNumber,
              bankCode,
              branchCode,
              bankName,
              source,
              bankAcctName,
              iban,
              swift_bic_code,
            },
            customerId: account[0].customerId,
          };
          this.props.addBank(payload);
        } else {
          this.callRedeem(null, selectedVerificationOption);
        }
      },
    );
  }

  handleJointAccountOtpConsentPopUp(accountNumber) {
    this.setState({
      showTransactionOtpModal: true,
      selectedFundAccountNumber: accountNumber,
    });
  }

  callRedeem(newBank, selectedVerificationOption) {
    const { data, redeemPurpose, selectedRedeemBankId } = this.state;
    const {
      portfolio,
      clientDetails: {
        info: { bank },
      },
      clientDetails: { info },
    } = this.props;
    const { id } = portfolio;
    const selectedBank = _find(bank, { id: selectedRedeemBankId });

    let bankDetails = {};

    if (!_isEmpty(newBank) || !_isEmpty(selectedBank)) {
      const { bankAcctNumber, bankName, id, bankCode } = !_isEmpty(newBank) ? newBank : selectedBank;
      bankDetails = {
        ...bankDetails,
        bankAcctNumber,
        bankName,
        bankId: id,
        bankCode,
      };
    }

    const reqPayload = {
      portofolioId: portfolio.id,
      accountId: data[0].partnerAccountNo,
      customerId: info.id,
      productBreakdown: [],
    };
    _forEach(data, (item) => {
      const payload = {
        FullIndicator: item.FullIndicator ? 'Y' : 'N',
        portofolioid: id,
        unitType: 'unit',
        txType: 'Redeem',
        partnerAccountNo: item.partnerAccountNo,
        purposeOfRedemption: redeemPurpose || '',
        investmentProductId: item.investmentProductId,
        investmentPartnerProductId: '',
        switchorredeemPartnerProductId: item.fund.fundcode,
        productType: 'Fund',
        units: item.FullIndicator ? '' : parseFloat(item.newAmount),
        customerId: info.id,
        ...bankDetails,
      };
      reqPayload.productBreakdown.push(payload);
    });
    const fundListedInJointAccount = filterJointAccountsFunds(data, info.account);

    if (
      fundListedInJointAccount.length &&
      this.isFundPartOfJointAccount(fundListedInJointAccount[0].partnerAccountNo) &&
      findOtpSelectedAccounts(info.jointAccountOtpSelection, fundListedInJointAccount[0].partnerAccountNo)
    ) {
      this.handleJointAccountOtpConsentPopUp(fundListedInJointAccount[0].partnerAccountNo);
    } else {
      this.props.initFundTransactionOtp({
        requestOtpType: 'FUND_REDEEM',
        data: reqPayload,
        selectedVerificationOption,
      });
    }
  }

  isFundPartOfJointAccount(selectedFundAccountNumber) {
    const { clientDetails } = this.props;
    return clientDetails.info.account.filter(
      (accountItem) =>
        accountItem.partnerAccountMappingId === selectedFundAccountNumber &&
        accountItem.jointAccounts &&
        accountItem.jointAccounts.length,
    ).length;
  }

  submitSwitchFund(selectedVerificationOption) {
    const {
      portfolio,
      clientDetails: { info },
    } = this.props;
    const { clientDetails } = this.props;
    const { data } = this.state;
    const obj = {};

    if (!this.props.userInfo.agent || !this.props.userInfo.agent.username) {
      toast.error(
        "Client's Profile is not available. Please try to logout and login again. If problem persist, contact Customer Support.",
        {
          position: toast.POSITION.TOP_RIGHT,
        },
      );

      return;
    }

    if (portfolio) {
      obj.agentId = portfolio.agentId;
      obj.portfolioId = portfolio.id ? portfolio.id.toString() : null;
      obj.accountId = data[0].partnerAccountNo;
      obj.customerId = info.id ? info.id.toString() : null;
    }

    obj.productBreakdown = [];

    data.map((item) => {
      item.switchToInfo.map((switchTo) => {
        obj.productBreakdown.push({
          unitType: 'unit',
          txType: 'Switch',
          partnerAccountNo: item.partnerAccountNo,
          switchInvestmentProductId: switchTo.fundToSwitchTo,
          portfolioId: item.portfolioId,
          investmentProductId: item.investmentProductId,
          investmentPartnerProductId: switchTo.fundToSwitchTo,
          switchorredeemPartnerProductId: item.fund.fundcode,
          productType: 'Fund',
          units: item.FullIndicator ? '' : parseFloat(switchTo.amountToSwitch),
          value: 0,
          customerId: info.id,
          FullIndicator: item.FullIndicator ? 'Y' : 'N',
        });
      });
    });
    const fundListedInJointAccount = filterJointAccountsFunds(data, info.account);
    if (
      fundListedInJointAccount.length &&
      this.isFundPartOfJointAccount(fundListedInJointAccount[0].partnerAccountNo) &&
      findOtpSelectedAccounts(clientDetails.info.jointAccountOtpSelection, fundListedInJointAccount[0].partnerAccountNo)
    ) {
      this.handleJointAccountOtpConsentPopUp(fundListedInJointAccount[0].partnerAccountNo);
    } else {
      if (this.state.wholeSaleAcknowledge) {
        this.props.callWholeSaleDisclaierAcknowledgeApi({ customerId: clientDetails.info.id });
      }
      this.props.initFundTransactionOtp({
        requestOtpType: 'FUND_SWITCH',
        data: obj,
        selectedVerificationOption,
      });
    }
  }

  handleCloseOtpModal() {
    this.props.openModalFundTransactionOtp(false);
    this.props.resetPreviousDoneTxnPaymentType();
    this.props.resetEmailSentForOnlinePaymentDialog();
    this.clearRedemptionProps();
  }

  renderModalOtp() {
    if (
      !_isEmpty(this.props.initFundTransactionOtpSuccessData) &&
      _has(this.props.initFundTransactionOtpSuccessData, 'otpiFrameUrl')
    ) {
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

  handleSwitchToChange(data, value, selectedIndex, type, selectedFund) {
    const currentSwitchToDefaultAmount = data.switchToInfo[data.switchToInfo.length - 1].amountToSwitch;
    const index = _findIndex(this.state.data, ['investmentProductId', data.investmentProductId]);

    this.setState(
      {
        data: update(this.state.data, {
          [index]: {
            switchToInfo: {
              [selectedIndex]: {
                [type]: { $set: value },
              },
            },
          },
        }),
      },
      () => {
        const errorMessage =
          type === 'amountToSwitch'
            ? ValidateSwitch(value, this.state.data[index], selectedIndex)
            : type === 'fundToSwitchTo'
            ? ValidateSwitch(currentSwitchToDefaultAmount, this.state.data[index], null, selectedFund)
            : '';

        this.setState({
          data: update(this.state.data, {
            [index]: {
              switchToInfo: {
                [selectedIndex]: {
                  [type]: { $set: value },
                  errorMessage: { $set: errorMessage },
                },
              },
            },
          }),
        });
      },
    );
  }

  navigateTo() {
    this.props.checkAmlaFail({});
    this.closeAllTransactionModal();
  }

  backToCurrentPageClick() {
    this.props.checkAmlaFail({});
  }

  updateNewRspFieldsForEdit(data, value) {
    value = value || '';
    const index = _findIndex(this.state.currentEditingFundForRSP, ['investmentProductId', data.investmentProductId]);
    this.setState({
      currentEditingFundForRSP: update(this.state.currentEditingFundForRSP, {
        [index]: { newAmount: { $set: value }, errorMessage: { $set: this.state.rspErrorMessage } },
      }),
    });
  }

  updateNewRspFields(data, value) {
    value = value || '';
    const index = _findIndex(this.state.data, ['investmentProductId', data.investmentProductId]);
    this.setState({
      data: update(this.state.data, {
        [index]: { newAmount: { $set: value }, errorMessage: { $set: this.state.rspErrorMessage } },
      }),
    });
  }

  handleRSPAmount(data, value, type) {
    this.setState({ rspErrorMessage: ValidateRsp(value, data) }, () => {
      if (type === 'edit') {
        this.updateNewRspFieldsForEdit(data, value);
      } else {
        this.updateNewRspFields(data, value);
      }
    });

    // const index = _findIndex(this.state.data, ['investmentProductId', fundId]);
    // // this.setState({ rspValue: value, fundId });
    // this.setState({
    //   data: update(this.state.data, {
    //     [index]: { inputedRSPAmount: { $set: value } },
    //   }),
    // });
  }

  handleRSPSubmit(accountId, selectedVerificationOption) {
    const rspDataObj = {};
    const rspObject = {};
    const { clientDetails } = this.props;
    if (this.state.data.length > 1) {
      const setUpRspPayloadForMultiple = [];
      this.state.data.forEach((data) => {
        const rspObj = {};
        rspObj.fundCode = data.fund.fundcode;
        rspObj.maxAmount = data.newAmount;
        // rspObj.maxAmount = data.minUnits;
        rspObj.accountId = accountId;
        setUpRspPayloadForMultiple.push(rspObj);
      });
      const id = this.state.data.map((fund) => fund.investmentProductId);
      rspDataObj.type = 'setUp';
      rspDataObj.id = id;
      rspObject.rsp = setUpRspPayloadForMultiple;
      if (
        this.isFundPartOfJointAccount(accountId) &&
        findOtpSelectedAccounts(clientDetails.info.jointAccountOtpSelection, accountId)
      ) {
        this.handleJointAccountOtpConsentPopUp(accountId);
      } else {
        if (this.state.wholeSaleAcknowledge) {
          this.props.callWholeSaleDisclaierAcknowledgeApi({ customerId: clientDetails.info.id });
        }
        this.props.initRspOtp({ rspObject, rspDataObj, selectedVerificationOption });
      }
    } else if (this.state.data.length === 1) {
      const setUpRspPayloadForSingle = {
        accountId,
        maxAmount: this.state.data[0].newAmount,
        fundCode: this.state.data[0].fund.fundcode,
      };
      const rsp = [];
      rspDataObj.type = 'setUp';
      rspDataObj.id = [this.state.data[0].investmentProductId];
      rsp.push(setUpRspPayloadForSingle);
      rspObject.rsp = rsp;
      if (
        this.isFundPartOfJointAccount(accountId) &&
        findOtpSelectedAccounts(clientDetails.info.jointAccountOtpSelection, accountId)
      ) {
        this.handleJointAccountOtpConsentPopUp(accountId);
      } else {
        this.props.initRspOtp({ rspObject, rspDataObj, selectedVerificationOption });
      }
    }
    this.addFields(this.props.data, 'rsp');
  }

  handleEditRSPSubmit(accountId, selectedVerificationOption) {
    const payloadObj = {};
    const fundIds = {};
    if (this.state.currentEditingFundForRSP.length > 1) {
      const editRspPayloadForMultiple = [];
      const rspRefNo = this.state.currentEditingFundForRSP[0].rspRefNo;
      this.state.currentEditingFundForRSP.forEach((data) => {
        const rspObj = {};
        rspObj.fundCode = data.fund.fundcode;
        rspObj.maxAmount = data.newAmount;
        rspObj.accountId = accountId;
        editRspPayloadForMultiple.push(rspObj);
      });
      const id = this.state.currentEditingFundForRSP.map((fund) => fund.investmentProductId);
      fundIds.type = 'edit';
      fundIds.id = id;
      payloadObj.rsp = editRspPayloadForMultiple;
      this.props.initEditRspOtp({ payloadObj, rspRefNo, fundIds }, selectedVerificationOption);
    } else if (this.state.currentEditingFundForRSP.length === 1) {
      const editRspPayloadForSingle = {
        accountId,
        maxAmount: this.state.currentEditingFundForRSP[0].newAmount,
        fundCode: this.state.currentEditingFundForRSP[0].fund.fundcode,
      };
      const rsp = [];
      fundIds.type = 'edit';
      fundIds.id = [this.state.currentEditingFundForRSP[0].investmentProductId];
      rsp.push(editRspPayloadForSingle);
      payloadObj.rsp = rsp;
      this.props.initEditRspOtp(
        { payloadObj, rspRefNo: this.state.currentEditingFundForRSP[0].rspRefNo, fundIds },
        selectedVerificationOption,
      );
    }
    this.addNewFieldsForEditRsp(this.props.currentEditingFundForRSP);
  }

  handleCloseEmailModal() {
    setTimeout(() => {
      this.setState({ isOpenDialogEmailSent: false });
      this.props.initialRspResponse();
    }, 5000);
  }

  handleCloseDialogEmailSent() {
    this.setState({ isOpenDialogEmailSent: false });
    // this.props.initialRspResponse();
  }

  closeJointAccountOtpSelectionModal() {
    this.setState({
      showTransactionOtpModal: false,
      selectedFundAccountNumber: null,
    });
  }

  wholeSaleAcknowledge() {
    this.setState((prevState) => ({
      wholeSaleAcknowledge: !prevState.wholeSaleAcknowledge,
    }));
  }

  // eslint-disable-next-line no-undef
  getRecentlyCreatedTransReq = (funds) =>
    funds.length &&
    funds.reduce((previous, current) =>
      previous.transactionRequest && current.transactionRequest && previous.transactionRequest.id > current.transactionRequest.id
        ? previous
        : current,
    );

  // eslint-disable-next-line no-undef
  getTransactionDetails = () => {
    const { clientDetails } = this.props;
    const funds = clientDetails && clientDetails.portfolio.filter((item) => item.transactionRequest);
    const transaction = this.getRecentlyCreatedTransReq(funds);
    return transaction.transactionRequest;
  };

  subscribeDisabled() {
    const accountIdObj = this.getTransactionDetails();
    const {
      clientDetails: { info },
    } = this.props;
    if (accountIdObj) {
      const accountId = accountIdObj.partnerAccountNO;
      const isEmisObj = info.account.find((accountItem) => accountItem.partnerAccountMappingId === accountId);
      if (isEmisObj) {
        return isEmisObj.isEmis;
      }
    }

    return false;
  }

  handleClickSetRSP() {
    const { info } = this.props.clientDetails;
    const cashIndex = _findIndex(info.account, ['UTRACCOUNTTYPE', 'CS']);
    if (cashIndex !== -1) {
      const mobileFormat = /^[+]?[0-9- ]+$/;
      if (!info.account[cashIndex].AccMobileNo || !info.account[cashIndex].AccMobileNo.match(mobileFormat)) {
        toast.error("Please update the Client's Mobile Number to continue with transactions", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      if (!info.account[cashIndex].AccEmail || info.account[cashIndex].AccEmail === '') {
        toast.error("Please update the Client's Email Address to continue with transactions.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    }
    const dataClone = this.state.data.map((item) => ({
      ...item,
      newAmount: item.fund.fundcode === '187' ? '500' : item.newAmount,
    }));
    this.setState({ data: dataClone }, () => this.props.toggleSetupRSP(false));
  }

  checkTransactionStatus() {
    // Checking isTopUpEnabled property
    const { data } = this.state;
    const isFound = data.every((item) => item.isTopUpEnabled);
    return !isFound;
  }

  checkIfPortfolioStatusPending() {
    const { data } = this.state;
    const isFound = data.some((item) => item.status === 'pending');
    return isFound;
  }

  handlePreStepRedeemModal(_e, flag) {
    if (!flag) {
      this.setState({ preStepRedeemModalOpen: true }, () => {
        // this.toggleRedeem();
      });
    } else {
      this.setState({ preStepRedeemModalOpen: false });
    }
  }

  // Only Applicable for KWSP funds
  checkIfAnyFundisClosed() {
    const { data } = this.state;
    return data.some((item) => item.fund.kwStatus === 'C' && item.accountType === 'KW');
  }

  // Only Applicable for KWSP funds
  checkIfAnyFundisSuspended() {
    const { data } = this.state;
    return data.some((item) => item.fund.kwStatus === 'S' && item.accountType === 'KW');
  }

  render() {
    const { data } = this.state;
    const hasNoData = _isEmpty(data);
    const isKWSP = _isEmpty(data.filter((fundItem) => fundItem.accountType !== 'KW'));
    const { clientDetails, isEmailVerificationSent } = this.props;
    let rspStatusData = [];
    rspStatusData = data.map((d) => d.rspStatus);
    const dataUnits = data.map((d) => d.units);

    let hasNoFundToSwitchTo = false;
    if (!this.props.portfolio || !this.props.portfolio.productbreakdown || this.props.portfolio.productbreakdown.length < 1) {
      hasNoFundToSwitchTo = true;
    }
    const isPartial = !hasNoData && data[0].status && data[0].status.toLowerCase() === 'active';
    let subscriptionIsPartial = null;
    if (this.props.clientDetails && this.props.clientDetails.portfolio && !_isEmpty(this.props.clientDetails.portfolio)) {
      const cashPortfolios =
        this.props.clientDetails &&
        this.props.clientDetails.portfolio.filter((item) => item.partnerAccountType === 'CS' || item.partnerAccountType === 'KW');
      if (cashPortfolios && cashPortfolios.length) {
        for (let i = 0; i < cashPortfolios.length; i += 1) {
          const isPartialFund = cashPortfolios[i].productbreakdown.find((d) => d.status && d.status.toLowerCase() === 'partial');
          if (isPartialFund) {
            subscriptionIsPartial = true;
            break;
          }
        }
      }
    }

    const renderSubscriptionButton = () => {
      const { isSubscriptionDisabled } = this.props;
      const disabled = isSubscriptionDisabled || this.subscribeDisabled();

      if (subscriptionIsPartial) {
        if (window.innerWidth <= 834) {
          return (
            <Grid item style={{ paddingTop: '5px' }}>
              <DrawerBtn primary onClick={this.toggleSubscription} disabled={disabled}>
                Subscribe
              </DrawerBtn>
            </Grid>
          );
        }
        return (
          <Grid item>
            <DrawerBtn primary onClick={this.toggleSubscription} disabled={disabled}>
              Subscribe
            </DrawerBtn>
          </Grid>
        );
      }

      return null;
    };

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

    let isRspOffline = false;
    if (data && data.length) {
      const rspOfflineData = data.find((item) => {
        if (
          item.rspStatus !== rspStatuses.pending &&
          item.rspStatus !== rspStatuses.inProgress &&
          item.rspStatus !== rspStatuses.editPending &&
          item.rspStatus !== rspStatuses.editInProgress &&
          item.rspStatus !== rspStatuses.terminationInProgress &&
          item.rspStatus !== rspStatuses.cancelled &&
          item.rspStatus !== rspStatuses.rejected &&
          item.rspStatus !== rspStatuses.completed &&
          item.rspStatus !== null
        ) {
          return item;
        }
      });
      if (rspOfflineData) isRspOffline = true;
    }

    return (
      <React.Fragment>
        {this.state.showTransactionOtpModal && (
          <JointAccountOtpModal
            clientName={clientDetails.info.fullName}
            customerId={clientDetails.info.id}
            accountNumber={this.state.selectedFundAccountNumber}
            handleClose={this.closeJointAccountOtpSelectionModal}
          />
        )}
        <Container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          {this.props.currentEditingFundForRSP &&
          this.props.currentEditingFundForRSP.length &&
          this.props.showRSPDialog &&
          hasNoData ? (
            <React.Fragment>
              <RegularSavingPlan
                isEdit
                open={this.props.showRSPDialog}
                handleClose={this.toggleRSP}
                data={data}
                handleRSPSubmit={this.handleEditRSPSubmit}
                clientDetails={this.props.clientDetails}
                handleRSPAmount={this.handleRSPAmount}
                serverErrorMessage={this.state.serverErrorMessage}
                currentEditingFundForRSP={this.state.currentEditingFundForRSP || []}
                handleDisclaimerChange={() => this.wholeSaleAcknowledge()}
              />
              {this.state.isRspVerificationConfirmationModalOpen ? (
                <RspVerificationConfirmationModal
                  open={this.state.isRspVerificationConfirmationModalOpen}
                  handleClose={this.handleCloseRspVerificationConfirmationModal}
                />
              ) : null}
            </React.Fragment>
          ) : null}
          {this.props.currentSetUpRsp && this.props.showRSPDialog && (
            <RegularSavingPlan
              open={this.props.showRSPDialog}
              handleClose={this.toggleRSP}
              data={data}
              handleRSPSubmit={this.handleRSPSubmit}
              clientDetails={this.props.clientDetails}
              handleRSPAmount={this.handleRSPAmount}
              serverErrorMessage={this.state.serverErrorMessage}
              currentEditingFundForRSP={this.props.currentEditingFundForRSP || []}
              handleDisclaimerChange={() => this.wholeSaleAcknowledge()}
            />
          )}

          {!hasNoData && (
            <React.Fragment>
              {this.state.showTopUp && (
                <TopUp
                  open={this.state.showTopUp}
                  handleClose={this.toggleTopUp}
                  data={data}
                  handleTopUpChange={this.handleTopUpChange}
                  topUpFund={this.topUpFund}
                  errorMessage={this.props.topUpTransactionError}
                  fullName={clientDetails.info.fullName}
                  wholeSaleAcknowledge={this.state.wholeSaleAcknowledge}
                  handleDisclaimerChange={() => this.wholeSaleAcknowledge()}
                  clientDetails={clientDetails.info}
                />
              )}
              <Switch
                open={this.state.showSwitch}
                handleClose={this.toggleSwitch}
                data={data}
                submitSwitchFund={this.submitSwitchFund}
                error={this.props.switchFundError}
                handleSwitchToChange={this.handleSwitchToChange}
                arrayCountToSwitch={this.state.arrayCountToSwitch}
                totalSection={this.state.totalSection}
                allFunds={this.props.allFunds}
                errorMessage={this.props.initFundTransactionOtpError}
                toggleFullSwitch={this.toggleFullSwitch}
                riskAppetite={this.props.clientDetails.info.riskAppetite}
                fullName={clientDetails.info.fullName}
                wholeSaleAcknowledge={this.state.wholeSaleAcknowledge}
                handleDisclaimerChange={() => this.wholeSaleAcknowledge()}
                clientDetails={clientDetails.info}
              />
              <Redeem
                open={this.state.showRedeem}
                handleClose={this.toggleRedeem}
                data={data}
                handleRedeemChange={this.handleRedeemChange}
                redeemFund={this.redeemFund}
                clientDetails={this.props.clientDetails}
                errorMessage={this.props.initFundTransactionOtpError}
                changeSelectedBankId={this.changeSelectedBankId}
                selectedRedeemBankId={this.state.selectedRedeemBankId}
                toggleFullRedemption={this.toggleFullRedemption}
                isRedeemFormCleared={this.state.isRedeemFormCleared}
              />
              <RegularSavingPlan
                open={this.props.showRSPDialog}
                handleClose={this.toggleRSP}
                data={data}
                handleRSPSubmit={this.handleRSPSubmit}
                clientDetails={this.props.clientDetails}
                handleRSPAmount={this.handleRSPAmount}
                serverErrorMessage={this.state.serverErrorMessage}
                currentEditingFundForRSP={this.props.currentEditingFundForRSP || []}
                wholeSaleAcknowledge={this.state.wholeSaleAcknowledge}
                handleDisclaimerChange={() => this.wholeSaleAcknowledge()}
              />
            </React.Fragment>
          )}
          {this.state.showPaymentSelectionDialog ? (
            <PaymentSelection
              open={this.state.showPaymentSelectionDialog}
              handleClose={this.togglePaymentSelection}
              data={data}
              transactionRoute={this.state.action}
              transactionRequest={this.state.action === 'subscribe' ? this.getTransactionDetails() : ''}
            />
          ) : null}
          <RowGridCenter>
            <Grid item>
              <DrawerBtn
                primary
                onClick={this.toggleTopUp}
                // disabled={hasNoData}
                disabled={
                  hasNoData || this.checkTransactionStatus() || this.checkIfAnyFundisClosed() || this.checkIfAnyFundisSuspended()
                }>
                Top Up
              </DrawerBtn>
            </Grid>
            <Grid item>
              <DrawerBtn
                primary
                onClick={this.toggleSwitch}
                // disabled={!(hasNoFundToSwitchTo && isPartial)}
                disabled={
                  !(hasNoFundToSwitchTo && isPartial) || this.checkIfPortfolioStatusPending() || this.checkIfAnyFundisClosed()
                }>
                Switch
              </DrawerBtn>
            </Grid>
            <Grid item>
              <DrawerBtn
                primary
                onClick={this.handlePreStepRedeemModal}
                // disabled={!isPartial}
                disabled={!isPartial || this.checkIfPortfolioStatusPending() || this.checkIfAnyFundisClosed()}>
                Redeem
              </DrawerBtn>
            </Grid>
            {renderSubscriptionButton(this.props.portfolio)}
            <Grid item>
              <DrawerBtn
                primary
                onClick={this.handleClickSetRSP}
                disabled={
                  isKWSP ||
                  hasNoData ||
                  rspStatusData.includes(rspStatuses.completed) ||
                  rspStatusData.includes(rspStatuses.terminationInProgress) ||
                  rspStatusData.includes(rspStatuses.editPending) ||
                  rspStatusData.includes(rspStatuses.pending) ||
                  rspStatusData.includes(rspStatuses.editRejected) ||
                  rspStatusData.includes(rspStatuses.editInProgress) ||
                  rspStatusData.includes(rspStatuses.inProgress) ||
                  dataUnits.includes(0) ||
                  isRspOffline ||
                  this.checkIfPortfolioStatusPending()
                }>
                Setup RSP
              </DrawerBtn>
            </Grid>
          </RowGridCenter>
          {this.renderModalOtp()}
          {showAmlaDialog && (
            <AmlaWarningModal
              isOpen={showAmlaDialog}
              data={amlaErrorObj}
              navigateTo={this.navigateTo}
              fromPage={this.state.action ? this.state.action.toUpperCase() : ''}
              backButtonClick={() => this.backToCurrentPageClick()}
              isFromTransaction
            />
          )}
        </Container>

        {/* pre-step popup for Redeem */}
        <Modal
          open={this.state.preStepRedeemModalOpen}
          modalWidth="710px"
          zIndex="1500"
          modalImage={AlertImg}
          modalImgAlt="alert img"
          handleClose={() => this.handlePreStepRedeemModal(null, true)}>
          <Grid container direction="column" xs={12} justify="center" spacing={24}>
            <Grid item>
              <Text>
                Prior to each redemption application, you are required to ensure that the investor is aware of his/her option to
                switch his/her investment(s) without incurring any fee and/or charge (unless otherwise stated*), and that any new
                investment(s) in the future will be subject to sales fees and/or charges, if any, as stated*
                <br /> *in the Prospectus, Information Memorandum and/or Disclosure Document of the said fund(s).
              </Text>
            </Grid>
            <Grid item>
              <RowGridCenter>
                <StyledButton onClick={() => this.handlePreStepRedeemModal(null, true)}>Back</StyledButton>
                <StyledButton
                  primary
                  onClick={() => {
                    this.handlePreStepRedeemModal(null, true);
                    this.toggleRedeem();
                  }}>
                  Continue
                </StyledButton>
              </RowGridCenter>
            </Grid>
          </Grid>
        </Modal>

        <OtpBox
          handleClose={this.handleCloseOtpModalForRsp}
          openModal={this.state.showModalRspOtp}
          url={this.props.initRspOtpSuccessData ? this.props.initRspOtpSuccessData.otpiFrameUrl : null}
          error={this.props.initRspOtpError}
        />

        <OtpBox
          handleClose={this.handleCloseOtpModalForRsp}
          openModal={this.state.showModalEditRspOtp}
          url={this.props.initEditRspOtpSuccessData ? this.props.initEditRspOtpSuccessData.otpiFrameUrl : null}
          error={this.props.initEditRspOtpError}
        />
        {isEmailVerificationSent ? (
          <EmailVerificationConfirmationModal
            open={isEmailVerificationSent}
            handleClose={() => {
              window.location.reload();
            }}
          />
        ) : null}
        {/* Age Eligible Prompt for topup, Switch, Redeem flow */}
        <ErrorModal msg={ageEligibleMsg} handleClose={this.toggleAgeEligible} open={this.state.ageEligible} showClose />
      </React.Fragment>
    );
  }
}

TransactionActionButton.propTypes = {
  data: PropTypes.array,
  currentEditingFundForRSP: PropTypes.array,
  topUpOrRedeem: PropTypes.func,
  initRspOtp: PropTypes.func,
  topUpTransactionError: PropTypes.object,
  portfolio: PropTypes.object,
  clientDetails: PropTypes.object,
  switchFundError: PropTypes.object,
  transactions: PropTypes.object,
  paymentSucceeded: PropTypes.bool,
  addedBank: PropTypes.object,
  showModalFundTransactionOtp: PropTypes.bool,
  initFundTransactionOtpSuccessData: PropTypes.object,
  initFundTransactionOtpError: PropTypes.object,
  userInfo: PropTypes.object,
  resetTransaction: PropTypes.func,
  addBank: PropTypes.func,
  initFundTransactionOtp: PropTypes.func,
  openModalFundTransactionOtp: PropTypes.func,
  resetSwitchFundSuccess: PropTypes.func,
  showModalSwitchFund: PropTypes.func,
  clearOTPError: PropTypes.func,
  clearTopupError: PropTypes.func,
  isSubscriptionDisabled: PropTypes.bool,
  clearRspOtpData: PropTypes.func,
  initRspOtpError: PropTypes.string,
  initEditRspOtpError: PropTypes.string,
  setUpRspFailureErr: PropTypes.string,
  initEditRspOtpSuccessData: PropTypes.object,
  initRspOtpSuccessData: PropTypes.object,
  switchFundSuccess: PropTypes.bool,
  amlaFailObj: PropTypes.object,
  showPaymentSelectionDialog: PropTypes.bool,
  checkAmlaFail: PropTypes.func,
  toggleSetupRSP: PropTypes.func,
  clearInitRspOTPErr: PropTypes.func,
  subscribeButtonClick: PropTypes.func,
  checkAmlaSubscribe: PropTypes.func,
  showPaymentSelection: PropTypes.func,
  callWholeSaleDisclaierAcknowledgeApi: PropTypes.func,
  resetPreviousDoneTxnPaymentType: PropTypes.func,
  resetEmailSentForOnlinePaymentDialog: PropTypes.func,
  initEditRspOtp: PropTypes.func,
  initialRspResponse: PropTypes.func,
  showRSPDialog: PropTypes.bool,
  currentSetUpRsp: PropTypes.bool,
  allFunds: PropTypes.array,
  isEmailVerificationSent: PropTypes.bool,
  salesCharges: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  rspResponse: makeSelectRspResponse(),
  transactions: makeSelectTransactions(),
  paymentSucceeded: makeSelectPaymentSucceeded(),
  clientDetails: makeSelectClientDetails(),
  addedBank: makeSelectAddedBank(),
  switchFundError: makeSelectSwitchFundError(),
  showModalFundTransactionOtp: makeSelectShowModalFundTransactionOtp(),
  initFundTransactionOtpSuccessData: makeSelectInitFundTransactionOtpSuccessData(),
  initFundTransactionOtpError: makeSelectInitFundTransactionOtpError(),
  userInfo: selectUserInfo(),
  topUpTransactionError: makeSelectTopUpTransactionError(),
  amlaFailObj: makeSelectAmlaFailObj(),
  showPaymentSelectionDialog: makeSelectShowPaymentSelection(),
  initEditRspOtpSuccessData: makeSelectInitEditRspOtpSuccessData(),
  initRspOtpSuccessData: makeSelectInitRspOtpSuccessData(),
  initRspOtpError: makeSelectInitRspOtpError(),
  isProcessingSetUpRsp: makeSelectisProcessingSetUpRsp(),
  isOTPCalled: makeSelectisOTPCalled(),
  setUpRspSuccess: makeSelectSetUpRspSuccess(),
  setUpRspFailureErr: makeSelectSetUpRspFailure(),
  initEditRspOtpError: makeSelectInitEditRspOtpError(),
  isSubscriptionDisabled: selectIsSubscriptionDisabled(),
  isEmailVerificationSent: makeSelectIsEmailVerificationSent(),
  salesCharges: makeSelectSalesCharges(),
});

function mapDispatchToProps(dispatch) {
  return {
    initRspOtp: (payload) => dispatch(initRspOtp(payload)),
    initEditRspOtp: (payload, selectedVerificationOption) => dispatch(initEditRspOtp(payload, selectedVerificationOption)),
    clearRspOtpData: () => dispatch(clearRspOtpData()),
    setUpRsp: (payload) => dispatch(setUpRsp(payload)),
    editRsp: (payload) => dispatch(editRsp(payload)),
    initialRspResponse: () => dispatch(initialRspResponse()),
    topUpOrRedeem: (payload) => dispatch(topUpOrRedeem(payload)),
    resetTransaction: () => dispatch(resetTransaction()),
    addBank: (payload) => dispatch(addBank(payload)),
    initFundTransactionOtp: (payload) => dispatch(initFundTransactionOtp(payload)),
    openModalFundTransactionOtp: (payload) => dispatch(openModalFundTransactionOtp(payload)),
    resetSwitchFundSuccess: () => dispatch(resetSwitchFundSuccess()),
    showModalSwitchFund: (payload) => dispatch(showModalSwitchFund(payload)),
    clearOTPError: () => dispatch(clearOTPError()),
    clearTopupError: () => dispatch(clearTopupError()),
    checkAmlaFail: (payload) => dispatch(checkAmlaFail(payload)),
    clearInitRspOTPErr: () => dispatch(clearInitRspOTPErr()),
    checkAmlaSubscribe: (payload) => dispatch(checkAmlaSubscribe(payload)),
    showPaymentSelection: (payload) => dispatch(showPaymentSelection(payload)),
    showTxnOtpWindows: (payload) => dispatch(showTxnOtpWindows(payload)),
    resetPreviousDoneTxnPaymentType: () => dispatch(resetPreviousDoneTxnPaymentType()),
    callWholeSaleDisclaierAcknowledgeApi: (payload) => dispatch(callWholeSaleDisclaierAcknowledgeApi(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
)(TransactionActionButton);
