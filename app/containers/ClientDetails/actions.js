/*
 *
 * ClientDetails actions
 *
 */

import {
  DEFAULT_ACTION,
  ACCOUNT_GET,
  ACCOUNT_GET_SUCCESS,
  ACCOUNT_GET_FAIL,
  CUSTOMER_DETAILS_GET,
  RESET,
  PROCESSING,
  CUSTOMER_DETAILS_GET_SUCCESS,
  TOPUP_REDEEM_REQUEST,
  TOPUP_REDEEM_REQUEST_SUCCESS,
  SETUP_RSP,
  SETUP_RSP_SUCCESS,
  SETUP_RSP_FAILURE,
  EDIT_RSP,
  EDIT_RSP_SUCCESS,
  EDIT_RSP_FAILURE,
  INIT_RSP_OTP,
  INIT_RSP_OTP_SUCCESS,
  INIT_RSP_OTP_FAILURE,
  INIT_EDIT_RSP_OTP,
  INIT_EDIT_RSP_OTP_SUCCESS,
  INIT_EDIT_RSP_OTP_FAILURE,
  INIT_TERMINATE_RSP_OTP,
  INIT_TERMINATE_RSP_OTP_SUCCESS,
  INIT_TERMINATE_RSP_OTP_FAILURE,
  TERMINATE_RSP,
  TERMINATE_RSP_SUCCESS,
  TERMINATE_RSP_FAILURE,
  PROCESSING_SETUP_RSP,
  CLEAR_RSP_OTP_DATA,
  ERROR,
  ERROR_RESET,
  SUCCESS,
  SUCCESS_RESET,
  TRANSACTION_GET,
  TRANSACTION_GET_SUCCESS,
  PAYMENT_DOCS_CREATE,
  PAYMENT_DOCS_CREATE_SUCCESS,
  TRANSACTION_RESET,
  BANK_ADD,
  BANK_ADD_SUCCESS,
  BANK_EDIT,
  CUSTOMER_DETAILS_UPDATE,
  CUSTOMER_DETAILS_UPDATE_SUCCESS,
  SWITCH_FUND_SUCCESS,
  SWITCH_FUND_FAIL,
  INITIAL_RSP_RESPONSE,
  INIT_FUND_TRANSACTION_OTP,
  INIT_FUND_TRANSACTION_OTP_SUCCESS,
  INIT_FUND_TRANSACTION_OTP_FAIL,
  RESET_SWITCH_FUND_SUCCESS,
  EXEC_AFTER_OTP_FUND_TRANSACTION_SUCCESS,
  EXEC_AFTER_OTP_FUND_TRANSACTION_FAIL,
  SAVE_TOKEN_OF_FUND_TRANSACTION_OTP_SUCCESS_FROM_EXEC_AFTER_OTP,
  SHOW_MODAL_SWITCH_FUND,
  OPEN_MODAL_FUND_TRANSACTION_OTP,
  ALL_TRANSACTION_OTP_SUCCESS,
  CLEAR_INIT_RSP_OTP_ERR,
  SAVE_TRANSACTION_DATA,
  CLEAR_TRANSACTION_DATA,
  SUBMIT_TOKEN_AFTER_OTP_FAIL,
  STORE_TRANSACTION_REQUEST,
  CLEAR_OTP_ERROR,
  TOPUP_REDEEM_REQUEST_FAIL,
  CLEAR_TOPUP_ERROR,
  RESET_ALLOCATE_FUND_STATUS,
  AMLA_CHECK_FAIL,
  CHECK_AMLA_SUBSCRIBE,
  SHOW_PAYMENT_SELECTION,
  SHOW_TXN_OTP_WINDOW,
  RESET_OTP,
  TRANSACTION_GET_FOR_DOWNLOAD,
  TRANSACTION_GET_FOR_DOWNLOAD_SUCCESS,
  REMOVE_FUND_TRANSACTIONS_FOR_DOWNLOAD,
  RESET_CLIENT_PROFILE_DATA,
  INVALID_CUSTOMER_ID,
  CLEAR_PAYMENT_STATUS,
  RESET_PREVIOUS_DONE_TXN_PAYMENT_TYPE,
  UPDATE_CLIENT_EMAIL,
  INIT_CLIENT_PROFILE_CHANGE_OTP,
  INIT_CLIENT_PROFILE_CHANGE_OTP_SUCCESS,
  INIT_CLIENT_PROFILE_CHANGE_OTP_ERROR,
  CLEAR_CLIENT_PROFILE_UPDATE_OTP_DATA,
  UPDATE_CLIENT_EMAIL_ERROR,
  UPDATE_CLIENT_EMAIL_SUCCESS,
  PROCESSING_UPDATE_CLIENT_PROFILE,
  RESEND_CONFIRMATION_EMAIL,
  RESENT_CONFIRMATION_EMAIL_STATUS,
  CLEAR_STATE_OF_CONFIRMATION_EMAIL_RESENT,
  SET_ERROR_MESSAGE,
  CLEAR_NEW_EMAIL,
  PROCESSING_TASK_CREATE_PAYMENT_REQUEST_WITH_DOC,
  CLEAR_TRANSACTION_REQUEST,
  SAVE_CLIENT_ACC_DETAIL,
  RISK_QUESTIONS_ANSWERS_GET,
  RISK_QUESTIONS_ANSWERS_GET_SUCCES,
  INIT_RETAKE_RISK_ASSESSMENT_OTP,
  INIT_RETAKE_RISK_ASSESSMENT_OTP_SUCCESS,
  INIT_RETAKE_RISK_ASSESSMENT_OTP_FAILURE,
  CLEAR_RETAKE_RISK_ASSESSMENT_OTP_DATA,
  RETAKE_RISK_ASSESSMENT,
  RETAKE_RISK_ASSESSMENT_SUCCESS,
  RETAKE_RISK_ASSESSMENT_ERROR,
  PROCESSING_RETAKE_ASSESSMENT,
  CREATE_ACCOUNT,
  PROCESSING_CREATE_ACCOUNT_CLIENT_PROFILE,
  CREATE_ACCOUNT_SUCCESS,
  CLEAR_ACCOUNT_CREATION_SUCCESS_VALUE,
  CALL_UNSUBSCRIBE,
  CALL_UNSUBSCRIBE_SUCCESS,
  CREATE_CASH_ACCOUNT_FAILED,
  CREATE_CASH_CLIENT_EMAIL_ERROR,
  CREATE_ACCOUNT_SET_MODAL_SUCCESS,
  GET_GROUPED_FUNDS,
  SAVE_GROUPED_FUNDS,
  CLEAR_GROUPED_FUNDS,
  SAVE_SELECTED_FUND,
  IS_ONLINE_TXN_SUCCESS,
  CREATE_KWSP_ACCOUNT,
  CREATE_KWSP_ACCOUNT_SUCCESS,
  DISABLE_RSP_NOTIFICATION,
  SAVE_SELECTED_ACCOUNT_DETAILS,
  WHOLESALE_DISCLAIMER_ACKNOWLEDGE,
  SET_ACCOUNT_CREATION_FLOW,
  SHOW_PAYMENT_SELECTION_SUBSCRIBE,
  EMAIL_OTP_REQUEST,
  EMAIL_OTP_SUCCESS,
  EMAIL_OTP_FAILURE,
  RESET_AMLA_ERROR_OBJECT,
  RESET_EMAIL_OTP_STATE,
  CANCEL_PENDING_TRX_REQUEST,
  CANCEL_PENDING_TRX_SUCCESS,
  CANCEL_PENDING_TRX_FAILURE,
  RESET_CANCEL_PENDING_TRX_STATE,
  CANCEL_PENDING_RSP_REQUEST,
  CANCEL_PENDING_RSP_SUCCESS,
  CANCEL_PENDING_RSP_FAILURE,
  SET_SELECTED_VERIFICATION_OPTION,
  GET_DEFAULT_SALES_CHARGE_REQUEST,
  GET_DEFAULT_SALES_CHARGE_SUCCESS,
  GET_DEFAULT_SALES_CHARGE_FAILURE,
  VERIFY_CAMPAIGN_CODE_REQUEST,
  VERIFY_CAMPAIGN_CODE_SUCCESS,
  VERIFY_CAMPAIGN_CODE_FAILURE,
  REMOVE_CAMPAIGN_CODE,
  GET_DOCUMENTS_URL,
  SAVE_DOCUMENTS_URL,
  GET_PENDING_TRANSACTIONS,
  SAVE_PENDING_TRANSACTIONS,
  CALL_CANCEL_PENDING_TRANSACTIONS,
  CANCEL_PENDING_TRANSACTIONS_SUCCESS,
} from './constants';

