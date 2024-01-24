/* eslint-disable no-case-declarations */
/*
 *
 * OnBoarding reducer
 *
 */
import {
  TITLE_SET,
  INTRODUCTION_SAVE,
  STEP_SET,
  RISK_PROFILE_1_SAVE,
  RISK_PROFILE_2_SAVE,
  RISK_PROFILE_3_SAVE,
  RISK_PROFILE_4_SAVE,
  RISK_PROFILE_5_SAVE,
  CLEAR_RISK_PROFILE_ANSWERS,
  RISK_PROFILES_GET_SUCCESS,
  FUNDS_SAVE,
  INITIAL_INVESTMENT_SAVE,
  PERSONAL_DETAILS_SAVE,
  FUNDS_DRAWER_SAVE,
  PROCESSING,
  DOC_REUPLOAD_SUCCESS,
  DOC_REUPLOAD_FAILURE,
  CLEAR_REUPLOAD_LOGS,
  FUNDS_GET_SUCCESS,
  RISK_QUESTIONS_ANSWERS_GET_SUCCES,
  RISK_SCORE_GET_SUCCESS,
  IMAGE_SAVE,
  FUNDS_ALL_GET_SUCCESS,
  ANNUAL_INCOME_GET_SUCCESS,
  ACCOUNT_CREATE_SUCCESS,
  RESET,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  PAYMENT_DOCS_CREATE_SUCCESS,
  ERROR,
  ERROR_RESET,
  AMLA_CHECK_SUCCESS,
  AMLA_RESET,
  AMLA_CHECK_FAIL,
  FUNDS_GET,
  OPEN_ONBAORDING_CLIENT_CONFIRMATION_OTP_MODAL,
  ADD_PRODUCT_TO_PORTFOLIO,
  ADD_PRODUCT_TO_PORTFOLIO_SUCCESS,
  ADD_PRODUCT_TO_PORTFOLIO_FAIL,
  INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP_SUCCESS,
  ADDED_PRODUCT_TO_POTFOLIO_RESET,
  TRANSACTION_FILE_UPLOAD_SUCCESS,
  PERSONAL_DETAILS_VALIDATE_SUCCESS,
  POSTAL_CODE_VALIDATE_SUCCESS,
  PAYMENT_DOCS_UPLOADED_RESET,
  PAYMENT_METHOD_SET,
  FUNDS_SAVE_SELECTED,
  PERSONAL_DETAILS_VALIDATE_FAIL,
  SAVE_ALL_FUNDS_WITH_FUND_DETAILS,
  POSTAL_CODE_VALIDATE_FAIL,
  POSTAL_CODE_VALIDATE,
  FILE_UPLOAD,
  FILE_UPLOAD_FAILED,
  CORRESPONDENCE_IS_PERMANENT_SET,
  SELECTED_FUND_REMOVE,
  AMLA_CHECK_FAIL_ON_ADD_FUND,
  CIF_DETAILS_SAVE,
  CIF_ALREADY_EXIST,
  RESET_CIF_ALREADY_EXIST,
  SET_RISK_PROFILE_TYPE,
  SAVE_INTRO_SUCCESS,
  CLEAR_STATE_FROM_POSTAL_CODE,
  DISABLE_NOB,
  CLEAR_IMAGE,
  RESET_OTP,
  PROCESSING_GET_ALL_FUND_WITH_FUND_DETAILS,
  CLEAR_STATES_FOR_ADD_FUND,
  INIT_MULTI_AGENT_MAP_OTP_SUCCESS,
  INIT_MULTI_AGENT_MAP_OTP_FAILURE,
  CLEAR_MULTI_AGENT_MAP_OTP_DATA,
  PROCESSING_MULTI_AGENT_MAP,
  MULTI_AGENT_MAP_SUCCESS,
  MULTI_AGENT_MAP_ERROR,
  NOT_FOUND_PDA_ERROR,
  SAVE_INTEREST,
  GET_DRAFT_SUCCESS,
  FILE_UPLOAD_DOC,
  FILE_UPLOAD_DOC_FAILED,
  CLEAR_UNSAVED_IMAGES,
  SAVE_KWSP_CASH_CIF_DETAILS,
  RESET_INTRO_DETAILS,
  CLEAR_PORTFOLIO_ERROR,
  CLEAR_RISK_PROFILE_TYPE,
  GET_DEFAULT_SALES_CHARGE_REQUEST,
  GET_DEFAULT_SALES_CHARGE_SUCCESS,
  GET_DEFAULT_SALES_CHARGE_FAILURE,
  VERIFY_CAMPAIGN_CODE_SUCCESS,
  VERIFY_CAMPAIGN_CODE_FAILURE,
  REMOVE_CAMPAIGN_CODE,
  VERIFY_CAMPAIGN_CODE_REQUEST,
  QUERYISAF_AMLA_FAIL,
  QUERYISAF_AMLA_RESET,
} from './constants';

