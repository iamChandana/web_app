
import { fromJS } from 'immutable';
import analyticsReducer from '../reducer';

describe('analyticsReducer', () => {
  it('returns the initial state', () => {
    expect(analyticsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
