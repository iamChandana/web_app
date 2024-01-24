import { createSelector } from 'reselect';

/**
 * Direct selector to the logs state domain
 */
const selectLogsDomain = (state) => state.logs;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Logs
 */

const makeSelectLogs = () => createSelector(selectLogsDomain, (substate) => substate);
const makeSelectAllTransactions = () => createSelector(selectLogsDomain, (substate) => substate.transactions);
const makeSelectProcessing = () => createSelector(selectLogsDomain, (substate) => substate.processing);
const makeSelectAllTransactionsForDownload = () => createSelector(selectLogsDomain, (substate) => substate.transactionsForDownload);

export default makeSelectLogs;
export { selectLogsDomain, makeSelectAllTransactions, makeSelectProcessing, makeSelectAllTransactionsForDownload };
