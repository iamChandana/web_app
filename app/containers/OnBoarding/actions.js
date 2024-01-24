/*
 *
 * OnBoarding actions
 *
 */

import {
  TITLE_SET,
  INTRODUCTION_SAVE,
  STEP_SET,
  RISK_PROFILE_1_SAVE,
  RISK_PROFILE_2_SAVE,
  RISK_PROFILE_3_SAVE,
  RISK_PROFILE_4_SAVE,
  RISK_PROFILE_5_SAVE,
  CLEAR_RISK_PROFILE_ANSWERS,
  RISK_PROFILES_GET_SUCCESS,
  FUNDS_SAVE,
  INITIAL_INVESTMENT_SAVE,
  PERSONAL_DETAILS_SAVE,
  FUNDS_DRAWER_SAVE,
  PROCESSING,
  FUNDS_GET,
  FUNDS_GET_SUCCESS,
  RISK_QUESTIONS_ANSWERS_GET,
  RISK_QUESTIONS_ANSWERS_GET_SUCCES,
  RISK_SCORE_GET,
  RISK_SCORE_GET_SUCCESS,
  DOC_REUPLOAD,
  FILE_UPLOAD,
  FILE_UPLOAD_DOC,
  FILE_UPLOAD_FAILED,
  FILE_UPLOAD_DOC_FAILED,
  RISK_PROFILES_GET,
  IMAGE_SAVE,
  ACCOUNT_CREATE,
  ACCOUNT_CREATE_SUCCESS,
  FUNDS_ALL_GET,
  FUNDS_ALL_GET_SUCCESS,
  ANNUAL_INCOME_GET,
  ANNUAL_INCOME_GET_SUCCESS,
  RESET,
  IMAGE_REMOVE,
  ORDER_CREATE,
  PAYMENT_DOCS_CREATE,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  PAYMENT_DOCS_CREATE_SUCCESS,
  ERROR,
  ERROR_RESET,
  AMLA_CHECK,
  AMLA_CHECK_SUCCESS,
  AMLA_CHECK_FAIL,
  AMLA_RESET,
  OPEN_ONBAORDING_CLIENT_CONFIRMATION_OTP_MODAL,
  INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP,
  INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP_SUCCESS,
  INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP_FAIL,
  ACCOUNT_CREATION_OTP_CORRECT,
  ACCOUNT_CREATION_OTP_INCORRECT,
  ADD_PRODUCT_TO_PORTFOLIO,
  ADD_PRODUCT_TO_PORTFOLIO_SUCCESS,
  ADD_PRODUCT_TO_PORTFOLIO_FAIL,
  ADDED_PRODUCT_TO_POTFOLIO_RESET,
  TRANSACTION_FILE_UPLOAD,
  TRANSACTION_FILE_UPLOAD_SUCCESS,
  PERSONAL_DETAILS_VALIDATE,
  PERSONAL_DETAILS_VALIDATE_SUCCESS,
  PERSONAL_DETAILS_VALIDATE_FAIL,
  POSTAL_CODE_VALIDATE,
  POSTAL_CODE_VALIDATE_SUCCESS,
  POSTAL_CODE_VALIDATE_FAIL,
  PAYMENT_DOCS_UPLOADED_RESET,
  PAYMENT_METHOD_SET,
  FUNDS_SAVE_SELECTED,
  SAVE_ALL_FUNDS_WITH_FUND_DETAILS,
  GET_ALL_FUNDS_WITH_FUND_DETAILS,
  CORRESPONDENCE_IS_PERMANENT_SET,
  SELECTED_FUND_REMOVE,
  AMLA_CHECK_FAIL_ON_ADD_FUND,
  CIF_DETAILS_SAVE,
  CHECK_CIF,
  CIF_ALREADY_EXIST,
  RESET_CIF_ALREADY_EXIST,
  SET_RISK_PROFILE_TYPE,
  SAVE_INTRO_SUCCESS,
  CLEAR_STATE_FROM_POSTAL_CODE,
  DISABLE_NOB,
  CLEAR_IMAGE,
  RESET_OTP,
  PROCESSING_GET_ALL_FUND_WITH_FUND_DETAILS,
  CLEAR_STATES_FOR_ADD_FUND,
  DOC_REUPLOAD_SUCCESS,
  DOC_REUPLOAD_FAILURE,
  CLEAR_REUPLOAD_LOGS,
  INIT_MULTI_AGENT_MAP_OTP,
  INIT_MULTI_AGENT_MAP_OTP_SUCCESS,
  INIT_MULTI_AGENT_MAP_OTP_FAILURE,
  CLEAR_MULTI_AGENT_MAP_OTP_DATA,
  MULTI_AGENT_MAP,
  MULTI_AGENT_MAP_SUCCESS,
  MULTI_AGENT_MAP_ERROR,
  PROCESSING_MULTI_AGENT_MAP,
  NOT_FOUND_PDA_ERROR,
  SAVE_INTEREST,
  SAVE_DRAFT,
  GET_DRAFT,
  GET_DRAFT_SUCCESS,
  CLEAR_UNSAVED_IMAGES,
  SAVE_KWSP_CASH_CIF_DETAILS,
  RESET_INTRO_DETAILS,
  CLEAR_PORTFOLIO_ERROR,
  CLEAR_RISK_PROFILE_TYPE,
  GET_DEFAULT_SALES_CHARGE_REQUEST,
  GET_DEFAULT_SALES_CHARGE_SUCCESS,
  GET_DEFAULT_SALES_CHARGE_FAILURE,
  VERIFY_CAMPAIGN_CODE_REQUEST,
  VERIFY_CAMPAIGN_CODE_SUCCESS,
  VERIFY_CAMPAIGN_CODE_FAILURE,
  REMOVE_CAMPAIGN_CODE,
  QUERYISAF_AMLA_SUCCESS,
  QUERYISAF_AMLA_FAIL,
  QUERYISAF_AMLA_RESET,
} from './constants';
import { CUSTOMER_GET, CUSTOMER_GET_SUCCESS } from '../ClientDetails/constants';

