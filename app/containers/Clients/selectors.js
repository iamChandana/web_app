import { createSelector } from 'reselect';

/**
 * Direct selector to the clients state domain
 */
const selectClientsDomain = (state) => state.clients;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Clients
 */

const makeSelectClients = () => createSelector(selectClientsDomain, (clientsState) => clientsState.clients);
const makeSelectProcessing = () => createSelector(selectClientsDomain, (clientsState) => clientsState.processing);

export { makeSelectClients, makeSelectProcessing };
