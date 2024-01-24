
import { fromJS } from 'immutable';
import fundProjectionReducer from '../reducer';

describe('fundProjectionReducer', () => {
  it('returns the initial state', () => {
    expect(fundProjectionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
