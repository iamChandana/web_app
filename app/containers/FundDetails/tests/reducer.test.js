
import { fromJS } from 'immutable';
import fundDetailsReducer from '../reducer';

describe('fundDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(fundDetailsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
