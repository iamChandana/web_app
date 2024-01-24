/* eslint-disable */
import { takeLatest, call, put, select } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';
import passwordRequirement from 'utils/passwordRequirement';
import { post, get, update } from '../../utils/api';
import { storeItem } from '../../utils/tokenStore';

import {
  LOGIN,
  USERID_CHECK,
  USERID_VERIFY,
  OTP_POST,
  SECRETS_POST,
  USERID_RECOVER,
  RESET_PASSWORD,
  CHANGE_PASSWORD_OTP_REQUEST,
  INIT_RESET_PASSWORD,
  RESET_PASSWORD_TOKEN_VERIFY,
  RESET_PASSWORD_EXECUTE,
  LOGOUT,
  SEND_OTP_SUCCESS_TOKEN,
  SEND_OTP_FAIL_TOKEN,
  INIT_FIRST_TIME_LOGIN_OTP,
  EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_SUCCESS,
  EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_FAIL,
  VERIFY_USERNAME_AND_PASSWORD,
  EXEC_AFTER_CHANGE_PASSWORD_OTP_VERIFY_SUCCESS,
  MARKET_NEWS_REQUEST,
} from './constants';
import {
  loginSuccess,
  loginFail,
  verifyUserIdSuccess,
  verifyUserIdFail,
  postSecretsSuccess,
  postOTPFail,
  postSecretsFail,
  checkUserIdSuccess,
  postOTPSuccess,
  checkUserIdFail,
  processing,
  recoverUserIdSuccess,
  recoverUserIdFail,
  initResetPasswordSuccess,
  initResetPasswordFail,
  resetPasswordSuccess,
  resetPasswordFail,
  changePasswordSuccess,
  changePasswordFail,
  changePasswordOtpRequestSuccess,
  changePasswordOtpRequestFail,
  verifyResetTokenSuccess,
  executeResetTokenSuccess,
  verifyResetTokenFail,
  initFirstTimeLoginOtpFail,
  initFirstTimeLoginOtpSuccess,
  saveTokenOfFirstTimeLoginOtpSuccessFromExecAfterOTP,
  setMode,
  setUsernameAndPasswordVerifyStatus,
  getMarketNewsSuccess,
  getMarketNewsFailed,
} from './actions';

import { selectResetToken, selectMode, selectPrevMode, selectOTPParams, selectNewPassword, selectUserInfo } from './selectors';
import { encriptObject } from '../../utils/encodeDecode';

const maxAttemptWrongPassword = 2;

function getRandomItem(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function* getVerifyImages() {
  let images;
  const skip = getRandomItem([6, 12, 18]);
  const order = `id ${getRandomItem(['ASC', 'DESC'])}`;
  const endpoint = `verifyimages?filter[order]=${order}&filter[limit]=6&filter[skip]=${skip}`;
  try {
    const apiResponse = yield call(get, endpoint);
    images = apiResponse.data;
  } catch (error) {
    throw new Error('Error');
  }
  return images;
}

function* loginSaga(action) {
  try {
    const payload = {
      //client_id: 123,
      //client_secret: 'secret',
      //grant_type: 'password',
      //scope: 'demo',
      ...action.payload,
    };
    yield put(processing(true));
    const encryptedPayload = encriptObject(payload);
    //const response = yield call(post, 'gateway/oauth/token', payload);
    const response = yield call(post, 'gateway/_internal/Agents/agentLogin', { i: encryptedPayload });
    storeItem('access_token', response.data.access_token);
    yield put(loginSuccess(response.data));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      error = Object.assign({}, error.error);
      let errorMessage = 'Unknown Error';
      if (!isEmpty(error) && (error.message.errorCode === 'InvalidUserPassword' || error.message.errorCode === 'DefaultError')) {
        errorMessage = `${error.message.message} ${maxAttemptWrongPassword + 1 - error.message.badPwCount} attempt(s) left. `;
      } else {
        errorMessage = error.message.message;
      }
      yield put(loginFail({ error: error.message.errorCode, message: errorMessage }));
    }
  } finally {
    yield put(processing(false));
    localStorage.removeItem('emailSentInfo');
  }
}

