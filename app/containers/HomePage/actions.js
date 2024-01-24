/*
 *
 * HomePage actions
 *
 */

import { DEFAULT_ACTION, LOGOUT, LOV_GET, LOV_GET_SUCCESS, PROCESSING, LOGOUT_SUCCESS } from './constants';

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

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function logoutSuccess() {
  localStorage.clear();
  sessionStorage.clear();
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function getLOV() {
  return {
    type: LOV_GET,
  };
}

export function getLOVSuccess(payload) {
  return {
    type: LOV_GET_SUCCESS,
    payload,
  };
}
