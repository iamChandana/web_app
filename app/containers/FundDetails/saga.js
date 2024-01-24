import { takeLatest, call, put } from 'redux-saga/effects';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';
import {
  FUND_DETAILS_GET,
  FUND_DOCS_GET,
  GET_GRAPH_DATA,
  GET_FUND_HOLDING_LIST,
  GET_FUND_PERFORMANCE_LIST,
} from './constants';
import {
  processing,
  getFundDetailsSuccess,
  getFundDetailsFail,
  getFundDocsSuccess,
  getFundDocsFail,
  getGraphSuccess,
  getFundPerformaceListSuccess,
  getFundHoldingListSuccess,
  fetchingFundGraph,
  fetchingFundPerformance,
  fetchingFundHoldingList,
  clearGraphData,
  getGraphFail,
  // FUND_DOCS_PDF_GET,
} from './actions';
import { get, post } from '../../utils/api';
import moment from 'moment';

function composePerfPayload(fundCode) {
  return {
    QueryFilter: {
      where: {
        fundcode: fundCode,
      },
      order: 'valuationdate ASC',
    },
    GraphParams: {
      Noofbands: 8,
      GraphBuffer: 1.2,
    },
  };
}

function iscomposePerfData(data, benchmark) {
  const perf = (data && data.data) || [];
  const format = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format;

  return perf.map((point, i) => ({
    navPerUnit: point.navperunit,
    benchmarkValue: (benchmark[i] && benchmark[i].navperunit) || null,
    date: format(new Date(point.valuationdate)),
  }));
}

function* getPerfomanceData(payload) {
  /* use dummy chart as requested by cspam
  let perfData;
  const perfEndpoint = 'portfolio/api/HZFUNDPRICES/getFundPerformanceChart';

  try {
    const perfResponse = yield call(post, perfEndpoint, composePerfPayload(payload));
    perfData = typeof perfResponse.data === 'object' ? perfResponse.data.data : null;
  } catch (error) {
    perfData = [];
  }
  return perfData;
  */

  return [];// perfData;
}

function* getFundDetailsSaga(action) {
  const { payload } = action;
  const idFilter = encodeURIComponent(`{"id": "${payload}"}`);
  const filter = `?fundFilter=${idFilter}`;
  const endpoint = `portfolio/api/Funds/getAllFundDetails${filter}`;
  try {
    yield put(processing(true));
    const response = yield call(get, endpoint);
    const data = response.data.Funds.res[0];
    const { benchMarkCode, benchMarkName } = data.fundDetails;
    const perfData = yield call(getPerfomanceData, data.fundcode);
    const benchmarkData = yield call(getPerfomanceData, benchMarkCode);

    yield put(
      getFundDetailsSuccess({
        ...data,
        perfData: iscomposePerfData(perfData, benchmarkData),
        benchmarkName: benchMarkName,
      }),
    );
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) { yield put(getFundDetailsFail(error)); }
  } finally {
    yield put(processing(false));
  }
}

