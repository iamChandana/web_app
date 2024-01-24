import logsReducer from '../reducer';

describe('logsReducer', () => {
  it('returns the initial state', () => {
    expect(logsReducer(undefined, {})).toEqual({});
  });
});
