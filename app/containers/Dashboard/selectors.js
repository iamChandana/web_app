import { createSelector } from 'reselect';

/**
 * Direct selector to the dashboard state domain
 */
const dashboard = (state) => state.dashboard;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Dashboard
 */

const selectDashboard = () => createSelector(dashboard, (dashboardState) => dashboardState);

export { selectDashboard };
