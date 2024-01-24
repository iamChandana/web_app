/*
 *
 * Analytics reducer
 *
 */

import * as ACTION from './constants';

const initialState = {
  gaId: null,
  status: {
    loading: false,
    error: false,
  },
};

function analyticsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION.GET_GA_ID:
      return {
        ...state,
        status: {
          ...state.status,
          loading: true,
        },
      };
    case ACTION.GET_GA_ID_SUCCESS:
      return {
        ...state,
        gaId: action.id,
        status: {
          ...state.status,
          loading: false,
          error: false,
        },
      };
    case ACTION.GET_GA_ID_FAILED:
      return {
        ...state,
        status: {
          ...state.status,
          loading: false,
          error: true,
        },
      };
    default:
      return state;
  }
}

export default analyticsReducer;
