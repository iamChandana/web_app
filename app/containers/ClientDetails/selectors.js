import { createSelector } from 'reselect';
import _flatten from 'lodash/flatten';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

/**
 * Direct selector to the clientDetails state domain
 */
const selectClientDetailsDomain = (state) => state.clientDetails;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClientDetails
 */

const makeSelectClientDetails = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.clientDetails,
  );
const makeSelectClientAccDetail = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.clientAccDetail,
  );
const makeSelectFormDetails = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.form,
  );
const makeSelectProcessing = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.processing,
  );
const makeSelectisOTPCalled = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.isOTPCalled,
  );
const makeSelectError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.error,
  );
const makeSelectSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.success,
  );
const makeSelectTransactions = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.transactions,
  );
const makeSelectPaymentSucceeded = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.paymentSucceeded,
  );
const makeSelectFundTransactions = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.fundTransactions,
  );
const makeSelectAddedBank = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.addedBank,
  );
const makeSelectSwitchFundError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.switchFundError,
  );
const makeSelectShowModalFundTransactionOtp = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.showModalFundTransactionOtp,
  );
const makeSelectInitFundTransactionOtpSuccessData = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initFundTransactionOtpSuccessData,
  );
const makeSelectInitFundTransactionOtpError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initFundTransactionOtpError,
  );
const makeSelectShowModalSwitchFund = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.showModalSwitchFund,
  );
const makeSelectAllTransactionOTPSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.allTransactionOTPSuccess,
  );
const makeSelectDataTransaction = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.dataTransaction,
  );
const makeSelectUnSubscribedFund = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.unSubscribedFund,
  );
const makeSelectSelectedFund = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.selectedFund,
  );
const makeSelectGroupedFunds = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.groupedFunds,
  );
const makeSelectUnsubscribeModal = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.isOpenUnsubscribeModal,
  );
const makeSelectTransactionRequest = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.transactionRequest,
  );
const makeSelectTopUpTransactionError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.topUpTransactionError,
  );
const makeSelectAmlaFailObj = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.amlaFailObj,
  );
const makeSelectShowPaymentSelection = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.showPaymentSelection,
  );
const makeSelectFundTransactionsForDownload = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.fundTransactionsForDownload,
  );
const makeSelectInvalidCustomerID = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.invalidCustomerID,
  );
const makeSelectIsTxnDoneUsingOnlinePayment = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isTxnDoneUsingOnlinePayment,
  );
const makeSelectShowModalClientProfileChangeOtp = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.showModalClientProfileChangeOtp,
  );
const makeSelectRspResponse = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.rspResponse,
  );
const makeSelectInitClientProfileChangeOtpSuccessData = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initClientProfileChangeOtpSuccessData,
  );
const makeSelectInitClientProfileChangeOtpError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initClientProfileChangeOtpError,
  );
const makeSelectInitRetakeRiskAssessmentSuccessData = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initRetakeRiskAssessmentOtpSuccessData,
  );
const makeSelectInitRetakeRiskAssessmentError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initRetakeRiskAssessmentOtpError,
  );
const makeSelectInitRspOtpSuccessData = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initRspOtpSuccessData,
  );
const makeSelectInitEditRspOtpSuccessData = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initEditRspOtpSuccessData,
  );
const makeSelectInitTerminateRspOtpSuccessData = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initTerminateRspOtpSuccessData,
  );
const makeSelectisProcessingSetUpRsp = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.isProcessingSetUpRsp,
  );
const makeSelectInitRspOtpError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initRspOtpError,
  );
const makeSelectUpdateClientEmailError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.updateClientEmailError,
  );
const makeSelectUpdateClientEmailSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.updateClientEmailSuccess,
  );
const makeSelectCreateCashAccountSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.cashAccountCreatedSuccess,
  );
const makeSelectNewEmail = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.newEmail,
  );
const makeSelectIsProcessingUpdateClientProfile = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isProcessingUpdateClientProfile,
  );