export function reset() {
  return {
    type: RESET,
  };
}
export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}

export function setTitle(payload) {
  return {
    type: TITLE_SET,
    payload,
  };
}

export function setStep(payload) {
  return {
    type: STEP_SET,
    payload,
  };
}

// introduction
export function saveIntroduction(payload) {
  return {
    type: INTRODUCTION_SAVE,
    payload,
  };
}
// RISK PROFILE
export function clearRiskProfileType() {
  return {
    type: CLEAR_RISK_PROFILE_TYPE,
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
export function saveRiskProfile1(payload) {
  return {
    type: RISK_PROFILE_1_SAVE,
    payload,
  };
}

export function saveRiskProfile2(payload) {
  return {
    type: RISK_PROFILE_2_SAVE,
    payload,
  };
}

export function saveRiskProfile3(payload) {
  return {
    type: RISK_PROFILE_3_SAVE,
    payload,
  };
}

export function saveRiskProfile4(payload) {
  return {
    type: RISK_PROFILE_4_SAVE,
    payload,
  };
}

export function saveRiskProfile5(payload) {
  return {
    type: RISK_PROFILE_5_SAVE,
    payload,
  };
}

export function clearRiskProfileAnswers() {
  return {
    type: CLEAR_RISK_PROFILE_ANSWERS,
  };
}

export function getRiskProfiles() {
  return {
    type: RISK_PROFILES_GET,
  };
}

export function saveRiskProfiles(payload) {
  return {
    type: RISK_PROFILES_GET_SUCCESS,
    payload,
  };
}
export function getRiskScore(payload) {
  return {
    type: RISK_SCORE_GET,
    payload,
  };
}

export function saveRiskScore(payload) {
  return {
    type: RISK_SCORE_GET_SUCCESS,
    payload,
  };
}

// FUNDS
export function saveFunds(payload) {
  return {
    type: FUNDS_SAVE,
    payload,
  };
}

export function saveFundsSelected(payload) {
  return {
    type: FUNDS_SAVE_SELECTED,
    payload,
  };
}

export function saveInitialInvestment(payload) {
  return {
    type: INITIAL_INVESTMENT_SAVE,
    payload,
  };
}

export function savePersonalDetails(payload) {
  return {
    type: PERSONAL_DETAILS_SAVE,
    payload,
  };
}

export function saveFundsDrawer(payload) {
  return {
    type: FUNDS_DRAWER_SAVE,
    payload,
  };
}

// Funds
export function getFunds(payload) {
  return {
    type: FUNDS_GET,
    payload,
  };
}

export function getFundsSuccess(payload) {
  return {
    type: FUNDS_GET_SUCCESS,
    payload,
  };
}

export function getAllFunds() {
  return {
    type: FUNDS_ALL_GET,
  };
}

export function getAllFundsSuccess(payload) {
  return {
    type: FUNDS_ALL_GET_SUCCESS,
    payload,
  };
}

// IMAGES
export function uploadPhoto(payload) {
  return {
    type: FILE_UPLOAD,
    payload,
  };
}

export function uploadDocPhoto(payload) {
  return {
    type: FILE_UPLOAD_DOC,
    payload,
  };
}

export function clearUploadedUnsavedImages() {
  return {
    type: CLEAR_UNSAVED_IMAGES,
  };
}
export function uploadPhotoFailed() {
  return {
    type: FILE_UPLOAD_FAILED,
  };
}

export function docUploadPhotoFailed() {
  return {
    type: FILE_UPLOAD_DOC_FAILED,
  };
}
export function saveImage(payload) {
  return {
    type: IMAGE_SAVE,
    payload,
  };
}

export function removePhoto(payload) {
  return {
    type: IMAGE_REMOVE,
    payload,
  };
}

export function reUploadDocument(payload) {
  return {
    type: DOC_REUPLOAD,
    payload,
  };
}

export function reUploadDocumentSuccess(payload) {
  return {
    type: DOC_REUPLOAD_SUCCESS,
    payload,
  };
}

export function reUploadDocumentFailure(payload) {
  return {
    type: DOC_REUPLOAD_FAILURE,
    payload,
  };
}

export function clearReUploadDocsLogs() {
  return {
    type: CLEAR_REUPLOAD_LOGS,
  };
}

// ACCOUNT
export function createAccount(payload) {
  return {
    type: ACCOUNT_CREATE,
    payload,
  };
}
export function createAccountSuccess(payload) {
  return {
    type: ACCOUNT_CREATE_SUCCESS,
    payload,
  };
}
// export funtion createAccountFail(payload) {
//   return {
//     type: ACCOUNT_CREATE_FAIL,
//     paylo
//   }
// }

// order creation
export function createOrder(payload) {
  return {
    type: ORDER_CREATE,
    payload,
  };
}

export function createOrderSuccess(payload) {
  return {
    type: ORDER_CREATE_SUCCESS,
    payload,
  };
}

export function createOrderFail(payload) {
  return {
    type: ORDER_CREATE_FAIL,
    payload,
  };
}

export function createPaymentDocs(payload) {
  return {
    type: PAYMENT_DOCS_CREATE,
    payload,
  };
}

export function createPaymentDocsSuccess(payload) {
  return {
    type: PAYMENT_DOCS_CREATE_SUCCESS,
    payload,
  };
}

export function resetPaymentDocsUploadedData() {
  return {
    type: PAYMENT_DOCS_UPLOADED_RESET,
  };
}
// list of values
export function getAnnualIncome(payload) {
  return {
    type: ANNUAL_INCOME_GET,
    payload,
  };
}

export function getAnnualIncomeSuccess(payload) {
  return {
    type: ANNUAL_INCOME_GET_SUCCESS,
    payload,
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

// amla check
export function checkAmla(payload) {
  return {
    type: AMLA_CHECK,
    payload,
  };
}

export function checkAmlaSuccess(payload) {
  return {
    type: AMLA_CHECK_SUCCESS,
    payload,
  };
}

export function checkAmlaFail(payload) {
  return {
    type: AMLA_CHECK_FAIL,
    payload,
  };
}

export function resetAmla() {
  return {
    type: AMLA_RESET,
  };
}

export function openOnBoardingClientConfirmationOtpModal(payload) {
  return {
    type: OPEN_ONBAORDING_CLIENT_CONFIRMATION_OTP_MODAL,
    payload,
  };
}

export function initOnBoardingClientConfirmationOtp(payload) {
  return {
    type: INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP,
    payload,
  };
}

export function initOnboardingClientConfirmationOtpSuccess(payload) {
  return {
    type: INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP_SUCCESS,
    payload,
  };
}

export function initOnboardingClientConfirmationOtpFail(payload) {
  return {
    type: INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP_FAIL,
    payload,
  };
}

export function accountCreationOtpCorrect(payload) {
  return {
    type: ACCOUNT_CREATION_OTP_CORRECT,
    payload,
  };
}

export function accountCreationOtpIncorrect(payload) {
  return {
    type: ACCOUNT_CREATION_OTP_INCORRECT,
    payload,
  };
}

export function getCustomer(payload) {
  return {
    type: CUSTOMER_GET,
    payload,
  };
}

export function getCustomerSuccess(payload) {
  return {
    type: CUSTOMER_GET_SUCCESS,
    payload,
  };
}

export function addProductToPortfolio(payload) {
  return {
    type: ADD_PRODUCT_TO_PORTFOLIO,
    payload,
  };
}

export function clearAddedPortfolioErrors() {
  console.log('Clearing');
  return {
    type: CLEAR_PORTFOLIO_ERROR,
  };
}
export function addProductToPortfolioSuccess(payload) {
  return {
    type: ADD_PRODUCT_TO_PORTFOLIO_SUCCESS,
    payload,
  };
}

export function addProductToPortfolioFail(payload) {
  return {
    type: ADD_PRODUCT_TO_PORTFOLIO_FAIL,
    payload,
  };
}

export function resetAddedProductToPortfolio() {
  return {
    type: ADDED_PRODUCT_TO_POTFOLIO_RESET,
  };
}

export function uploadTransactionFile(payload) {
  return {
    type: TRANSACTION_FILE_UPLOAD,
    payload,
  };
}

export function uploadTransactionFileSuccess(payload) {
  return {
    type: TRANSACTION_FILE_UPLOAD_SUCCESS,
    payload,
  };
}

export function uploadTransactionFileFail(payload) {
  return {
    type: TRANSACTION_FILE_UPLOAD,
    payload,
  };
}

export function validatePersonalDetails(payload) {
  return {
    type: PERSONAL_DETAILS_VALIDATE,
    payload,
  };
}

export function validatePersonalDetailsSuccess(payload) {
  return {
    type: PERSONAL_DETAILS_VALIDATE_SUCCESS,
    payload,
  };
}

export function validatePersonalDetailsFail(payload) {
  return {
    type: PERSONAL_DETAILS_VALIDATE_FAIL,
    payload,
  };
}

export function validatePostalCode(payload) {
  return {
    type: POSTAL_CODE_VALIDATE,
    payload,
  };
}

export function validatePostalCodeSuccess(payload) {
  return {
    type: POSTAL_CODE_VALIDATE_SUCCESS,
    payload,
  };
}

export function validatePostalCodeFail(payload) {
  return {
    type: POSTAL_CODE_VALIDATE_FAIL,
    payload,
  };
}

export function setPaymentMethod(payload) {
  return {
    type: PAYMENT_METHOD_SET,
    payload,
  };
}

export function getAllFundsWithFundDetails() {
  return {
    type: GET_ALL_FUNDS_WITH_FUND_DETAILS,
  };
}

export function saveAllFundsWithFundDetails(payload) {
  return {
    type: SAVE_ALL_FUNDS_WITH_FUND_DETAILS,
    payload,
  };
}

export function setCorrespondencePermanentEquality(payload) {
  return {
    type: CORRESPONDENCE_IS_PERMANENT_SET,
    payload,
  };
}

export function removeSelectedFund(payload) {
  return {
    type: SELECTED_FUND_REMOVE,
    payload,
  };
}

export function checkAmlaFailOnAddFund(payload) {
  return {
    type: AMLA_CHECK_FAIL_ON_ADD_FUND,
    payload,
  };
}
export function saveCifDetails(payload) {
  return {
    type: CIF_DETAILS_SAVE,
    payload,
  };
}

export function saveKWSPandCashDetails(payload) {
  return {
    type: SAVE_KWSP_CASH_CIF_DETAILS,
    payload,
  };
}

export function checkCif(payload) {
  return {
    type: CHECK_CIF,
    payload,
  };
}

export function cifAlreadyExist(payload) {
  return {
    type: CIF_ALREADY_EXIST,
    payload,
  };
}

export function resetCifAlreadyExist() {
  return {
    type: RESET_CIF_ALREADY_EXIST,
  };
}

export function setRiskProfileType(payload) {
  return {
    type: SET_RISK_PROFILE_TYPE,
    payload,
  };
}

export function saveIntroductionSuccess(payload) {
  return {
    type: SAVE_INTRO_SUCCESS,
    payload,
  };
}

export function saveInterest(interest) {
  return {
    type: SAVE_INTEREST,
    payload: interest,
  };
}

export function clearStateFromPostalCode() {
  return {
    type: CLEAR_STATE_FROM_POSTAL_CODE,
  };
}

export function disableNOB(payload) {
  return {
    type: DISABLE_NOB,
    payload,
  };
}

export function clearImage() {
  return {
    type: CLEAR_IMAGE,
  };
}

export function resetOtp() {
  return {
    type: RESET_OTP,
  };
}

export function processingGetAllFundWithFundDetails(payload) {
  return {
    type: PROCESSING_GET_ALL_FUND_WITH_FUND_DETAILS,
    payload,
  };
}

export function clearStatesForAddFund() {
  return {
    type: CLEAR_STATES_FOR_ADD_FUND,
  };
}

export function initMultiAgentMapOtp() {
  return {
    type: INIT_MULTI_AGENT_MAP_OTP,
  };
}

export function initMultiAgentMapOtpSuccess(payload) {
  return {
    type: INIT_MULTI_AGENT_MAP_OTP_SUCCESS,
    payload,
  };
}

export function initMultiAgentMapOtpFailure(payload) {
  return {
    type: INIT_MULTI_AGENT_MAP_OTP_FAILURE,
    payload,
  };
}

export function clearMultiAgentMapOtpData() {
  return {
    type: CLEAR_MULTI_AGENT_MAP_OTP_DATA,
  };
}

export function multiAgentMap(payload) {
  return {
    type: MULTI_AGENT_MAP,
    payload,
  };
}

export function multiAgentMapSuccess() {
  return {
    type: MULTI_AGENT_MAP_SUCCESS,
  };
}

export function multiAgentMapError(payload) {
  return {
    type: MULTI_AGENT_MAP_ERROR,
    payload,
  };
}

export function processingMultiAgentMap(payload) {
  return {
    type: PROCESSING_MULTI_AGENT_MAP,
    payload,
  };
}

export function notFoundPdaError() {
  return {
    type: NOT_FOUND_PDA_ERROR,
  };
}

export function saveDraft(payload) {
  return {
    type: SAVE_DRAFT,
    payload,
  };
}

export function getDraft(payload) {
  return {
    type: GET_DRAFT,
    payload,
  };
}

export function getDraftSuccess(payload) {
  return {
    type: GET_DRAFT_SUCCESS,
    payload,
  };
}

export function resetIntroductionPageDetails(payload) {
  return {
    type: RESET_INTRO_DETAILS,
    payload,
  };
}

export function getDefaultSalesChargeRequest(accountType) {
  return {
    type: GET_DEFAULT_SALES_CHARGE_REQUEST,
    accountType,
  };
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

export function verifyCampaignCodeRequest(payload, initialInvestment) {
  return {
    type: VERIFY_CAMPAIGN_CODE_REQUEST,
    payload,
    initialInvestment,
  };
}

export function verifyCampaignCodeSuccess(res) {
  return {
    type: VERIFY_CAMPAIGN_CODE_SUCCESS,
    res,
  };
}

export function verifyCampaignCodeFailure(fundCode, err) {
  return {
    type: VERIFY_CAMPAIGN_CODE_FAILURE,
    fundCode,
    err,
  };
}

export function removeCampaignCode(fundCode) {
  return {
    type: REMOVE_CAMPAIGN_CODE,
    fundCode,
  };
}

export function queryISAFAmlaSuccess(payload) {
  return {
    type: QUERYISAF_AMLA_SUCCESS,
    payload,
  };
}

export function queryISAFAmlaFail(payload) {
  return {
    type: QUERYISAF_AMLA_FAIL,
    payload,
  };
}

export function queryISAFAmlaReset() {
  return {
    type: QUERYISAF_AMLA_RESET,
  };
}
