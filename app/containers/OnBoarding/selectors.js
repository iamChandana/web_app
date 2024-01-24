import { createSelector } from 'reselect';
import _isEmpty from 'lodash/isEmpty';

/**
 * Direct selector to the onBoarding state domain
 */
const selectOnBoardingDomain = (state) => state.onBoarding;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OnBoarding
 */

const makeSelectOnBoarding = () =>
  createSelector(
    selectOnBoardingDomain,
    (substate) => substate,
  );
const makeSelectTitle = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.title,
  );
const makeSelectStep = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.step,
  );
const makeSelectIntroduction = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.introduction,
  );
const makeSelectRiskProfile1 = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfile1,
  );
const makeSelectRiskProfile2 = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfile2,
  );
const makeSelectRiskProfile3 = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfile3,
  );
const makeSelectRiskProfile4 = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfile4,
  );
const makeSelectRiskProfile5 = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfile5,
  );
const makeSelectRiskProfiles = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfiles,
  );
const makeSelectFunds = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.funds,
  );
const makeSelectSelectedFunds = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.selectedFunds,
  );
const makeSelectInitialInvestment = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.initialInvestment,
  );
const makeSelectPersonalDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.personalDetails,
  );
const makeSelectQuestions = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.questions,
  );
const makeSelectRiskScore = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskScore,
  );
const makeSelectProcessing = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.processing,
  );
const makeSelectImage = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.image,
  );
const makeSelectAllFunds = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.allFunds,
  );
const makeSelectFundsDrawer = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => {
      const itemLen = onBoarding.makeSelectFundsDrawer;
      if (itemLen > 3) {
        onBoarding.fundsDrawer.splice(0, 3);
      }
      return onBoarding.fundsDrawer;
    },
  );

const makeSelectAnnualIncomeLOV = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.annualIncomeLOV,
  );
const makeSelectAccount = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.account,
  );
const makeSelectOrder = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.orderCreated,
  );
const makeSelectError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.error,
  );
const makeSelectUploadError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.uploadError,
  );
const makeSelectPaymentRequestSucceeded = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.paymentRequestSucceeded,
  );
const makeSelectAmlaPass = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.amlaPass,
  );
const makeSelectFundFilterAsset = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.assetFilter,
  );
const makeSelectFundFilterRiskProfileType = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.riskProfileType,
  );
const makeSelectFundFilterValueForMoney = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.ValueForMoney,
  );
const makeSelectFundFilterFundType = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.fundType,
  );
const makeSelectOTPSrcAccountCreation = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.OTPSrcAccountCreation,
  );
const makeSelectShowOnBoardingClientConfirmationOtpModal = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.showOnBoardingClientConfirmationOtpModal,
  );
const makeSelectCustomer = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.customer,
  );
const makeSelectAddedToPortfolio = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.addedToPortfolio,
  );
const makeSelectAddedFunds = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.addedFunds,
  ); //
const makeSelectTransactionFile = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.transactionFile,
  );
const makeSelectValidatedDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.validatedDetails,
  );
const makeSelectStateFromPostalCode = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.stateFromPostalCode,
  );
const makeSelectPaymentDocsUploadedData = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.paymentDocsUploadedData,
  );
const makeSelectPaymentMethod = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.paymentMethod,
  );
const makeSelectAmlaError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.amlaError,
  );
const makeSelectValidateErrorDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.validateErrorDetails,
  );
const makeSelectAllFundsWithDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.allFundsWithDetails,
  );
const makeSelectCorrepondenceIsPermanent = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.correpondenceIsPermanent,
  );
const makeSelectAddToPortfolioError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.addToPortfolioError,
  );
const makeSelectOrderCreateError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.orderCreateError,
  );
const makeSelectAmlaFailObj = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.amlaFailObj,
  );
const makeSelectCifDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.cifDetails,
  );
const makeSelectIsExistingClient = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.isExistingClient,
  );
const makeSelectIsExistingClientDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.isExistingClientDetails,
  );
const makeSelectSaveIntroSuccess = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.saveIntroSuccess,
  );
const makeSelectNOBisDisable = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.NOBisDisable,
  );
const makeSelectSignUpToken = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.signUpToken,
  );
const makeSelectProcessingGetAllFundWithFundDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.processingGetAllFundWithFundDetails,
  );
const makeSelectDocReUploadSuccess = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.docReUploadSuccess,
  );
const makeSelectDocReUploadFailure = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.docReUploadFailure,
  );

const makeSelectInitMultiAgentMapOtpSuccessData = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.initMultiAgentMapOtpSuccessData,
  );
const makeSelectInitMultiAgentMapOtpErrorData = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.initMultiAgentMapOtpError,
  );
const makeSelectisOTPCalled = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.isOTPCalled,
  );
