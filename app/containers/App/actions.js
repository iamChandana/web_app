/*
 *
 * App actions
 *
 */

import { DEFAULT_ACTION, APP_FUNDS_GET, APP_FUNDS_GET_SUCCESS, SET_TOAST, CLEAR_TOAST } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAppFunds(payload) {
  return {
    type: APP_FUNDS_GET,
    payload,
  };
}

export function getAppFundsSuccess(payload) {
  return {
    type: APP_FUNDS_GET_SUCCESS,
    payload,
  };
}

export function setToast(payload) {
  return {
    type: SET_TOAST,
    payload,
  };
}

export function clearToast() {
  return {
    type: CLEAR_TOAST,
  };
}