export function clearOTPError() {
  return {
    type: CLEAR_OTP_ERROR,
  };
}
export function reset() {
  return {
    type: RESET,
  };
}

export function setError(payload) {
  return {
    type: ERROR,
    payload,
  };
}

export function resetError() {
  return {
    type: ERROR_RESET,
  };
}

export function setDBLockError(payload) {
  return {
    type: SUCCESS,
    payload,
  };
}

export function resetSuccess() {
  return {
    type: SUCCESS_RESET,
  };
}

export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAccount(payload) {
  return {
    type: ACCOUNT_GET,
    payload,
  };
}

export function getAccountSuccess(payload) {
  return {
    type: ACCOUNT_GET_SUCCESS,
    payload,
  };
}

export function getAccountFail(payload) {
  return {
    type: ACCOUNT_GET_FAIL,
    payload,
  };
}

export function getCustomerDetails(payload) {
  return {
    type: CUSTOMER_DETAILS_GET,
    payload,
  };
}

export function getCustomerDetailsSuccess(payload) {
  return {
    type: CUSTOMER_DETAILS_GET_SUCCESS,
    payload,
  };
}

export function topUpOrRedeem(payload) {
  return {
    type: TOPUP_REDEEM_REQUEST,
    payload,
  };
}

export function topUpOrRedeemSuccess(payload) {
  return {
    type: TOPUP_REDEEM_REQUEST_SUCCESS,
    payload,
  };
}

