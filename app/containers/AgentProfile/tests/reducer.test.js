
import { fromJS } from 'immutable';
import agentProfileReducer from '../reducer';

describe('agentProfileReducer', () => {
  it('returns the initial state', () => {
    expect(agentProfileReducer(undefined, {})).toEqual(fromJS({}));
  });
});
