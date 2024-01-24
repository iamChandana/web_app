/*
 *
 * Clients actions
 *
 */

import { DEFAULT_ACTION, CLIENTS_GET, CLIENTS_GET_SUCCESS, CLIENT_DETAILS_GET, PROCESSING } from './constants';

export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getClients(payload) {
  return {
    type: CLIENTS_GET,
    payload,
  };
}

export function getClientsSuccess(payload) {
  return {
    type: CLIENTS_GET_SUCCESS,
    payload,
  };
}

export function getClientDetails(id) {
  return {
    type: CLIENT_DETAILS_GET,
    id,
  };
}

export function getClientDetailsSuccess(payload) {
  return {
    type: CLIENT_DETAILS_GET,
    payload,
  };
}
