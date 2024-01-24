/*
 *
 * HomePage reducer
 *
 */

import { DEFAULT_ACTION, LOV_GET_SUCCESS, PROCESSING, LOGOUT_SUCCESS } from './constants';

const initialState = {
  processing: false,
  lov: [],
  isLogout: false,
};

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case DEFAULT_ACTION:
      return state;

    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLogout: true,
      };
    case LOV_GET_SUCCESS:
      return {
        ...state,
        lov: action.payload,
      };
    default:
      return state;
  }
}

export default homePageReducer;
