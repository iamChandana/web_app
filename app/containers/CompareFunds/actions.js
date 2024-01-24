/*
 *
 * CompareFunds actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_GRAPH_DATA,
  GET_GRAPH_DATA_SUCCESS,
  GET_GRAPH_DATA_FAIL,
  GET_FUND_HOLDING_LIST,
  GET_FUND_HOLDING_LIST_SUCCESS,
  GET_FUND_PERFORMANCE_LIST_SUCCESS,
  GET_FUND_PERFORMANCE_LIST,
  CLEAR_GRAPH_DATA,
  PROCESSING,
  PROCESSING_GET_TIME_SERIES_LIST,
  ADD_FUNDS_FLOW,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
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

export function getGraphFail(payload) {
  return {
    type: GET_GRAPH_DATA_FAIL,
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

export function processingGetTimeSeriesList(payload) {
  return {
    type: PROCESSING_GET_TIME_SERIES_LIST,
    payload,
  };
}

export function setAddFundsFlow(payload) {
  return {
    type: ADD_FUNDS_FLOW,
    payload,
  };
}