function* checkUserIdSaga(action) {
  const apiUrl = 'gateway/_internal/Agents/verifyAgent';
  try {
    yield put(processing(true));
    const response = yield call(post, apiUrl, {
      userId: action.userId,
    });
    if (isEmpty(response.data)) {
      throw new Error('Incorrect User ID.');
    }
    yield put(checkUserIdSuccess(response.data));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(checkUserIdFail(error.error ? error.error.message : error.message));
    }
  } finally {
    yield put(processing(false));
  }
}

function* verifyUserIdSaga() {
  try {
    yield put(processing(true));
    yield put(verifyUserIdSuccess());
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(verifyUserIdFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

function* postOTPSaga() {
  try {
    yield put(processing(true));
    // yield put(postSecretsSuccess());
    const images = yield call(getVerifyImages);
    yield put(
      postOTPSuccess({
        images,
      }),
    );
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(postOTPFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

function* postSecretsSaga(action) {
  const endpoint = 'agents/updatesimgswAgent';
  try {
    yield put(processing(true));
    const response = yield call(update, endpoint, action.payload);
    response.data.agent.isFirstTime = false;
    yield put(postSecretsSuccess(response.data.agent));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(postSecretsFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

function* recoverUserIdSaga(action) {
  const endpoint = 'agents/recoverUserId';
  try {
    const apiPayload = {
      i: action.payload,
    };
    yield put(processing(true));
    const response = yield call(post, endpoint, apiPayload);
    yield put(recoverUserIdSuccess(response.data.status));
    if (isEmpty(response.data)) {
      throw new Error('NRIC number not found.');
    }
    yield put(recoverUserIdSuccess());
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      const errorMessage = error.error.statusCode === 400 ? 'Incorrect NRIC Number' : error.message;
      yield put(recoverUserIdFail(errorMessage));
    }
  } finally {
    yield put(processing(false));
  }
}

function* initResetPasswordSaga(action) {
  const endpoint = 'gateway/_internal/Agents/initresetPasswordrequest';
  try {
    yield put(processing(true));
    const response = yield call(post, endpoint, {
      userId: action.payload,
    });
    if (isEmpty(response.data)) {
      throw new Error('Incorrect User ID.');
    }
    yield put(initResetPasswordSuccess(response.data.OtpParams));
    yield call(checkUserIdSaga, {
      userId: action.payload,
    });
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      const errorMessage =
        !isEmpty(error) && !isEmpty(error.error) && error.error.statusCode === 400 ? 'Incorrect User ID.' : error.message;
      yield put(initResetPasswordFail(errorMessage));
    }
  } finally {
    yield put(processing(false));
  }
}

function* resetPasswordSaga() {
  const OtpParams = yield select(selectOTPParams());
  const { userId } = OtpParams;
  const endpoint = 'gateway/_internal/Agents/resetPasswordrequest';
  try {
    yield put(processing(true));
    yield call(post, endpoint, {
      userId,
    });
    yield put(resetPasswordSuccess());
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(resetPasswordFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

function* changePasswordOtpRequestSaga(action) {
  const endpoint = '/gateway/_internal/OtpTransactions/requestOTPVerification';
  try {
    yield put(processing(true));

    const response = yield call(post, endpoint, action.payload);
    if (response.data.res && response.data.res.otpiFrameUrl) {
      yield put(
        changePasswordOtpRequestSuccess({
          otpiFrameUrl: response.data.res.otpiFrameUrl,
          newPassword: action.payload.newPassword,
        }),
      );
    } else {
      yield put(changePasswordOtpRequestFail('Please contact OTP vendor'));
    }
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(changePasswordOtpRequestFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

function* executeResetPasswordSaga(action) {
  const reqPayload = {
    token: yield select(selectResetToken()),
    newPassword: action.payload.password,
    userId: action.payload.userId,
  };
  const endpoint = 'gateway/_internal/Agents/resetPasswordExecution';
  let res;
  try {
    yield put(processing(true));
    res = yield call(post, endpoint, reqPayload);
    yield put(executeResetTokenSuccess());
  } catch (error) {
    // yield put(changePasswordFail());
  } finally {
    yield put(processing(false));
  }

  return res;
}

function* verifyResetTokenSaga() {
  const token = yield select(selectResetToken());
  const endpoint = 'gateway/_internal/Agents/verifyResetpasswordToken';
  try {
    yield put(processing(true));
    const response = yield call(post, endpoint, {
      token,
    });
    if (response.data.agent.tokenStatus === 'Valid') {
      yield put(verifyResetTokenSuccess(response.data.agent.userId));
    } else {
      yield put(verifyResetTokenFail());
    }
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(verifyResetTokenFail());
    }
  } finally {
    yield put(processing(false));
  }
}

function* logoutSaga() {
  const endpoint = 'gateway/_internal/Agents/logout';

  try {
    yield put(processing(true));
    const response = yield call(post, endpoint);
  } catch (error) {}
}

function* sendOtpSuccessToken(action) {
  const endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload}`;

  try {
    const response = yield call(get, endpoint);

    // for first time user login
    if (response.data && response.data.res) {
      const tokenUponSuccessOtp = response.data.res.TokenUponSuccess;

      yield put(saveTokenOfFirstTimeLoginOtpSuccessFromExecAfterOTP(tokenUponSuccessOtp));
    }
  } catch (error) {
    console.error(`saga.js => sendOtpSuccessToken => error : ${error}`);
  }
}

function* sendOtpFailToken(action) {
  const endpoint = `gateway/_internal/OtpTransactions/stopAfterOTPInvalid?encP=${action.payload.token}`;

  try {
    yield call(get, endpoint);
  } catch (error) {
    console.error(`saga.js => sendOtpFailToken => error : ${error}`);
  }
}

function* initFirstTimeLoginOtpSaga(action) {
  const endpoint = 'gateway/_internal/OtpTransactions/requestOTPVerification';
  try {
    yield put(processing(true));
    const response = yield call(post, endpoint, {
      userId: action.payload,
      TransactionType: 'FirstTimeUser',
      reqPayload: action.payload,
      MobileNo: '-1',
    });
    if (isEmpty(response.data)) {
      throw new Error('Incorrect User ID.');
    }
    yield put(initFirstTimeLoginOtpSuccess(response.data.res.otpiFrameUrl));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      let errorMessage = !isEmpty(error) && error.error.statusCode === 400 ? 'Incorrect User ID.' : error.message;

      if (!errorMessage) {
        errorMessage = 'Failed to initialise OTP. Please try again later!';
      }
      yield put(initFirstTimeLoginOtpFail(errorMessage));
    }
  } finally {
    yield put(processing(false));
  }
}

function* execAfterFirstTimeLoginOtpFail(action) {
  const endpoint = `gateway/_internal/OtpTransactions/stopAfterOTPInvalid?encP=${action.payload}`;

  try {
    yield call(get, endpoint);
  } catch (error) {
    console.error(`saga.js => execAfterFirstTimeLoginOtpFail => error : ${error}`);
  }
}

function* execAfterFirstTimeLoginOtpSuccess(action) {
  const endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload}`;

  try {
    yield call(postOTPSaga);

    const response = yield call(get, endpoint);

    if (response.data && response.data.res) {
      const tokenUponSuccessOtp = response.data.res.TokenUponSuccess;

      yield put(saveTokenOfFirstTimeLoginOtpSuccessFromExecAfterOTP(tokenUponSuccessOtp));
    }
  } catch (error) {
    console.error(`saga.js => sendOtpSuccessToken => error : ${error}`);
  }
}

function* verifyUsernameAndPasswordSaga(action) {
  try {
    const payload = {
      ...action.payload,
    };
    yield put(processing(true));
    //const response = yield call(post, 'gateway/oauth/token', payload);
    const encryptedPayload = encriptObject(payload);
    const response = yield call(post, 'gateway/_internal/Agents/agentLogin', { i: encryptedPayload });
    //const response = yield call(post, 'gateway/_internal/Agents/agentLogin', payload);
    storeItem('access_token', response.data.access_token);
    yield put(
      setUsernameAndPasswordVerifyStatus({
        isUsernameAndPasswordVerified: true,
        changePasswordStep: 2,
        error: null,
        existingPassword: action.payload.password,
        newToken: response.data.access_token,
      }),
    );
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      error = Object.assign({}, error.error);
      /*let errorMessage = 'Incorrect Password'; // TODO: should be always define in backend
      if (!isEmpty(error) && error.error_description.errorCode === 'LOCKOUT') {
        errorMessage = 'LOCKOUT';
      }
      if (!isEmpty(error) && error.error_description.errorCode === 'InvalidUserPassword') {
        if (error.error_description.badPwCount > maxAttemptWrongPassword) {
          errorMessage = 'LOCKOUT';
        } else {
          errorMessage = `Incorrect Password. ${maxAttemptWrongPassword + 1 - error.error_description.badPwCount} attempt(s) left. `;
        }
      }*/
      let errorMessage = 'Unknown Error';
      if (!isEmpty(error) && (error.message.errorCode === 'InvalidUserPassword' || error.message.errorCode === 'DefaultError')) {
        errorMessage = `${error.message.message} ${maxAttemptWrongPassword + 1 - error.message.badPwCount} attempt(s) left. `;
      } else {
        errorMessage = error.message.message;
      }
      yield put(loginFail({ error: error.message.errorCode, message: errorMessage }));
      yield put(
        setUsernameAndPasswordVerifyStatus({
          isUsernameAndPasswordVerified: false,
          changePasswordStep: 1,
          error: errorMessage,
          message: errorMessage,
          existingPassword: null,
        }),
      );
    }
  } finally {
    yield put(processing(false));
  }
}

function* executeAfterChangePasswordOtpVerifySuccessSaga(action) {
  try {
    yield put(processing(true));
    const response = yield call(get, `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload}`);
    const userInfo = yield select(selectUserInfo());
    const reqPayload = {
      //token: action.payload, //yield select(selectResetToken()),
      token: userInfo.access_token,
      newPassword: yield select(selectNewPassword()),
      userId: userInfo.agent.username,
      existingPassword: userInfo.existingPassword,
    };
    const res = yield call(post, 'gateway/_internal/Agents/resetPasswordExecution', reqPayload);
    yield put(changePasswordSuccess(res.data.agent.message));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      console.error('saga.js => executeAfterChangePasswordOtpVerifySuccessSaga => error :', error);
      // yield put(changePasswordFail(error));
      //error = Object.assign({},error.error);
      yield put(changePasswordFail({ error: { message: passwordRequirement } }));
      //yield put(changePasswordFail({ error: error.error.statusCode, message: error.error.message }));
    }
  }
}

function* getMarketNews() {
  try {
    const response = yield call(get, 'gateway/_internal/MarketUpdates?filter[where][status]=true&filter[limit]=4');
    yield put(getMarketNewsSuccess(response));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(getMarketNewsFailed());
    }
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(USERID_CHECK, checkUserIdSaga);
  yield takeLatest(USERID_VERIFY, verifyUserIdSaga);
  yield takeLatest(OTP_POST, postOTPSaga);
  yield takeLatest(SECRETS_POST, postSecretsSaga);
  yield takeLatest(USERID_RECOVER, recoverUserIdSaga);
  yield takeLatest(RESET_PASSWORD, resetPasswordSaga);
  yield takeLatest(CHANGE_PASSWORD_OTP_REQUEST, changePasswordOtpRequestSaga);
  yield takeLatest(INIT_RESET_PASSWORD, initResetPasswordSaga);
  yield takeLatest(RESET_PASSWORD_TOKEN_VERIFY, verifyResetTokenSaga);
  yield takeLatest(RESET_PASSWORD_EXECUTE, executeResetPasswordSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(SEND_OTP_SUCCESS_TOKEN, sendOtpSuccessToken);
  yield takeLatest(SEND_OTP_FAIL_TOKEN, sendOtpFailToken);
  yield takeLatest(INIT_FIRST_TIME_LOGIN_OTP, initFirstTimeLoginOtpSaga);
  yield takeLatest(EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_FAIL, execAfterFirstTimeLoginOtpFail);
  yield takeLatest(EXEC_AFTER_OTP_FIRST_TIME_LOGIN_OTP_SUCCESS, execAfterFirstTimeLoginOtpSuccess);
  yield takeLatest(VERIFY_USERNAME_AND_PASSWORD, verifyUsernameAndPasswordSaga);
  yield takeLatest(EXEC_AFTER_CHANGE_PASSWORD_OTP_VERIFY_SUCCESS, executeAfterChangePasswordOtpVerifySuccessSaga);
  yield takeLatest(MARKET_NEWS_REQUEST, getMarketNews);
}
