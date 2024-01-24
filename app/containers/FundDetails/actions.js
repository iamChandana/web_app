/*
 *
 * FundDetails actions
 *
 */

import {
  DEFAULT_ACTION,
  FUND_DETAILS_GET,
  FUND_DETAILS_GET_SUCCESS,
  FUND_DETAILS_GET_FAIL,
  PROCESSING,
  FUND_DOCS_GET,
  FUND_DOCS_GET_FAIL,
  FUND_DOCS_PDF_GET,
  FUND_DOCS_GET_SUCCESS,
  FUND_DOCS_PDF_GET_SUCCESS,
  FUND_DETAILS_RESET,
  GET_GRAPH_DATA,
  GET_GRAPH_DATA_SUCCESS,
  GET_FUND_HOLDING_LIST,
  GET_FUND_HOLDING_LIST_SUCCESS,
  GET_FUND_PERFORMANCE_LIST,
  GET_FUND_PERFORMANCE_LIST_SUCCESS,
  FETCHING_FUND_PERFORMANCE,
  FETCHING_FUND_HOLDING_LIST,
  FETCHING_FUND_GRAPH,
  CLEAR_GRAPH_DATA,
  GET_GRAPH_DATA_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function fetchingFundGraph(payload) {
  return {
    type: FETCHING_FUND_GRAPH,
    payload,
  };
}

export function fetchingFundPerformance(payload) {
  return {
    type: FETCHING_FUND_PERFORMANCE,
    payload,
  };
}

export function fetchingFundHoldingList(payload) {
  return {
    type: FETCHING_FUND_HOLDING_LIST,
    payload,
  };
}

export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}
export function getFundDetails(payload) {
  return {
    type: FUND_DETAILS_GET,
    payload,
  };
}
export function getGraphFail(payload) {
  return {
    type: GET_GRAPH_DATA_FAIL,
    payload,
  };
}

export function getFundDetailsSuccess(payload) {
  return {
    type: FUND_DETAILS_GET_SUCCESS,
    payload,
  };
}

export function getFundDetailsFail(payload) {
  return {
    type: FUND_DETAILS_GET_FAIL,
    payload,
  };
}

export function getFundDocs(payload) {
  return {
    type: FUND_DOCS_GET,
    payload,
  };
}

export function getFundDocsSuccess(payload) {
  return {
    type: FUND_DOCS_GET_SUCCESS,
    payload,
  };
}

export function getFundDocsFail(payload) {
  return {
    type: FUND_DOCS_GET_FAIL,
    payload,
  };
}

export function geFundDocsPdf(payload) {
  return {
    type: FUND_DOCS_PDF_GET,
    payload,
  };
}

export function getFundDocsPdf(payload) {
  return {
    type: FUND_DOCS_PDF_GET_SUCCESS,
    payload,
  };
}

export function resetFundDetails() {
  return {
    type: FUND_DETAILS_RESET,
  };
}

export function getGraph(payload) {
  return {
    type: GET_GRAPH_DATA,
    payload,
  };
}

export function getGraphSuccess(payload) {
  return {
    type: GET_GRAPH_DATA_SUCCESS,
    payload,
  };
}

export function clearGraphData() {
  return {
    type: CLEAR_GRAPH_DATA,
  };
}

export function getFundHoldingList(payload) {
  return {
    type: GET_FUND_HOLDING_LIST,
    payload,
  };
}

export function getFundHoldingListSuccess(payload) {
  return {
    type: GET_FUND_HOLDING_LIST_SUCCESS,
    payload,
  };
}

export function getFundPerformanceList(payload) {
  return {
    type: GET_FUND_PERFORMANCE_LIST,
    payload,
  };
}

export function getFundPerformaceListSuccess(payload) {
  return {
    type: GET_FUND_PERFORMANCE_LIST_SUCCESS,
    payload,
  };
}