export function topUpOrRedeemFail(payload) {
  return {
    type: TOPUP_REDEEM_REQUEST_FAIL,
    payload,
  };
}

// transactions
export function getTransaction(payload) {
  return {
    type: TRANSACTION_GET,
    payload,
  };
}

export function getTransactionSuccess(payload) {
  return {
    type: TRANSACTION_GET_SUCCESS,
    payload,
  };
}

export function storeTransactionRequest(payload) {
  return {
    type: STORE_TRANSACTION_REQUEST,
    payload,
  };
}

// create payment
export function createPaymentDocs(payload) {
  return {
    type: PAYMENT_DOCS_CREATE,
    payload,
  };
}

export function createPaymentDocsSuccess() {
  return {
    type: PAYMENT_DOCS_CREATE_SUCCESS,
  };
}

export function resetTransaction() {
  return {
    type: TRANSACTION_RESET,
  };
}

export function addBank(payload) {
  return {
    type: BANK_ADD,
    payload,
  };
}

export function addBankSuccess(payload) {
  return {
    type: BANK_ADD_SUCCESS,
    payload,
  };
}

export function editBank() {
  return {
    type: BANK_EDIT,
  };
}

export function updateCustomerDetails(payload) {
  return {
    type: CUSTOMER_DETAILS_UPDATE,
    payload,
  };
}

export function updateCustomerDetailsSuccess(payload) {
  return {
    type: CUSTOMER_DETAILS_UPDATE_SUCCESS,
    payload,
  };
}

export function switchFundSuccess(payload) {
  return {
    type: SWITCH_FUND_SUCCESS,
    payload,
  };
}

export function resetSwitchFundSuccess(payload) {
  return {
    type: RESET_SWITCH_FUND_SUCCESS,
    payload,
  };
}

export function switchFundFail(payload) {
  return {
    type: SWITCH_FUND_FAIL,
    payload,
  };
}

export function submitTokenAfterOTPFail(payload) {
  return {
    type: SUBMIT_TOKEN_AFTER_OTP_FAIL,
    payload,
  };
}

export function initFundTransactionOtp(payload) {
  return {
    type: INIT_FUND_TRANSACTION_OTP,
    payload,
  };
}

export function initFundTransactionOtpSuccess(payload) {
  return {
    type: INIT_FUND_TRANSACTION_OTP_SUCCESS,
    payload,
  };
}

export function isTxnDoneUsingOnlineSuccess(payload) {
  return {
    type: IS_ONLINE_TXN_SUCCESS,
    payload,
  };
}

