import { createSelector } from 'reselect';

/**
 * Direct selector to the homePage state domain
 */
const selectHomePageDomain = (state) => state.home;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () => createSelector(selectHomePageDomain, (substate) => substate);
const makeSelectLOV = () => createSelector(selectHomePageDomain, (home) => home.lov);
const makeSelectLogout = () => createSelector(selectHomePageDomain, (home) => home.isLogout);
const makeSelectProcessing = () => createSelector(selectHomePageDomain, (home) => home.processing);
export default makeSelectHomePage;
export { selectHomePageDomain, makeSelectLOV, makeSelectLogout, makeSelectProcessing };