const makeSelectIsProcessingRetakeAssessment = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isProcessingRetakeRiskAssessment,
  );
const makeSelectRetakeAssessmentSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.retakeRiskAssessmentSuccess,
  );
const makeSelectRetakeAssessmentError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.retakeRiskAssessmentError,
  );
const makeSelectMessageResentConfirmationEmailStatus = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.messageResentConfirmationEmailStatus,
  );
const makeSelectErrorCreatePaymentRequestWithDocAfterOtp = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.errorCreatePaymentRequestWithDocAfterOtp,
  );
const makeSelectIsProcessingTaskCreatePaymentRequestWithDoc = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isProcessingTaskCreatePaymentRequestWithDoc,
  );
const makeSelectSetUpRspSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.setUpRspSuccess,
  );
const makeSelectSetUpRspFailure = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.setUpRspFailureErr,
  );
const makeSelectrspDataObj = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.rspDataObj,
  );
const makeSelectInitEditRspOtpError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initEditRspOtpError,
  );
const makeSelectEditRspSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.editRspSuccess,
  );
const makeSelectEditRspFailure = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.editRspFailureErr,
  );
const makeSelectRspRefNo = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.rspRefNo,
  );
const makeSelectfundIds = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => substate.fundIds,
  );
const makeSelectInitTerminateRspOtpError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.initTerminateRspOtpError,
  );
const makeSelectTerminateRspSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.terminateRspSuccess,
  );
const makeSelectTerminateRspFailure = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.terminateRspFailureErr,
  );
const makeSelectCreateCashAccountError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.cashAccountCreationFailed,
  );
const makeSelectCreateCashAccountClientError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.createCashAccountClientError,
  );
const makeSelectTransactionType = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.transactionType,
  );
const makeSelectOnlineTxnSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isTxnDoneUsingOnlinePaymentSuccess,
  );
const makeSelectCreateKwspAccountSuccess = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.kwspAccountCreatedSuccess,
  );
const makeSelectGetSelectionAccount = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.selectedAccountDetails,
  );
const makeSelectSetAccountCreationFlow = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.accountCreationFlow,
  );
const makeSelectSetSubscribeAccountId = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.subscribeAccountId,
  );

const selectIsSubscriptionDisabled = () =>
  createSelector(
    selectClientDetailsDomain,
    (substate) => {
      const activeAccounts = substate.clientDetails.info.account.filter((account) => account.AccountStatus === 'A');

      // if there is no active account
      if (activeAccounts === undefined) {
        return true;
      }

      let isSubscriptionDisabled = true;

      activeAccounts.forEach((activeAccount) => {
        // cause user can have multiple cash accounts/portfolios
        const portfolios = substate.clientDetails.portfolio.filter(
          (currentPortfolio) => currentPortfolio.partnerAccountType === activeAccount.UTRACCOUNTTYPE,
        );

        // if portfolio exist
        if (portfolios.length > 0) {
          const productBreakdown = _flatten(portfolios.map((portfolio) => portfolio.productbreakdown));
          const isPartialProduct = productBreakdown.find((product) => product.status === 'partial');

          // and if one of the products inside portfolio is of partial status
          if (isPartialProduct) {
            isSubscriptionDisabled = false;
          }
        }
      });

      return isSubscriptionDisabled;
    },
  );

const makeSelectFullName = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (!subState) {
        return null;
      }
      if (subState.clientDetails.info.fullName !== null) {
        return subState.clientDetails.info.fullName;
      }

      return '-';
    },
  );

const makeSelectEmail = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (!subState) {
        return null;
      }
      if (subState.clientDetails && subState.clientDetails.info && subState.clientDetails.info.email !== null) {
        return subState.clientDetails.info.email;
      }

      return '-';
    },
  );

const makeSelectMobileNo = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (!subState) {
        return null;
      }
      if (subState.clientDetails.info.MobileNo !== null) {
        return subState.clientDetails.info.MobileNo;
      }

      return '-';
    },
  );

