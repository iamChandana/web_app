
import { fromJS } from 'immutable';
import faqReducer from '../reducer';

describe('faqReducer', () => {
  it('returns the initial state', () => {
    expect(faqReducer(undefined, {})).toEqual(fromJS({}));
  });
});
