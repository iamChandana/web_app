/*
 *
 * Login actions
 *
 */

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USERID_VERIFY,
  USERID_CHECK_SUCCESS,
  USERID_CHECK_FAIL,
  USERID_VERIFY_SUCCESS,
  USERID_VERIFY_FAIL,
  OTP_POST,
  OTP_POST_SUCCESS,
  OTP_POST_FAIL,
  SECRETS_POST,
  SECRETS_POST_SUCCESS,
  SECRETS_POST_FAIL,
  PROCESSING,
  USERID_CHECK,
  AGREEMENT_ACCEPT,
  USERID_RECOVER_FAIL,
  MODE_SET,
  USERID_RECOVER,
  USERID_RECOVER_SUCCESS,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD_OTP_REQUEST,
  CHANGE_PASSWORD_OTP_REQUEST_SUCCESS,
  CHANGE_PASSWORD_OTP_REQUEST_FAIL,
  INIT_RESET_PASSWORD,
  INIT_RESET_PASSWORD_SUCCESS,
  INIT_RESET_PASSWORD_FAIL,
  RESET_PASSWORD_TOKEN_VERIFY,
  RESET_PASSWORD_EXECUTE,
  RESET_TOKEN_SAVE,
  RESET_PASSWORD_TOKEN_VERIFY_SUCCESS,
  RESET_PASSWORD_EXECUTE_SUCCESS,
  RESET_PASSWORD_TOKEN_VERIFY_FAIL,
  ERROR_RESET,
  CLOSE_OTP_MODAL,
  SET_OTP_ERROR,
  SEND_OTP_SUCCESS_TOKEN,
  SEND_OTP_FAIL_TOKEN,
  INIT_FIRST_TIME_LOGIN_OTP,
  INIT_FIRST_TIME_LOGIN_OTP_SUCCESS,
  INIT_FIRST_TIME_LOGIN_OTP_FAIL,
  OPEN_FIRST_TIME_LOGIN_OTP_MODAL,
  EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_SUCCESS,
  EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_FAIL,
  SAVE_TOKEN_OF_FIRST_TIME_LOGIN_OTP_SUCCESS_FROM_EXEC_AFTER_OTP,
  VERIFY_USERNAME_AND_PASSWORD,
  SET_USERNAME_AND_PASSWORD_VERIFY_STATUS,
  EXEC_AFTER_CHANGE_PASSWORD_OTP_VERIFY_SUCCESS,
  MARKET_NEWS_REQUEST,
  MARKET_NEWS_SUCCESS,
  MARKET_NEWS_FAILED,
  RESET,
  RESET_CHANGE_PASSWORD_STATE,
  SET_CHANGE_PASSWORD_MODEL_OPEN,
} from './constants';

export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}

export function login(payload) {
  return {
    type: LOGIN,
    payload,
  };
}

export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
}

export function loginFail(payload) {
  return {
    type: LOGIN_FAIL,
    payload,
  };
}

// user id check
export function checkUserId(userId) {
  return {
    type: USERID_CHECK,
    userId,
  };
}

export function checkUserIdSuccess(payload) {
  let updatedPayload = payload;

  if (!payload.isFirstTime) {
    updatedPayload = { ...payload, mode: 'login' };
  }

  return {
    type: USERID_CHECK_SUCCESS,
    payload: updatedPayload,
  };
}

export function checkUserIdFail(payload) {
  return {
    type: USERID_CHECK_FAIL,
    payload,
  };
}

// user id verify
export function verifyUserId(userId) {
  return {
    type: USERID_VERIFY,
    userId,
  };
}

export function verifyUserIdSuccess(payload) {
  return {
    type: USERID_VERIFY_SUCCESS,
    payload,
  };
}

export function verifyUserIdFail(payload) {
  return {
    type: USERID_VERIFY_FAIL,
    payload,
  };
}

// post otp
export function postOTP(payload) {
  return {
    type: OTP_POST,
    payload,
  };
}

export function postOTPSuccess(payload) {
  return {
    type: OTP_POST_SUCCESS,
    payload,
  };
}

export function postOTPFail(payload) {
  return {
    type: OTP_POST_FAIL,
    payload,
  };
}

// post secrets - image, word
export function postSecrets(payload) {
  return {
    type: SECRETS_POST,
    payload,
  };
}

export function postSecretsSuccess(payload) {
  return {
    type: SECRETS_POST_SUCCESS,
    payload,
  };
}

export function postSecretsFail(payload) {
  return {
    type: SECRETS_POST_FAIL,
    payload,
  };
}

export function acceptAgreement() {
  return {
    type: AGREEMENT_ACCEPT,
  };
}

// MODE SET
export function setMode(payload) {
  return {
    type: MODE_SET,
    payload,
  };
}

// recovery
export function recoverUserId(payload) {
  return {
    type: USERID_RECOVER,
    payload,
  };
}

export function recoverUserIdSuccess(payload) {
  return {
    type: USERID_RECOVER_SUCCESS,
    payload,
  };
}

export function recoverUserIdFail(payload) {
  return {
    type: USERID_RECOVER_FAIL,
    payload,
  };
}

// reset password
export function initResetPassword(payload) {
  return {
    type: INIT_RESET_PASSWORD,
    payload,
  };
}

export function initResetPasswordSuccess(payload) {
  return {
    type: INIT_RESET_PASSWORD_SUCCESS,
    payload,
  };
}