const makeSelectKwspIslamicORConventionalFlag = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      const kwspAccount = subState.clientDetails.info.account.find((account) => account.UTRACCOUNTTYPE === 'KW');

      if (!kwspAccount) {
        return '-';
      }

      return kwspAccount.islamicORConventionalFlag;
    },
  );

const makeSelectTrxRequestId = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (subState && subState.transactions && subState.transactions !== null) {
        return subState.transactions.id;
      }

      return '-';
    },
  );

const makeSelectIsAmlaError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => !_isEmpty(subState.amlaFailObj),
  );
const makeSelectIsEmailVerificationSent = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isEmailVerificationSent,
  );

const makeSelectPendingVerificationTrxRequests = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (subState.clientDetails.portfolio.length > 0) {
        const transactionRequestsArr = [];

        subState.clientDetails.portfolio.forEach((portfolio) => {
          const temp = portfolio.pendingVerificationTrxRequests;

          transactionRequestsArr.push(temp);
        });

        const flattenArray = transactionRequestsArr.flat();

        if (flattenArray.length > 0) {
          return flattenArray;
        }
      }

      return [];
    },
  );

const makeSelectPendingVerificationTrxRequestsFundCode = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (subState.clientDetails.portfolio.length > 0) {
        const transactionRequestsArr = [];

        subState.clientDetails.portfolio.forEach((portfolio) => {
          const temp = portfolio.pendingVerificationTrxRequests;

          transactionRequestsArr.push(temp);
        });

        const flattenArray = transactionRequestsArr.flat().filter((x) => x !== undefined);
        return flattenArray;
        // if (flattenArray.length > 0) {
        //   return flattenArray.map((portfolio) => portfolio.transactionPartnerProductId);
        // }
      }

      return [];
    },
  );

const makeSelectProductBreakdown = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      if (subState.clientDetails.portfolio.length > 0) {
        const productBreakdownArray = [];

        subState.clientDetails.portfolio.forEach((portfolio) => {
          const temp = portfolio.productbreakdown;

          productBreakdownArray.push(temp);
        });

        const flattenArray = productBreakdownArray.flat();

        if (flattenArray.length > 0) {
          return flattenArray;
        }
      }

      return [];
    },
  );

const makeSelectIsCancelPendingVerificationSuccessful = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.isCancelPendingVerificationSuccessful,
  );

const makeSelectSelectedVerificationOption = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.selectedVerificationOption,
  );
const makeSelectSelectedVerificationError = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => subState.verificationError,
  );

const makeSelectIsRiskAssessmentExpired = () =>
  createSelector(
    selectClientDetailsDomain,
    (subState) => {
      const { clientDetails } = subState;

      if (!clientDetails || !clientDetails.info) {
        return false;
      }

      const isIsafPerformanceDateEmpty =
        !clientDetails.info.ISAF_PERFORMANCE_DATE || clientDetails.info.ISAF_PERFORMANCE_DATE === '';
      const isIsafScoreEmpty = !clientDetails.info.ISAF_SCORE || clientDetails.info.ISAF_SCORE === '';

      const currentDate = moment(new Date());
      const assessmentDate = moment(clientDetails.info.ISAF_PERFORMANCE_DATE);
      const diff = currentDate.diff(assessmentDate, 'months', true);
      const isRiskAssessmentExpired = diff >= 12;

      return isIsafPerformanceDateEmpty || isIsafScoreEmpty || isRiskAssessmentExpired;
    },
  );

const makeSelectSalesCharges = () =>
  createSelector(
    selectClientDetailsDomain,
    (clientDetails) => clientDetails.salesCharges,
  );

const makeSelectDocumentsUrl = () =>
  createSelector(
    selectClientDetailsDomain,
    (clientDetails) => clientDetails.documentsUrl,
  );

const makeSelectPendingTransactionsResponse = () =>
  createSelector(
    selectClientDetailsDomain,
    (clientDetails) => clientDetails.pendingTransactionsResponse,
  );

