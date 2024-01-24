/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';
import { MenuItem } from 'material-ui/Menu';
import Pagination from 'components/Pagination';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';
import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';
import Text from 'components/Text';
import update from 'immutability-helper';
import OtpBox from 'components/OtpBox';
import moment from 'moment';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import LoadingOverlay from 'components/LoadingOverlay';
import Parser from 'html-react-parser';
import {
  makeSelectPaymentSucceeded,
  makeSelectClientDetails,
  makeSelectProcessing,
  makeSelectError,
  makeSelectSetUpRspSuccess,
  makeSelectEditRspSuccess,
  makeSelectAllTransactionOTPSuccess,
  makeSelectDataTransaction,
  makeSelectTransactionRequest,
  makeSelectInitFundTransactionOtpError,
  makeSelectInvalidCustomerID,
  makeSelectIsTxnDoneUsingOnlinePayment,
  makeSelectMessageResentConfirmationEmailStatus,
  makeSelectErrorCreatePaymentRequestWithDocAfterOtp,
  makeSelectIsProcessingTaskCreatePaymentRequestWithDoc,
  makeSelectisOTPCalled,
  makeSelectRspResponse,
  makeSelectSetUpRspFailure,
  makeSelectEditRspFailure,
  makeSelectRspRefNo,
  makeSelectfundIds,
  makeSelectrspDataObj,
  makeSelectInitTerminateRspOtpSuccessData,
  makeSelectInitTerminateRspOtpError,
  makeSelectTerminateRspSuccess,
  makeSelectTerminateRspFailure,
  makeSelectSuccess,
  makeSelectOnlineTxnSuccess,
  makeSelectRetakeAssessmentSuccess,
  makeSelectRetakeAssessmentError,
  makeSelectUnSubscribedFund,
  makeSelectGroupedFunds,
  makeSelectUnsubscribeModal,
  makeSelectSelectedFund,
  makeSelectIsRiskAssessmentExpired,
} from 'containers/ClientDetails/selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import {
  getCustomerDetails,
  reset,
  resetError,
  execAfterOTPFundTransactionSuccess,
  execAfterOTPFundTransactionFail,
  resetSwitchFundSuccess,
  clearTransactionData,
  resetAllocateFundStatus,
  resetClientProfileData,
  showTxnOtpWindows,
  resetPreviousDoneTxnPaymentType,
  resendConfirmationEmail,
  clearStateOfConfirmationEmailResent,
  setUpRsp,
  editRsp,
  initTerminateRspOtp,
  terminateRsp,
  clearRspOtpData,
  clearTransactionRequest,
  getRiskQuestionsAnswers,
  callUnsubscribe,
  getGroupedFunds,
  clearGroupedFunds,
  resetSuccess,
  disableRspNotification,
  resetAmlaErrorObject,
  resetEmailOtpState,
  resetCancelPendingTrxState,
} from 'containers/ClientDetails/actions';
import { setAddFundsFlow } from 'containers/CompareFunds/actions';
import {
  reset as resetOnBoarding,
  getRiskProfiles,
  getAllFundsWithFundDetails,
  clearStatesForAddFund,
  clearRiskProfileType,
} from 'containers/OnBoarding/actions';
import Dialog from 'components/Dialog';
import Button from 'components/Button';
import Headline from 'containers/ClientDetails/Headline';
import ErrorModal from 'components/Kwsp/Modal/ErrorModal';
import GroupedButtons from 'components/Button/GroupedButtons';
import { RowGridLeft, RowGridSpaceBetween, ColumnGridCenter } from 'components/GridContainer';
import {
  makeSelectAllFundsWithDetails,
  makeSelectProcessingGetAllFundWithFundDetails,
  makeSelectIsQueryISAFAmlaError,
} from 'containers/OnBoarding/selectors';
import Modal from 'components/Modal';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
import 'containers/App/style/react-toast.css';

import RspNotificationCancelModal from './RspNotificationModal';
import { getAccountHolderType } from '../utils/getAccountHolderType';
import SortByAccountType from '../utils/sortByAccountType';
import TransactionActionButton from './TransactionActionButton';
import FundWrapper from './FundWrapper';
import {
  StyledSearch,
  Filter,
  StyledSelect,
  Container,
  AddFundsBtn,
  CancelTitleGrid,
  CancelImageGrid,
  CancelMessageGrid,
} from './styles';
import AddFundsBtnIcon from '../images/addBtn.svg';
import ActiveCashSchemeIcon from './assets/cash_scheme_white.svg';
import InActiveCashSchemeIcon from './assets/cash_scheme_blue.svg';
import ActiveKWSPSchemeIcon from './assets/KWSP_scheme_white.svg';
import InActiveKWSPSchemeIcon from './assets/KWSP_scheme_blue.svg';

import EmailSentIcon from '../images/email-sent.svg';
import IconWarning from '../images/icon-warning.png';
import CloseIcon from '../images/close.png';
import { HasSameRefNoIndexes, getAccountDetailsByFund } from './Utility';
import SuccessIcon from './assets/check.svg';
import QueryISAFAmlaErrorModal from './QueryISAFAmlaErrorModal';
import rspStatuses from '../../ClientDetails/TransactionModal/rspStatuses';
import onBoardingConstants from '../../OnBoarding/Utils/constants';
import CheckAgeEligibility from '../../ClientDetails/Profile/Utility/CheckAgeEligibility';
import CancelRspVerificationConfirmationModal from '../TransactionModal/VerificationOptionModal/CancelRspVerificationConfirmationModal';

const ViewByBtns = styled(GroupedButtons)`
  width: ${(props) => (props.width ? props.width : '200px')};
  background-color: ${(props) => (props.active ? '#007bba' : '#fff')};
  font-size: ${(props) => (props.active ? '11px' : '10px')};
  color: ${(props) => (props.active ? '#fff' : Color.C_LIGHT_BLUE)};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : '0px')};
  border-right: ${(props) => (props.borderRight ? props.borderRight : '')}; // to prevent double borders
  img {
    margin-right: 8px;
  }
  display: inline-block;
`;

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${(props) => props.btnBgColor};
  border: 1px solid ${Color.C_LIGHT_BLUE};
  margin-top: 32px;
  color: ${(props) => props.btnFontColor};
  font-family: ${defaultFont.primary.name};
  outline: none;
  cursor: pointer;
`;

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  }
`;

