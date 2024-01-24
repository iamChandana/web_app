/*
 *
 * FundDetails reducer
 *
 */
import {
  DEFAULT_ACTION,
  PROCESSING,
  FUND_DETAILS_GET_SUCCESS,
  FUND_DOCS_GET_SUCCESS,
  FUND_DETAILS_RESET,
  GET_GRAPH_DATA_SUCCESS,
  GET_GRAPH_DATA_FAIL,
  GET_FUND_HOLDING_LIST_SUCCESS,
  GET_FUND_PERFORMANCE_LIST_SUCCESS,
  FETCHING_FUND_PERFORMANCE,
  FETCHING_FUND_HOLDING_LIST,
  FETCHING_FUND_GRAPH,
  CLEAR_GRAPH_DATA,
} from './constants';

const initialState = {
  processing: false,
  fetchingFundGraph: false,
  fetchingFundHoldingList: false,
  fetchingFundPerformance: false,
  error: '',
};

function fundDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case FUND_DETAILS_GET_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case FUND_DOCS_GET_SUCCESS:
      return {
        ...state,
        docs: action.payload,
      };
    case FUND_DETAILS_RESET:
      return initialState;
    case GET_GRAPH_DATA_SUCCESS:
      return {
        ...state,
        graphData: action.payload,
      };
    case GET_GRAPH_DATA_FAIL:
      return {
        ...state,
        graphData: action.payload,
      };
    case GET_FUND_HOLDING_LIST_SUCCESS:
      return {
        ...state,
        fundHoldingList: action.payload,
      };
    case GET_FUND_PERFORMANCE_LIST_SUCCESS:
      return {
        ...state,
        fundPerformanceList: action.payload,
      };
    case FETCHING_FUND_GRAPH:
      return {
        ...state,
        fetchingFundGraph: action.payload,
      };
    case FETCHING_FUND_HOLDING_LIST:
      return {
        ...state,
        fetchingFundHoldingList: action.payload,
      };
    case FETCHING_FUND_PERFORMANCE:
      return {
        ...state,
        fetchingFundPerformance: action.payload,
      };
    case CLEAR_GRAPH_DATA:
      return {
        ...state,
        graphData: null,
      };
    default:
      return state;
  }
}

export default fundDetailsReducer;
