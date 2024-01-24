/*
 *
 * FundProjection reducer
 *
 */
import update from 'immutability-helper';

import {
  ADD_FUND_PLAN,
  UPDATE_FUND_PLAN,
  DELETE_FUND_PLAN,
  FUND_PROJ_DATA_REQUESTED,
  FUND_PROJ_DATA_SUCCEEDED,
  FUND_PROJ_DATA_FAILED,
  TALKING_POINTS_GET_SUCCESS,
  TALKING_POINTS_GET,
  TALKING_POINTS_GET_FAIL,
  FUND_HISTORY_DATA_REQUEST,
  FUND_HISTORY_DATA_SUCCESS,
  FUND_HISTORY_DATA_FAIL,
} from './constants';

const initialState = {
  plans: [],
  currentProjection: {
    loadingFundData: false,
    loadingProjectionData: false,
    projectionData: [],
  },
  talkingPoints: {
    loading: false,
    data: {},
  },
  historyData: {},
  fetchingHistoryData: false,
};

function fundProjectionReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FUND_PLAN: {
      const existingPlan = state.plans.find((plan) => plan.fundId === action.payload.fundId);
      if (!existingPlan) {
        return update(state, {
          plans: { $push: [action.payload] },
        });
      }
      return state;
    }
    case UPDATE_FUND_PLAN:
      return update(state, {
        plans: {
          $apply: (plans) =>
            plans.map((plan) => {
              if (plan.fundId === action.payload.fundId) {
                return action.payload;
              }
              return plan;
            }),
        },
      });
    case DELETE_FUND_PLAN:
      return update(state, {
        plans: {
          $apply: (plans) => plans.filter((plan) => plan.fundId !== action.payload),
        },
      });
    case FUND_PROJ_DATA_REQUESTED:
      return update(state, {
        currentProjection: {
          loadingFundData: { $set: !action.payload.onRefetch },
          loadingProjectionData: { $set: true },
        },
      });
    case FUND_PROJ_DATA_SUCCEEDED:
      return update(state, {
        plans: {
          $apply: (plans) =>
            plans.map((plan) => {
              if (plan.fundId === action.payload.fundId) {
                const { fundId, fundName, initialInvestment, monthlyContribution, goalYears } = plan;
                const {
                  minAdditionalInvestmentAmt,
                  maxAdditionalInvestmentAmt,
                  minInitialInvestmentAmt,
                  maxInitialInvestmentAmt,
                  onRefetch,
                  fullDetails,
                } = action.payload;

                return {
                  fundId,
                  fundName,
                  initialInvestment: onRefetch ? initialInvestment : minInitialInvestmentAmt,
                  monthlyContribution: onRefetch ? monthlyContribution : minAdditionalInvestmentAmt,
                  goalYears,
                  minAdditionalInvestmentAmt,
                  maxAdditionalInvestmentAmt,
                  minInitialInvestmentAmt,
                  maxInitialInvestmentAmt,
                  fullDetails,
                };
              }
              return plan;
            }),
        },
        currentProjection: {
          loadingFundData: { $set: false },
          loadingProjectionData: { $set: false },
          projectionData: { $set: action.payload.projectionResponse },
        },
      });
    case FUND_PROJ_DATA_FAILED:
      return update(state, {
        loadingFundData: { $set: false },
        loadingProjectionData: { $set: false },
      });
    case TALKING_POINTS_GET:
      return update(state, { talkingPoints: { loading: { $set: true } } });
    case TALKING_POINTS_GET_SUCCESS:
      return update(state, { talkingPoints: { loading: { $set: false }, data: { $set: action.payload } } });
    case TALKING_POINTS_GET_FAIL:
      return update(state, { talkingPoints: { loading: { $set: false }, data: { $set: {} } } });
    case FUND_HISTORY_DATA_REQUEST:
      return update(state, { fetchingHistoryData: { $set: true } });
    case FUND_HISTORY_DATA_SUCCESS:
      return update(state, { historyData: { $set: action.payload }, fetchingHistoryData: { $set: false } });
    case FUND_HISTORY_DATA_FAIL:
      return update(state, { historyData: { $set: {} }, fetchingHistoryData: { $set: false } });
    default:
      return state;
  }
}

export default fundProjectionReducer;