import { CUSTOMER_GET_SUCCESS } from '../ClientDetails/constants';

const initialState = {
  title: 'Hello! Please tell us about yourself.',
  step: 2,
  paymentRequestSucceeded: false,
  error: '',
  uploadError: null,
  docUploadError: null,
  amlaPass: undefined,
  processing: false,
  assetFilter: 'All',
  riskProfileType: 'All', // props.riskScore.riskProfileType,
  valueForMoneyFilter: 'All',
  fundType: false,
  addedToPortfolio: false,
  paymentMethod: 'Payment Method', // no value, just placeholder
  correpondenceIsPermanent: false,
  addToPortfolioError: {},
  amlaFailObj: {},
  isExistingClient: undefined,
  personalDetails: {},
  saveIntroSuccess: undefined,
  NOBisDisable: false,
  introduction: {},
  docReUploadSuccess: null,
  docReUploadFailure: null,
  kwspCashIntroDetails: {},
  draftDetails: {
    data: {
      fullName: null,
    },
  },
  queryISAFFailObj: {},
};

function onBoardingReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DRAFT_SUCCESS:
      return {
        ...state,
        personalDetails: {
          ...state.personalDetails,
          ...action.payload.data,
        },
        introduction: {
          ...state.introduction,
          ...action.payload.data,
        },
        draftDetails: action.payload || {
          data: {
            fullName: null,
          },
        },
      };
    case PROCESSING:
      return {
        ...state,
        processing: action.payload,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case TITLE_SET:
      return {
        ...state,
        title: action.payload,
      };
    case STEP_SET:
      return {
        ...state,
        step: action.payload,
      };
    case INTRODUCTION_SAVE:
      const personalDetails = {
        ...state.personalDetails,
        ...state.introduction,
        ...action.payload,
      };
      return {
        ...state,
        introduction: action.payload,
        personalDetails,
        step: 2,
      };
    case ANNUAL_INCOME_GET_SUCCESS:
      return {
        ...state,
        annualIncomeLOV: action.payload,
      };

    // risk
    case CLEAR_RISK_PROFILE_TYPE:
      return {
        ...state,
        riskProfileType: null,
      };
    case RISK_PROFILE_1_SAVE:
      return {
        ...state,
        riskProfile1: action.payload,
      };
    case RISK_PROFILE_2_SAVE:
      return {
        ...state,
        riskProfile2: action.payload,
      };
    case RISK_PROFILE_3_SAVE:
      return {
        ...state,
        riskProfile3: action.payload,
      };
    case RISK_PROFILE_4_SAVE:
      return {
        ...state,
        riskProfile4: action.payload,
      };
    case RISK_PROFILE_5_SAVE:
      return {
        ...state,
        riskProfile5: action.payload,
      };
    case CLEAR_RISK_PROFILE_ANSWERS:
      return {
        ...state,
        riskProfile1: null,
        riskProfile2: null,
        riskProfile3: null,
        riskProfile4: null,
        riskProfile5: null,
      };
    case RISK_PROFILES_GET_SUCCESS:
      return {
        ...state,
        riskProfiles: action.payload,
      };
    case RISK_SCORE_GET_SUCCESS:
      return {
        ...state,
        riskScore: action.payload,
        riskProfileType: action.payload.riskProfileType,
      };

    // funds
    case FUNDS_SAVE:
      return {
        ...state,
        selectedFunds: action.payload.map((fund) => ({
          ...fund,
          defaultSalesCharge: fund.defaultSalesCharge || 0,
          campaignSalesCharge: fund.campaignSalesCharge || null,
          campaignCode: fund.campaignCode || null,
          campaignMinInitialInvestment: fund.campaignMinInitialInvestment || null,
          campaignErrorMessage: null,
        })),
        fundsDrawer: action.payload,
      };
    case FUNDS_SAVE_SELECTED:
      return {
        ...state,
        selectedFunds: action.payload,
      };
    case INITIAL_INVESTMENT_SAVE:
      return {
        ...state,
        initialInvestment: action.payload,
      };
    case PERSONAL_DETAILS_SAVE:
      return {
        ...state,
        personalDetails: { ...state.personalDetails, ...state.introduction, ...action.payload },
        introduction: {
          ...state.introduction,
        },
      };
    case FUNDS_DRAWER_SAVE:
      return {
        ...state,
        fundsDrawer: action.payload,
      };
    case FUNDS_GET_SUCCESS:
      return {
        ...state,
        funds: action.payload.funds,
        ValueForMoney: action.payload.ValueForMoney,
        assetFilter: action.payload.assetFilter,
        fundType: action.payload.fundType,
        riskProfileType: action.payload.riskProfileType,
      };
    case FUNDS_ALL_GET_SUCCESS:
      return {
        ...state,
        allFunds: action.payload,
      };
    case SAVE_ALL_FUNDS_WITH_FUND_DETAILS:
      return {
        ...state,
        allFundsWithDetails: action.payload,
      };
    case RISK_QUESTIONS_ANSWERS_GET_SUCCES:
      return {
        ...state,
        questions: action.payload,
      };
    case ACCOUNT_CREATE_SUCCESS:
      return {
        ...state,
        account: action.payload,
      };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        orderCreated: action.payload,
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        orderCreateError: action.payload,
      };
    case PAYMENT_DOCS_CREATE_SUCCESS:
      return {
        ...state,
        paymentRequestSucceeded: true,
        paymentDocsUploadedData: action.payload,
      };
    case PAYMENT_DOCS_UPLOADED_RESET:
      return {
        ...state,
        paymentRequestSucceeded: false,
      };
    case IMAGE_SAVE:
      return {
        ...state,
        image: {
          ...state.image,
          ...action.payload,
        },
      };
    case AMLA_CHECK_SUCCESS:
      return {
        ...state,
        amlaPass: true,
        signUpToken: action.payload,
      };
    case AMLA_CHECK_FAIL:
      return {
        ...state,
        amlaPass: false,
        amlaError: action.payload,
        validateErrorDetails: action.payload,
      };
    case AMLA_RESET:
      return {
        ...state,
        amlaPass: undefined,
      };
    case RESET:
      return initialState;

    case FUNDS_GET:
      if (action.payload) {
        return {
          ...state,
          ValueForMoney: action.payload.ValueForMoney,
          assetFilter: action.payload.assetFilter,
          fundType: action.payload.fundType,
          riskProfileType: action.payload.riskProfileType,
        };
      }
      return state;
    case FILE_UPLOAD:
      return {
        ...state,
        uploadError: false,
      };
    case FILE_UPLOAD_DOC:
      return {
        ...state,
        docUploadError: false,
      };
    case FILE_UPLOAD_FAILED:
      return {
        ...state,
        uploadError: true,
      };
    case FILE_UPLOAD_DOC_FAILED:
      return {
        ...state,
        docUploadError: true,
      };
    case ERROR_RESET:
      return {
        ...state,
        error: '',
        validateErrorDetails: {},
        amlaPass: undefined,
      };

    case OPEN_ONBAORDING_CLIENT_CONFIRMATION_OTP_MODAL:
      return {
        ...state,
        showOnBoardingClientConfirmationOtpModal: action.payload,
      };

    case INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP_SUCCESS:
      return {
        ...state,
        OTPSrcAccountCreation: action.payload,
        showOnBoardingClientConfirmationOtpModal: true,
      };

    case CUSTOMER_GET_SUCCESS:
      return {
        ...state,
        customer: action.payload,
      };
    case ADD_PRODUCT_TO_PORTFOLIO_SUCCESS:
      return {
        ...state,
        addedToPortfolio: true,
        addedFunds: action.payload,
      };
    case ADD_PRODUCT_TO_PORTFOLIO:
      return {
        ...state,
        addToPortfolioError: {},
      };
    case ADD_PRODUCT_TO_PORTFOLIO_FAIL:
      return {
        ...state,
        addToPortfolioError: {
          errorMessage: action.payload,
        },
      };
    case ADDED_PRODUCT_TO_POTFOLIO_RESET:
      return {
        ...state,
        addedToPortfolio: false,
      };
    case TRANSACTION_FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        transactionFile: action.payload,
      };
    case PERSONAL_DETAILS_VALIDATE_SUCCESS:
      return {
        ...state,
        validatedDetails: action.payload,
      };
    case PERSONAL_DETAILS_VALIDATE_FAIL:
      return {
        ...state,
        validateErrorDetails: action.payload,
      };
    case POSTAL_CODE_VALIDATE:
      return {
        ...state,
        stateFromPostalCode: {
          ...state.stateFromPostalCode,
          [action.payload.type]: null,
        },
      };
    case POSTAL_CODE_VALIDATE_SUCCESS:
      return {
        ...state,
        stateFromPostalCode: {
          // ...state.stateFromPostalCode,
          [action.payload.type]: action.payload.data,
        },
      };
    case POSTAL_CODE_VALIDATE_FAIL:
      return {
        ...state,
        stateFromPostalCode: {
          [action.payload.type]: {
            data: null,
            errorMsg: action.payload.errorMsg,
            error: true,
          },
        },
      };
    case PAYMENT_METHOD_SET:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CORRESPONDENCE_IS_PERMANENT_SET:
      return {
        ...state,
        correpondenceIsPermanent: action.payload,
      };
    case SELECTED_FUND_REMOVE:
      const filteredState = state.selectedFunds.filter((fund) => fund.id !== action.payload);
      return {
        ...state,
        selectedFunds: filteredState,
      };
    case AMLA_CHECK_FAIL_ON_ADD_FUND:
      return {
        ...state,
        amlaFailObj: action.payload,
      };
    case CIF_DETAILS_SAVE:
      return {
        ...state,
        cifDetails: action.payload,
        isExistingClient: false,
        processing: false,
        personalDetails: {
          ...state.personalDetails,
          ...state.introduction,
          ...action.payload,
          passportIdentificationType: action.payload.uploadType === 'Passport' ? action.payload.identificationType : null,
          identificationType: action.payload.uploadType === 'Passport' ? null : action.payload.identificationType,
          passportNumber: action.payload.uploadType === 'Passport' ? action.payload.identificationNumber : null,
          identificationNumber: action.payload.uploadType === 'Passport' ? null : action.payload.identificationNumber,
        },
      };
    case CIF_ALREADY_EXIST:
      return {
        ...state,
        isExistingClient: true,
        isExistingClientDetails: action.payload,
        processing: false,
        cifDetails: {
          uploadType: action.payload.uploadType,
          identificationNumber: action.payload.identificationNumber,
          identificationType: action.payload.identificationType,
        },
        personalDetails: {
          ...state.personalDetails,
          ...state.introduction,
          passportIdentificationType: action.payload.uploadType === 'Passport' ? action.payload.identificationType : null,
          identificationType: action.payload.uploadType === 'Passport' ? null : action.payload.identificationType,
          passportNumber: action.payload.uploadType === 'Passport' ? action.payload.identificationNumber : null,
          identificationNumber: action.payload.uploadType === 'Passport' ? null : action.payload.identificationNumber,
        },
      };
    case RESET_CIF_ALREADY_EXIST:
      return {
        ...state,
        isExistingClient: undefined,
      };
    case SET_RISK_PROFILE_TYPE:
      return {
        ...state,
        riskProfileType: action.payload,
      };
    case SAVE_INTRO_SUCCESS:
      return {
        ...state,
        saveIntroSuccess: action.payload,
      };
    case CLEAR_STATE_FROM_POSTAL_CODE:
      return {
        ...state,
        stateFromPostalCode: null,
      };
    case DISABLE_NOB:
      return {
        ...state,
        NOBisDisable: action.payload,
      };
    case CLEAR_IMAGE:
      return {
        ...state,
        image: null,
      };
    case RESET_OTP:
      return {
        ...state,
        OTPSrcAccountCreation: null,
        showOnBoardingClientConfirmationOtpModal: null,
      };
    case PROCESSING_GET_ALL_FUND_WITH_FUND_DETAILS:
      return {
        ...state,
        processingGetAllFundWithFundDetails: action.payload,
      };
    case CLEAR_STATES_FOR_ADD_FUND:
      return {
        ...state,
        fundsDrawer: [],
        funds: null,
        processing: null,
        riskScore: null,
        allFunds: null,
        error: null,
        customer: null,
        riskProfiles: [],
        fundFilterAsset: null,
        fundFilterFundType: null,
        fundFilterRiskProfileType: null,
        fundFilterValueForMoney: null,
        selectedFunds: [],
        initialInvestment: null,
        addedToPortfolio: false,
        addedFunds: [],
        paymentRequestSucceeded: null,
        paymentDocsUploadedData: null,
        addToPortfolioError: {},
        amlaFailObj: {},
        queryISAFFailObj: {},
      };
    // REUPLOAD
    case DOC_REUPLOAD_SUCCESS:
      return {
        ...state,
        docReUploadSuccess: action.payload,
      };
    case DOC_REUPLOAD_FAILURE:
      return {
        ...state,
        docReUploadFailure: action.payload,
      };
    case CLEAR_REUPLOAD_LOGS:
      return {
        ...state,
        docReUploadSuccess: null,
        docReUploadFailure: null,
      };
    case CLEAR_MULTI_AGENT_MAP_OTP_DATA:
      return {
        ...state,
        initMultiAgentMapOtpSuccessData: null,
        initMultiAgentMapOtpError: null,
        isProcessingMultiAgentMap: null,
        multiAgentMapSuccess: null,
        multiAgentMapError: null,
      };
    case INIT_MULTI_AGENT_MAP_OTP_SUCCESS:
      return {
        ...state,
        initMultiAgentMapOtpSuccessData: action.payload.res,
        isOTPCalled: false,
      };
    case INIT_MULTI_AGENT_MAP_OTP_FAILURE:
      return {
        ...state,
        initMultiAgentMapOtpError: action.payload,
      };
    case PROCESSING_MULTI_AGENT_MAP:
      return {
        ...state,
        isProcessingMultiAgentMap: action.payload,
        isOTPCalled: true,
      };
    case MULTI_AGENT_MAP_SUCCESS:
      return {
        ...state,
        multiAgentMapSuccess: true,
      };
    case MULTI_AGENT_MAP_ERROR:
      return {
        ...state,
        multiAgentMapError: action.payload,
      };
    case NOT_FOUND_PDA_ERROR:
      return {
        ...state,
        notFoundPdaError: true,
        isExistingClient: true,
      };
    case SAVE_INTEREST:
      return {
        ...state,
        interests: action.payload,
      };

    case CLEAR_UNSAVED_IMAGES: {
      return {
        ...state,
        image: action.payload,
      };
    }
    case SAVE_KWSP_CASH_CIF_DETAILS: {
      return {
        ...state,
        kwspCashIntroDetails: { ...action.payload },
      };
    }

    case RESET_INTRO_DETAILS: {
      return {
        ...state,
        introduction: action.payload,
      };
    }
    case CLEAR_PORTFOLIO_ERROR: {
      return {
        ...state,
        addToPortfolioError: {},
      };
    }

    case GET_DEFAULT_SALES_CHARGE_REQUEST: {
      return { ...state, processing: true };
    }

    case GET_DEFAULT_SALES_CHARGE_SUCCESS: {
      const arrayClone = state.selectedFunds;
      const newArray = arrayClone.map((fund) => {
        let salesCharge = action.res.find((charge) => charge && charge.NEWFUNDCODE.trim() === fund.fundcode);

        if (!salesCharge) {
          salesCharge = {
            ...salesCharge,
            id: 'NOT_FOUND',
          };
        }

        return {
          ...fund,
          defaultRateId: salesCharge.id || '',
          defaultSalesCharge: salesCharge.RATE || 0,
        };
      });
      return {
        ...state,
        selectedFunds: newArray,
        processing: false,
      };
    }

    case GET_DEFAULT_SALES_CHARGE_FAILURE: {
      return { ...state, processing: false };
    }

    case VERIFY_CAMPAIGN_CODE_REQUEST: {
      return {
        ...state,
        processing: true,
      };
    }

    case VERIFY_CAMPAIGN_CODE_SUCCESS: {
      const arrayClone = state.selectedFunds;
      const fundIndex = arrayClone.findIndex((fund) => fund.fundcode === action.res.fundCode);

      if (action.res.initialInvestment >= action.res.minInvestment) {
        arrayClone[fundIndex].campaignSalesCharge = action.res.salesCharge;
        arrayClone[fundIndex].campaignCode = action.res.campaignCode;
        arrayClone[fundIndex].campaignCodeId = action.res.campaignCodeId;
        arrayClone[fundIndex].campaignMinInitialInvestment = action.res.minInvestment;
        arrayClone[fundIndex].campaignCodeSalesCharge = action.res.campaignCodeSalesCharge;
      } else {
        arrayClone[fundIndex].campaignSalesCharge = null;
        arrayClone[fundIndex].campaignCode = 'MIN';
        arrayClone[fundIndex].campaignCodeId = null;
        arrayClone[fundIndex].campaignCodeSalesCharge = null;
        arrayClone[fundIndex].campaignMinInitialInvestment = action.res.minInvestment;
      }

      return {
        ...state,
        selectedFunds: arrayClone,
        processing: false,
      };
    }

    case VERIFY_CAMPAIGN_CODE_FAILURE: {
      let errorCode = null;

      switch (action.err.error.name) {
        case 'InvalidCampaignCode':
          errorCode = 'ERR';
          break;
        case 'NotApplicableToFund':
          errorCode = 'ERR';
          break;
        case 'LessThanTheRequiredMinimumAmount':
          errorCode = 'MIN';
          break;
        default:
          errorCode = 'ERR';
      }

      const updatedSelectedFunds = state.selectedFunds.map((fund) => {
        if (fund.fundcode === action.fundCode) {
          return {
            ...fund,
            campaignSalesCharge: null,
            campaignCode: errorCode,
            campaignCodeId: null,
            campaignErrorMessage: action.err.error.message,
          };
        }

        return fund;
      });

      return {
        ...state,
        selectedFunds: updatedSelectedFunds,
        processing: false,
      };
    }

    case REMOVE_CAMPAIGN_CODE: {
      const updatedSelectedFunds = state.selectedFunds.map((fund) => {
        if (fund.fundcode === action.fundCode) {
          return {
            ...fund,
            campaignSalesCharge: null,
            campaignCode: null,
            campaignCodeSalesCharge: null,
            campaignCodeId: null,
            campaignErrorMessage: null,
          };
        }

        return fund;
      });
      return {
        ...state,
        selectedFunds: updatedSelectedFunds,
      };
    }

    case QUERYISAF_AMLA_FAIL: {
      return {
        ...state,
        queryISAFFailObj: action.payload,
      };
    }

    case QUERYISAF_AMLA_RESET: {
      return {
        ...state,
        queryISAFFailObj: {},
      };
    }

    default:
      return state;
  }
}

export default onBoardingReducer;
