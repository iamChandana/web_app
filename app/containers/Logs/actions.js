/*
 *
 * Logs actions
 *
 */

import {
  DEFAULT_ACTION,
  ALL_TRANSACTIONS_GET,
  ALL_TRANSACTIONS_GET_SUCCESS,
  ERROR,
  PROCESSING,
  ERROR_RESET,
  RESET,
  ALL_TRANSACTIONS_FOR_DOWNLOAD_GET,
  ALL_TRANSACTIONS_FOR_DOWNLOAD_GET_SUCCESS,
  REMOVE_ALL_TRANSACTIONS_FOR_DOWNLOAD
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function setError(payload) {
  return {
    type: ERROR,
    payload,
  };
}

export function resetError() {
  return {
    type: ERROR_RESET,
  };
}
export function processing(payload) {
  return {
    type: PROCESSING,
    payload,
  };
}
export function getAllTransactions(payload) {
  return {
    type: ALL_TRANSACTIONS_GET,
    payload,
  };
}

export function getAllTransactionsSuccess(payload) {
  return {
    type: ALL_TRANSACTIONS_GET_SUCCESS,
    payload,
  };
}

export function getAllTransactionsForDownload(payload) {
  return {
    type: ALL_TRANSACTIONS_FOR_DOWNLOAD_GET,
    payload,
  };
}

export function getAllTransactionsForDownloadSuccess(payload) {
  return {
    type: ALL_TRANSACTIONS_FOR_DOWNLOAD_GET_SUCCESS,
    payload,
  };
}

export function removeAllTransactionsForDownload() {
  return {
    type: REMOVE_ALL_TRANSACTIONS_FOR_DOWNLOAD,
  };
}