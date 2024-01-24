import teamReducer from '../reducer';

describe('teamReducer', () => {
  it('returns the initial state', () => {
    expect(teamReducer(undefined, {})).toEqual({});
  });
});
