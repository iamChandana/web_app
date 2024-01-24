import { createSelector } from 'reselect';

/**
 * Direct selector to the agentProfile state domain
 */
const selectAgentProfileDomain = (state) => state.agentProfile;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AgentProfile
 */

const makeSelectAgentProfile = () => createSelector(selectAgentProfileDomain, (substate) => substate);

export default makeSelectAgentProfile;
export { selectAgentProfileDomain };
