// import { take, call, put, select } from 'redux-saga/effects';
import { GET_GRAPH_DATA, GET_FUND_HOLDING_LIST, GET_FUND_PERFORMANCE_LIST } from './constants';
import { takeLatest, call, put } from 'redux-saga/effects';
import { get, post } from '../../utils/api';
import { getGraphSuccess, getGraphFail, clearGraphData, getFundPerformaceListSuccess, getFundHoldingListSuccess, processing, processingGetTimeSeriesList } from './actions';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

function composePerfPayload(fundCode) {
  return {
    QueryFilter: {
      where: {
        fundcode: fundCode,
      },
    },
    GraphParams: {
      Noofbands: 8,
      GraphBuffer: 1.2,
    },
  };
}

function composePerfData(data, benchmark) {
  const perf = (data && data.data) || [];
  const format = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format;

  return perf.map((point, i) => ({
    navPerUnit: point.navperunit,
    benchmarkValue: (benchmark[i] && benchmark[i].navperunit) || null,
    date: format(new Date(point.valuationdate)),
  }));
}

function* getFundPerformanceListSaga(action) {

  const funds = action.payload;

  for (let fund of funds){

    try {

      let fundPerformance = [], assetDetailsAnalysisSPType;
      let endPointApi = `riskprofile/api/ApiCalls/getPerformanceList/${fund.lipperId}`;
      const response = yield call(get, endPointApi);

      if (response.data && 
          response.data.response && 
          response.data.response.GetAssetDetailsAnalysisSP_Response_1 && 
          response.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult && 
          !_isEmpty(response.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult.AssetDetailsAnalysisSPType)) {
            assetDetailsAnalysisSPType = response.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult.AssetDetailsAnalysisSPType.filter(obj => 
              obj.LipperId == fund.lipperId
            );
      }

      if (!_isEmpty(assetDetailsAnalysisSPType)) {
        assetDetailsAnalysisSPType = assetDetailsAnalysisSPType[0];
        if (assetDetailsAnalysisSPType.PerformanceCalculationList && 
            !_isEmpty(assetDetailsAnalysisSPType.PerformanceCalculationList.PerformanceCalculationItem)) {
              fundPerformance = assetDetailsAnalysisSPType.PerformanceCalculationList.PerformanceCalculationItem.filter(obj => 
                obj.CalculationType === 'YeartoMonthEndPerformance' || obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd'
              );
        }
      }

      yield put(
        getFundPerformaceListSuccess({
          fundName: fund.fundName,
          lipperId: fund.lipperId,
          isin: fund.isin,
          fundPerformance
        })
      );

    } catch (error) {
      // yield put(getFundDetailsFail(error));
      console.error('CompareFunds => saga.js => getFundPerformanceListSaga : error : ', error);
      //yield put(getGraphFail());
    } finally {
      yield put(processing(false));
    }    

  }

}

function* getFundHoldingListSaga(action) {

  const funds = action.payload;
  let holdingList = [];

  for (const fund of funds){

    try {
      // get holding list
      let endPointApi = `riskprofile/api/ApiCalls/getHoldingsList/${fund.lipperId}`;
      const responseHoldingList = yield call(get, endPointApi);

      if (responseHoldingList.data && 
          responseHoldingList.data.response && 
          responseHoldingList.data.response.GetAssetHoldings_Response_1 &&
          responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult && 
          responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult.AllocationSchemes && 
          !_isEmpty(responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult.AllocationSchemes.AllocationSchemeType)) {
        holdingList = responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult.AllocationSchemes.AllocationSchemeType.filter(obj => obj.AllocationSchemeId === 'Top10Holdings');
        holdingList = holdingList[0].AllocationsByDateByItem.AllocationsByDate[0].AllocationItems.AllocationValueByItem;
      }
      
      yield put(
        getFundHoldingListSuccess({
          fundName: fund.fundName,
          lipperId: fund.lipperId,
          isin: fund.isin,
          holdingList
        })
      );
    } catch (error) {
      // yield put(getFundDetailsFail(error));
      console.error('CompareFunds => saga.js => getFundHoldingListSaga : error : ', error);
      //yield put(getGraphFail());
    } finally {
      yield put(processing(false));
    }    

  }

}

function* getGraphDataSaga(action) {
  
  const funds = action.payload;
  yield put(clearGraphData());
  yield put(processingGetTimeSeriesList(true));

  for (const fund of funds){
    try {

      let periodFrom = `${moment().subtract(fund.numOfYear, 'y').format('YYYY-MM-DD')}T00:00:00.000Z`;
      let periodTo = `${moment().format('YYYY-MM-DD')}T23:59:59.999Z`;   

      let payload = {
        symbol: fund.ric,
        startTime: periodFrom,
        endTime: periodTo,
        interval: 'DAILY',
        id: 0
      }

      let response = yield call(post, 'riskprofile/api/ApiCalls/getTimeSeriesList', payload);

      if (response.data &&
        response.data.response && 
        response.data.response.GetInterdayTimeSeries_Response_4 &&
        response.data.response.GetInterdayTimeSeries_Response_4.Row) {
          response = response.data.response.GetInterdayTimeSeries_Response_4.Row;
          response = response.map(timeSeries => ({ value: timeSeries.CLOSE, date: timeSeries.TIMESTAMP.substring(0,10)}));
      }
      
      yield put(
        getGraphSuccess({
          fundName: fund.fundName,
          lipperId: fund.lipperId,
          isin: fund.isin,
          fundGraph: response,
        })
      );

    } catch (error) {
      // yield put(getFundDetailsFail(error));
      console.error('CompareFunds => saga.js => getGraphDataSaga : error : ', error);
      //yield put(getGraphFail());
    } finally {
      //yield put(processingGetTimeSeriesList(false));
    }

  }

  yield put(processingGetTimeSeriesList(false));

}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(GET_GRAPH_DATA, getGraphDataSaga);
  yield takeLatest(GET_FUND_HOLDING_LIST, getFundHoldingListSaga);
  yield takeLatest(GET_FUND_PERFORMANCE_LIST, getFundPerformanceListSaga);
}
