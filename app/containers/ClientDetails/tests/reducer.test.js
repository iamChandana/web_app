import clientDetailsReducer from '../reducer';

describe('clientDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(clientDetailsReducer(undefined, {})).toEqual({});
  });
});
