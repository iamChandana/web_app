import {
  API_STATUS_TYPES,
  DECODE_REJECTED_TRANSACTION_FAILURE,
  DECODE_REJECTED_TRANSACTION_REQUEST,
  DECODE_REJECTED_TRANSACTION_SUCCESS,
  VERIFY_TRANSACTION_FAILURE,
  VERIFY_TRANSACTION_REQUEST,
  VERIFY_TRANSACTION_SUCCESS,
  VERIFY_SWITCH_REQUEST,
  VERIFY_SWITCH_FAILURE,
  VERIFY_SWITCH_SUCCESS,
  VERIFY_REDEEM_REQUEST,
  VERIFY_REDEEM_FAILURE,
  VERIFY_REDEEM_SUCCESS,
} from './constants';

const initialState = {
  apiStatus: API_STATUS_TYPES.IDLE,
  apiError: null,
  apiResponse: null,
};

function transactionConfirmationReducer(state = initialState, action) {
  switch (action.type) {
    case VERIFY_TRANSACTION_REQUEST: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.PROCESSING,
        apiError: null,
        apiResponse: null,
      };
    }

    case VERIFY_TRANSACTION_SUCCESS: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.SUCCESS,
        apiError: null,
        apiResponse: action.payload.data,
      };
    }

    case VERIFY_TRANSACTION_FAILURE: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.FAILURE,
        apiError: action.payload.error,
        apiResponse: null,
      };
    }

    case DECODE_REJECTED_TRANSACTION_REQUEST: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.PROCESSING,
        apiError: null,
        apiResponse: null,
      };
    }

    case DECODE_REJECTED_TRANSACTION_SUCCESS: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.SUCCESS,
        apiError: null,
        apiResponse: action.payload,
      };
    }

    case DECODE_REJECTED_TRANSACTION_FAILURE: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.FAILURE,
        apiError: action.payload,
        apiResponse: null,
      };
    }

    case VERIFY_SWITCH_REQUEST: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.PROCESSING,
        apiError: null,
        apiResponse: null,
      };
    }

    case VERIFY_SWITCH_SUCCESS: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.SUCCESS,
        apiError: null,
        apiResponse: action.payload.data,
      };
    }

    case VERIFY_SWITCH_FAILURE: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.FAILURE,
        apiError: action.payload.error,
        apiResponse: null,
      };
    }

    case VERIFY_REDEEM_REQUEST: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.PROCESSING,
        apiError: null,
        apiResponse: null,
      };
    }

    case VERIFY_REDEEM_SUCCESS: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.SUCCESS,
        apiError: null,
        apiResponse: action.payload.data,
      };
    }

    case VERIFY_REDEEM_FAILURE: {
      return {
        ...state,
        apiStatus: API_STATUS_TYPES.FAILURE,
        apiError: action.payload.error,
        apiResponse: null,
      };
    }

    default:
      return {
        ...state,
      };
  }
}

export default transactionConfirmationReducer;
