import { createSelector } from 'reselect';

/**
 * Direct selector to the analytics state domain
 */
const selectAnalyticsDomain = (state) => state.analytics;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Analytics
 */

const makeSelectAnalytics = () =>
  createSelector(
    selectAnalyticsDomain,
    (substate) => substate,
  );

export default makeSelectAnalytics;
export { selectAnalyticsDomain };
