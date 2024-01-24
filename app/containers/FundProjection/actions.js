/*
 *
 * FundProjection actions
 *
 */

import {
  ADD_FUND_PLAN,
  UPDATE_FUND_PLAN,
  DELETE_FUND_PLAN,
  FUND_PROJ_DATA_REQUESTED,
  FUND_PROJ_DATA_SUCCEEDED,
  FUND_PROJ_DATA_FAILED,
  TALKING_POINTS_GET,
  TALKING_POINTS_GET_SUCCESS,
  TALKING_POINTS_GET_FAIL,
  FUND_HISTORY_DATA_REQUEST,
  FUND_HISTORY_DATA_SUCCESS,
  FUND_HISTORY_DATA_FAIL,
} from './constants';

export function addFundPlan(payload) {
  return {
    type: ADD_FUND_PLAN,
    payload,
  };
}

export function updateFundPlan(payload) {
  return {
    type: UPDATE_FUND_PLAN,
    payload,
  };
}

export function deleteFundPlan(payload) {
  return {
    type: DELETE_FUND_PLAN,
    payload,
  };
}

export function fundProjDataRequested(payload) {
  return {
    type: FUND_PROJ_DATA_REQUESTED,
    payload,
  };
}

export function fundProjDataSucceeded(payload) {
  return {
    type: FUND_PROJ_DATA_SUCCEEDED,
    payload,
  };
}

export function fundProjDataFailed(payload) {
  return {
    type: FUND_PROJ_DATA_FAILED,
    payload,
  };
}

export function getTalkingPoints(payload) {
  return {
    type: TALKING_POINTS_GET,
    payload,
  };
}
    
export function getHistoryData(payload) {
  return {
    type: FUND_HISTORY_DATA_REQUEST,
    payload,
  };
}

export function getTalkingPointsSuccess(payload) {
  return {
    type: TALKING_POINTS_GET_SUCCESS,
    payload,
  };
}
    
export function getHistoryDataSuccess(payload) {
  return {
    type: FUND_HISTORY_DATA_SUCCESS,
    payload,
  };
}

export function getTalkingPointsFail(payload) {
  return {
    type: TALKING_POINTS_GET_FAIL,
    payload,
  }
}

export function getHistoryDataFail() {
  return {
    type: FUND_HISTORY_DATA_FAIL,
  };
}