export function initFundTransactionOtpFail(payload) {
  return {
    type: INIT_FUND_TRANSACTION_OTP_FAIL,
    payload,
  };
}

export function openModalFundTransactionOtp(payload) {
  return {
    type: OPEN_MODAL_FUND_TRANSACTION_OTP,
    payload,
  };
}

export function execAfterOTPFundTransactionSuccess(payload) {
  return {
    type: EXEC_AFTER_OTP_FUND_TRANSACTION_SUCCESS,
    payload,
  };
}

export function execAfterOTPFundTransactionFail(payload) {
  return {
    type: EXEC_AFTER_OTP_FUND_TRANSACTION_FAIL,
    payload,
  };
}

export function saveTokenOfFundTransactionOtpSuccessFromExecAfterOTP(payload) {
  return {
    type: SAVE_TOKEN_OF_FUND_TRANSACTION_OTP_SUCCESS_FROM_EXEC_AFTER_OTP,
    payload,
  };
}

export function showModalSwitchFund(payload) {
  return {
    type: SHOW_MODAL_SWITCH_FUND,
    payload,
  };
}

export function allTransactionOTPSuccess() {
  return {
    type: ALL_TRANSACTION_OTP_SUCCESS,
  };
}

export function saveTransactionData(payload) {
  return {
    type: SAVE_TRANSACTION_DATA,
    payload,
  };
}

export function clearTransactionData() {
  return {
    type: CLEAR_TRANSACTION_DATA,
  };
}

export function clearTopupError() {
  return {
    type: CLEAR_TOPUP_ERROR,
  };
}

export function resetAllocateFundStatus() {
  return {
    type: RESET_ALLOCATE_FUND_STATUS,
  };
}

export function checkAmlaFail(payload) {
  return {
    type: AMLA_CHECK_FAIL,
    payload,
  };
}

export function checkAmlaSubscribe(payload) {
  return {
    type: CHECK_AMLA_SUBSCRIBE,
    payload,
  };
}

export function showPaymentSelection(payload) {
  return {
    type: SHOW_PAYMENT_SELECTION,
    payload,
  };
}

export function showTxnOtpWindows(payload) {
  return {
    type: SHOW_TXN_OTP_WINDOW,
    payload,
  };
}

export function resetOtp() {
  return {
    type: RESET_OTP,
  };
}

export function getTransactionForDownload(payload) {
  return {
    type: TRANSACTION_GET_FOR_DOWNLOAD,
    payload,
  };
}

export function getTransactionForDownloadSuccess(payload) {
  return {
    type: TRANSACTION_GET_FOR_DOWNLOAD_SUCCESS,
    payload,
  };
}

export function removeFundTransactionForDownload() {
  return {
    type: REMOVE_FUND_TRANSACTIONS_FOR_DOWNLOAD,
  };
}

export function resetClientProfileData() {
  return {
    type: RESET_CLIENT_PROFILE_DATA,
  };
}

export function invalidCustomerId() {
  return {
    type: INVALID_CUSTOMER_ID,
  };
}

export function clearPaymentStatus() {
  return {
    type: CLEAR_PAYMENT_STATUS,
  };
}

export function resetPreviousDoneTxnPaymentType() {
  return {
    type: RESET_PREVIOUS_DONE_TXN_PAYMENT_TYPE,
  };
}

export function updateClientEmail(payload) {
  return {
    type: UPDATE_CLIENT_EMAIL,
    payload,
  };
}

export function createAccount(payload) {
  return {
    type: CREATE_ACCOUNT,
    payload,
  };
}
export function initClientProfileChangeOtp(payload) {
  return {
    type: INIT_CLIENT_PROFILE_CHANGE_OTP,
    payload,
  };
}

export function initProfileChangeOtpSuccess(payload) {
  return {
    type: INIT_CLIENT_PROFILE_CHANGE_OTP_SUCCESS,
    payload,
  };
}

export function initClientProfileChangeOtpError(payload) {
  return {
    type: INIT_CLIENT_PROFILE_CHANGE_OTP_ERROR,
    payload,
  };
}

export function initRetakeRiskAssessmentOtp(payload) {
  return {
    type: INIT_RETAKE_RISK_ASSESSMENT_OTP,
    payload,
  };
}