class Funds extends React.Component {
  toastIdError = null;
  toastIdSuccess = null;
  toastIdWarning = null;

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      selected: [],
      productbreakdown:
        !_isEmpty(props.clientDetails) && props.clientDetails.portfolio.length
          ? HasSameRefNoIndexes(props.clientDetails.portfolio, null, this.props.lov)
          : [],
      productbreakdownClone:
        !_isEmpty(props.clientDetails) && props.clientDetails.portfolio.length
          ? HasSameRefNoIndexes(props.clientDetails.portfolio, null, this.props.lov)
          : [],
      originalproductbreakdown: [],
      fundHasSameRefNo: [],
      currentEditingFundForRSP: null,
      selectedPeriod: 'All',
      searchFund: '',
      rspSuccessStatus: null,
      currentPage: 1,
      subscriptionModalShow: false,
      portfolioTransactionRequest: [],
      transRequestRedirect: '',
      toastShown: false,
      showModelRSP: false,
      selectedFundForRSP: null,
      isTxnDoneUsingOnlinePayment: null,
      showRSPDialog: false,
      openDialogCancelRSP: false,
      showDialogWarningRSP: false,
      messageDialogWarningRSP: '',
      schemeType: 'all',
      riskAssessmentModal: false,
      selectedAccount: '',
      toggleAccountSelection: false,
      isAddFundDisabled: false,
      toggleRspNotificationModal: false,
      toggleRspNotificationFundName: null,
      isCancelRspVerificationConfirmationModalOpen: false,
    };

    this.expand = this.expand.bind(this);
    this.select = this.select.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.addFundsForSelectedAccount = this.addFundsForSelectedAccount.bind(this);
    this.periodSelectionChange = this.periodSelectionChange.bind(this);
    this.searchFundChange = this.searchFundChange.bind(this);
    this.paginate = this.paginate.bind(this);
    this.handleCloseSubModal = this.handleCloseSubModal.bind(this);
    this.submitSetupRSP = this.submitSetupRSP.bind(this);
    this.handleCloseDialogEmailSentOnlinePayment = this.handleCloseDialogEmailSentOnlinePayment.bind(this);
    this.resendEmail = this.resendEmail.bind(this);
    this.toggleSetupRSP = this.toggleSetupRSP.bind(this);
    this.editRSP = this.editRSP.bind(this);
    this.handleCancelRSP = this.handleCancelRSP.bind(this);
    this.toggleDialogCancelRSP = this.toggleDialogCancelRSP.bind(this);
    this.toggleDialogWarningRSP = this.toggleDialogWarningRSP.bind(this);
    this.unCheckFundsAfterComplete = this.unCheckFundsAfterComplete.bind(this);
    this.setUpRsp = this.setUpRsp.bind(this);
    this.handleCloseEmailModal = this.handleCloseEmailModal.bind(this);
    this.handleSchemeType = this.handleSchemeType.bind(this);
    this.handleMultipleAccounts = this.handleMultipleAccounts.bind(this);
    this.handleriskAssessmentModal = this.handleriskAssessmentModal.bind(this);
    this.callUnSubscribeApi = this.callUnSubscribeApi.bind(this);
    this.callGetGroupedFunds = this.callGetGroupedFunds.bind(this);
    this.closeRspNotifications = this.closeRspNotifications.bind(this);
    this.closeDisableRspNotification = this.closeDisableRspNotification.bind(this);
    this.disableRspNotification = this.disableRspNotification.bind(this);
    this.toggleAccountSelection = this.toggleAccountSelection.bind(this);
    this.showAgeEligibilityPopUp = this.showAgeEligibilityPopUp.bind(this);
    this.handleOpenCancelRspVerificationConfirmationModal = this.handleOpenCancelRspVerificationConfirmationModal.bind(this);
    this.handleCloseCancelRspVerificationConfirmationModal = this.handleCloseCancelRspVerificationConfirmationModal.bind(this);
    this.checkDisabledStatusForAddFunds = this.checkDisabledStatusForAddFunds.bind(this);
    this.getEmailVerifiedIds = this.getEmailVerifiedIds.bind(this);
  }

  handleOpenCancelRspVerificationConfirmationModal() {
    this.setState({
      isCancelRspVerificationConfirmationModalOpen: true,
    });
  }

  handleCloseCancelRspVerificationConfirmationModal() {
    this.setState({
      isCancelRspVerificationConfirmationModalOpen: false,
    });
  }

  notifyError = (message) => {
    if (!toast.isActive(this.toastIdError)) {
      this.toastIdError = toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
        onClose: () => {
          this.clearReduxStateError();
        },
      });
    }
  };

  clearReduxStateError() {
    this.props.resetError();
  }

  notifySuccess = (message) => {
    if (!toast.isActive(this.toastIdSuccess)) {
      this.toastIdSuccess = toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  notifyWarning = (message) => {
    if (!toast.isActive(this.toastIdWarning)) {
      this.toastIdWarning = toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };
  componentDidMount() {
    this.props.clearRiskProfileType(); // clearing riskProfile which was selected in Add funds page.
    this.props.clearStatesForAddFund();
    // this.props.resetClientProfileData(); // need to clear the client data before fetching in order to avoid caching. will get better solution soon.
    const idParam = this.props.match.params.id;
    this.processUrlParam();
    const { clientDetails } = this.props;
    if (!_isEmpty(idParam)) {
      if (clientDetails && clientDetails.info) {
        const currentId = (clientDetails.info && clientDetails.info.id) || '';
        // eslint-disable-next-line eqeqeq
        if (currentId != idParam) {
          this.props.resetClientProfileData();
          // this.props.getCustomerDetails({ idParam, url: 'funds' });
        }
      }
    } else {
      this.notifyError('Unable to retrieve customer profile and portfolio due to invalid customer id');
    }
    if (_isEmpty(this.props.allFundsWithDetails)) {
      this.props.getAllFundsWithFundDetails();
    }
    this.props.resetAllocateFundStatus();
    this.props.showTxnOtpWindows(false);

    // if (this.props.isAmlaError) {
    //   this.props.handleResetAmlaErrorObject();
    // }
    this.props.handleResetEmailOtpState();
    this.props.handleResetCancelPendingTrxState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.retakeRiskAssessmentSuccess) {
      this.setState({ riskAssessmentModal: true });
    }

    if (this.props.retakeRiskAssessmentError) {
      this.setState({
        riskAssessmentModal: true,
        riskAssessmentError: true,
        riskAssessmentErrorMessage: this.props.retakeRiskAssessmentError,
      });
    }

    // if(nextProps.clientDetails){
    //   console.log('Is DB locked', this.state.isDBLocked, _isEmpty(nextProps.clientDetails), _isEmpty(nextProps.clientDetails.portfolio), this.props.processing);
    //     if ((_isEmpty(nextProps.clientDetails) || _isEmpty(nextProps.clientDetails.portfolio)) && !this.props.processing) {
    //       if (this.state.isDBLocked) {
    //         this.props.history.push('/clients');
    //       }
    //     }

    // }

    if (nextProps.setUpRspSuccess && !this.props.setUpRspSuccess) {
      this.toggleSetupRSP(true, this.props.rspDataObj);
      const productbreakdownClone = [...this.state.productbreakdown];
      this.props.rspDataObj.id.forEach((investmentProductId) => {
        productbreakdownClone.forEach((fund) => {
          if (investmentProductId === fund.investmentProductId) {
            fund.rspStatus = 'Pending';
          }
        });
      });
      this.setState({ isOpenDialogEmailSent: true, rspResError: false, productbreakdown: productbreakdownClone });
    }

    if (nextProps.editRspSuccess && !this.props.editRspSuccess) {
      this.toggleSetupRSP(true, this.props.fundIds);
      this.setState({ isOpenDialogEmailSent: true, rspResError: false, isEditRsp: true });
    }

    if (nextProps.terminateRspSuccess && !this.props.terminateRspSuccess) {
      // this.toggleSetupRSP(true, this.props.fundIds, true);
      this.setState({ isOpenDialogEmailSent: true, rspResError: false, isTerminate: true });
    }

    if (this.props.paymentSucceeded !== nextProps.paymentSucceeded && nextProps.paymentSucceeded) {
      this.setState({
        selected: [],
      });
    }

    if (nextProps.initTerminateRspOtpSuccessData) {
      this.setState({ showModalForTerminate: true });
    }

    if (
      !_isEmpty(nextProps.clientDetails) &&
      this.props.clientDetails !== nextProps.clientDetails &&
      !_isEmpty(nextProps.clientDetails.portfolio)
    ) {
      this.setState({
        productbreakdown: HasSameRefNoIndexes(nextProps.clientDetails.portfolio, null, this.props.lov),
        originalproductbreakdown: HasSameRefNoIndexes(nextProps.clientDetails.portfolio, null, this.props.lov),
      });
    }

    // if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
    if (!_isEmpty(nextProps.error)) {
      toast(nextProps.error);
      this.props.resetError();
      // this.props.history.replace('/clients');
    }

    if (!_isEmpty(nextProps.success)) {
      this.setState(
        {
          isDBLocked: true,
        },
        () => {
          this.notifyWarning(nextProps.success);
          this.props.resetSuccess();
          if (_isEmpty(nextProps.clientDetails) || _isEmpty(nextProps.clientDetails.portfolio)) {
            this.props.history.push('/clients');
          }
        },
      );
      // this.props.history.replace('/clients');
    }
    if (nextProps.otpError !== this.props.otpError && !_isEmpty(nextProps.otpError) && typeof nextProps.otpError === 'string') {
      toast(nextProps.otpError);
    }

    if (
      !_isEmpty(nextProps.clientDetails) &&
      nextProps.clientDetails !== this.props.clientDetails &&
      _isEmpty(_get(nextProps.clientDetails, ['info'], null))
    ) {
      this.props.history.replace('/clients');
    }

    if (nextProps.invalidCustomerID) {
      this.props.history.replace('/clients');
    }

    if (nextProps.transactionRequest !== undefined) {
      this.setState({
        transRequestRedirect: nextProps.transactionRequest,
      });
    }

    if (
      !this.props.errorCreatePaymentRequestWithDocAfterOtp &&
      nextProps.errorCreatePaymentRequestWithDocAfterOtp &&
      typeof nextProps.errorCreatePaymentRequestWithDocAfterOtp === 'string'
    ) {
      this.notifyError(nextProps.errorCreatePaymentRequestWithDocAfterOtp);
    }

    if (!this.props.isTxnDoneUsingOnlinePaymentSuccess && nextProps.isTxnDoneUsingOnlinePaymentSuccess) {
      this.setState(
        {
          isTxnDoneUsingOnlinePayment: true,
          openDialogEmailSentOnlinePayment: true,
        },
        () => {},
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.productbreakdown !== this.state.productbreakdown && this.props.fundIds) {
      // if (this.props.fundIds && this.props.fundIds.type === 'terminate') {
      //   const index = _findIndex(this.state.productbreakdown, ['investmentProductId', this.props.fundIds.id[0]]);
      //   this.setState({
      //     productbreakdown: update(this.state.productbreakdown, {
      //       [index]: { rspStatus: { $set: rspStatuses.terminationInProgress } },
      //     }),
      //   });
      // }
      // if (this.props.fundIds.type === 'edit') {
      //   const productbreakdownClone = [...this.state.productbreakdown];
      //   this.props.fundIds.id.forEach((id) => {
      //     const index = _findIndex(this.state.productbreakdown, ['investmentProductId', id]);
      //     productbreakdownClone[index].rspStatus = 'Edit Pending';
      //   });
      // }
      // if (this.props.fundIds.type === 'setUp') {
      //   const productbreakdownClone = [...this.state.productbreakdown];
      //   this.props.fundIds.id.forEach((id) => {
      //     const index = _findIndex(this.state.productbreakdown, ['investmentProductId', id]);
      //     productbreakdownClone[index].rspStatus = 'Pending';
      //   });
      // }
    }

    if (this.props.setUpRspFailureErr !== prevProps.setUpRspFailureErr && this.props.setUpRspFailureErr) {
      this.setState({ isOpenDialogEmailSent: true, rspResError: true, message: this.props.setUpRspFailureErr });
    }

    if (this.props.editRspFailureErr !== prevProps.editRspFailureErr && this.props.editRspFailureErr) {
      this.setState({ isOpenDialogEmailSent: true, rspResError: true, message: this.props.editRspFailureErr });
    }

    if (this.props.initTerminateRspOtpError !== prevProps.initTerminateRspOtpError && this.props.initTerminateRspOtpError) {
      this.setState({ isOpenDialogEmailSent: true, rspResError: true });
    }

    if (this.props.terminateRspFailureErr !== prevProps.terminateRspFailureErr && this.props.terminateRspFailureErr) {
      this.setState({
        isOpenDialogEmailSent: true,
        rspResError: true,
        message: this.props.terminateRspFailureErr,
        terminateErr: true,
      });
    }

    if (this.props.allTransactionOTPSuccess !== prevProps.allTransactionOTPSuccess && this.props.allTransactionOTPSuccess) {
      // this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
      setTimeout(() => {
        window.history.pushState('funds', 'Client Fund', `/clients/${this.props.match.params.id}/funds`);
      }, 5000);
    }
    // this.props.location.pathname.indexOf('funds/isTxnDoneUsingOnlinePayment') > 0
    if (
      this.state.transRequestRedirect &&
      this.state.transRequestRedirect.transactionRefPrefix !== undefined &&
      !this.state.isTxnDoneUsingOnlinePayment
    ) {
      this.props.clearTransactionRequest();
      if (this.toastIdSuccess === null) {
        switch (this.state.transRequestRedirect.transactionRefPrefix) {
          case 'T':
            this.notifySuccess('Fund topup submitted successfully');
            /* if (!toast.isActive(this.toastId)) {
              this.toastId = toast.success('Fund topup submitted successfully', {
                position: toast.POSITION.TOP_RIGHT,
                className: {},
                preventDuplicate: true,
              });
            } */
            break;
          case 'S':
            // if (!toast.isActive(this.toastId) && !this.state.doNotShowAnyToast) {
            this.notifySuccess('Fund subscription submitted successfully');
            /* if (!toast.isActive(this.toastId)) {
              this.toastId = toast.success('Fund subscription submitted successfully', {
                position: toast.POSITION.TOP_RIGHT,
                className: {},
                preventDuplicate: true,
              });
            } */
            break;
          default:
            break;
        }
      }
    }
  }

  componentWillUnmount() {
    // this.props.resetSwitchFundSuccess();
    // this.props.clearTransactionData();
    this.props.clearStateOfConfirmationEmailResent();
    this.props.resetPreviousDoneTxnPaymentType();
    this.props.clearTransactionRequest();
    this.props.clearRspOtpData();
  }

  unCheckFundsAfterComplete() {
    this.setState({ selected: [] });
  }

  handleriskAssessmentModal() {
    this.setState({ riskAssessmentModal: !this.state.riskAssessmentModal });
  }

  callUnSubscribeApi() {
    this.props.callUnsubscribe(this.props.selectedFund);
  }

  callGetGroupedFunds(fund) {
    this.props.getGroupedFunds(fund);
  }

  processUrlParam() {
    // redirect from fund transaction after onboarding in order to display message under the fund.
    if (this.props.location.pathname.indexOf('fromFundTransferAfterOnBoarding') > 0 && this.props.location.state) {
      /* this.setState({
        doNotShowAnyToast: true,
      }); */
      this.setState({
        investmentPartnerProductIdsFromSubscriptionAfterOnBoarding: this.props.location.state.investmentPartnerProductIds,
      });
    }

    if (!this.props.location) {
      // || !this.props.location.search) {
      return;
    }

    let isFundTransactionOtp = false;
    let isFundTransactionOtpSuccess = false;
    let type = '';
    let needToGetCustomerData = true;

    // check if it is switch fund otp return
    if (this.props.location.pathname.indexOf('funds/switchfund') > 0) {
      isFundTransactionOtp = true;
      type = 'switch';

      if (this.props.location.pathname.indexOf('funds/switchfund/otpy') > 0) {
        isFundTransactionOtpSuccess = true;

        /*
        toast.success('Fund switching submitted successfully', {
          position: toast.POSITION.TOP_RIGHT,
          className: {},
        });
        */

        this.notifySuccess('Fund switching submitted successfully');
      }

      if (this.props.location.pathname.indexOf('funds/switchfund/otpn') > 0) {
        isFundTransactionOtpSuccess = false;
        this.notifyError('You have entered an invalid OTP');
      }
    }

    // check if it is switch fund otp return
    if (this.props.location.pathname.indexOf('funds/redeemfund') > 0) {
      isFundTransactionOtp = true;

      if (this.props.location.pathname.indexOf('funds/redeemfund/otpy') > 0) {
        isFundTransactionOtpSuccess = true;
        type = 'redeem';
        /*
        toast.success('Fund redemption submitted successfully', {
          position: toast.POSITION.TOP_RIGHT,
          className: {},
        });
        */
        this.notifySuccess('Fund redemption submitted successfully');
      }

      if (this.props.location.pathname.indexOf('funds/redeemfund/otpn') > 0) {
        isFundTransactionOtpSuccess = false;
        this.notifyError('You have entered an invalid OTP');
      }
    }

    // check if it is switch fund otp return
    if (this.props.location.pathname.indexOf('funds/topupfund') > 0) {
      isFundTransactionOtp = true;
      type = 'topup';

      if (this.props.location.pathname.indexOf('funds/topupfund/otpy') > 0) {
        isFundTransactionOtpSuccess = true;

        // toast.success('Fund topup submitted successfully', {
        //   position: toast.POSITION.TOP_RIGHT,
        //   className: {},
        // });
      }

      if (this.props.location.pathname.indexOf('funds/topupfund/otpn') > 0) {
        isFundTransactionOtpSuccess = false;
        this.notifyError('You have entered an invalid OTP');
      }

      // if (this.props.isTxnDoneUsingOnlinePayment && !this.props.errorCreatePaymentRequestWithDocAfterOtp) {
      if (this.props.isTxnDoneUsingOnlinePaymentSuccess) {
        needToGetCustomerData = false;
        this.setState(
          {
            isTxnDoneUsingOnlinePayment: true,
            openDialogEmailSentOnlinePayment: true,
          },
          () => {},
        );
      } else {
        this.setState(
          {
            isTxnDoneUsingOnlinePayment: false,
            openDialogEmailSentOnlinePayment: false,
          },
          () => {},
        );
      }
    }

    const locationSearch = this.props.location.search;

    const urlParams = locationSearch.split('?');

    if (isFundTransactionOtp && locationSearch) {
      const queryParam = urlParams[1].split('=')[1];
      if (isFundTransactionOtpSuccess) {
        needToGetCustomerData = false;
        this.props.execAfterOTPFundTransactionSuccess({ queryParam, type });
      } else {
        this.props.execAfterOTPFundTransactionFail(queryParam);
      }
    }

    if (this.props.location.pathname.indexOf('funds/isTxnDoneUsingOnlinePayment') > 0) {
      needToGetCustomerData = false;
      this.setState(
        {
          isTxnDoneUsingOnlinePayment: true,
          openDialogEmailSentOnlinePayment: true,
        },
        () => {
          this.props.resetPreviousDoneTxnPaymentType();
        },
      );
      /*
      setTimeout(() => {
        window.history.pushState('funds', 'Client Fund', `/clients/${this.props.match.params.id}/funds`);
      }, 5000);
      */
    }

    if (needToGetCustomerData) {
      const idParam = this.props.match.params.id;
      const { clientDetails } = this.props;
      if (!_isEmpty(idParam)) {
        // if (_isEmpty(clientDetails) || _isEmpty(clientDetails.info) || _isEmpty(clientDetails.portfolio))
        this.props.getCustomerDetails({ idParam, url: 'funds' });
      } else {
        this.notifyError('Unable to retrieve customer profile and portfolio due to invalid customer id');
      }
    }

    if (this.props.location.pathname.indexOf('funds/rsp/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const tokenForSetUpRsp = urlParams[1].split('=')[1];
      this.props.setUpRsp({
        tokenForSetUpRsp,
      });
    }
    if (this.props.location.pathname.indexOf('funds/rsp/otpn') > 0) {
      this.notify('Otp failed!');
    }

    if (this.props.location.pathname.indexOf('funds/edit-rsp/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const token = urlParams[1].split('=')[1];
      // const refNo = this.props.rspRefNo;
      this.props.editRsp({ token });
    }
    if (this.props.location.pathname.indexOf('funds/edit-rsp/otpn') > 0) {
      this.notify('Otp failed!');
    }

    if (this.props.location.pathname.indexOf('funds/terminateRsp/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const token = urlParams[1].split('=')[1];
      // const refNo = this.props.rspRefNo;
      this.props.terminateRsp({ token });
    }
    if (this.props.location.pathname.indexOf('funds/terminateRsp/otpn') > 0) {
      this.notify('Otp failed!');
    }

    setTimeout(() => {
      window.history.pushState('funds', 'Client Fund', `/clients/${this.props.match.params.id}/funds`);
    }, 3500);
  }

  getProductPortfolio() {
    const productIds = [];
    let cashIndex;
    if (this.props.clientDetails.portfolio) {
      cashIndex = _findIndex(this.props.clientDetails.portfolio, ['partnerAccountType', 'CS']);
      if (cashIndex !== -1 && this.state.clientDetails && this.state.clientDetails.portfolio[cashIndex].length) {
        this.state.clientDetails.portfolio[cashIndex].productbreakdown.forEach((item) => {
          productIds.push(item.investmentProductId);
        });
      }
    }

    return { productIds, cashIndex };
  }

  showAgeEligibilityPopUp() {
    this.setState({
      isNotELigible: !this.state.isNotELigible,
    });
  }

  addFunds() {
    const { info, portfolio } = this.props.clientDetails;

    const { id } = this.props.match.params;
    const cashIndex = _findIndex(
      info.account,
      (accountType) => accountType.UTRACCOUNTTYPE === 'CS' || accountType.UTRACCOUNTTYPE === 'KW',
    );

    if (cashIndex !== -1) {
      const mobileFormat = /^[+]?[0-9- ]+$/;
      if (!info.account[cashIndex].AccMobileNo || !info.account[cashIndex].AccMobileNo.match(mobileFormat)) {
        toast.error("Please update the Client's Mobile Number to continue with transactions", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    }

    if (portfolio && portfolio.length > 1) {
      // this.setState({ toggleAccountSelection: true, cashAccounts: cashAccounts });
      this.setState({ toggleAccountSelection: true });
    } else if (portfolio) {
      const cashIndex = _findIndex(info.account, (accountType) => accountType.UTRACCOUNTTYPE === 'CS');
      const kwspIndex = _findIndex(info.account, (accountType) => accountType.UTRACCOUNTTYPE === 'KW');
      if (info.account[0].UTRACCOUNTTYPE === 'CS') {
        this.addFundsRedirect(cashIndex, id);
      } else if (CheckAgeEligibility(info.birthDate) >= 55) {
        this.showAgeEligibilityPopUp();
      } else {
        this.addFundsRedirect(kwspIndex, id);
      }
    } else {
      this.props.history.push(`/clients/${id}/add-funds/create`);
    }
  }

  addFundsRedirect(cashIndex, id) {
    this.props.history.push(`/clients/${id}/add-funds/${this.props.clientDetails.portfolio[cashIndex].id}`, {
      portfolio: this.props.clientDetails.portfolio[cashIndex].productbreakdown
        ? this.props.clientDetails.portfolio[cashIndex].productbreakdown
        : [],
      accountType: this.props.clientDetails.info.account[cashIndex].UTRACCOUNTTYPE,
    });
  }

  addFundsForSelectedAccount() {
    const { id } = this.props.match.params;
    const { info, portfolio } = this.props.clientDetails;
    const selectedIndex = _findIndex(portfolio, ['accountId', this.state.selectedAccount]);
    this.toggleAccountSelection();
    if (this.props.clientDetails.portfolio) {
      if (this.state.selectedAccountType === 'KW') {
        if (CheckAgeEligibility(info.birthDate) >= 55) {
          this.showAgeEligibilityPopUp();
          return;
        }
      }
      this.addFundsRedirect(selectedIndex, id);
    } else {
      this.props.history.push(`/clients/${id}/add-funds/create`);
    }
  }

  periodSelectionChange(e) {
    if (e.target.value !== this.state.selectedPeriod) {
      this.setState({
        selectedPeriod: e.target.value,
      });
      if (this.state.productbreakdown !== []) {
        switch (e.target.value) {
          case 'Recent': {
            this.state.productbreakdown.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
            break;
          }
          case 'AccountType': {
            this.setState({
              productbreakdown: SortByAccountType(this.state.productbreakdown, this.props.clientDetails.info.account),
            });
            break;
          }
          default: {
            this.state.productbreakdown.sort((a, b) => new Date(a.modifiedAt) - new Date(b.modifiedAt));
            break;
          }
        }
      }
    }
  }

  handleSchemeType(schemeType) {
    this.setState({ schemeType }, () => {
      const filteredProductBreakDown = HasSameRefNoIndexes(this.props.clientDetails.portfolio, schemeType, this.props.lov);
      this.setState({ productbreakdown: filteredProductBreakDown, currentPage: 1 });
      window.scrollTo(0, 80);
    });
  }

  searchFundChange(e) {
    const value = e.target.value;
    this.setState({
      searchFund: value,
    });
    let clientFunds = this.state.originalproductbreakdown;
    if ((!clientFunds || clientFunds.length < 1) && this.props.clientDetails && this.props.clientDetails.portfolio) {
      clientFunds = this.props.clientDetails.portfolio.productbreakdown;
    }
    if (value && value.trim() !== '') {
      const searchResult = [];
      _forEach(clientFunds, (item) => {
        const currentValue = value.trim().toLowerCase();

        const isFoundByName = item.fund && item.fund.name && item.fund.name.toLowerCase().includes(currentValue);
        const isFoundByFundCode = item.fund && item.fund.fundcode && item.fund.fundcode.includes(currentValue);

        if (isFoundByName || isFoundByFundCode) {
          // if (item.fund && item.fund.name && item.fund.name.toLowerCase().indexOf(value.trim().toLowerCase()) > -1) {
          searchResult.push(item);
        }
      });
      this.setState({
        productbreakdown: searchResult,
      });
    } else {
      // const temporiginalproductbreakdown = this.state.originalproductbreakdown;
      this.setState({
        productbreakdown: clientFunds,
      });
    }
  }

  paginate(current) {
    this.setState({
      currentPage: current,
    });
    window.scrollTo(0, 80);
  }

  expand(item) {
    if (item) {
      const index = _findIndex(this.state.productbreakdown, {
        partnerProductId: item.partnerProductId,
        partnerAccountNo: item.partnerAccountNo,
        pid: item.pid,
      });
      const productbreakdownClone = this.state.productbreakdown.map((fundItem) => ({
        ...fundItem,
        // expanded: false,
      }));
      productbreakdownClone[index] = {
        ...productbreakdownClone[index],
        expanded: !productbreakdownClone[index].expanded,
      };
      this.setState({
        productbreakdown: productbreakdownClone,
      });
    }
  }

  handleCloseSubModal() {
    this.setState({
      subscriptionModalShow: false,
    });
  }

  handleCloseEmailModal() {
    this.setState({ isOpenDialogEmailSent: false }, () => {
      window.location.reload();
      this.props.clearRspOtpData();
    });
  }

  submitSetupRSP(RSPObject) {
    console.info('submitSetupRSP', RSPObject);
  }

  handleCloseDialogEmailSentOnlinePayment() {
    this.setState(
      {
        openDialogEmailSentOnlinePayment: false,
        // isTxnDoneUsingOnlinePayment: false // need to remain true for fundwrapper
      },
      () => {
        window.location.reload();
        this.props.resetPreviousDoneTxnPaymentType();
        this.props.clearTransactionRequest();
      },
    );
  }

  getEmailVerifiedIds() {
    const { portfolio } = this.props.clientDetails;
    const emailVerifyIds = portfolio.map((portfolioItem) => portfolioItem.emailVerify || []);
    let structuredEmailVerifyIds = [];
    for (const value of emailVerifyIds) {
      if (value.length) structuredEmailVerifyIds = [...structuredEmailVerifyIds, ...value.map((item) => item)];
    }
    return structuredEmailVerifyIds || [];
  }

  resendEmail() {
    this.props.resendConfirmationEmail(null);
  }

  renderFundList(isSuspended) {
    let currentPage = this.state.currentPage;
    if (this.state.productbreakdown && this.state.productbreakdown.length <= 12) {
      currentPage = 1;
    }
    const arr = [];
    this.state.productbreakdown &&
      this.state.productbreakdown
        .filter((data) => !(data.status === 'resubscribe' && data.totalPurchase === null))
        .forEach((item, index) => {
          if (index >= (currentPage - 1) * 12 && index < currentPage * 12) {
            arr.push(
              <div key={item.pid} id={item.pid}>
                <FundWrapper
                  isSuspended={isSuspended}
                  transactionRequest={this.state.portfolioTransactionRequest}
                  expand={this.expand}
                  select={this.select}
                  data={item}
                  rspSuccessId={this.state.rspSuccessId}
                  setUpRsp={this.setUpRsp}
                  selected={this.state.selected}
                  key={item.investmentProductId}
                  dataTransaction={this.props.dataTransaction}
                  toggleModelRSP={this.toggleModelRSP}
                  isTxnDoneUsingOnlinePayment={this.state.isTxnDoneUsingOnlinePayment}
                  investmentPartnerProductIdsFromSubscriptionAfterOnBoarding={
                    this.state.investmentPartnerProductIdsFromSubscriptionAfterOnBoarding
                  }
                  accountDetails={this.props.clientDetails.info}
                  emailVerifiedIds={this.getEmailVerifiedIds()}
                  toggleSetupRSP={this.toggleSetupRSP}
                  showRSPDialog={this.state.showRSPDialog}
                  editRSP={this.editRSP}
                  toggleDialogCancelRSP={this.toggleDialogCancelRSP}
                  schemeType={this.state.schemeType}
                  callUnSubscribeApi={this.callUnSubscribeApi}
                  unSubscribedFund={this.props.unSubscribedFund}
                  callGetGroupedFunds={this.callGetGroupedFunds}
                  groupedFunds={this.props.groupedFunds}
                  unsubscribeModal={this.props.unsubscribeModal}
                  clearGroupedFunds={this.props.clearGroupedFunds}
                  selectedFund={this.props.selectedFund}
                  accountSelected={this.state.accountSelected}
                  rspNotificationDisabled={item.rspNotificationDisabled}
                  closeRspNotifications={this.closeRspNotifications}
                />
              </div>,
            );
          }
        });
    return arr;
  }

  setUpRsp(fund) {
    const { info } = this.props.clientDetails;
    const cashFundIndex = _findIndex(info.account, ['partnerAccountMappingId', fund.partnerAccountNo]);
    const cashFunds = info.account.filter((item) => item.UTRACCOUNTTYPE === 'CS');
    let isEmailVerified = false;
    let isEmailExist;
    for (let i = 0; i < cashFunds.length; i++) {
      if (cashFunds[i].isEmailVerified) {
        isEmailVerified = true;
        break;
      }
    }
    for (let i = 0; i < cashFunds.length; i++) {
      if (cashFunds[i].AccEmail.length) {
        isEmailExist = true;
        break;
      }
    }
    if (!isEmailExist) {
      toast.error("Please update the Client's Email Address to continue with transactions.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!isEmailVerified) {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Please verify your email first!',
      }));
      return;
    }
    if (info.account[cashFundIndex].AccountStatus !== 'A') {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Your account is not active!',
      }));
      return;
    }
    this.setState((prevState) => ({
      showRSPDialog: !prevState.showRSPDialog,
      currentSetUpRsp: !prevState.currentSetUpRsp,
      currentSetUpRspData: [fund],
    }));
  }

  toggleSetupRSP(isSuccess, rspSuccessIds, isTerminate) {
    const { selected, currentSetUpRspData, currentEditingFundForRSP } = this.state;
    const fund = selected.length ? selected : currentSetUpRspData || currentEditingFundForRSP;
    const selectedFund = fund && fund.length && getAccountDetailsByFund(fund[0], this.props.clientDetails.info.account);
    if (this.state.selected.length > 3) {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Please select a maximum of 3 funds to perform regular saving plan!',
      }));
      return;
    }
    if (selectedFund && !selectedFund.isEmailVerified) {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Please verify your email first!',
      }));
      return;
    }
    if (selectedFund && selectedFund.AccountStatus !== 'A') {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Your account is not active!',
      }));
      return;
    }
    if (isSuccess && rspSuccessIds && Object.keys(rspSuccessIds).length > 0) {
      if (isTerminate) {
        const index = _findIndex(this.state.productbreakdown, ['investmentProductId', rspSuccessIds.id[0]]);
        // console.log(index, this.state.productbreakdown);
        this.setState({
          productbreakdown: update(this.state.productbreakdown, {
            [index]: { rspStatus: { $set: rspStatuses.terminationInProgress } },
          }),
          showRSPDialog: false,
          rspSuccessId: rspSuccessIds,
        });
      } else {
        this.setState(
          (prevState) => ({
            showRSPDialog: false,
            rspSuccessId: rspSuccessIds,
          }),
          () => {
            if (!this.state.showRSPDialog) {
              this.setState({
                currentEditingFundForRSP: null,
                currentSetUpRsp: null,
                currentSetUpRspData: null,
                selected: [],
              });
            }
          },
        );
      }
    } else {
      this.setState(
        (prevState) => ({
          showRSPDialog: !prevState.showRSPDialog,
        }),
        () => {
          if (!this.state.showRSPDialog) {
            this.setState({
              currentEditingFundForRSP: null,
              currentSetUpRsp: null,
              currentSetUpRspData: null,
              selected: [],
            });
          }
        },
      );
    }
  }

  editRSP(fund) {
    const { info } = this.props.clientDetails;
    const cashFundIndex = _findIndex(info.account, ['partnerAccountMappingId', fund.partnerAccountNo]);
    const cashFunds = info.account.filter((item) => item.UTRACCOUNTTYPE === 'CS');
    let isEmailVerified = false;
    let isEmailExist;
    for (let i = 0; i < cashFunds.length; i++) {
      if (cashFunds[i].isEmailVerified) {
        isEmailVerified = true;
        break;
      }
    }
    for (let i = 0; i < cashFunds.length; i++) {
      if (cashFunds[i].AccEmail.length) {
        isEmailExist = true;
        break;
      }
    }
    if (!isEmailExist) {
      toast.error("Please update the Client's Email Address to continue with transactions.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!isEmailVerified) {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Please verify your email first!',
      }));
      return;
    }
    if (info.account[cashFundIndex].AccountStatus !== 'A') {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Your account is not active!',
      }));
      return;
    }
    const fundsForEditable = [];
    fundsForEditable.push(fund);
    if (fund.hasSameRefNoIndexs && fund.hasSameRefNoIndexs.length > 0) {
      fund.hasSameRefNoIndexs.forEach((index) => {
        fundsForEditable.push(this.state.productbreakdown[index]);
      });
    }
    const fundsHasCompleted = fundsForEditable.filter((fund) => fund.rspStatus === 'Completed');
    this.setState((prevState) => ({
      showRSPDialog: !prevState.showRSPDialog,
      currentEditingFundForRSP: fundsHasCompleted,
      currentSetUpRsp: null,
      selected: [],
    }));
  }

  select(item) {
    const selectedArray = [...this.state.selected];
    const productbreakdownClone = [...this.state.productbreakdown];
    if (!selectedArray.length || selectedArray[0].accountType === item.accountType) {
      const indexInSelected = _findIndex(this.state.selected, {
        partnerProductId: item.partnerProductId,
        partnerAccountNo: item.partnerAccountNo,
      });

      if (indexInSelected > -1) {
        selectedArray.splice(indexInSelected, 1);
      } else {
        selectedArray.push(item);
        const accountNo = selectedArray[0].partnerAccountNo;
        productbreakdownClone.forEach((item) => {
          if (item.partnerAccountNo !== accountNo) {
            item.hasDisabled = true;
          }
        });
      }
    }

    if (selectedArray.length === 0) {
      productbreakdownClone.forEach((item) => {
        item.hasDisabled = false;
      });
    }

    this.setState({
      selected: selectedArray,
      productbreakdown: productbreakdownClone,
      isAddFundDisabled: selectedArray.length,
      accountSelected: selectedArray.length > 0 ? selectedArray[0].partnerAccountNo : null, // Doesnot matter which index we consider since all the indexes will have the same account type
    });
  }

  toggleDialogCancelRSP(fund) {
    const { info } = this.props.clientDetails;
    let cashFundIndex;
    if (fund) {
      cashFundIndex = _findIndex(info.account, ['partnerAccountMappingId', fund.partnerAccountNo]);
    } else {
      cashFundIndex = _findIndex(info.account, [
        'partnerAccountMappingId',
        this.state.currentCancellingFundForRSP.partnerAccountNo,
      ]);
    }

    const cashFunds = info.account.filter((item) => item.UTRACCOUNTTYPE === 'CS');
    let isEmailVerified = false;
    let isEmailExist;
    for (let i = 0; i < cashFunds.length; i++) {
      if (cashFunds[i].isEmailVerified) {
        isEmailVerified = true;
        break;
      }
    }
    for (let i = 0; i < cashFunds.length; i++) {
      if (cashFunds[i].AccEmail.length) {
        isEmailExist = true;
        break;
      }
    }
    if (!isEmailExist) {
      toast.error("Please update the Client's Email Address to continue with transactions.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!isEmailExist) {
      toast.error("Please update the Client's Email Address to continue with transactions.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!isEmailVerified) {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Please verify your email first!',
      }));
      return;
    }

    if (info.account[cashFundIndex].AccountStatus !== 'A') {
      this.setState((prevState) => ({
        showDialogWarningRSP: true,
        messageDialogWarningRSP: 'Your account is not active!',
      }));
      return;
    }
    this.setState(
      (prevState) => ({
        openDialogCancelRSP: !prevState.openDialogCancelRSP,
      }),
      () => {
        let currentCancellingFundForRSP;

        if (!this.state.openDialogCancelRSP) {
          currentCancellingFundForRSP = null;
        } else {
          currentCancellingFundForRSP = fund;
        }

        this.setState({
          currentCancellingFundForRSP,
        });
      },
    );
  }

  handleCancelRSP(selectedVerificationOption) {
    const { currentCancellingFundForRSP } = this.state;

    const reqPayload = {};
    reqPayload.rspRefNo = currentCancellingFundForRSP.rspRefNo;
    reqPayload.fundCode = currentCancellingFundForRSP.partnerProductId;
    reqPayload.customerId = currentCancellingFundForRSP.customerId;
    reqPayload.maxAmount = currentCancellingFundForRSP.rspMaxAmount;
    reqPayload.accountId = currentCancellingFundForRSP.partnerAccountNo;
    const payload = {};
    payload.reqPayload = reqPayload;
    payload.fundIds = { id: [currentCancellingFundForRSP.investmentProductId], type: 'terminate' };
    this.setState(
      {
        openDialogCancelRSP: !this.state.openDialogCancelRSP,
      },
      () => {
        this.props.initTerminateRspOtp(payload, selectedVerificationOption);
      },
    );
  }

  toggleDialogWarningRSP() {
    this.setState((prevState) => ({
      showDialogWarningRSP: !prevState.showDialogWarningRSP,
    }));
  }

  handleMultipleAccounts(accountType, accountId) {
    this.setState({ selectedAccount: accountId, selectedAccountType: accountType });
  }

  closeRspNotifications(customerId, investProductName, investmentProductId) {
    this.setState({
      toggleRspNotificationModal: true,
      toggleRspNotificationFundName: investProductName,
      toggleRspNotificationCustomerId: customerId,
      toggleRspNotificationFundId: investmentProductId,
    });
  }

  closeDisableRspNotification() {
    this.setState({
      toggleRspNotificationModal: false,
    });
  }
  disableRspNotification() {
    const customerId = this.state.toggleRspNotificationCustomerId;
    const investProductName = this.state.toggleRspNotificationFundName;
    const investmentProductId = this.state.toggleRspNotificationFundId;
    this.setState(
      {
        toggleRspNotificationModal: false,
      },
      () => {
        this.props.disableRspNotification({ customerId, investmentProductId });
      },
    );
  }

  checkEmis(accountItem) {
    return accountItem.UTRACCOUNTTYPE === 'KW' && accountItem.isEmis;
  }

  toggleAccountSelection() {
    this.setState({ toggleAccountSelection: !this.state.toggleAccountSelection });
  }

  checkDisabledStatusForAddFunds() {
    const {
      clientDetails: {
        info: { account },
      },
    } = this.props;
    let flag = false;
    if (account.length === 1) {
      flag = account[0].AccountStatus === 'S';
    }
    return flag;
  }

  render() {
    const { clientDetails, processing, allFundsWithDetails, lov, isQueryISAFAmlaError } = this.props;
    if (_isEmpty(clientDetails) || _isEmpty(clientDetails.portfolio)) return <LoadingOverlay show={processing} />;
    const { portfolio, info } = clientDetails;
    const hasConfirmendOrders = true; //! _isEmpty(this.state.originalproductbreakdown);
    const cashPortfolioIndex = _findIndex(portfolio, ['partnerAccountType', 'CS']);
    const cashAccountIndex = _findIndex(info.account, ['UTRACCOUNTTYPE', 'CS']);
    const { ageErrorMessage } = onBoardingConstants;
    let isCashAccountSuspended = false;

    let isFundDisabled;

    const cashFunds = portfolio.filter((item) => item.partnerAccountType === 'CS');
    if (cashFunds.length > 1) {
      portfolio.forEach((item) => {
        if (item.status === 'active') isCashAccountSuspended = false;
      });
    } else if (cashPortfolioIndex !== -1 && cashAccountIndex !== -1) {
      if (info.account[cashAccountIndex].AccountStatus === 'S' || portfolio[cashPortfolioIndex].status === 'suspended') {
        isCashAccountSuspended = true;
      }
    }
    if (isCashAccountSuspended) {
      isFundDisabled = true;
    }

    // disabling when the account is exprired
    const assessmentDate = info.ISAF_PERFORMANCE_DATE;
    const currentDate = moment(new Date());
    const diff = currentDate.diff(assessmentDate, 'months', true);
    if (
      diff >= 12 ||
      !info.ISAF_SCORE ||
      info.ISAF_SCORE === '' ||
      !info.ISAF_PERFORMANCE_DATE ||
      info.ISAF_PERFORMANCE_DATE === ''
    ) {
      isFundDisabled = true;
    }

    // Disabling for single cash account which has disable holder class
    const cashAccounts = portfolio && portfolio.filter((item) => item.partnerAccountType === 'CS');
    if (portfolio && portfolio.length === 1 && cashAccounts && cashAccounts.length === 1) {
      let disabledHolderClassArr = [];
      let disabledHolderClass = [];
      if (lov && lov.Dictionary) {
        disabledHolderClassArr = lov.Dictionary.find((item) => item.id == 32);
        disabledHolderClass = disabledHolderClassArr ? disabledHolderClassArr.datadictionary.map((item) => item.codevalue) : [];
      }
      // if (disabledHolderClass && disabledHolderClass.includes(cashAccounts[0].partnerHolderClass)) {
      //   isFundDisabled = true;
      // }
    }

    // Disabling Add funds for single eMis KWSP Account
    const kwspAccounts = info.account && info.account.filter((item) => item.UTRACCOUNTTYPE === 'KW');
    if (kwspAccounts && kwspAccounts.length === 1 && kwspAccounts.isEmis) {
      isFundDisabled = true;
    }

    // after submiting editing profile, info.account is getting converted to obj
    let convertedAcc = [];
    if (info && !Array.isArray(info.account)) {
      const account = [];
      Object.keys(info.account).forEach((item) => {
        account.push(info.account[item]);
      });
      convertedAcc = {
        ...info,
        account,
      };
    } else {
      convertedAcc = { ...info };
    }

    return (
      <React.Fragment>
        <LoadingOverlay show={processing} />
        <RspNotificationCancelModal
          disableRspNotification={this.disableRspNotification}
          closeDisableRspNotification={this.closeDisableRspNotification}
          open={this.state.toggleRspNotificationModal}
          fundName={this.state.toggleRspNotificationFundName}
        />
        <Headline
          lov={lov}
          clientDetails={clientDetails}
          id={this.props.match.params.id}
          // locationUrl={this.props.location.pathname}
          resendConfirmationEmailToClient={this.resendEmail}
          messageResentConfirmationEmailStatus={this.props.messageResentConfirmationEmailStatus}
          clearStateOfConfirmationEmailResent={this.props.clearStateOfConfirmationEmailResent}
          isProfilePage={false}
          retakeQuestions={this.props.getRiskQuestionsAnswers}
          getRiskProfiles={this.props.getRiskProfiles}
        />
        <ErrorModal msg={ageErrorMessage} handleClose={this.showAgeEligibilityPopUp} open={this.state.isNotELigible} showClose />
        <Container>
          <RowGridSpaceBetween>
            <Grid item xs={10} alignItems="flex-start" style={{ display: 'flex' }}>
              {hasConfirmendOrders && (
                <RowGridLeft>
                  <Grid item xs={3} lg={4} style={{ paddingBottom: '10px', paddingRight: '10px' }}>
                    <StyledSearch
                      value={this.state.searchFund}
                      width="100%"
                      placeholder="Search Funds..."
                      onChange={this.searchFundChange}
                    />
                  </Grid>
                  <Grid item xs={9} lg={8}>
                    <Filter style={{ marginLeft: '8px' }}>
                      <Text className="label">View By</Text>
                      <Hidden mdUp implementation="css">
                        <StyledSelect onChange={(e) => this.handleSchemeType(e.target.value)} value={this.state.schemeType}>
                          <MenuItem value="all">All Scheme</MenuItem>
                          <MenuItem value="CS">Cash Scheme</MenuItem>
                          <MenuItem value="KW">KWSP Scheme</MenuItem>
                        </StyledSelect>
                      </Hidden>
                      <Hidden smDown implementation="css">
                        <Grid item style={{ marginLeft: '16px', marginRight: '21px' }}>
                          <ViewByBtns
                            active={this.state.schemeType === 'all'}
                            width="50px"
                            borderRadius="5px 0px 0px 5px"
                            onClick={() => {
                              this.handleSchemeType('all');
                            }}
                            borderRight="none">
                            ALL
                          </ViewByBtns>
                          <ViewByBtns
                            onClick={() => {
                              this.handleSchemeType('CS');
                            }}
                            active={this.state.schemeType === 'CS'}
                            width="112px"
                            borderRight="none">
                            <img
                              src={this.state.schemeType === 'CS' ? ActiveCashSchemeIcon : InActiveCashSchemeIcon}
                              alt="Add Funds"
                            />
                            CASH SCHEME
                          </ViewByBtns>
                          <ViewByBtns
                            onClick={() => {
                              this.handleSchemeType('KW');
                            }}
                            active={this.state.schemeType === 'KW'}
                            width="113px"
                            borderRadius="0px 5px 5px 0px">
                            <img
                              src={this.state.schemeType === 'KW' ? ActiveKWSPSchemeIcon : InActiveKWSPSchemeIcon}
                              alt="Add Funds"
                            />
                            KWSP SCHEME
                          </ViewByBtns>
                        </Grid>
                      </Hidden>

                      <Text className="label">Sort By</Text>
                      <StyledSelect onChange={this.periodSelectionChange} value={this.state.selectedPeriod}>
                        <MenuItem value="Recent">Most Recent</MenuItem>
                        <MenuItem value="All">All Funds</MenuItem>
                        <MenuItem value="AccountType">Account Type</MenuItem>
                      </StyledSelect>
                    </Filter>
                  </Grid>
                </RowGridLeft>
              )}
            </Grid>
            <Grid item xs={2} style={{ display: 'flex' }} justify="flex-end" alignItems="flex-start">
              <AddFundsBtn
                onClick={this.addFunds}
                disabled={this.checkDisabledStatusForAddFunds() || this.props.isRiskAssessmentExpired}>
                <img src={AddFundsBtnIcon} alt="Add Funds" />
                Add Funds
              </AddFundsBtn>
            </Grid>
          </RowGridSpaceBetween>
          {this.renderFundList(isFundDisabled)}
          {!_isEmpty(this.state.productbreakdown) && (
            <ColumnGridCenter>
              <Pagination
                current={this.state.currentPage}
                count={
                  this.state.productbreakdown.filter((data) => !(data.status === 'resubscribe' && data.totalPurchase === null))
                    .length
                }
                onChange={this.paginate}
              />
            </ColumnGridCenter>
          )}
          {_isEmpty(this.state.productbreakdown) && (
            <ColumnGridCenter style={{ marginTop: '26px' }}>
              <Text>No available data.</Text>
            </ColumnGridCenter>
          )}
        </Container>
        <TransactionActionButton
          data={this.state.currentSetUpRsp ? this.state.currentSetUpRspData : this.state.selected}
          portfolio={portfolio}
          currentSetUpRsp={this.state.currentSetUpRsp}
          unCheckFundsAfterComplete={this.unCheckFundsAfterComplete}
          clientDetails={clientDetails}
          allFunds={allFundsWithDetails}
          subscribeButtonClick={(val) => {
            this.setState({ portfolioTransactionRequest: val, transType: 'subscribe' });
          }}
          isAddFundDisabled={this.state.isAddFundDisabled}
          resetEmailSentForOnlinePaymentDialog={() =>
            this.setState({
              isTxnDoneUsingOnlinePayment: false,
              openDialogEmailSentOnlinePayment: false,
            })
          }
          toggleSetupRSP={this.toggleSetupRSP}
          showRSPDialog={this.state.showRSPDialog}
          currentEditingFundForRSP={this.state.currentEditingFundForRSP}
          // isTxnDoneUsingOnlinePayment={this.state.isTxnDoneUsingOnlinePayment}
          unSubscribedFund={this.props.unSubscribedFund}
        />

        {/* {this.state.isTxnDoneUsingOnlinePayment && !_isEmpty(clientDetails) && !_isEmpty(clientDetails.portfolio) && ( */}
        <Modal
          width={600}
          height={600}
          open={this.state.openDialogEmailSentOnlinePayment}
          handleClose={() => this.handleCloseDialogEmailSentOnlinePayment()}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
              <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                <img src={EmailSentIcon} alt="email" />
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
                  {this.props.clientDetails.info.account[0].AccEmail}
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="14px">Please be informed that the payment link will expire in 48 hrs.</Text>
              </Grid>
            </Grid>
          </Grid>
        </Modal>

        <Modal
          width={600}
          height={600}
          open={this.state.openDialogCancelRSP}
          handleClose={() => this.toggleDialogCancelRSP(null)}>
          <Grid container direction="column" justify="center" alignItems="center">
            <CancelImageGrid item xs={12}>
              <img src={IconWarning} alt="warning" />
            </CancelImageGrid>
            <CancelImageGrid item xs={12}>
              <Text align="center" size="18px" weight="bolder">
                You have initiated cancellation of RSP for{' '}
                {this.state.currentCancellingFundForRSP
                  ? this.state.currentCancellingFundForRSP.fund
                    ? `${this.state.currentCancellingFundForRSP.fund.fundcode} ${this.state.currentCancellingFundForRSP.fund.name}`
                    : ''
                  : ''}
              </Text>
            </CancelImageGrid>
            <CancelMessageGrid item xs={12}>
              <Text align="center" size="14px" weight="bolder">
                Would you like to proceed?
              </Text>
            </CancelMessageGrid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
            <Grid item xs={6}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={this.handleOpenCancelRspVerificationConfirmationModal} width="80%">
                  Yes
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={() => this.toggleDialogCancelRSP(null)} primary width="80%">
                  No
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
        {this.state.isCancelRspVerificationConfirmationModalOpen ? (
          <CancelRspVerificationConfirmationModal
            open={this.state.isCancelRspVerificationConfirmationModalOpen}
            handleClose={this.handleCloseCancelRspVerificationConfirmationModal}
            handleCancelRsp={this.handleCancelRSP}
          />
        ) : null}
        <Modal
          width={400}
          height={450}
          open={this.state.showDialogWarningRSP}
          handleClose={this.toggleDialogWarningRSP}
          title={' '}>
          <Grid container direction="column" justify="center" alignItems="center" style={{ marginTop: -50 }}>
            <CancelImageGrid item xs={12}>
              <img src={IconWarning} alt="warnong" />
            </CancelImageGrid>
            <CancelTitleGrid item xs={12}>
              <Text align="center" size="17px" weight="bold">
                {/* Something Went Wrong! */}
                {this.state.message}
              </Text>
            </CancelTitleGrid>
            <CancelMessageGrid item xs={12}>
              <Text align="center" fontStyle="italic">
                {this.state.messageDialogWarningRSP}
              </Text>
            </CancelMessageGrid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
            <Grid item xs={12}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={this.toggleDialogWarningRSP} primary width="80%">
                  Ok
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
        <Dialog
          open={this.state.isOpenDialogEmailSent}
          closeHandler={this.handleCloseEmailModal}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
                {this.state.rspResError ? (
                  <React.Fragment>
                    {this.state.terminateErr ? (
                      <React.Fragment>
                        <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                          <img src={CloseIcon} width="50px" alt="close" />
                        </Grid>
                        <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                          <Text size="14px">Termination of RSP failed</Text>
                        </Grid>
                        <Grid item xs={12}>
                          <Text size="14px" color="#1d1d26">
                            {this.state.message}
                          </Text>
                        </Grid>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                          <img src={IconWarning} alt="warning" />
                        </Grid>
                        <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                          <Text size="14px">Email not sent</Text>
                        </Grid>
                        <Grid item xs={12}>
                          <Text size="14px" color="#1d1d26" fontStyle="italic">
                            {this.state.message}
                          </Text>
                        </Grid>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {this.state.isTerminate ? (
                      <React.Fragment>
                        <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                          <img src={IconWarning} alt="warning" />
                        </Grid>
                        <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                          <Text size="14px" weight="bold">
                            The Termination for the RSP is in progress.
                          </Text>
                        </Grid>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                          <img src={EmailSentIcon} alt="email" />
                        </Grid>
                        <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                          <Text size="14px" weight="bold">
                            Email notification sent
                          </Text>
                        </Grid>
                        <Grid item xs={12}>
                          {this.state.isEditRsp ? (
                            <Text size="14px" color="#1d1d26" fontStyle="italic">
                              We have sent an enrolment update link along with the RSP details
                            </Text>
                          ) : (
                            <Text size="14px" color="#1d1d26" fontStyle="italic">
                              We have sent an enrolment link along with the RSP details
                            </Text>
                          )}
                          <Text size="14px" color="#1d1d26" style={{ wordWrap: 'break-word' }}>
                            to <span style={{ fontWeight: 'bolder' }}>{this.props.clientDetails.info.account[0].AccEmail}</span>
                          </Text>
                        </Grid>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          }
        />

        <Dialog
          open={this.state.riskAssessmentModal}
          closeHandler={this.handleriskAssessmentModal}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
                <React.Fragment>
                  <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                    {this.state.riskAssessmentError ? (
                      <img src={CloseIcon} width="50px" alt="close" />
                    ) : (
                      <img src={SuccessIcon} alt="success" />
                    )}
                  </Grid>
                  {this.state.riskAssessmentError ? (
                    <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                      <Text size="14px" weight="bold">
                        {Parser(this.state.riskAssessmentErrorMessage)}.
                      </Text>
                    </Grid>
                  ) : (
                    <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                      <Text size="14px" weight="bold">
                        Client&apos;s Investor Suitability Profile is updated.
                      </Text>
                    </Grid>
                  )}
                </React.Fragment>
              </Grid>
            </Grid>
          }
        />

        <Dialog
          open={this.state.toggleAccountSelection}
          noClose
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center" style={{ padding: '26px 0px' }}>
              <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
                <Grid item xs={12}>
                  <Text size="14px" weight="bolder">
                    Choose Your Accounts
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Text size="14px">Select the account type to purchase the funds, then click continue to proceed.</Text>
                </Grid>

                <div style={{ marginTop: '26px' }}>
                  {convertedAcc &&
                    convertedAcc.account &&
                    convertedAcc.account.map((item) => {
                      const accountType = item.UTRACCOUNTTYPE === 'CS' ? 'Cash' : 'KWSP';
                      return (
                        <Grid item xs={12} style={{ marginBottom: '-8px' }}>
                          <StyledRadioButton
                            checked={this.state.selectedAccount === item.partnerAccountMappingId}
                            value={item.partnerAccountMappingId}
                            onChange={() => this.handleMultipleAccounts(item.UTRACCOUNTTYPE, item.partnerAccountMappingId)}
                            control={<Radio />}
                            label={`${accountType} Account No. ${getAccountHolderType(item) + item.partnerAccountMappingId}`}
                            disabled={item.AccountStatus === 'S' || this.checkEmis(item)}
                          />
                        </Grid>
                      );
                    })}
                </div>
                <Grid item xs={12} style={{ marginTop: 5 }}>
                  <Grid container justify="center" align="center" alignItems="center">
                    <Grid item xs={6} align="right" style={{ paddingRight: 5 }}>
                      <StyledBtn onClick={this.toggleAccountSelection} btnBgColor={'white'} btnFontColor={Color.C_LIGHT_BLUE}>
                        Back
                      </StyledBtn>
                    </Grid>
                    <Grid item xs={6} align="left" style={{ paddingLeft: 5 }}>
                      <StyledBtn onClick={this.addFundsForSelectedAccount} btnBgColor={Color.C_LIGHT_BLUE} btnFontColor="#ffffff">
                        Continue
                      </StyledBtn>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          }
        />
        {isQueryISAFAmlaError ? <QueryISAFAmlaErrorModal open={isQueryISAFAmlaError} isFromClientsFundPage /> : null}
        <OtpBox
          handleClose={() => {
            this.setState({ showModalForTerminate: false });
          }}
          openModal={this.state.showModalForTerminate}
          url={this.props.initTerminateRspOtpSuccessData ? this.props.initTerminateRspOtpSuccessData.otpiFrameUrl : null}
          error={this.props.initTerminateRspOtpError}
        />
      </React.Fragment>
    );
  }
}

Funds.propTypes = {
  paymentSucceeded: PropTypes.bool,
  clientDetails: PropTypes.object,
  allTransactionOTPSuccess: PropTypes.bool,
  otpError: PropTypes.object,
  lov: PropTypes.object,
  clearRiskProfileType: PropTypes.func,
  isQueryISAFAmlaError: PropTypes.bool.isRequired,
  handleResetAmlaErrorObject: PropTypes.func.isRequired,
  handleResetEmailOtpState: PropTypes.func.isRequired,
  handleResetCancelPendingTrxState: PropTypes.func.isRequired,
  isRiskAssessmentExpired: PropTypes.bool.isRequired,
  initTerminateRspOtpError: PropTypes.object,
  initTerminateRspOtpSuccessData: PropTypes.object,
  resetError: PropTypes.func.isRequired,
  clearStatesForAddFund: PropTypes.func.isRequired,
  match: PropTypes.object,
  resetClientProfileData: PropTypes.func.isRequired,
  allFundsWithDetails: PropTypes.array,
  getAllFundsWithFundDetails: PropTypes.func,
  resetAllocateFundStatus: PropTypes.func,
  showTxnOtpWindows: PropTypes.func,
  retakeRiskAssessmentSuccess: PropTypes.bool,
  retakeRiskAssessmentError: PropTypes.string,
  rspDataObj: PropTypes.object,
  fundIds: PropTypes.array,
  location: PropTypes.object,
  history: PropTypes.object,
  clearRspOtpData: PropTypes.func.isRequired,
  resetSuccess: PropTypes.func,
  clearStateOfConfirmationEmailResent: PropTypes.func.isRequired,
  resetPreviousDoneTxnPaymentType: PropTypes.func.isRequired,
  clearTransactionRequest: PropTypes.func.isRequired,
  callUnsubscribe: PropTypes.func.isRequired,
  getGroupedFunds: PropTypes.func.isRequired,
  initTerminateRspOtp: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  rspResponse: makeSelectRspResponse(),
  initTerminateRspOtpSuccessData: makeSelectInitTerminateRspOtpSuccessData(),
  initTerminateRspOtpError: makeSelectInitTerminateRspOtpError(),
  terminateRspSuccess: makeSelectTerminateRspSuccess(),
  terminateRspFailureErr: makeSelectTerminateRspFailure(),
  paymentSucceeded: makeSelectPaymentSucceeded(),
  processing: makeSelectProcessing(),
  clientDetails: makeSelectClientDetails(),
  setUpRspFailureErr: makeSelectSetUpRspFailure(),
  isOTPCalled: makeSelectisOTPCalled(),
  error: makeSelectError(),
  allTransactionOTPSuccess: makeSelectAllTransactionOTPSuccess(),
  dataTransaction: makeSelectDataTransaction(),
  transactionRequest: makeSelectTransactionRequest(),
  allFundsWithDetails: makeSelectAllFundsWithDetails(),
  otpError: makeSelectInitFundTransactionOtpError(),
  invalidCustomerID: makeSelectInvalidCustomerID(),
  rspDataObj: makeSelectrspDataObj(),
  setUpRspSuccess: makeSelectSetUpRspSuccess(),
  editRspSuccess: makeSelectEditRspSuccess(),
  editRspFailureErr: makeSelectEditRspFailure(),
  rspRefNo: makeSelectRspRefNo(),
  fundIds: makeSelectfundIds(),
  isTxnDoneUsingOnlinePayment: makeSelectIsTxnDoneUsingOnlinePayment(),
  messageResentConfirmationEmailStatus: makeSelectMessageResentConfirmationEmailStatus(),
  errorCreatePaymentRequestWithDocAfterOtp: makeSelectErrorCreatePaymentRequestWithDocAfterOtp(),
  processingGetAllFundWithFundDetails: makeSelectProcessingGetAllFundWithFundDetails(),
  isProcessingTaskCreatePaymentRequestWithDoc: makeSelectIsProcessingTaskCreatePaymentRequestWithDoc(),
  retakeRiskAssessmentSuccess: makeSelectRetakeAssessmentSuccess(),
  retakeRiskAssessmentError: makeSelectRetakeAssessmentError(),
  unSubscribedFund: makeSelectUnSubscribedFund(),
  lov: makeSelectLOV(),
  groupedFunds: makeSelectGroupedFunds(),
  unsubscribeModal: makeSelectUnsubscribeModal(),
  selectedFund: makeSelectSelectedFund(),
  success: makeSelectSuccess(),
  isTxnDoneUsingOnlinePaymentSuccess: makeSelectOnlineTxnSuccess(),
  isRiskAssessmentExpired: makeSelectIsRiskAssessmentExpired(),
  isQueryISAFAmlaError: makeSelectIsQueryISAFAmlaError(),
});

function mapDispatchToProps(dispatch) {
  return {
    getCustomerDetails: (payload) => dispatch(getCustomerDetails(payload)),
    callUnsubscribe: (payload) => dispatch(callUnsubscribe(payload)),
    getGroupedFunds: (payload) => dispatch(getGroupedFunds(payload)),
    clearGroupedFunds: () => dispatch(clearGroupedFunds()),
    reset: () => dispatch(reset()),
    clearRspOtpData: () => dispatch(clearRspOtpData()),
    setUpRsp: (payload) => dispatch(setUpRsp(payload)),
    editRsp: (payload) => dispatch(editRsp(payload)),
    initTerminateRspOtp: (payload, selectedVerificationOption) =>
      dispatch(initTerminateRspOtp(payload, selectedVerificationOption)),
    terminateRsp: (payload) => dispatch(terminateRsp(payload)),
    resetError: () => dispatch(resetError()),
    resetOnBoarding: () => dispatch(resetOnBoarding()),
    execAfterOTPFundTransactionSuccess: (payload) => dispatch(execAfterOTPFundTransactionSuccess(payload)),
    execAfterOTPFundTransactionFail: (payload) => dispatch(execAfterOTPFundTransactionFail(payload)),
    resetSwitchFundSuccess: () => dispatch(resetSwitchFundSuccess()),
    clearTransactionData: () => dispatch(clearTransactionData()),
    getAllFundsWithFundDetails: () => dispatch(getAllFundsWithFundDetails()),
    resetAllocateFundStatus: () => dispatch(resetAllocateFundStatus()),
    resetClientProfileData: () => dispatch(resetClientProfileData()),
    showTxnOtpWindows: (payload) => dispatch(showTxnOtpWindows(payload)),
    resetPreviousDoneTxnPaymentType: () => dispatch(resetPreviousDoneTxnPaymentType()),
    resendConfirmationEmail: (payload) => dispatch(resendConfirmationEmail(payload)),
    clearStateOfConfirmationEmailResent: () => dispatch(clearStateOfConfirmationEmailResent()),
    clearTransactionRequest: () => dispatch(clearTransactionRequest()),
    clearStatesForAddFund: () => dispatch(clearStatesForAddFund()),
    getRiskQuestionsAnswers: () => dispatch(getRiskQuestionsAnswers()),
    getRiskProfiles: () => dispatch(getRiskProfiles()),
    setAddFundsFlow: (payload) => dispatch(setAddFundsFlow(payload)),
    resetSuccess: (payload) => dispatch(resetSuccess(payload)),
    disableRspNotification: (payload) => dispatch(disableRspNotification(payload)),
    clearRiskProfileType: () => dispatch(clearRiskProfileType()),
    handleResetAmlaErrorObject: () => dispatch(resetAmlaErrorObject()),
    handleResetEmailOtpState: () => dispatch(resetEmailOtpState()),
    handleResetCancelPendingTrxState: () => dispatch(resetCancelPendingTrxState()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Funds);
