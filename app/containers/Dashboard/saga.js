import { takeLatest, put, call } from 'redux-saga/effects';
import { getGraphFail } from 'containers/FundDetails/actions';
import { Data1a, Data1b, Data1c, Data1d } from './Graph/Data1';
import { Data2a, Data2b, Data2c, Data2d } from './Graph/Data2';
import { Data3a, Data3b, Data3c, Data3d } from './Graph/Data3';
import { Data4a, Data4b, Data4c, Data4d } from './Graph/Data4';
import { getBBGDataSuccess, processing, successGetGraphData, failGetGraphData } from './actions';
import { BBG_DATA_REQUEST, GET_GRAPH_DATA } from './constants';
import { post } from '../../utils/api';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';

function* fetchBBGData(action) {
  const data1 = [Data1a, Data1b, Data1c, Data1d];
  const data2 = [Data2a, Data2b, Data2c, Data2d];
  const data3 = [Data3a, Data3b, Data3c, Data3d];
  const data4 = [Data4a, Data4b, Data4c, Data4d];
  const { marketId, periodId } = action.payload;

  const data = [data1, data2, data3, data4];

  yield put(getBBGDataSuccess(data[marketId][periodId]));
}

function* getGraphData(action) {
  const { marketId, periodId } = action.payload;
  let periodFrom,
    periodTo;
  if (periodId === 0) {
    periodFrom = moment().subtract(1, 'M').format('YYYY-MM-DD');
    periodTo = moment().format('YYYY-MM-DD');
  } else if (periodId === 2) {
    periodFrom = moment().subtract(3, 'y').format('YYYY-MM-DD');
    periodTo = moment().format('YYYY-MM-DD');
  } else if (periodId === 3) {
    periodFrom = moment().subtract(5, 'y').format('YYYY-MM-DD');
    periodTo = moment().format('YYYY-MM-DD');
  } else {
    periodFrom = moment().subtract(1, 'y').format('YYYY-MM-DD');
    periodTo = moment().format('YYYY-MM-DD');
  }
  periodFrom += 'T00:00:00.000Z';
  periodTo += 'T23:59:59.999Z';

  try {
    yield put(processing(true));
    // let endPointApi = 'trkd/api/ApiCalls/getQuotesList';
    let endPointApi = 'riskprofile/api/ApiCalls/getQuotesList';
    let payload = {
      name: marketId,
      nameType: 'RIC',
      id: 0,
    };
    const responsePayload = {};
    const response1 = yield call(post, endPointApi, payload);
    if (response1.data &&
      response1.data.response &&
      response1.data.response.RetrieveItem_Response_3 &&
      response1.data.response.RetrieveItem_Response_3.ItemResponse[0] &&
      response1.data.response.RetrieveItem_Response_3.ItemResponse[0].Item[0] &&
      response1.data.response.RetrieveItem_Response_3.ItemResponse[0].Item[0].Fields &&
      !_isEmpty(response1.data.response.RetrieveItem_Response_3.ItemResponse[0].Item[0].Fields.Field)) {
      responsePayload.quotesList = response1.data.response.RetrieveItem_Response_3.ItemResponse[0].Item[0].Fields.Field;
    } else {
      responsePayload.quotesList = [];
    }
    // endPointApi = 'trkd/api/ApiCalls/getTimeSeriesList';
    endPointApi = 'riskprofile/api/ApiCalls/getTimeSeriesList';
    payload = {
      symbol: marketId,
      startTime: periodFrom,
      endTime: periodTo,
      interval: 'DAILY',
      id: 0,
    };
    const response2 = yield call(post, endPointApi, payload);
    let arrTimeSeriesList = [];
    if (response2.data &&
      response2.data.response &&
      response2.data.response.GetInterdayTimeSeries_Response_4 &&
      !_isEmpty(response2.data.response.GetInterdayTimeSeries_Response_4.Row)) {
      arrTimeSeriesList = response2.data.response.GetInterdayTimeSeries_Response_4.Row;
      arrTimeSeriesList = arrTimeSeriesList.map((timeSeries) => ({ value: timeSeries.CLOSE, date: timeSeries.TIMESTAMP.substring(0, 10) }));

      // compose 52 weeks range
      /*
      DO NOT REMOVE. FOR FUTURE IMPLEMENTATION
      if (periodId > 0) {
        responsePayload.quotesList.push({
          Double: arrTimeSeriesList[arrTimeSeriesList.length - 1].value,
          Name: 'week52End'
        });
      }

      if (periodId === 1) {
        responsePayload.quotesList.push({
          Double: arrTimeSeriesList[0].value,
          Name: 'week52Start'
        });
      } else if (periodId > 1) {
        const week52 = moment().subtract(52, 'w');
        const numDay = arrTimeSeriesList.length - 250;
        for (let i = numDay;i<arrTimeSeriesList.length;i++) {
          const date1 = moment(arrTimeSeriesList[i].date);
          if (moment(week52.format('YYYY-MM-DD')).isSame(date1.format('YYYY-MM-DD')) ||
              moment(date1.format('YYYY-MM-DD')).isAfter(week52.format('YYYY-MM-DD'))) {
            responsePayload.quotesList.push({
              Double: arrTimeSeriesList[i].value,
              Name: 'week52Start',
              Date: date1.format('YYYY-MM-DD')
            });
            break;
          }
        }
      }
      */

      // console.log('responsePayload.quotesList :: ', responsePayload.quotesList);
    }

    responsePayload.timeSeriesList = arrTimeSeriesList;
    // console.log('responsePayload', responsePayload);
    yield put(successGetGraphData(responsePayload));
    yield put(processing(false));
  } catch (err) {
    yield put(processing(true));
    yield put(getGraphFail(err.error.message));
  } finally {
    yield put(processing(false));
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(BBG_DATA_REQUEST, fetchBBGData);
  yield takeLatest(GET_GRAPH_DATA, getGraphData);
}
