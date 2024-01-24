import { createSelector } from 'reselect';

/**
 * Direct selector to the compareFunds state domain
 */
const selectCompareFundsDomain = (state) => state.compareFunds;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CompareFunds
 */

const makeSelectCompareFunds = () => createSelector(selectCompareFundsDomain, (substate) => substate);
const makeSelectGraphData = () => createSelector(selectCompareFundsDomain, (state) => state.graphData);
const makeSelectFundHoldingList = () => createSelector(selectCompareFundsDomain, (state) => state.fundHoldingList);
const makeSelectFundPerformanceList = () => createSelector(selectCompareFundsDomain, (state) => state.fundPerformanceList);
const makeSelectProcessing = () => createSelector(selectCompareFundsDomain, (clientsState) => clientsState.processing);
const makeSelectIsProcessingGetTimeSeriesList = () => createSelector(selectCompareFundsDomain, (state) => state.isProcessingGetTimeSeriesList);
const makeSelectIsOnboardingFlow = () => createSelector(selectCompareFundsDomain, (state) => state.isOnboardingFlow);

export default makeSelectCompareFunds;
export {
  selectCompareFundsDomain,
  makeSelectGraphData,
  makeSelectProcessing,
  makeSelectFundHoldingList,
  makeSelectFundPerformanceList,
  makeSelectIsProcessingGetTimeSeriesList,
  makeSelectIsOnboardingFlow,
};
