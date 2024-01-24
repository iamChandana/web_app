/*
 *
 * Login reducer
 *
 */

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  PROCESSING,
  USERID_CHECK_SUCCESS,
  USERID_CHECK_FAIL,
  USERID_VERIFY_SUCCESS,
  USERID_VERIFY_FAIL,
  OTP_POST_SUCCESS,
  OTP_POST_FAIL,
  SECRETS_POST_SUCCESS,
  SECRETS_POST_FAIL,
  AGREEMENT_ACCEPT,
  MODE_SET,
  USERID_RECOVER_SUCCESS,
  INIT_RESET_PASSWORD_SUCCESS,
  USERID_RECOVER_FAIL,
  INIT_RESET_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_TOKEN_SAVE,
  RESET_PASSWORD_TOKEN_VERIFY_SUCCESS,
  RESET_PASSWORD_EXECUTE_SUCCESS,
  RESET_PASSWORD_TOKEN_VERIFY_FAIL,
  ERROR_RESET,
  CLOSE_OTP_MODAL,
  SET_OTP_ERROR,
  SEND_OTP_FAIL_TOKEN,
  SEND_OTP_SUCCESS_TOKEN,
  INIT_FIRST_TIME_LOGIN_OTP_SUCCESS,
  INIT_FIRST_TIME_LOGIN_OTP_FAIL,
  OPEN_FIRST_TIME_LOGIN_OTP_MODAL,
  SAVE_TOKEN_OF_FIRST_TIME_LOGIN_OTP_SUCCESS_FROM_EXEC_AFTER_OTP,
  CHANGE_PASSWORD_OTP_REQUEST_SUCCESS,
  CHANGE_PASSWORD_OTP_REQUEST_FAIL,
  SET_USERNAME_AND_PASSWORD_VERIFY_STATUS,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  MARKET_NEWS_SUCCESS,
  MARKET_NEWS_REQUEST,
  MARKET_NEWS_FAILED,
  RESET,
  RESET_CHANGE_PASSWORD_STATE,
  SET_CHANGE_PASSWORD_MODEL_OPEN,
} from './constants';

const initialState = {
  processing: false,
  userInfo: {},
  error: '',
  mode: 'login',
  authenticated: false,
  tokenVerified: false,
  passwordResetted: false,
  lockout: false,
  showOtpModal: false,
  showFirstTimeLoginOtpModal: false,
  otpiFrameUrl: null,
  isUsernameAndPasswordVerified: false,
  changePasswordStep: 1,
  news: {
    data: null,
    loading: false,
    error: null,
  },
  isPasswordChangedSuccess: false,
  message: '',
  changePasswordModelOpen: false,
};

