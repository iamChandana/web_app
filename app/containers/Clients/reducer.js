/*
 *
 * Clients reducer
 *
 */
import { DEFAULT_ACTION, CLIENTS_GET_SUCCESS, CLIENT_DETAILS_GET_SUCCESS, PROCESSING } from './constants';

const initialState = {};

function clientsReducer(state = initialState, action) {
  switch (action.type) {
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case DEFAULT_ACTION:
      return state;
    case CLIENTS_GET_SUCCESS:
      return {
        ...state,
        clients: action.payload,
      };
    case CLIENT_DETAILS_GET_SUCCESS:
      return {
        ...state,
        clientDetails: action.payload,
      };
    default:
      return state;
  }
}

export default clientsReducer;
