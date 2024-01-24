import { takeLatest, call, put } from 'redux-saga/effects';
import moment from 'moment';
import { map, pick } from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import _noop from 'lodash/noop';

import { processing, getAllTransactionsSuccess, setError, getAllTransactionsForDownloadSuccess } from './actions';
import { ALL_TRANSACTIONS_GET, ALL_TRANSACTIONS_FOR_DOWNLOAD_GET } from './constants';
import { get } from '../../utils/api';

function* getAllTransactionsSaga(action) {
  const {
    payload: { skip, searchInput, transactionDate, trxStatus, sortBy },
  } = action;
  // const { skip } = payload;
  const endPoint = 'investment/api/TransactionRequests/getAllTransactions';
  const transactionFilters = [];
  if (transactionDate) transactionFilters.push(`"transactionDate":"${moment(transactionDate).format('YYYY-MM-DD')}"`);
  if (trxStatus && trxStatus !== 'All') transactionFilters.push(`"RequestStatus":"${trxStatus}"`);
  // const searchInputFilter = searchInput || searchInput;
  const searchInputFilter = searchInput ? searchInput.trim() : '';
  const skipValue = skip || 0;
  const limitSkipFilter = `?limit=12&skip=${skipValue}`;
  // const transactionDetailsFilter = encodeURIComponent(`{${searchInputFilter}}`);
  const sortQuery = encodeURIComponent(`{"order":"${sortBy} ASC"}`);
  const trxQuery = encodeURIComponent(`{${transactionFilters.join(',')}}`);
  const transactionFilter = transactionFilters.length > 0 ? `&transactionFilter=${trxQuery}` : '';
  const sortByFilter = sortBy && sortBy !== 'All' ? `&sortFilter=${sortQuery}` : '';
  const customerFilter = searchInput ? `&customerFilter=${searchInputFilter}` : '';

  const finalUrl = `${endPoint + limitSkipFilter + transactionFilter + sortByFilter + customerFilter}`;
  try {
    yield put(processing(true));
    const apiRes = yield call(get, finalUrl);
    yield put(getAllTransactionsSuccess(apiRes.data));
  } catch (err) {
    yield call(errorHandler, err);
  } finally {
    yield put(processing(false));
  }
}

