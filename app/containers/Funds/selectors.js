import { createSelector } from 'reselect';

/**
 * Direct selector to the funds state domain
 */
const selectFundsDomain = (state) => state.funds;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Funds
 */

const makeSelectFunds = () => createSelector(selectFundsDomain, (fundsState) => fundsState.funds);
const makeSelectViewFunds = () => createSelector(selectFundsDomain, (fundsState) => fundsState.viewFunds);

export default makeSelectFunds;
export { selectFundsDomain, makeSelectFunds, makeSelectViewFunds };
