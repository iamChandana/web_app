/*
 *
 * App reducer
 *
 */
import { DEFAULT_ACTION, SET_TOAST, CLEAR_TOAST } from './constants';

const initialState = {
  toast: null,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_TOAST:
      return {
        ...state,
        toast: action.payload,
      };
    case CLEAR_TOAST:
      return {
        ...state,
        toast: null,
      };
    default:
      return state;
  }
}

export default appReducer;
