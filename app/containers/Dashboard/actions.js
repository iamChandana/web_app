/*
 *
 * Dashboard actions
 *
 */

import { 
  DEFAULT_ACTION, 
  BBG_DATA_REQUEST, 
  BBG_DATA_SUCCESS, 
  GET_GRAPH_DATA, 
  SUCCESS_GET_GRAPH_DATA, 
  FAIL_GET_GRAPH_DATA,
  PROCESSING
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getBBGData(payload) {
  return {
    type: BBG_DATA_REQUEST,
    payload,
  };
}

export function getBBGDataSuccess(payload) {
  return {
    type: BBG_DATA_SUCCESS,
    payload,
  };
}

export function getGraphData(payload) {
  return {
    type: GET_GRAPH_DATA,
    payload,
  };
}

export function successGetGraphData(payload) {
  return {
    type: SUCCESS_GET_GRAPH_DATA,
    payload,
  };
}

export function failGetGraphData(payload) {
  return {
    type: FAIL_GET_GRAPH_DATA,
    payload,
  };
}

export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}