export {
  makeSelectInitTerminateRspOtpSuccessData,
  makeSelectInitTerminateRspOtpError,
  makeSelectTerminateRspSuccess,
  makeSelectTerminateRspFailure,
  makeSelectClientDetails,
  makeSelectEditRspSuccess,
  makeSelectfundIds,
  makeSelectRspRefNo,
  makeSelectEditRspFailure,
  makeSelectInitEditRspOtpError,
  makeSelectInitEditRspOtpSuccessData,
  makeSelectrspDataObj,
  makeSelectisProcessingSetUpRsp,
  makeSelectFormDetails,
  makeSelectSetUpRspSuccess,
  makeSelectSetUpRspFailure,
  makeSelectRspResponse,
  makeSelectInitRspOtpSuccessData,
  makeSelectInitRspOtpError,
  makeSelectProcessing,
  makeSelectisOTPCalled,
  makeSelectError,
  makeSelectTransactions,
  makeSelectPaymentSucceeded,
  makeSelectFundTransactions,
  makeSelectAddedBank,
  makeSelectSwitchFundError,
  makeSelectInitFundTransactionOtpSuccessData,
  makeSelectShowModalFundTransactionOtp,
  makeSelectInitFundTransactionOtpError,
  makeSelectShowModalSwitchFund,
  makeSelectAllTransactionOTPSuccess,
  makeSelectDataTransaction,
  makeSelectTransactionRequest,
  makeSelectTopUpTransactionError,
  makeSelectAmlaFailObj,
  makeSelectShowPaymentSelection,
  makeSelectFundTransactionsForDownload,
  makeSelectInvalidCustomerID,
  makeSelectIsTxnDoneUsingOnlinePayment,
  makeSelectShowModalClientProfileChangeOtp,
  makeSelectInitClientProfileChangeOtpSuccessData,
  makeSelectInitClientProfileChangeOtpError,
  makeSelectUpdateClientEmailError,
  makeSelectUpdateClientEmailSuccess,
  makeSelectNewEmail,
  makeSelectIsProcessingUpdateClientProfile,
  makeSelectMessageResentConfirmationEmailStatus,
  makeSelectErrorCreatePaymentRequestWithDocAfterOtp,
  makeSelectIsProcessingTaskCreatePaymentRequestWithDoc,
  makeSelectClientAccDetail,
  makeSelectInitRetakeRiskAssessmentSuccessData,
  makeSelectInitRetakeRiskAssessmentError,
  makeSelectIsProcessingRetakeAssessment,
  makeSelectRetakeAssessmentSuccess,
  makeSelectRetakeAssessmentError,
  // makeExistingCustomerDetails,
  makeSelectCreateCashAccountSuccess,
  makeSelectUnSubscribedFund,
  makeSelectCreateCashAccountError,
  makeSelectCreateCashAccountClientError,
  makeSelectGroupedFunds,
  makeSelectUnsubscribeModal,
  makeSelectSelectedFund,
  makeSelectSuccess,
  makeSelectTransactionType,
  makeSelectOnlineTxnSuccess,
  makeSelectCreateKwspAccountSuccess,
  makeSelectGetSelectionAccount,
  makeSelectSetAccountCreationFlow,
  makeSelectSetSubscribeAccountId,
  selectIsSubscriptionDisabled,
  makeSelectFullName,
  makeSelectMobileNo,
  makeSelectKwspIslamicORConventionalFlag,
  makeSelectEmail,
  makeSelectTrxRequestId,
  makeSelectIsAmlaError,
  makeSelectIsEmailVerificationSent,
  makeSelectPendingVerificationTrxRequests,
  makeSelectIsCancelPendingVerificationSuccessful,
  makeSelectPendingVerificationTrxRequestsFundCode,
  makeSelectProductBreakdown,
  makeSelectSelectedVerificationOption,
  makeSelectSelectedVerificationError,
  makeSelectIsRiskAssessmentExpired,
  makeSelectSalesCharges,
  makeSelectDocumentsUrl,
  makeSelectPendingTransactionsResponse,
  makeSelectCancelPendingTransactionsSuccess,
};
