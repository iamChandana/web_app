import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { fundProjDataSucceeded, fundProjDataFailed, getHistoryDataSuccess, getTalkingPointsSuccess, getTalkingPointsFail, getHistoryDataFail } from './actions';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { FUND_PROJ_DATA_REQUESTED, FUND_HISTORY_DATA_REQUEST, TALKING_POINTS_GET } from './constants';
import { get, post } from '../../utils/api';

function composeProjectionData(projectionResponse) {
  const result = [];

  const {
    projectedAmtLowerArray: pessimistic,
    projectedAmtMedianArray: average,
    projectedAmtUpperArray: optimistic,
  } = projectionResponse.data.response;
  if ((pessimistic && pessimistic.length) && (average && average.length) && (optimistic && optimistic.length)) {
    for (let i = 0; i < pessimistic[0].length; i += 1) {
      result.push({
        pessimistic: pessimistic[0][i].projectedAmt,
        average: average[0][i].projectedAmt,
        optimistic: optimistic[0][i].projectedAmt,
        year: new Date().getFullYear() + i + 1,
      });
    }
  }
  return result;
}

function* loadProjectionData(action) {
  try {
    const { payload } = action;
    const { fundId, initialInvestment, monthlyContribution, goalYears, onRefetch } = payload;

    const idFilter = encodeURIComponent(`{"id": "${fundId}"}`);
    const filter = `?fundFilter=${idFilter}`;
    const fundDetailsEndpoint = `portfolio/api/ModelPortfolios/getAllModelPortfolioDetails${filter}`;
    const fundDetailsResponse = yield call(get, fundDetailsEndpoint);

    const { productbreakdown } = fundDetailsResponse.data.ModelPortfolios.portfolioObject[0];
    const { fullDetails } = productbreakdown[0];
    const {
      minAdditionalInvestmentAmt,
      maxAdditionalInvestmentAmt,
      minInitialInvestmentAmt,
      maxInitialInvestmentAmt,
      historical10YrAnnualizedReturn,
      historical10YrAnnualizedStd,
    } = fullDetails;

    const projectionEndpoint = 'portfolio/api/accumulators';

    const projectionRequest = () =>
      axios.post(projectionEndpoint, {
        initialInvestment: onRefetch ? initialInvestment : minInitialInvestmentAmt,
        annualInvestment: (onRefetch ? monthlyContribution : minAdditionalInvestmentAmt) * 12,
        yearsToGoal: goalYears,
        discreteExpectedReturnPerAnnum: historical10YrAnnualizedReturn,
        discreteExpectedVolatility: historical10YrAnnualizedStd,
        compound: 1,
        confidence: 0.9,
        period: 'end',
        currentYear: 0,
      });
    const projectionResponse = yield call(projectionRequest);

    yield put(
      fundProjDataSucceeded({
        projectionResponse: composeProjectionData(projectionResponse),
        fundId,
        minAdditionalInvestmentAmt,
        maxAdditionalInvestmentAmt,
        minInitialInvestmentAmt,
        maxInitialInvestmentAmt,
        onRefetch,
        fullDetails,
      }),
    );
  } catch (error) {
    yield put(fundProjDataFailed(error));
  }
}

function* getTalkingPoints({ payload }) {
  try {
    const { data } = yield call(get, `portfolio/api/viewFundTalkingPoints?filter[where][isin]=${payload}`);
    yield put(getTalkingPointsSuccess(data[0]));
  } catch (error) {
    yield put(getTalkingPointsFail());
  }
}

function* getHistoryData(action) {
  const { lipperId, ric, goalYears } = action.payload;
  try {
    const endPointApi = `riskprofile/api/ApiCalls/getPerformanceList/${lipperId}`;
    const response1 = yield call(get, endPointApi);

    let performanceCalculationItem = [],
      responseThreeYearPerformancetoLastMonthEnd,
      assetDetailsAnalysisSPType;

    if (response1.data &&
      response1.data.response &&
      response1.data.response.GetAssetDetailsAnalysisSP_Response_1 &&
      response1.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult &&
      !_isEmpty(response1.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult.AssetDetailsAnalysisSPType)) {
      assetDetailsAnalysisSPType = response1.data.response.GetAssetDetailsAnalysisSP_Response_1.AssetDetailsAnalysisSPResult.AssetDetailsAnalysisSPType.filter((obj) =>
        obj.LipperId == lipperId
      );
    }

    if (!_isEmpty(assetDetailsAnalysisSPType)) {
      assetDetailsAnalysisSPType = assetDetailsAnalysisSPType[0];
      if (assetDetailsAnalysisSPType.PerformanceCalculationList &&
        !_isEmpty(assetDetailsAnalysisSPType.PerformanceCalculationList.PerformanceCalculationItem)) {
        performanceCalculationItem = assetDetailsAnalysisSPType.PerformanceCalculationList.PerformanceCalculationItem.filter((obj) =>
          obj.CalculationType === 'YeartoMonthEndPerformance' || obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd'
        );
      }
    }

    /* if (response1.data &&
      response1.data.response &&
      response1.data.response.PerformanceCalculationList &&
      !_isEmpty(response1.data.response.PerformanceCalculationList.PerformanceCalculationItem)) {
      performanceCalculationItem = response1.data.response.PerformanceCalculationList.PerformanceCalculationItem.filter(
        (obj) =>
          obj.CalculationType === 'YeartoMonthEndPerformance' || obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd',
      );
    } */

    const startDate = moment()
      .subtract(goalYears, 'years')
      .format('YYYY-MM-DD');
    if (!_isEmpty(performanceCalculationItem)) {
      const payload = {
        symbol: ric,
        startTime: `${startDate}T00:00:00.000Z`,
        endTime: `${moment().format('YYYY-MM-DD')}T23:59:59.999Z`,
        interval: 'DAILY',
        id: 0,
      };

      const response2 = yield call(post, 'riskprofile/api/ApiCalls/getTimeSeriesList', payload);
      let arrTimeSeriesList2 = [];

      if (response2.data && response2.data.response && response2.data.response.GetInterdayTimeSeries_Response_4) {
        arrTimeSeriesList2 = response2.data.response.GetInterdayTimeSeries_Response_4.Row;
        if (!_isEmpty(arrTimeSeriesList2)) {
          arrTimeSeriesList2 = arrTimeSeriesList2.map((timeSeries) => ({
            value: timeSeries.CLOSE,
            date: timeSeries.TIMESTAMP.substring(0, 10),
          }));
        } else {
          arrTimeSeriesList2 = [];
        }
      }
      responseThreeYearPerformancetoLastMonthEnd = arrTimeSeriesList2;
    }

    yield put(
      getHistoryDataSuccess({
        performanceCalculationItem,
        threeYearPerformancetoLastMonthEnd: responseThreeYearPerformancetoLastMonthEnd,
      }),
    );
  } catch (error) {
    console.log('Performance error', error);
    yield put(getHistoryDataFail());
  }
}

export default function* defaultSaga() {
  yield takeLatest(FUND_PROJ_DATA_REQUESTED, loadProjectionData);
  yield takeLatest(TALKING_POINTS_GET, getTalkingPoints);
  yield takeLatest(FUND_HISTORY_DATA_REQUEST, getHistoryData);
}
