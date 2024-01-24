/*
 *
 * AgentProfile actions
 *
 */

import { DEFAULT_ACTION, AGENT_PROFILE_GET, AGENT_PROFILE_GET_SUCCESS, AGENT_PROFILE_GET_FAIL } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getAgentProfile(payload) {
  return {
    type: AGENT_PROFILE_GET,
    payload,
  };
}

export function getAgentProfileSuccess(payload) {
  return {
    type: AGENT_PROFILE_GET_SUCCESS,
    payload,
  };
}

export function getAgentProfileFail(payload) {
  return {
    type: AGENT_PROFILE_GET_FAIL,
    payload,
  };
}
