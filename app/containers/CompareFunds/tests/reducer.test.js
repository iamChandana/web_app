
import { fromJS } from 'immutable';
import compareFundsReducer from '../reducer';

describe('compareFundsReducer', () => {
  it('returns the initial state', () => {
    expect(compareFundsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
