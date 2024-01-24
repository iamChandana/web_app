import { createSelector } from 'reselect';

/**
 * Direct selector to the team state domain
 */
const selectTeamDomain = (state) => state.team;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Team
 */

const makeSelectTeam = () => createSelector(selectTeamDomain, (substate) => substate);

export default makeSelectTeam;
export { selectTeamDomain };