function* getFundDocsSaaga(action) {
  const { payload } = action;
  const filter = encodeURIComponent(`{"where":{"isin":"${payload}"}`);
  const endpoint = `portfolio/api/FundDocs?filter=${filter}`;
  try {
    yield put(processing(true));
    const response = yield call(get, endpoint);
    yield put(getFundDocsSuccess(response.data));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(getFundDocsFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

// function* getFundDocsPDFSaaga(action) {
//   const { payload } = action;
//   const endpoint = `portfolio/api/funddocscontainers/pdfs/download/${payload}`;
//   try {
//     yield put(processing(true));
//     const response = yield call(get, endpoint);
//     console.log(response);
//     // yield put(getFundDocsSuccess(response.data));
//   } catch (error) {
//     yield put(getFundDocsFail(error));
//   } finally {
//     yield put(processing(false));
//   }
// }

function* getFundPerformanceListSaga(action) {
  // console.log('FundDatails getFundPerformanceListSaga');
  const { isin, fundName, lipperId } = action.payload;

  try {
    yield put(fetchingFundPerformance(true));

    let fundPerformance = [],
      assetDetailsAnalysisSPType;
    const endPointApi = `riskprofile/api/ApiCalls/getPerformanceList/${lipperId}`;
    const response = yield call(get, endPointApi);

    if (response.data &&
      response.data.response &&
      response.data.response.GetAssetDetailsAnalysisSP_Response_1 &&
      response.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult &&
      !_isEmpty(response.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult.AssetDetailsAnalysisSPType)) {
      assetDetailsAnalysisSPType = response.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult.AssetDetailsAnalysisSPType.filter((obj) =>
        obj.LipperId == lipperId
      );
    }

    if (!_isEmpty(assetDetailsAnalysisSPType)) {
      assetDetailsAnalysisSPType = assetDetailsAnalysisSPType[0];
      if (assetDetailsAnalysisSPType.PerformanceCalculationList &&
        !_isEmpty(assetDetailsAnalysisSPType.PerformanceCalculationList.PerformanceCalculationItem)) {
        fundPerformance = assetDetailsAnalysisSPType.PerformanceCalculationList.PerformanceCalculationItem.filter((obj) =>
          obj.CalculationType === 'YeartoMonthEndPerformance' || obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd'
        );
      }
    }
    /*
        if (response.data &&
          response.data.response &&
          response.data.response.PerformanceCalculationList &&
          !_isEmpty(response.data.response.PerformanceCalculationList.PerformanceCalculationItem)) {
          fundPerformance = response.data.response.PerformanceCalculationList.PerformanceCalculationItem.filter((obj) =>
            obj.CalculationType === 'YeartoMonthEndPerformance' || obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd'
          );
        }
    */
    yield put(
      getFundPerformaceListSuccess({
        fundName,
        lipperId,
        isin,
        fundPerformance,
      })
    );
  } catch (error) {
    // yield put(getFundDetailsFail(error));
    console.error('FundDetails => saga.js => getFundPerformanceListSaga : error : ', error);
    yield put(getGraphFail(error.error.message));
  } finally {
    yield put(fetchingFundPerformance(false));
  }
}

function* getFundHoldingListSaga(action) {
  // console.log('FundDatails getFundHoldingListSaga');
  const { isin, fundName, lipperId } = action.payload;
  let holdingList = [];

  try {
    yield put(fetchingFundHoldingList(true));
    // get holding list
    const endPointApi = `riskprofile/api/ApiCalls/getHoldingsList/${lipperId}`;
    const responseHoldingList = yield call(get, endPointApi);

    if (responseHoldingList.data &&
      responseHoldingList.data.response &&
      responseHoldingList.data.response.GetAssetHoldings_Response_1 &&
      responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult &&
      responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult.AllocationSchemes &&
      !_isEmpty(responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult.AllocationSchemes.AllocationSchemeType)) {
      holdingList = responseHoldingList.data.response.GetAssetHoldings_Response_1.AssetHoldingsResult.AllocationSchemes.AllocationSchemeType.filter((obj) => obj.AllocationSchemeId === 'Top10Holdings');
      holdingList = holdingList[0].AllocationsByDateByItem.AllocationsByDate[0].AllocationItems.AllocationValueByItem;
    }

    yield put(
      getFundHoldingListSuccess({
        fundName,
        lipperId,
        isin,
        holdingList,
      })
    );
  } catch (error) {
    // yield put(getFundDetailsFail(error));
    console.error('FundDetails => saga.js => getFundHoldingListSaga : error : ', error);
    yield put(getGraphFail(error.error.message));
  } finally {
    yield put(fetchingFundHoldingList(false));
  }
}

function* getGraphDataSaga(action) {
  // console.log('FundDatails getGraphDataSaga');
  const { isin, fundName, lipperId, ric, benchMarkRic, benchMarkName, numOfYear } = action.payload;

  let responseTimeSeriesRic = [],
    responseTimeSeriesBenchMarkRic = [],
    payload;

  yield put(clearGraphData());

  if (ric) {
    try {
      yield put(fetchingFundGraph(true));

      const periodFrom = `${moment().subtract(numOfYear, 'y').format('YYYY-MM-DD')}T00:00:00.000Z`;
      const periodTo = `${moment().format('YYYY-MM-DD')}T23:59:59.999Z`;

      payload = {
        symbol: ric,
        startTime: periodFrom,
        endTime: periodTo,
        interval: 'DAILY',
        id: 0,
      };

      // console.log('payload ric : ', payload);

      responseTimeSeriesRic = yield call(post, 'riskprofile/api/ApiCalls/getTimeSeriesList', payload);
      if (responseTimeSeriesRic.data &&
        responseTimeSeriesRic.data.response &&
        responseTimeSeriesRic.data.response.GetInterdayTimeSeries_Response_4 &&
        !_isEmpty(responseTimeSeriesRic.data.response.GetInterdayTimeSeries_Response_4.Row)) {
        responseTimeSeriesRic = responseTimeSeriesRic.data.response.GetInterdayTimeSeries_Response_4.Row;
        const firstValue = responseTimeSeriesRic[0].CLOSE;
        responseTimeSeriesRic = responseTimeSeriesRic.map((timeSeries) => ({ value: parseFloat((((timeSeries.CLOSE / firstValue) * 100).toFixed(4))), date: timeSeries.TIMESTAMP.substring(0, 10) }));
      }

      // console.log('responseTimeSeriesRic :', responseTimeSeriesRic);
    } catch (error) {
      // yield put(getFundDetailsFail(error));
      console.error('FundDetails => saga.js => getGraphDataSaga : error : ', error);
      // yield put(getGraphFail());
    } finally {
      // yield put(fetchingFundGraph(false));
    }
  } else {
    console.error(`${fundName} ${isin} | ric is missing`);
  }

  if (benchMarkRic) {
    try {
      payload.symbol = benchMarkRic;

      // console.log('payload benchMarkRic : ', payload);

      responseTimeSeriesBenchMarkRic = yield call(post, 'riskprofile/api/ApiCalls/getTimeSeriesList', payload);

      if (responseTimeSeriesBenchMarkRic.data &&
        responseTimeSeriesBenchMarkRic.data.response &&
        responseTimeSeriesBenchMarkRic.data.response.GetInterdayTimeSeries_Response_4 &&
        !_isEmpty(responseTimeSeriesBenchMarkRic.data.response.GetInterdayTimeSeries_Response_4.Row)) {
        responseTimeSeriesBenchMarkRic = responseTimeSeriesBenchMarkRic.data.response.GetInterdayTimeSeries_Response_4.Row;
        const firstValue = responseTimeSeriesBenchMarkRic[0].CLOSE;
        responseTimeSeriesBenchMarkRic = responseTimeSeriesBenchMarkRic.map((timeSeries) => ({ value: parseFloat((((timeSeries.CLOSE / firstValue) * 100).toFixed(4))), date: timeSeries.TIMESTAMP.substring(0, 10) }));
      }

      // console.log('responseTimeSeriesBenchMarkRic :', responseTimeSeriesBenchMarkRic);
    } catch (error) {
      // yield put(getFundDetailsFail(error));
      console.error('FundDetails => saga.js => getGraphDataSaga : error : ', error);
      // yield put(getGraphFail());
    } finally {

    }
  } else {
    console.error(`${fundName} ${isin} | has no benchMarkRic`);
  }

  yield put(
    getGraphSuccess({
      fundName,
      lipperId,
      isin,
      benchMarkRic,
      benchMarkName,
      ric,
      fundGraph: responseTimeSeriesRic,
      fundBenchmarkGraph: responseTimeSeriesBenchMarkRic,
    })
  );

  yield put(fetchingFundGraph(false));
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(FUND_DETAILS_GET, getFundDetailsSaga);
  yield takeLatest(FUND_DOCS_GET, getFundDocsSaaga);
  yield takeLatest(GET_GRAPH_DATA, getGraphDataSaga);
  yield takeLatest(GET_FUND_HOLDING_LIST, getFundHoldingListSaga);
  yield takeLatest(GET_FUND_PERFORMANCE_LIST, getFundPerformanceListSaga);
  // yield takeLatest(FUND_DOCS_PDF_GET, getFundDocsPDFSaaga);
}