// no case declaration
let isFirstTime;
let mode;
let authenticated;
let newState;

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case LOGIN_SUCCESS:
      isFirstTime = state.userInfo.agent.isFirstTime || !state.prevMode;
      mode = 'confirm';
      authenticated = false;
      if (!isFirstTime) {
        authenticated = true;
        mode = 'login';
      }
      return {
        ...state,
        mode,
        authenticated,
        error: '',
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload.error,
        message: action.payload.message,
      };

    case USERID_CHECK_SUCCESS:
      return {
        ...state,
        prevMode: state.prevMode === 'reset' ? 'resetConfirm' : action.payload.agent.isFirstTime ? '' : 'login', // eslint-disable-line
        error: '',
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
        userInfoForResetPassword: {
          ...state.userInfoForResetPassword,
          ...action.payload,
        },
      };

    case USERID_CHECK_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case USERID_VERIFY_SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    case USERID_VERIFY_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case OTP_POST_SUCCESS:
      return {
        ...state,
        mode: 'secrets',
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    case OTP_POST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case SECRETS_POST_SUCCESS:
      return {
        ...state,
        mode: 'password',
        error: '',
        userInfo: {
          ...state.userInfo,
          agent: {
            ...state.userInfo.agent,
            ...action.payload,
          },
        },
      };
    case SECRETS_POST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case AGREEMENT_ACCEPT:
      newState = {
        ...state,
      };
      newState.mode = 'verify';
      newState.userInfo.agent.isFirstTime = false;
      return newState;
    case USERID_RECOVER_SUCCESS:
      return {
        ...state,
        mode: 'recoveryConfirm',
        userInfo: {
          ...state.userInfo,
          agent: {
            ...state.userInfo.agent,
            ...action.payload,
          },
        },
      };
    case USERID_RECOVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case INIT_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        prevMode: 'reset',
        userInfo: {
          ...state.userInfo,
          otpParams: action.payload,
        },
        showOtpModal: true,
      };
    case INIT_RESET_PASSWORD_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        mode: 'resetEmailSend',
        userInfo: {
          ...state.userInfo,
          resetEmailSuccess: true,
        },
      };
    case RESET_TOKEN_SAVE:
      return {
        ...state,
        resetToken: action.payload,
      };
    case RESET_PASSWORD_TOKEN_VERIFY_SUCCESS:
      return {
        ...state,
        tokenVerified: true,
        userId: action.payload,
      };
    case RESET_PASSWORD_TOKEN_VERIFY_FAIL:
      return {
        ...state,
        tokenVerified: false,
      };
    case RESET_PASSWORD_EXECUTE_SUCCESS:
      return {
        ...state,
        passwordResetted: true,
        mode: 'passwordResetted',
      };
    case MODE_SET:
      if (action.payload === 'login') {
        return {
          ...initialState,
          news: state.news,
        };
      }
      return {
        ...state,
        mode: action.payload,
        error: '',
      };
    case ERROR_RESET:
      return {
        ...state,
        error: '',
      };

    case CLOSE_OTP_MODAL:
      return {
        ...state,
        showOtpModal: false,
      };

    case SET_OTP_ERROR:
      return {
        ...state,
        errorOtp: action.payload.errorOtp,
        showOtpModal: action.payload.showOtpModal,
      };

    case SEND_OTP_SUCCESS_TOKEN:
      return {
        ...state,
        showOtpModal: false,
      };

    case SEND_OTP_FAIL_TOKEN:
      return {
        ...state,
        errorOtp: action.payload.errorOtp,
        showOtpModal: true,
      };

    case INIT_FIRST_TIME_LOGIN_OTP_SUCCESS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          otpParams: action.payload.otpParams,
        },
        showFirstTimeLoginOtpModal: true,
      };

    case INIT_FIRST_TIME_LOGIN_OTP_FAIL:
      return {
        ...state,
        errorOtp: action.payload.errorOtp,
        showFirstTimeLoginOtpModal: action.payload.showFirstTimeLoginOtpModal,
      };

    case OPEN_FIRST_TIME_LOGIN_OTP_MODAL:
      return {
        ...state,
        showFirstTimeLoginOtpModal: action.payload,
      };

    case SAVE_TOKEN_OF_FIRST_TIME_LOGIN_OTP_SUCCESS_FROM_EXEC_AFTER_OTP:
      return {
        ...state,
        firstTimeLoginSuccessTokenFromExecAfterOtp: action.payload,
      };

    case CHANGE_PASSWORD_OTP_REQUEST_SUCCESS:
      return {
        ...state,
        processing: false,
        showOtpModal: true,
        otpiFrameUrl: action.payload.otpiFrameUrl,
        newPassword: action.payload.newPassword,
      };

    case CHANGE_PASSWORD_OTP_REQUEST_FAIL:
      return {
        ...state,
        processing: false,
        error: action.payload,
      };
    // eslint-disable-next-line
    case SET_USERNAME_AND_PASSWORD_VERIFY_STATUS:
      const data = {
        ...state.userInfo,
      };

      if (action.payload.existingPassword) {
        data.existingPassword = action.payload.existingPassword;
      }

      if (action.payload.newToken && action.payload.newToken.length > 10) {
        data.access_token = action.payload.newToken;
      }

      if (action.payload.existingPassword || action.payload.newToken) {
        return {
          ...state,
          isUsernameAndPasswordVerified: action.payload.isUsernameAndPasswordVerified,
          changePasswordStep: action.payload.changePasswordStep,
          error: action.payload.error,
          message: action.payload.message,
          userInfo: data,
        };
      }

      return {
        ...state,
        isUsernameAndPasswordVerified: action.payload.isUsernameAndPasswordVerified,
        changePasswordStep: action.payload.changePasswordStep,
        error: action.payload.error,
        message: action.payload.message,
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        processing: false,
        showOtpModal: false,
        isPasswordChangedSuccess: true,
        error: null,
        newPassword: null,
        userInfo: {
          ...state.userInfo,
          existingPassword: null,
        },
        message: action.payload,
        isUsernameAndPasswordVerified: false,
        changePasswordStep: 1,
        changePasswordModelOpen: false,
      };

    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        processing: false,
        showOtpModal: false,
        isPasswordChangedSuccess: false,
        error: action.payload.error,
        newPassword: null,
        userInfo: {
          ...state.userInfo,
          existingPassword: null,
        },
        isUsernameAndPasswordVerified: false,
        changePasswordStep: 1,
        changePasswordModelOpen: false,
        message: action.payload.message,
      };

    case MARKET_NEWS_REQUEST:
      return {
        ...state,
        news: {
          ...state.news,
          loading: true,
        },
      };
    case MARKET_NEWS_SUCCESS:
      return {
        ...state,
        news: {
          ...state.news,
          loading: false,
          data: action.payload.data,
        },
      };
    case MARKET_NEWS_FAILED:
      return {
        ...state,
        news: initialState.news,
      };
    case RESET:
      return {
        ...state,
        processing: false,
        userInfo: {},
        error: '',
        mode: 'login',
        authenticated: false,
        tokenVerified: false,
        passwordResetted: false,
        lockout: false,
        showOtpModal: false,
        showFirstTimeLoginOtpModal: false,
        otpiFrameUrl: null,
        isUsernameAndPasswordVerified: false,
        changePasswordStep: 1,
        changePasswordModelOpen: false,
      };
    case RESET_CHANGE_PASSWORD_STATE:
      return {
        ...state,
        message: null,
        error: null,
        isPasswordChangedSuccess: false,
      };
    case SET_CHANGE_PASSWORD_MODEL_OPEN:
      return {
        ...state,
        changePasswordModelOpen: action.payload,
      };
    default:
      return state;
  }
}

export default loginReducer;
