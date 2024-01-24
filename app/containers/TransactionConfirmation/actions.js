import {
  VERIFY_TRANSACTION_REQUEST,
  VERIFY_TRANSACTION_SUCCESS,
  VERIFY_TRANSACTION_FAILURE,
  DECODE_REJECTED_TRANSACTION_REQUEST,
  DECODE_REJECTED_TRANSACTION_SUCCESS,
  DECODE_REJECTED_TRANSACTION_FAILURE,
  VERIFY_SWITCH_REQUEST,
  VERIFY_SWITCH_SUCCESS,
  VERIFY_SWITCH_FAILURE,
  VERIFY_REDEEM_REQUEST,
  VERIFY_REDEEM_SUCCESS,
  VERIFY_REDEEM_FAILURE,
} from './constants';

export function verifyTransactionRequest(payload, isRsp) {
  return {
    type: VERIFY_TRANSACTION_REQUEST,
    payload,
    isRsp,
  };
}

export function verifyTransactionSuccess(payload) {
  return {
    type: VERIFY_TRANSACTION_SUCCESS,
    payload,
  };
}

export function verifyTransactionFailure(payload) {
  return {
    type: VERIFY_TRANSACTION_FAILURE,
    payload,
  };
}

export function decodeRejectedTransactionRequest(payload) {
  return {
    type: DECODE_REJECTED_TRANSACTION_REQUEST,
    payload,
  };
}

export function decodeRejectedTransactionSuccess(payload) {
  return {
    type: DECODE_REJECTED_TRANSACTION_SUCCESS,
    payload,
  };
}

export function decodeRejectedTransactionFailure(payload) {
  return {
    type: DECODE_REJECTED_TRANSACTION_FAILURE,
    payload,
  };
}

export function verifySwitchRequest(payload) {
  return {
    type: VERIFY_SWITCH_REQUEST,
    payload,
  };
}

export function verifySwitchSuccess(payload) {
  return {
    type: VERIFY_SWITCH_SUCCESS,
    payload,
  };
}

export function verifySwitchFailure(payload) {
  return {
    type: VERIFY_SWITCH_FAILURE,
    payload,
  };
}

export function verifyRedeemRequest(payload) {
  return {
    type: VERIFY_REDEEM_REQUEST,
    payload,
  };
}

export function verifyRedeemSuccess(payload) {
  return {
    type: VERIFY_REDEEM_SUCCESS,
    payload,
  };
}

export function verifyRedeemFailure(payload) {
  return {
    type: VERIFY_REDEEM_FAILURE,
    payload,
  };
}