function* getAllTransactionsForDownloadSaga(action) {
  const {
    payload: { searchInput, transactionDate, trxStatus, sortBy },
  } = action;
  const endPoint = 'investment/api/TransactionRequests/getAllTransactions';
  const transactionFilters = [];
  if (transactionDate) transactionFilters.push(`"transactionDate":"${moment(transactionDate).format('YYYY-MM-DD')}"`);
  if (trxStatus && trxStatus !== 'All') transactionFilters.push(`"RequestStatus":"${trxStatus}"`);
  const searchInputFilter = searchInput ? searchInput.trim() : '';
  const sortQuery = encodeURIComponent(`{"order":"${sortBy} ASC"}`);
  const trxQuery = encodeURIComponent(`{${transactionFilters.join(',')}}`);
  const transactionFilter = transactionFilters.length > 0 ? `&transactionFilter=${trxQuery}` : '';
  const sortByFilter = sortBy && sortBy !== 'All' ? `&sortFilter=${sortQuery}` : '';
  const customerFilter = searchInput ? `&customerFilter=${searchInputFilter}` : '';
  const limitSkipFilter = '?limit=10000&skip=0';
  const finalUrl = `${endPoint + limitSkipFilter + transactionFilter + sortByFilter + customerFilter}`;

  try {
    yield put(processing(true));
    const apiRes = yield call(get, finalUrl);
    const arr = apiRes.data ? (apiRes.data.Funds ? (apiRes.data.Funds.res ? apiRes.data.Funds.res : []) : []) : [];
    let picked = [];

    if (arr.length > 0) {
      picked = map(arr, (e) =>
        pick(e, [
          'MainHolderlDNo',
          'refNo',
          'transactionDate',
          'transactionType',
          'fullName',
          'fundMode',
          'transactionRequestAmount',
          'RequestStatus',
          'transactions',
          'bankAcctNumber',
          'bankName',
        ]),
      );
    }
    /* let pickedData = picked.map(obj => ({
      refNo: obj.refNo,
      transactionDate: moment(obj.transactionDate).format('DD-MM-YYYY'),
      transactionType: obj.transactionType,
      fullName: obj.fullName,
      fundMode: obj.fundMode,
      transactionRequestAmount: obj.transactionRequestAmount?obj.transactionRequestAmount.toFixed(2).toString():'0.00',
      RequestStatus: obj.RequestStatus,
      MainHolderlDNo: obj.MainHolderlDNo,
      ...obj.transactions
    })); */
    const arrAggr = [];
    try {
      for (const obj of picked) {
        let parent = {},
          child = {};
        parent = {
          refNo: obj.refNo,
          transactionDate: moment(obj.transactionDate).format('DD-MM-YYYY'),
          transactionType: obj.transactionType,
          fullName: obj.fullName,
          fundMode: obj.fundMode,
          transactionRequestAmount: obj.transactionRequestAmount ? obj.transactionRequestAmount.toFixed(2).toString() : '0.00',
          RequestStatus: obj.RequestStatus,
        };
        // arrAggr.push(parent);
        for (const transaction of obj.transactions) {
          child = { ...parent };
          child.mainHolderlDNo = getIdNo(obj.MainHolderlDNo);
          child.fund = getFundNames(transaction);
          child.status = transaction.transactionStatus ? transaction.transactionStatus : '';
          child.accountNO = transaction.partnerAccountNO;
          if (transaction.transactionType === 'TR') {
            if (transaction.transactionUnits < 0) {
              child.unitDebited = transaction.transactionUnits ? transaction.transactionUnits.toFixed(2) : '0.00';
              child.unitCredited = '';
            } else {
              child.unitCredited = transaction.transactionUnits ? transaction.transactionUnits.toFixed(2) : '0.00';
              child.unitDebited = '';
            }
            child.unitMaintain = '';
          } else if (transaction.transactionType === 'CO' || transaction.transactionType === 'UC') {
            child.unitMaintain = transaction.transactionUnits ? transaction.transactionUnits.toFixed(2) : '0.00';
            child.unitDebited = '';
            child.unitCredited = '';
          } else if (
            transaction.transactionType === 'SA' ||
            transaction.transactionType === 'DD' ||
            transaction.transactionType === 'BI'
          ) {
            child.unitCredited = transaction.transactionUnits ? transaction.transactionUnits.toFixed(2) : '0.00';
            child.unitDebited = '';
            child.unitMaintain = '';
          } else if (transaction.transactionType === 'RD' || transaction.transactionType === 'SW') {
            child.unitDebited = transaction.transactionUnits ? transaction.transactionUnits.toFixed(2) : '0.00';
            child.unitCredited = '';
            child.unitMaintain = '';
          }
          child.transactionTypeOfChildren = transaction.transactionType;
          child.partnerProductType = transaction.partnerProductType;
          child.bankName = obj.bankName;
          child.bankAcctNumber = obj.bankAcctNumber;
          arrAggr.push(child);
        }
      }
    } catch (err1) {
      _noop();
    }
    yield put(getAllTransactionsForDownloadSuccess(arrAggr));
  } catch (err) {
    yield call(errorHandler, err);
  } finally {
    yield put(processing(false));
  }
}

function getFundNames(data) {
  let fund = '-';
  if (!_isEmpty(data.fund) || !_isEmpty(data.switchfund)) {
    if (data.transactionType === 'SW') {
      const swo = !_isEmpty(data.switchfund) ? data.switchfund.name : '-';
      fund = `${swo}`;
    } else if (data.transactionType === 'RD') {
      fund = !_isEmpty(data.switchfund) ? data.switchfund.name : '-';
    } else {
      fund = data.fund.name;
    }
  }
  return fund;
}

// put this in common utils if want to re-use
function suppressMobileNo(mobile) {
  if (mobile !== undefined && mobile !== null) {
    const len = mobile.length;
    const mobilepart = mobile.slice(3, len - 4);
    return mobile.replace(mobilepart, 'xxxxx');
  }
  return '';
}

function getIdNo(data) {
  if (!_isEmpty(data)) {
    return suppressMobileNo(data);
  }
  return '-';
}

function* errorHandler(err) {
  if (err) {
    if (err.error) {
      if (err.error.statusCode) {
        if (err.error.statusCode === '400') {
          yield put(setError('Invalid information. Please check again.'));
        } else {
          yield put(setError('Internal server error. Please try again.'));
        }
      }
    }
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(ALL_TRANSACTIONS_GET, getAllTransactionsSaga);
  yield takeLatest(ALL_TRANSACTIONS_FOR_DOWNLOAD_GET, getAllTransactionsForDownloadSaga);
}