export function initResetPasswordFail(payload) {
  return {
    type: INIT_RESET_PASSWORD_FAIL,
    payload,
  };
}

export function resetPassword(payload) {
  return {
    type: RESET_PASSWORD,
    payload,
  };
}

export function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS,
  };
}

export function resetPasswordFail(payload) {
  return {
    type: RESET_PASSWORD_FAIL,
    payload,
  };
}

export function changePasswordSuccess(payload) {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    payload,
  };
}

export function changePasswordFail(payload) {
  return {
    type: CHANGE_PASSWORD_FAIL,
    payload,
  };
}

export function changePasswordOtpRequest(payload) {
  return {
    type: CHANGE_PASSWORD_OTP_REQUEST,
    payload,
  };
}

export function changePasswordOtpRequestFail(payload) {
  return {
    type: CHANGE_PASSWORD_OTP_REQUEST_FAIL,
    payload,
  };
}

export function changePasswordOtpRequestSuccess(payload) {
  return {
    type: CHANGE_PASSWORD_OTP_REQUEST_SUCCESS,
    payload,
  };
}

export function executeAfterChangePasswordOtpVerifySuccess(payload) {
  return {
    type: EXEC_AFTER_CHANGE_PASSWORD_OTP_VERIFY_SUCCESS,
    payload,
  };
}

export function verifyResetToken(payload) {
  return {
    type: RESET_PASSWORD_TOKEN_VERIFY,
    payload,
  };
}

export function verifyResetTokenSuccess(payload) {
  return {
    type: RESET_PASSWORD_TOKEN_VERIFY_SUCCESS,
    payload,
  };
}
export function verifyResetTokenFail(payload) {
  return {
    type: RESET_PASSWORD_TOKEN_VERIFY_FAIL,
    payload,
  };
}
export function executeResetToken(payload) {
  return {
    type: RESET_PASSWORD_EXECUTE,
    payload,
  };
}

export function executeResetTokenSuccess(payload) {
  return {
    type: RESET_PASSWORD_EXECUTE_SUCCESS,
    payload,
  };
}

export function saveResetToken(payload) {
  return {
    type: RESET_TOKEN_SAVE,
    payload,
  };
}

export function closeOtpModal() {
  return {
    type: CLOSE_OTP_MODAL,
    payload: true,
  };
}

export function setOtpError() {
  return {
    type: SET_OTP_ERROR,
    payload: {
      errorOtp: 'You have entered an invalid OTP',
      showOtpModal: true,
    },
  };
}

export function sendOtpSuccessToken(token) {
  return {
    type: SEND_OTP_SUCCESS_TOKEN,
    payload: token,
  };
}

export function sendOtpFailToken(token) {
  return {
    type: SEND_OTP_FAIL_TOKEN,
    payload: {
      token,
      errorOtp: 'You have entered an invalid OTP',
    },
  };
}

export function initFirstTimeLoginOtp(payload) {
  return {
    type: INIT_FIRST_TIME_LOGIN_OTP,
    payload, // userid
  };
}

export function initFirstTimeLoginOtpSuccess(payload) {
  return {
    type: INIT_FIRST_TIME_LOGIN_OTP_SUCCESS,
    payload: {
      otpParams: payload,
      showFirstTimeLoginOtpModal: true,
    },
  };
}

export function initFirstTimeLoginOtpFail(payload) {
  return {
    type: INIT_FIRST_TIME_LOGIN_OTP_FAIL,
    payload: {
      errorOtp: payload,
      showFirstTimeLoginOtpModal: true,
    },
  };
}

export function openFirstTimeLoginOtpModal(payload) {
  return {
    type: OPEN_FIRST_TIME_LOGIN_OTP_MODAL,
    payload,
  };
}

export function execAfterOTPfirstTimeLoginOtpSuccess(payload) {
  return {
    type: EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_SUCCESS,
    payload,
  };
}

export function execAfterOTPfirstTimeLoginOtpFail(payload) {
  return {
    type: EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_FAIL,
    payload,
  };
}

export function saveTokenOfFirstTimeLoginOtpSuccessFromExecAfterOTP(token) {
  return {
    type: SAVE_TOKEN_OF_FIRST_TIME_LOGIN_OTP_SUCCESS_FROM_EXEC_AFTER_OTP,
    payload: token,
  };
}

export function verifyUsernameAndPassword(payload) {
  return {
    type: VERIFY_USERNAME_AND_PASSWORD,
    payload,
  };
}

export function setUsernameAndPasswordVerifyStatus(payload) {
  return {
    type: SET_USERNAME_AND_PASSWORD_VERIFY_STATUS,
    payload,
  };
}

export function getMarketNews() {
  return {
    type: MARKET_NEWS_REQUEST,
  };
}

export function getMarketNewsSuccess(payload) {
  return {
    type: MARKET_NEWS_SUCCESS,
    payload,
  };
}

export function getMarketNewsFailed() {
  return {
    type: MARKET_NEWS_FAILED,
  };
}
// export function logout() {
//   return {
//     type: LOGOUT,
//   };
// }

// export function logoutSuccess() {
//   return {
//     type: LOGOUT_SUCCESS,
//   };
// }

export function resetError() {
  return {
    type: ERROR_RESET,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function resetChangePasswordState() {
  return {
    type: RESET_CHANGE_PASSWORD_STATE,
  };
}

export function setChangePasswordModelOpen(payload) {
  return {
    type: SET_CHANGE_PASSWORD_MODEL_OPEN,
    payload,
  };
}
