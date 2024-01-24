/*
 *
 * Logs reducer
 *
 */

import { 
  PROCESSING, 
  ERROR, 
  RESET, 
  ALL_TRANSACTIONS_GET_SUCCESS, 
  ALL_TRANSACTIONS_FOR_DOWNLOAD_GET_SUCCESS,
  REMOVE_ALL_TRANSACTIONS_FOR_DOWNLOAD
} from './constants';

const initialState = {};

function logsReducer(state = initialState, action) {
  switch (action.type) {
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case RESET:
      return initialState;
    case ALL_TRANSACTIONS_GET_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
      };
    case ALL_TRANSACTIONS_FOR_DOWNLOAD_GET_SUCCESS:
      return {
        ...state,
        transactionsForDownload: action.payload,
      };
    case REMOVE_ALL_TRANSACTIONS_FOR_DOWNLOAD:
    return {
      ...state,
      transactionsForDownload: null,
    };    
    default:
      return state;
  }
}

export default logsReducer;