const makeSelectisIsProcessingMultiAgentMap = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.isProcessingMultiAgentMap,
  );
const makeSelectMultiAgentMapSuccess = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.multiAgentMapSuccess,
  );
const makeSelectMultiAgentMapError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.multiAgentMapError,
  );
const makeSelectNotFoundPdaError = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.notFoundPdaError,
  );
const makeSelectInterest = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.interests,
  );
const makeSelectDraftDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.draftDetails,
  );
const makekwspCashIntroDetails = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.kwspCashIntroDetails,
  );

const makeSelectAddFundsTrxRequestId = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => {
      if (onBoarding.addedFunds && onBoarding.addedFunds.transactionRequests.id) {
        return onBoarding.addedFunds.transactionRequests.id;
      }

      return '-';
    },
  );

const makeSelectOrderTrxRequestId = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => {
      if (onBoarding.orderCreated && onBoarding.orderCreated.transactionRequest) {
        return onBoarding.orderCreated.transactionRequest.id;
      }

      return '-';
    },
  );

const makeSelectAccountType = () =>
  createSelector(
    selectOnBoardingDomain,
    (onboarding) => {
      if (!onboarding.kwspCashIntroDetails.createKwspAccountParams) {
        return '-';
      }

      return onboarding.kwspCashIntroDetails.createKwspAccountParams.AccountType;
    },
  );

const makeSelectQueryISAFAmlaFailObj = () =>
  createSelector(
    selectOnBoardingDomain,
    (onBoarding) => onBoarding.queryISAFFailObj,
  );

const makeSelectIsQueryISAFAmlaError = () =>
  createSelector(
    selectOnBoardingDomain,
    (subState) => !_isEmpty(subState.queryISAFFailObj),
  );

export default makeSelectOnBoarding;
export {
  selectOnBoardingDomain,
  makeSelectInitMultiAgentMapOtpSuccessData,
  makeSelectInitMultiAgentMapOtpErrorData,
  makeSelectisOTPCalled,
  makeSelectMultiAgentMapSuccess,
  makeSelectMultiAgentMapError,
  makeSelectisIsProcessingMultiAgentMap,
  makeSelectDocReUploadSuccess,
  makeSelectDocReUploadFailure,
  makeSelectTitle,
  makeSelectStep,
  makeSelectIntroduction,
  makeSelectRiskProfile1,
  makeSelectRiskProfile2,
  makeSelectRiskProfile3,
  makeSelectRiskProfile4,
  makeSelectRiskProfile5,
  makeSelectRiskProfiles,
  makeSelectFunds,
  makeSelectInitialInvestment,
  makeSelectPersonalDetails,
  makeSelectFundsDrawer,
  makeSelectSelectedFunds,
  makeSelectQuestions,
  makeSelectRiskScore,
  makeSelectProcessing,
  makeSelectImage,
  makeSelectAllFunds,
  makeSelectAnnualIncomeLOV,
  makeSelectAccount,
  makeSelectOrder,
  makeSelectError,
  makeSelectPaymentRequestSucceeded,
  makeSelectAmlaPass,
  makeSelectFundFilterAsset,
  makeSelectFundFilterRiskProfileType,
  makeSelectFundFilterValueForMoney,
  makeSelectShowOnBoardingClientConfirmationOtpModal,
  makeSelectOTPSrcAccountCreation,
  makeSelectFundFilterFundType,
  makeSelectCustomer,
  makeSelectAddedToPortfolio,
  makeSelectAddedFunds,
  makeSelectTransactionFile,
  makeSelectValidatedDetails,
  makeSelectStateFromPostalCode,
  makeSelectPaymentDocsUploadedData,
  makeSelectPaymentMethod,
  makeSelectAmlaError,
  makeSelectValidateErrorDetails,
  makeSelectAllFundsWithDetails,
  makeSelectUploadError,
  makeSelectCorrepondenceIsPermanent,
  makeSelectAddToPortfolioError,
  makeSelectOrderCreateError,
  makeSelectAmlaFailObj,
  makeSelectCifDetails,
  makeSelectIsExistingClient,
  makeSelectSaveIntroSuccess,
  makeSelectNOBisDisable,
  makeSelectSignUpToken,
  makeSelectProcessingGetAllFundWithFundDetails,
  makeSelectIsExistingClientDetails,
  makeSelectNotFoundPdaError,
  makeSelectInterest,
  makeSelectDraftDetails,
  makekwspCashIntroDetails,
  makeSelectAddFundsTrxRequestId,
  makeSelectOrderTrxRequestId,
  makeSelectAccountType,
  makeSelectQueryISAFAmlaFailObj,
  makeSelectIsQueryISAFAmlaError,
};
