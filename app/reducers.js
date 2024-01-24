/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import globalReducer from 'containers/App/reducer';
import analyticsReducer from 'containers/App/Analytics/reducer';
import LoginReducer from 'containers/LoginPage/reducer';
import DashboardReducer from 'containers/Dashboard/reducer';
import HomePageReducer from 'containers/HomePage/reducer';
import OnBoardingReducer from 'containers/OnBoarding/reducer';
import FundsReducer from 'containers/Funds/reducer';
import ClientsReducer from 'containers/Clients/reducer';
import ClientDetailsReducer from 'containers/ClientDetails/reducer';
import LogsReducer from 'containers/Logs/reducer';
import FundDetailsReducer from 'containers/FundDetails/reducer';
import FundProjectionReducer from 'containers/FundProjection/reducer';
import CompareFundsReducer from 'containers/CompareFunds/reducer';
import transactionConfirmationReducer from 'containers/TransactionConfirmation/reducer';
/*
 * routeReducer
 *

 * The change is necessitated by moving to react-router-redux@5
 *
 */

export function location(state = null, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return action.payload;
    default:
      return state;
  }
}
const routeReducer = combineReducers({ location });

const appReducer = combineReducers({
  form: formReducer,
  route: routeReducer,
  global: globalReducer,
  analytics: analyticsReducer,
  login: LoginReducer,
  dashboard: DashboardReducer,
  home: HomePageReducer,
  onBoarding: OnBoardingReducer,
  funds: FundsReducer,
  clients: ClientsReducer,
  clientDetails: ClientDetailsReducer,
  transactionConfirmation: transactionConfirmationReducer,
  logs: LogsReducer,
  fundDetails: FundDetailsReducer,
  fundProjection: FundProjectionReducer,
  compareFunds: CompareFundsReducer,
});

const rootReducer = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case '@@redux-form/RESET':
      newState.form = {};
      break;
    case 'app/HomePage/LOGOUT_SUCCESS':
      newState = undefined;
      break;
    default:
      break;
  }

  return appReducer(newState, action);
};
export default rootReducer;
