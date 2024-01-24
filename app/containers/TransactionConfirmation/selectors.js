import { createSelector } from 'reselect';

const selectTransactionConfirmation = (state) => state.transactionConfirmation;

const selectVerifyTransactionApiStatus = createSelector(
  selectTransactionConfirmation,
  (subState) => subState.apiStatus,
);

const selectVerifyTransactionApiResponse = createSelector(
  selectTransactionConfirmation,
  (subState) => subState.apiResponse,
);

const selectVerifyTransactionApiError = createSelector(
  selectTransactionConfirmation,
  (subState) => subState.apiError,
);

export default selectTransactionConfirmation;
export { selectVerifyTransactionApiStatus, selectVerifyTransactionApiResponse, selectVerifyTransactionApiError };
