import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLIENTS_GET, CLIENT_DETAILS_GET } from './constants';
import { post, get, update } from '../../utils/api';
import { processing, getClientsSuccess, getClientDetailsSuccess } from './actions';

function* getClientsSaga(action) {
  const { search, skip, orderBy, allClient } = action.payload || {};
  const searchQuery = search ? `&searchText=${search}` : '';
  const sortOrder = orderBy === 'createdAt' ? 'DESC' : 'ASC';
  const orderByQuery = orderBy ? `&orderby=${orderBy} ${sortOrder}` : '';
  const skipValue = skip || 0;
  let limit = 12;
  if (allClient) {
    limit = 300; // temp fix for the performance issues
  }
  const endpoint = `customer/api/Customers/getAccountDetails?limit=${limit}&skip=${skipValue + searchQuery + orderByQuery}`;

  try {
    yield put(processing(true));
    const res = yield call(get, endpoint);
    yield put(getClientsSuccess(res.data.response));
  } catch (error) {
  } finally {
    yield put(processing(false));
  }
}

function* getClientDetailsSaga() {
  const endpoint = '';

  try {
    yield put(processing(true));
    const res = yield call(post, endpoint);
    yield;
  } catch (error) {
  } finally {
    yield processing(false);
  }
}
// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CLIENTS_GET, getClientsSaga);
  yield takeLatest(CLIENT_DETAILS_GET, getClientDetailsSaga);
}
