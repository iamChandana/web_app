/*
 *
 * Funds reducer
 *
 */

import { DEFAULT_ACTION, FUNDS_GET_SUCCESS, FUNDS_VIEW_ADD } from './constants';
import update from 'immutability-helper';

const initialState = {
  viewFunds: [],
};

function fundsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case FUNDS_VIEW_ADD:
      // return update(state.viewFunds, {$push: actionlpa})
      return {
        ...state,
        viewFunds: [...state.viewFunds, action.payload],
      };
    // case FUNDS_GET_SUCCESS:
    //   return {
    //     ...state,
    //     funds: action.payload,
    //   };
    default:
      return state;
  }
}

export default fundsReducer;