export function initRetakeRiskAssessmentOtpSuccess(payload) {
  return {
    type: INIT_RETAKE_RISK_ASSESSMENT_OTP_SUCCESS,
    payload,
  };
}

export function initRetakeRiskAssessmentOtpFailure(payload) {
  return {
    type: INIT_RETAKE_RISK_ASSESSMENT_OTP_FAILURE,
    payload,
  };
}

export function clearRiskAssessmentOtpData() {
  return {
    type: CLEAR_RETAKE_RISK_ASSESSMENT_OTP_DATA,
  };
}

export function retakeRiskAssessment(payload) {
  return {
    type: RETAKE_RISK_ASSESSMENT,
    payload,
  };
}

export function retakeRiskAssessmentSuccess() {
  return {
    type: RETAKE_RISK_ASSESSMENT_SUCCESS,
  };
}

export function retakeRiskAssessmentError(payload) {
  return {
    type: RETAKE_RISK_ASSESSMENT_ERROR,
    payload,
  };
}

export function processingRetakeAssessment(payload) {
  return {
    type: PROCESSING_RETAKE_ASSESSMENT,
    payload,
  };
}

export function initRspOtp(payload) {
  return {
    type: INIT_RSP_OTP,
    payload,
  };
}

export function initRspOtpSuccess(payload) {
  return {
    type: INIT_RSP_OTP_SUCCESS,
    payload,
  };
}

export function initRspOtpFailure(payload) {
  return {
    type: INIT_RSP_OTP_FAILURE,
    payload,
  };
}

export function initEditRspOtp(payload, selectedVerificationOption) {
  return {
    type: INIT_EDIT_RSP_OTP,
    payload,
    selectedVerificationOption,
  };
}

export function initEditRspOtpSuccess(payload) {
  return {
    type: INIT_EDIT_RSP_OTP_SUCCESS,
    payload,
  };
}

export function initEditRspOtpFailure(payload) {
  return {
    type: INIT_EDIT_RSP_OTP_FAILURE,
    payload,
  };
}

export function initTerminateRspOtp(payload, selectedVerificationOption) {
  return {
    type: INIT_TERMINATE_RSP_OTP,
    payload,
    selectedVerificationOption,
  };
}

export function initTerminateRspOtpSuccess(payload) {
  return {
    type: INIT_TERMINATE_RSP_OTP_SUCCESS,
    payload,
  };
}

export function initTerminateRspOtpFailure(payload) {
  return {
    type: INIT_TERMINATE_RSP_OTP_FAILURE,
    payload,
  };
}

export function terminateRsp(payload) {
  return {
    type: TERMINATE_RSP,
    payload,
  };
}

export function terminateRspSuccess() {
  return {
    type: TERMINATE_RSP_SUCCESS,
  };
}

export function terminateRspFailure(payload) {
  return {
    type: TERMINATE_RSP_FAILURE,
    payload,
  };
}

export function clearInitRspOTPErr() {
  return {
    type: CLEAR_INIT_RSP_OTP_ERR,
  };
}

export function processingSetUpRsp(payload) {
  return {
    type: PROCESSING_SETUP_RSP,
    payload,
  };
}

export function clearRspOtpData() {
  return {
    type: CLEAR_RSP_OTP_DATA,
  };
}

export function setUpRsp(payload) {
  return {
    type: SETUP_RSP,
    payload,
  };
}

export function setUpRspSuccess() {
  return {
    type: SETUP_RSP_SUCCESS,
  };
}

export function setUpRspFailure(payload) {
  return {
    type: SETUP_RSP_FAILURE,
    payload,
  };
}

export function editRsp(payload) {
  return {
    type: EDIT_RSP,
    payload,
  };
}

export function editRspSuccess(payload) {
  return {
    type: EDIT_RSP_SUCCESS,
    payload,
  };
}

export function editRspFailure(payload) {
  return {
    type: EDIT_RSP_FAILURE,
    payload,
  };
}

export function initialRspResponse() {
  return {
    type: INITIAL_RSP_RESPONSE,
  };
}

export function clearClientProfileUpdateOtpData() {
  return {
    type: CLEAR_CLIENT_PROFILE_UPDATE_OTP_DATA,
  };
}

