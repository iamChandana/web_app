import { createSelector } from 'reselect';

const selectFundProjectionDomain = (state) => state.fundProjection;
const makeSelectFundDetails = (fundId) =>
  createSelector(selectFundProjectionDomain, (fundProjection) => fundProjection.plans.find((plan) => plan.fundId === fundId));
const makeSelectFundPlans = () => createSelector(selectFundProjectionDomain, (fundProjection) => fundProjection.plans);
const makeSelectProjectionData = () =>
  createSelector(selectFundProjectionDomain, (fundProjection) => fundProjection.currentProjection);
const makeSelectTalkingPoints = () =>
  createSelector(selectFundProjectionDomain, (fundProjection) => fundProjection.talkingPoints);
const makeSelectHistoryData = () => createSelector(selectFundProjectionDomain, (fundProjection) => fundProjection.historyData);
const makeSelectFetchingHistoryData = () =>
  createSelector(selectFundProjectionDomain, (fundProjection) => fundProjection.fetchingHistoryData);
export {
  makeSelectFundDetails,
  makeSelectFundPlans,
  makeSelectProjectionData,
  makeSelectHistoryData,
  makeSelectFetchingHistoryData,
  makeSelectTalkingPoints
};
