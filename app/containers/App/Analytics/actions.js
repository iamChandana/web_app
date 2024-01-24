/*
 *
 * Analytics actions
 *
 */

import * as ACTION from './constants';

export function getGaId() {
  return {
    type: ACTION.GET_GA_ID,
  };
}

export function getGaIdSuccess(id) {
  return {
    type: ACTION.GET_GA_ID_SUCCESS,
    id,
  };
}

export function getGaIdFailed() {
  return {
    type: ACTION.GET_GA_ID_FAILED,
  };
}