export function updateClientEmailSuccess() {
  return {
    type: UPDATE_CLIENT_EMAIL_SUCCESS,
  };
}

export function createAccountSuccess() {
  return {
    type: CREATE_ACCOUNT_SUCCESS,
  };
}
export function setCreateCashAccountSuccessPopUp() {
  return {
    type: CREATE_ACCOUNT_SET_MODAL_SUCCESS,
  };
}

export function updateClientEmailError(payload) {
  return {
    type: UPDATE_CLIENT_EMAIL_ERROR,
    payload,
  };
}

export function processingUpdateClientProfile(payload) {
  return {
    type: PROCESSING_UPDATE_CLIENT_PROFILE,
    payload,
  };
}

export function processingCreateAccountClientProfile(payload) {
  return {
    type: PROCESSING_CREATE_ACCOUNT_CLIENT_PROFILE,
    payload,
  };
}

export function clearCashKwspAccountCreatedStateValue() {
  return {
    type: CLEAR_ACCOUNT_CREATION_SUCCESS_VALUE,
  };
}

export function resendConfirmationEmail(payload) {
  return {
    type: RESEND_CONFIRMATION_EMAIL,
    payload,
  };
}

export function resentConfirmationEmailStatus(payload) {
  return {
    type: RESENT_CONFIRMATION_EMAIL_STATUS,
    payload,
  };
}

export function clearStateOfConfirmationEmailResent() {
  return {
    type: CLEAR_STATE_OF_CONFIRMATION_EMAIL_RESENT,
  };
}

export function setErrorMessage(payload) {
  return {
    type: SET_ERROR_MESSAGE,
    payload,
  };
}

export function clearNewEmail() {
  return {
    type: CLEAR_NEW_EMAIL,
  };
}

export function processingTaskCreatePaymentRequestWithDoc(payload) {
  return {
    type: PROCESSING_TASK_CREATE_PAYMENT_REQUEST_WITH_DOC,
    payload,
  };
}

export function clearTransactionRequest() {
  return {
    type: CLEAR_TRANSACTION_REQUEST,
  };
}

export function saveClientAccDetail(payload) {
  return {
    type: SAVE_CLIENT_ACC_DETAIL,
    payload,
  };
}

export function getRiskQuestionsAnswers() {
  return {
    type: RISK_QUESTIONS_ANSWERS_GET,
  };
}

export function getRiskQuestionsAnswersSuccess(payload) {
  return {
    type: RISK_QUESTIONS_ANSWERS_GET_SUCCES,
    payload,
  };
}

export function callUnsubscribe(payload) {
  return {
    type: CALL_UNSUBSCRIBE,
    payload,
  };
}

export function callUnsubscribeSuccess(payload) {
  return {
    type: CALL_UNSUBSCRIBE_SUCCESS,
    payload,
  };
}

export function createClientAccountError(payload) {
  return {
    type: CREATE_CASH_ACCOUNT_FAILED,
    payload,
  };
}
export function createCashAccountClientEmailError(payload) {
  return {
    type: CREATE_CASH_CLIENT_EMAIL_ERROR,
    payload,
  };
}

export function getGroupedFunds(payload) {
  return {
    type: GET_GROUPED_FUNDS,
    payload,
  };
}

export function clearGroupedFunds() {
  return {
    type: CLEAR_GROUPED_FUNDS,
  };
}

export function saveGroupedFunds(payload) {
  return {
    type: SAVE_GROUPED_FUNDS,
    payload,
  };
}

export function saveSelectedFund(payload) {
  return {
    type: SAVE_SELECTED_FUND,
    payload,
  };
}
export function setCreateKwspAccountSuccessPopUp(payload) {
  return {
    type: CREATE_KWSP_ACCOUNT_SUCCESS,
    payload,
  };
}
export function createKwspAccount(payload) {
  return {
    type: CREATE_KWSP_ACCOUNT,
    payload,
  };
}
export function disableRspNotification(payload) {
  return {
    type: DISABLE_RSP_NOTIFICATION,
    payload,
  };
}

