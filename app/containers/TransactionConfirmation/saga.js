import { takeLatest, call, put } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import { get } from 'utils/api';

import {
  verifyTransactionSuccess,
  verifyTransactionFailure,
  decodeRejectedTransactionSuccess,
  decodeRejectedTransactionFailure,
  verifySwitchSuccess,
  verifySwitchFailure,
  verifyRedeemFailure,
  verifyRedeemSuccess,
} from './actions';
import {
  VERIFY_TRANSACTION_REQUEST,
  DECODE_REJECTED_TRANSACTION_REQUEST,
  VERIFY_SWITCH_REQUEST,
  VERIFY_REDEEM_REQUEST,
} from './constants';

function* verifyTransactionSaga({ payload, isRsp }) {
  try {
    // aStrMsgFromEmail is the msg encoded inside "verify link" eg. localhost:verify?r="transaction verify failed"
    const { token, qStrMsgFromEmail } = payload;
    let endpoint = 'createPaymentRequestWithDocAfterVerify';

    if (isRsp) {
      endpoint = 'setupRSPAfterVerify';
    }

    const response = yield call(get, `${endpoint}?t=${token}`);
    if (!token) {
      // when there is an error, token will be empty and queryStringMessage will be the error.
      yield put(verifyTransactionFailure(new Error(qStrMsgFromEmail || 'Verify transaction token does not exist.')));
    }
    console.log('response: ', response);

    yield put(verifyTransactionSuccess(response));
  } catch (err) {
    yield put(verifyTransactionFailure(err));
  }
}

function* decodeRejectedTransactionSaga({ payload }) {
  try {
    const encodedMessage = new URLSearchParams(payload).get('r');
    const decodedMessage = atob(encodedMessage);

    if (!decodedMessage.includes('success')) {
      if (decodedMessage.includes('token')) {
        yield put(replace('/customers/tokenExpired'));
      }

      yield put(decodeRejectedTransactionFailure(decodedMessage));
    } else {
      const transaction = {
        transactionType: new URLSearchParams(payload).get('typ') || new URLSearchParams(payload).get('rt') || '-',
        date: new URLSearchParams(payload).get('d'),
        refNo: new URLSearchParams(payload).get('t'),
        total: new URLSearchParams(payload).get('p'),
        funds: [],
        fund: new URLSearchParams(payload).get('fn'),
      };

      yield yield put(decodeRejectedTransactionSuccess(transaction));
    }
  } catch (err) {
    const error = err.error.message || 'Something Went Wrong!';

    yield put(decodeRejectedTransactionFailure(error));
  }
}

function* verifySwitchSaga({ payload }) {
  try {
    // aStrMsgFromEmail is the msg encoded inside "verify link" eg. localhost:verify?r="transaction verify failed"
    const { token, qStrMsgFromEmail } = payload;

    const response = yield call(get, `verifyTransactionSwRd?t=${token}`);
    if (!token) {
      // when there is an error, token will be empty and queryStringMessage will be the error.
      yield put(verifySwitchFailure(new Error(qStrMsgFromEmail || 'Verify transaction token does not exist.')));
    }
    console.log('switch response: ', response);

    yield put(verifySwitchSuccess(response));
  } catch (err) {
    yield put(verifySwitchFailure(err));
  }
}

function* verifyRedeemSaga({ payload }) {
  try {
    // aStrMsgFromEmail is the msg encoded inside "verify link" eg. localhost:verify?r="transaction verify failed"
    const { token, qStrMsgFromEmail } = payload;

    const response = yield call(get, `verifyTransactionSwRd?t=${token}`);
    if (!token) {
      // when there is an error, token will be empty and queryStringMessage will be the error.
      yield put(verifyRedeemFailure(new Error(qStrMsgFromEmail || 'Verify transaction token does not exist.')));
    }
    console.log('redeem response: ', response);

    yield put(verifyRedeemSuccess(response));
  } catch (err) {
    yield put(verifyRedeemFailure(err));
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(VERIFY_TRANSACTION_REQUEST, verifyTransactionSaga);
  yield takeLatest(VERIFY_SWITCH_REQUEST, verifySwitchSaga);
  yield takeLatest(VERIFY_REDEEM_REQUEST, verifyRedeemSaga);
  yield takeLatest(DECODE_REJECTED_TRANSACTION_REQUEST, decodeRejectedTransactionSaga);
}
