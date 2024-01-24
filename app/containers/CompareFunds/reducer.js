/*
 *
 * CompareFunds reducer
 *
 */

import {
  DEFAULT_ACTION,
  GET_GRAPH_DATA_SUCCESS,
  GET_GRAPH_DATA_FAIL,
  PROCESSING,
  CLEAR_GRAPH_DATA,
  GET_FUND_HOLDING_LIST_SUCCESS,
  GET_FUND_PERFORMANCE_LIST_SUCCESS,
  PROCESSING_GET_TIME_SERIES_LIST,
  ADD_FUNDS_FLOW,
} from './constants';

const initialState = { processing: false, graphData: [], fundHoldingList: [], fundPerformanceList: [], isProcessingGetTimeSeriesList: false };

function compareFundsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case GET_GRAPH_DATA_SUCCESS:
      const fund = state.graphData.filter((obj) => obj.lipperId === action.payload.lipperId);
      if (!fund || fund.length < 1) {
        return {
          ...state,
          graphData: state.graphData.concat(action.payload),
        };
      }
      return {
        ...state,
      };

    case GET_GRAPH_DATA_FAIL:
      return {
        ...state,
        graphData: action.payload,
      };
    case CLEAR_GRAPH_DATA:
      return {
        ...state,
        graphData: [],
      };
    case GET_FUND_HOLDING_LIST_SUCCESS:
      const fundHolding = state.fundHoldingList.filter((obj) => obj.lipperId === action.payload.lipperId);
      if (!fundHolding || fundHolding.length < 1) {
        return {
          ...state,
          fundHoldingList: state.fundHoldingList.concat(action.payload),
        };
      }
      return {
        ...state,
      };

    case GET_FUND_PERFORMANCE_LIST_SUCCESS:
      const fundPerf = state.fundPerformanceList.filter((obj) => obj.lipperId === action.payload.lipperId);
      if (!fundPerf || fundPerf.length < 1) {
        return {
          ...state,
          fundPerformanceList: state.fundPerformanceList.concat(action.payload),
        };
      }
      return {
        ...state,
      };

    case PROCESSING_GET_TIME_SERIES_LIST:
      return {
        ...state,
        isProcessingGetTimeSeriesList: action.payload,
      };
    case ADD_FUNDS_FLOW: {
      return {
        ...state,
        isOnboardingFlow: action.payload,
      };
    }
    default:
      return state;
  }
}

export default compareFundsReducer;
