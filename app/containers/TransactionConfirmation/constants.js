/*
 *
 * TransactionConfirmation constants
 *
 */

export const VERIFY_TRANSACTION_REQUEST = 'app/TransactionConfirmation/VERIFY_TRANSACTION_REQUEST';
export const VERIFY_TRANSACTION_SUCCESS = 'app/TransactionConfirmation/VERIFY_TRANSACTION_SUCCESS';
export const VERIFY_TRANSACTION_FAILURE = 'app/TransactionConfirmation/VERIFY_TRANSACTION_FAILURE';

export const DECODE_REJECTED_TRANSACTION_REQUEST = 'app/TransactionConfirmation/DECODE_REJECTED_TRANSACTION_REQUEST';
export const DECODE_REJECTED_TRANSACTION_SUCCESS = 'app/TransactionConfirmation/DECODE_REJECTED_TRANSACTION_SUCCESS';
export const DECODE_REJECTED_TRANSACTION_FAILURE = 'app/TransactionConfirmation/DECODE_REJECTED_TRANSACTION_FAILURE';

export const API_STATUS_TYPES = {
  IDLE: 'IDLE', // idle status exists cos in case want to show last success state when error
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

export const VERIFY_SWITCH_REQUEST = 'app/TransactionConfirmation/VERIFY_SWITCH_REQUEST';
export const VERIFY_SWITCH_SUCCESS = 'app/TransactionConfirmation/VERIFY_SWITCH_SUCCESS';
export const VERIFY_SWITCH_FAILURE = 'app/TransactionConfirmation/VERIFY_SWITCH_FAILURE';

export const VERIFY_REDEEM_REQUEST = 'app/TransactionConfirmation/VERIFY_REDEEM_REQUEST';
export const VERIFY_REDEEM_SUCCESS = 'app/TransactionConfirmation/VERIFY_REDEEM_SUCCESS';
export const VERIFY_REDEEM_FAILURE = 'app/TransactionConfirmation/VERIFY_REDEEM_FAILURE';
