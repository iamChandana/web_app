import { createSelector } from 'reselect';

/**
 * Direct selector to the overview state domain
 */
const selectOverviewDomain = (state) => state.overview;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Overview
 */

const makeSelectOverview = () => createSelector(selectOverviewDomain, (substate) => substate);

export default makeSelectOverview;
export { selectOverviewDomain };
