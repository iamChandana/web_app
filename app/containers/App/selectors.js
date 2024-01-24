import { createSelector } from 'reselect';

/**
 * Direct selector to the app state domain
 */
const selectAppDomain = (state) => state.app;

/**
 * Other specific selectors
 */

/**
 * Default selector used by App
 */

const makeSelectApp = () =>
  createSelector(
    selectAppDomain,
    (substate) => substate,
  );
const makeSelectAppFunds = () =>
  createSelector(
    selectAppDomain,
    (substate) => substate.funds,
  );
export default makeSelectApp;
export { selectAppDomain, makeSelectAppFunds };
