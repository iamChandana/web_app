/*
 *
 * Dashboard reducer
 *
 */
import { 
  DEFAULT_ACTION, 
  BBG_DATA_REQUEST, 
  BBG_DATA_SUCCESS,
  SUCCESS_GET_GRAPH_DATA, 
  FAIL_GET_GRAPH_DATA,
  PROCESSING
} from './constants';

const initialState = {
  loading: false,
  data: null,
  graphData: null,
};

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case BBG_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        data: null,
      };
    case BBG_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case SUCCESS_GET_GRAPH_DATA:
      return {
        ...state,
        loading: false,
        graphData: action.payload,
      };  
    case FAIL_GET_GRAPH_DATA:
      return {
        ...state,
        loading: false,
        graphData: action.payload,
      };  
    case PROCESSING:
      return {
        ...state,
        loading: action.payload,
      };                
    default:
      return state;
  }
}

export default dashboardReducer;
