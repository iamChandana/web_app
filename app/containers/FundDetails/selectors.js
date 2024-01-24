import { createSelector } from 'reselect';

/**
 * Direct selector to the fundDetails state domain
 */
const selectFundDetailsDomain = (state) => state.fundDetails;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FundDetails
 */

const makeSelectFundDetails = () => createSelector(selectFundDetailsDomain, (substate) => substate);
const makeSelectData = () => createSelector(selectFundDetailsDomain, (state) => state.data);
const makeSelectDocs = () => createSelector(selectFundDetailsDomain, (state) => state.docs);
const makeSelectGraphData = () => createSelector(selectFundDetailsDomain, (state) => state.graphData);
const makeSelectFundHoldingList = () => createSelector(selectFundDetailsDomain, (state) => state.fundHoldingList);
const makeSelectFundPerformanceList = () => createSelector(selectFundDetailsDomain, (state) => state.fundPerformanceList);
const makeSelectProcessing = () => createSelector(selectFundDetailsDomain, (state) => state.processing);

const makeSelectFetchingFundGraph = () => createSelector(selectFundDetailsDomain, (state) => state.fetchingFundGraph);
const makeSelectFetchingFundHoldingList = () => createSelector(selectFundDetailsDomain, (state) => state.fetchingFundHoldingList);
const makeSelectFetchingFundPerformance = () => createSelector(selectFundDetailsDomain, (state) => state.fetchingFundPerformance);

export { 
  makeSelectData, 
  makeSelectDocs, 
  makeSelectGraphData,
  makeSelectFundHoldingList,
  makeSelectFundPerformanceList,
  makeSelectProcessing,
  makeSelectFetchingFundGraph,
  makeSelectFetchingFundHoldingList,
  makeSelectFetchingFundPerformance
};