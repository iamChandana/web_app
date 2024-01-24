/*
 *
 * Funds actions
 *
 */

import { DEFAULT_ACTION, PROCESSING, FUNDS_VIEW_ADD } from './constants';

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

export function addViewFunds(payload) {
  return {
    type: FUNDS_VIEW_ADD,
    payload,
  };
}
// export function getFunds() {
//   return {
//     type: FUNDS_GET,
//   };
// }

// export function getFundsSuccess(payload) {
//   return {
//     type: FUNDS_GET_SUCCESS,
//     payload,
//   };
// }
