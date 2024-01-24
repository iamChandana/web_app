import { takeLatest, call, put } from 'redux-saga/effects';
import { get } from 'utils/api';
import * as action from './actions';
import { GET_GA_ID } from './constants';

function* getGaIdSaga() {
  try {
    const response = yield call(get, 'getGAID');

    yield put(action.getGaIdSuccess(response.data.GA_ID));
  } catch (err) {
    yield put(action.getGaIdFailed());
  }
}
// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_GA_ID, getGaIdSaga);
}
