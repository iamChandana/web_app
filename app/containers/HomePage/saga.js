import _noop from 'lodash/noop';
import _orderBy from 'lodash/orderBy';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { selectUserInfo } from 'containers/LoginPage/selectors';
import { post, get } from '../../utils/api';

import { LOV_GET, LOGOUT } from './constants';
import { getLOVSuccess, processing, logoutSuccess } from './actions';

function* getLOVSaga() {
  const endpoint = 'DataDictionaryTypes/getAllDataDictionary';
  try {
    // yield put(processing(true));
    const response = yield call(get, endpoint);
    const responseDataClone = { ...response.data };
    const sortedDictionary = responseDataClone.Dictionary.map((item) => {
      if (item.DictionaryType === 'Banks') {
        return { ...item, datadictionary: _orderBy(item.datadictionary, ['description'], ['asc']) };
      }
      return { ...item };
    });
    responseDataClone.Dictionary = sortedDictionary;
    yield put(getLOVSuccess(responseDataClone));
  } catch (error) {
    _noop();
  } finally {
    yield put(processing(false));
  }
}

function* logoutSaga() {
  const userInfo = yield select(selectUserInfo());
  const endpoint = 'gateway/_internal/Agents/logoutFromAgent';
  const payload = {
    accessToken: userInfo.access_token,
  };
  try {
    yield put(processing(true));
    yield call(post, endpoint, payload);
    yield put(logoutSuccess());
  } catch (error) {
    _noop();
  } finally {
    yield put(processing(false));
  }
}
// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(LOV_GET, getLOVSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