export function saveSelectedAccount(payload) {
  return {
    type: SAVE_SELECTED_ACCOUNT_DETAILS,
    payload,
  };
}
export function callWholeSaleDisclaierAcknowledgeApi(payload) {
  return {
    type: WHOLESALE_DISCLAIMER_ACKNOWLEDGE,
    payload,
  };
}
export function initAccountCreationType(payload) {
  return {
    type: SET_ACCOUNT_CREATION_FLOW,
    payload,
  };
}

export function showPaymentSelectionSubscribe(payload) {
  return {
    type: SHOW_PAYMENT_SELECTION_SUBSCRIBE,
    payload,
  };
}

export function emailOtpRequest(payload) {
  return {
    type: EMAIL_OTP_REQUEST,
    payload,
  };
}

export function emailOtpRequestSuccess() {
  return {
    type: EMAIL_OTP_SUCCESS,
  };
}

export function emailOtpRequestFailure(err) {
  return {
    type: EMAIL_OTP_FAILURE,
    err,
  };
}

export function resetAmlaErrorObject() {
  return {
    type: RESET_AMLA_ERROR_OBJECT,
  };
}

export function resetEmailOtpState() {
  return {
    type: RESET_EMAIL_OTP_STATE,
  };
}

export function cancelPendingTrxRequest(payload) {
  return {
    type: CANCEL_PENDING_TRX_REQUEST,
    payload,
  };
}

export function cancelPendingTrxSuccess() {
  return {
    type: CANCEL_PENDING_TRX_SUCCESS,
  };
}

export function cancelPendingTrxFailure() {
  return {
    type: CANCEL_PENDING_TRX_FAILURE,
  };
}

export function resetCancelPendingTrxState() {
  return {
    type: RESET_CANCEL_PENDING_TRX_STATE,
  };
}

export function cancelPendingRspRequest(payload) {
  return {
    type: CANCEL_PENDING_RSP_REQUEST,
    payload,
  };
}

export function cancelPendingRspSuccess() {
  return {
    type: CANCEL_PENDING_RSP_SUCCESS,
  };
}

export function cancelPendingRspFailure() {
  return {
    type: CANCEL_PENDING_RSP_FAILURE,
  };
}

export function setSelectedVerificationOption(selectedOption) {
  return {
    type: SET_SELECTED_VERIFICATION_OPTION,
    selectedOption,
  };
}

export function getDefaultSalesChargeRequest(funds) {
  return { type: GET_DEFAULT_SALES_CHARGE_REQUEST, funds };
}

export function getDefaultSalesChargeSuccess(res) {
  return {
    type: GET_DEFAULT_SALES_CHARGE_SUCCESS,
    res,
  };
}

export function getDefaultSalesChargeFailure(err) {
  return {
    type: GET_DEFAULT_SALES_CHARGE_FAILURE,
    err,
  };
}

export function verifyCampaignCodeRequest(payload) {
  return {
    type: VERIFY_CAMPAIGN_CODE_REQUEST,
    payload,
  };
}

export function verifyCampaignCodeSuccess(res) {
  return {
    type: VERIFY_CAMPAIGN_CODE_SUCCESS,
    res,
  };
}

export function verifyCampaignCodeFailure(err, fundCode) {
  return {
    type: VERIFY_CAMPAIGN_CODE_FAILURE,
    err,
    fundCode,
  };
}

export function removeCampaignCode(fundCode) {
  return {
    type: REMOVE_CAMPAIGN_CODE,
    fundCode,
  };
}

export function getDocumentsUrl() {
  return {
    type: GET_DOCUMENTS_URL,
  };
}

export function saveDocumentsUrl(payload) {
  return {
    type: SAVE_DOCUMENTS_URL,
    payload,
  };
}

export function getPendingTransactions(payload) {
  return {
    type: GET_PENDING_TRANSACTIONS,
    payload,
  };
}

export function savePendingTransactions(payload) {
  return {
    type: SAVE_PENDING_TRANSACTIONS,
    payload,
  };
}

export function callCancelPendingTransactions(payload, isRspPayment) {
  return {
    type: CALL_CANCEL_PENDING_TRANSACTIONS,
    payload,
    isRspPayment,
  };
}

export function cancelPendingTransactionsSuccess() {
  return {
    type: CANCEL_PENDING_TRANSACTIONS_SUCCESS,
  };
}
