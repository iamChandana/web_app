/* eslint-disable no-case-declarations */
/*
 *
 * ClientDetails reducer
 *
 */
import {
  DEFAULT_ACTION,
  PROCESSING,
  RESET,
  CLEAR_INIT_RSP_OTP_ERR,
  CUSTOMER_DETAILS_GET_SUCCESS,
  TOPUP_REDEEM_REQUEST_SUCCESS,
  PAYMENT_DOCS_CREATE_SUCCESS,
  TRANSACTION_GET_SUCCESS,
  TRANSACTION_RESET,
  BANK_ADD_SUCCESS,
  ERROR,
  SUCCESS,
  INITIAL_RSP_RESPONSE,
  CLEAR_RSP_OTP_DATA,
  PROCESSING_SETUP_RSP,
  SWITCH_FUND_SUCCESS,
  SWITCH_FUND_FAIL,
  INIT_FUND_TRANSACTION_OTP_SUCCESS,
  INIT_FUND_TRANSACTION_OTP_FAIL,
  OPEN_MODAL_FUND_TRANSACTION_OTP,
  RESET_SWITCH_FUND_SUCCESS,
  SAVE_TOKEN_OF_FUND_TRANSACTION_OTP_SUCCESS_FROM_EXEC_AFTER_OTP,
  SHOW_MODAL_SWITCH_FUND,
  ALL_TRANSACTION_OTP_SUCCESS,
  SAVE_TRANSACTION_DATA,
  CLEAR_TRANSACTION_DATA,
  SUBMIT_TOKEN_AFTER_OTP_FAIL,
  STORE_TRANSACTION_REQUEST,
  PAYMENT_DOCS_CREATE,
  CLEAR_OTP_ERROR,
  TOPUP_REDEEM_REQUEST_FAIL,
  TOPUP_REDEEM_REQUEST,
  CLEAR_TOPUP_ERROR,
  RESET_ALLOCATE_FUND_STATUS,
  AMLA_CHECK_FAIL,
  SHOW_PAYMENT_SELECTION,
  SHOW_TXN_OTP_WINDOW,
  RESET_OTP,
  TRANSACTION_GET_FOR_DOWNLOAD_SUCCESS,
  REMOVE_FUND_TRANSACTIONS_FOR_DOWNLOAD,
  ERROR_RESET,
  SUCCESS_RESET,
  RESET_CLIENT_PROFILE_DATA,
  INVALID_CUSTOMER_ID,
  CLEAR_PAYMENT_STATUS,
  RESET_PREVIOUS_DONE_TXN_PAYMENT_TYPE,
  INIT_CLIENT_PROFILE_CHANGE_OTP_SUCCESS,
  INIT_CLIENT_PROFILE_CHANGE_OTP_ERROR,
  CLEAR_CLIENT_PROFILE_UPDATE_OTP_DATA,
  UPDATE_CLIENT_EMAIL_ERROR,
  UPDATE_CLIENT_EMAIL_SUCCESS,
  PROCESSING_UPDATE_CLIENT_PROFILE,
  RESENT_CONFIRMATION_EMAIL_STATUS,
  CLEAR_STATE_OF_CONFIRMATION_EMAIL_RESENT,
  SET_ERROR_MESSAGE,
  CLEAR_NEW_EMAIL,
  PROCESSING_TASK_CREATE_PAYMENT_REQUEST_WITH_DOC,
  CLEAR_TRANSACTION_REQUEST,
  SETUP_RSP_SUCCESS,
  SETUP_RSP_FAILURE,
  EDIT_RSP_SUCCESS,
  EDIT_RSP_FAILURE,
  INIT_RSP_OTP_SUCCESS,
  INIT_RSP_OTP_FAILURE,
  INIT_EDIT_RSP_OTP_SUCCESS,
  INIT_EDIT_RSP_OTP_FAILURE,
  INIT_TERMINATE_RSP_OTP_SUCCESS,
  INIT_TERMINATE_RSP_OTP_FAILURE,
  TERMINATE_RSP_SUCCESS,
  TERMINATE_RSP_FAILURE,
  SAVE_CLIENT_ACC_DETAIL,
  RISK_QUESTIONS_ANSWERS_GET_SUCCES,
  INIT_RETAKE_RISK_ASSESSMENT_OTP_SUCCESS,
  INIT_RETAKE_RISK_ASSESSMENT_OTP_FAILURE,
  CLEAR_RETAKE_RISK_ASSESSMENT_OTP_DATA,
  PROCESSING_RETAKE_ASSESSMENT,
  RETAKE_RISK_ASSESSMENT_ERROR,
  RETAKE_RISK_ASSESSMENT_SUCCESS,
  PROCESSING_CREATE_ACCOUNT_CLIENT_PROFILE,
  CLEAR_ACCOUNT_CREATION_SUCCESS_VALUE,
  CALL_UNSUBSCRIBE_SUCCESS,
  CREATE_CASH_ACCOUNT_FAILED,
  CREATE_CASH_CLIENT_EMAIL_ERROR,
  CREATE_ACCOUNT_SET_MODAL_SUCCESS,
  SAVE_GROUPED_FUNDS,
  CLEAR_GROUPED_FUNDS,
  SAVE_SELECTED_FUND,
  IS_ONLINE_TXN_SUCCESS,
  CREATE_KWSP_ACCOUNT_SUCCESS,
  SAVE_SELECTED_ACCOUNT_DETAILS,
  SET_ACCOUNT_CREATION_FLOW,
  SHOW_PAYMENT_SELECTION_SUBSCRIBE,
  RESET_AMLA_ERROR_OBJECT,
  EMAIL_OTP_REQUEST,
  EMAIL_OTP_SUCCESS,
  EMAIL_OTP_FAILURE,
  RESET_EMAIL_OTP_STATE,
  CANCEL_PENDING_TRX_REQUEST,
  CANCEL_PENDING_TRX_SUCCESS,
  CANCEL_PENDING_TRX_FAILURE,
  RESET_CANCEL_PENDING_TRX_STATE,
  CANCEL_PENDING_RSP_REQUEST,
  CANCEL_PENDING_RSP_SUCCESS,
  CANCEL_PENDING_RSP_FAILURE,
  SET_SELECTED_VERIFICATION_OPTION,
  INIT_RSP_OTP,
  INIT_EDIT_RSP_OTP,
  INIT_TERMINATE_RSP_OTP,
  INIT_FUND_TRANSACTION_OTP,
  GET_DEFAULT_SALES_CHARGE_REQUEST,
  GET_DEFAULT_SALES_CHARGE_SUCCESS,
  GET_DEFAULT_SALES_CHARGE_FAILURE,
  VERIFY_CAMPAIGN_CODE_REQUEST,
  VERIFY_CAMPAIGN_CODE_SUCCESS,
  VERIFY_CAMPAIGN_CODE_FAILURE,
  REMOVE_CAMPAIGN_CODE,
  SAVE_DOCUMENTS_URL,
  SAVE_PENDING_TRANSACTIONS,
} from './constants';

const initialState = {
  paymentSucceeded: undefined,
  processing: undefined,
  rspResponse: undefined,
  showModalFundTransactionOtp: false,
  switchFundSuccess: false,
  showModalSwitchFund: false,
  transactionRequest: '',
  topUpTransactionError: {},
  amlaFailObj: {},
  showPaymentSelection: undefined,
  invalidCustomerID: undefined,
  messageResentConfirmationEmailStatus: null,
  errorCreatePaymentRequestWithDocAfterOtp: null,
  isOTPCalled: false,
  setUpRspFailureErr: null,
  setUpRspSuccess: null,
  editRspSuccess: null,
  editRspFailureErr: null,
  clientAccDetail: null,
  unSubscribedFund: [],
  cashAccountCreationFailed: null,
  cashAccountCreatedSuccess: null,
  cashAccountCreationFailedMessage: null,
  isOpenUnsubscribeModal: false,
  groupedFunds: [],
  selectedFund: {},
  isEmailVerificationSent: false,
  verificationError: null,
  isCancelPendingVerificationSuccessful: false,
  selectedVerificationOption: null,
  salesCharges: [],
  fundTransactions: {},
  documentsUrl: {},
  pendingTransactionsResponse: {
    data: null,
    error: null,
  },
};

function clientDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
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
    case SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    case RESET:
      return initialState;
    case CALL_UNSUBSCRIBE_SUCCESS:
      return {
        ...state,
        unSubscribedFund: [...state.unSubscribedFund, ...action.payload],
        isOpenUnsubscribeModal: false,
        groupedFunds: [],
        selectedFund: {},
      };
    case SAVE_GROUPED_FUNDS:
      return {
        ...state,
        isOpenUnsubscribeModal: true,
        groupedFunds: action.payload,
      };
    case CLEAR_GROUPED_FUNDS:
      return {
        ...state,
        groupedFunds: [],
        isOpenUnsubscribeModal: false,
        selectedFund: {},
      };
    case SAVE_SELECTED_FUND:
      return {
        ...state,
        selectedFund: action.payload,
      };
    case CUSTOMER_DETAILS_GET_SUCCESS:
      return {
        ...state,
        clientDetails: action.payload,
        subscribeAccountId: null,
      };
    case TOPUP_REDEEM_REQUEST_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
      };
    case TRANSACTION_RESET:
      return {
        ...state,
        transactions: null,
      };
    case PAYMENT_DOCS_CREATE:
      return {
        ...state,
        paymentSucceeded: false,
      };
    case PAYMENT_DOCS_CREATE_SUCCESS:
      return {
        ...state,
        paymentSucceeded: true,
      };
    case BANK_ADD_SUCCESS:
      return {
        ...state,
        addedBank: action.payload,
      };
    case TRANSACTION_GET_SUCCESS:
      return {
        ...state,
        fundTransactions: {
          ...state.fundTransactions,
          [action.payload.fund]: action.payload.data,
        },
      };

    case SWITCH_FUND_SUCCESS:
      return {
        ...state,
        showModalFundTransactionOtp: false,
      };

    case RESET_SWITCH_FUND_SUCCESS:
      return {
        ...state,
        switchFundSuccessData: null,
        switchFundSuccess: false,
        showModalFundTransactionOtp: false,
      };

    case SWITCH_FUND_FAIL:
      return {
        ...state,
        switchFundError: action.payload,
      };

    case SUBMIT_TOKEN_AFTER_OTP_FAIL:
      return {
        ...state,
        errorSubmitTokenAfterOTP: action.payload,
      };

    case INIT_FUND_TRANSACTION_OTP_SUCCESS:
      return {
        ...state,
        initFundTransactionOtpSuccessData: action.payload,
        showModalFundTransactionOtp: true,
        isTxnDoneUsingOnlinePayment: action.payload.paymentType === 'IB',
        transactionType: action.payload.transactionType,
        isTxnDoneUsingOnlinePaymentSuccess: null,
      };
    case IS_ONLINE_TXN_SUCCESS: {
      return {
        ...state,
        isTxnDoneUsingOnlinePaymentSuccess: action.payload,
        errorCreatePaymentRequestWithDocAfterOtp: action.payload ? null : state.errorCreatePaymentRequestWithDocAfterOtp,
      };
    }
    case INIT_FUND_TRANSACTION_OTP_FAIL:
      return {
        ...state,
        initFundTransactionOtpError: action.payload,
      };

    case OPEN_MODAL_FUND_TRANSACTION_OTP:
      if (action.payload) {
        return {
          ...state,
          showModalFundTransactionOtp: true,
        };
      }
      return {
        ...state,
        initFundTransactionOtpSuccessData: null,
        showModalFundTransactionOtp: false,
      };

    case SAVE_TOKEN_OF_FUND_TRANSACTION_OTP_SUCCESS_FROM_EXEC_AFTER_OTP:
      return {
        ...state,
        tokenFundTransactionOtpSuccessFromExecAfterOtp: action.payload,
        showModalFundTransactionOtp: false,
      };

    case SHOW_MODAL_SWITCH_FUND:
      return {
        ...state,
        showModalSwitchFund: action.payload,
      };

    case ALL_TRANSACTION_OTP_SUCCESS:
      return {
        ...state,
        allTransactionOTPSuccess: true,
        showModalFundTransactionOtp: false,
        initFundTransactionOtpSuccessData: undefined,
        showPaymentSelection: false,
      };

    case SAVE_TRANSACTION_DATA:
      return {
        ...state,
        dataTransaction: action.payload,
      };

    case CLEAR_TRANSACTION_DATA:
      return {
        ...state,
        dataTransaction: null,
        paymentSucceeded: undefined,
        allTransactionOTPSuccess: undefined,
      };

    case STORE_TRANSACTION_REQUEST:
      return {
        ...state,
        transactionRequest: action.payload,
      };

    case CLEAR_OTP_ERROR:
      return {
        ...state,
        initFundTransactionOtpError: {},
        initClientProfileChangeOtpError: null,
      };
    case TOPUP_REDEEM_REQUEST:
      return {
        ...state,
        topUpTransactionError: {},
      };
    case TOPUP_REDEEM_REQUEST_FAIL:
      return {
        ...state,
        topUpTransactionError: action.payload,
      };
    case CLEAR_TOPUP_ERROR:
      return {
        ...state,
        topUpTransactionError: {},
      };
    case RESET_ALLOCATE_FUND_STATUS:
      return {
        ...state,
        paymentSucceeded: undefined,
        allTransactionOTPSuccess: undefined,
      };
    case AMLA_CHECK_FAIL:
      return {
        ...state,
        amlaFailObj: action.payload,
      };
    case SHOW_PAYMENT_SELECTION:
      return {
        ...state,
        showPaymentSelection: action.payload,
      };
    case SHOW_TXN_OTP_WINDOW:
      return {
        ...state,
        showModalFundTransactionOtp: action.payload,
      };
    case RESET_OTP:
      return {
        ...state,
        initFundTransactionOtpSuccessData: null,
        showModalFundTransactionOtp: undefined,
      };
    case TRANSACTION_GET_FOR_DOWNLOAD_SUCCESS:
      return {
        ...state,
        fundTransactionsForDownload: action.payload,
      };
    case REMOVE_FUND_TRANSACTIONS_FOR_DOWNLOAD:
      return {
        ...state,
        fundTransactionsForDownload: null,
      };
    case ERROR_RESET:
      return {
        ...state,
        error: null,
        errorCreatePaymentRequestWithDocAfterOtp: null,
      };
    case SUCCESS_RESET:
      return {
        ...state,
        success: null,
      };
    case RESET_CLIENT_PROFILE_DATA:
      return {
        ...state,
        clientDetails: null,
      };
    case INVALID_CUSTOMER_ID:
      return {
        ...state,
        invalidCustomerID: true,
      };
    case CLEAR_PAYMENT_STATUS:
      return {
        ...state,
        paymentSucceeded: undefined,
      };
    case RESET_PREVIOUS_DONE_TXN_PAYMENT_TYPE:
      return {
        ...state,
        isTxnDoneUsingOnlinePayment: null,
      };
    case INIT_CLIENT_PROFILE_CHANGE_OTP_SUCCESS:
      return {
        ...state,
        initClientProfileChangeOtpSuccessData: action.payload.res, // this is the otp frame url
        showModalClientProfileChangeOtp: true,
        newEmail: action.payload.newEmail,
        editedData: action.payload.editedData,
        isOTPCalled: false,
      };
    case INIT_CLIENT_PROFILE_CHANGE_OTP_ERROR:
      return {
        ...state,
        initClientProfileChangeOtpError: action.payload,
      };
    case INIT_RETAKE_RISK_ASSESSMENT_OTP_SUCCESS:
      return {
        ...state,
        initRetakeRiskAssessmentOtpSuccessData: action.payload.res,
        isOTPCalled: false,
      };
    case INIT_RETAKE_RISK_ASSESSMENT_OTP_FAILURE:
      return {
        ...state,
        initRetakeRiskAssessmentOtpError: action.payload,
      };
    case CLEAR_RETAKE_RISK_ASSESSMENT_OTP_DATA:
      return {
        ...state,
        initRetakeRiskAssessmentOtpSuccessData: null,
        initRetakeRiskAssessmentOtpError: null,
        isProcessingRetakeRiskAssessment: null,
        retakeRiskAssessmentError: null,
        retakeRiskAssessmentSuccess: null,
      };
    case PROCESSING_RETAKE_ASSESSMENT:
      return {
        ...state,
        isProcessingRetakeRiskAssessment: action.payload,
        isOTPCalled: true,
      };
    case RETAKE_RISK_ASSESSMENT_ERROR:
      return {
        ...state,
        retakeRiskAssessmentError: action.payload,
      };
    case RETAKE_RISK_ASSESSMENT_SUCCESS:
      return {
        ...state,
        retakeRiskAssessmentSuccess: true,
      };
    case INIT_RSP_OTP_SUCCESS:
      const { url, rspDataObj } = action.payload;
      return {
        ...state,
        initRspOtpSuccessData: url, // this is the otp frame url
        showModalRspOtp: true,
        rspDataObj,
        isOTPCalled: false,
      };
    case INIT_RSP_OTP_FAILURE:
      return {
        ...state,
        initRspOtpError: action.payload,
      };
    case INIT_EDIT_RSP_OTP_SUCCESS:
      const { uri, fundIds, rspRefNo } = action.payload;
      return {
        ...state,
        initEditRspOtpSuccessData: uri, // this is the otp frame url
        showModalEditRspOtp: true,
        fundIds,
        rspRefNo,
        isOTPCalled: false,
      };
    case INIT_EDIT_RSP_OTP_FAILURE:
      return {
        ...state,
        initEditRspOtpError: action.payload,
      };
    case INIT_TERMINATE_RSP_OTP_SUCCESS:
      return {
        ...state,
        initTerminateRspOtpSuccessData: action.payload.url,
        fundIds: action.payload.fundIds,
      };
    case INIT_TERMINATE_RSP_OTP_FAILURE:
      return {
        ...state,
        initTerminateRspOtpError: action.payload,
      };
    case CLEAR_RSP_OTP_DATA:
      return {
        ...state,
        initRspOtpError: null,
        initEditRspOtpError: null,
        showModalRspOtp: null,
        showModalEditRspOtp: null,
        initRspOtpSuccessData: null,
        initEditRspOtpSuccessData: null,
        isProcessingSetUpRsp: null,
        setUpRspSuccess: null,
        initTerminateRspOtpSuccessData: null,
        initTerminateRspOtpError: null,
        setUpRspFailureErr: null,
        editRspSuccess: null,
        editRspFailureErr: null,
        terminateRspSuccess: null,
        terminateRspFailureErr: null,
      };
    case SETUP_RSP_SUCCESS:
      return {
        ...state,
        setUpRspSuccess: true,
      };
    case SETUP_RSP_FAILURE:
      return {
        ...state,
        setUpRspFailureErr: action.payload,
      };
    case EDIT_RSP_SUCCESS:
      return {
        ...state,
        editRspSuccess: true,
      };
    case EDIT_RSP_FAILURE:
      return {
        ...state,
        editRspFailureErr: action.payload,
      };
    case TERMINATE_RSP_SUCCESS: {
      return {
        ...state,
        terminateRspSuccess: true,
      };
    }
    case TERMINATE_RSP_FAILURE: {
      return {
        ...state,
        terminateRspFailureErr: action.payload,
      };
    }
    case CLEAR_INIT_RSP_OTP_ERR:
      return {
        ...state,
        initRspOtpError: null,
      };
    case INITIAL_RSP_RESPONSE:
      return {
        ...state,
        rspResponse: null,
        initRspOtpError: null,
        showModalRspOtp: null,
        showModalEditRspOtp: null,
        initRspOtpSuccessData: null,
        initEditRspOtpSuccessData: null,
        isProcessingSetUpRsp: null,
        setUpRspSuccess: null,
        setUpRspFailureErr: null,
        editRspSuccess: null,
        editRspFailureErr: null,
      };
    case UPDATE_CLIENT_EMAIL_ERROR:
      return {
        ...state,
        updateClientEmailError: action.payload,
      };
    case CREATE_CASH_CLIENT_EMAIL_ERROR: {
      return {
        ...state,
        createCashAccountClientError: action.payload,
      };
    }
    case UPDATE_CLIENT_EMAIL_SUCCESS:
      // const accountsArray = [...state.clientDetails.info.account];
      // accountsArray.unshift({
      //   ...state.clientDetails.info.account[0],
      //   AccEmail: state.newEmail || state.clientDetails.info.account[0].AccEmail,
      //   isEmailVerified: !state.newEmail,
      //   ...state.editedData,
      // });

      return {
        ...state,
        updateClientEmailSuccess: true,
        // clientDetails: {
        //   ...state.clientDetails,
        //   info: {
        //     ...state.clientDetails.info,
        //     account: [
        //       ...(_uniqWith(accountsArray, _isEqual)),
        //     ],
        //   },
        // },
      };
    // case CREATE_ACCOUNT_SUCCESS:
    //   return {
    //     ...state,
    //     clientDetails: {
    //       ...state.clientDetails,
    //       info: {
    //         ...state.clientDetails.info,
    //         account: {
    //           ...state.clientDetails.info.account,
    //           0: {
    //             ...state.clientDetails.info.account[0],
    //             AccEmail: state.newEmail || state.clientDetails.info.account[0].AccEmail,
    //             isEmailVerified: !state.newEmail,
    //             ...state.editedData,
    //           },
    //         },
    //       },
    //     },
    //   };

    case CREATE_ACCOUNT_SET_MODAL_SUCCESS: {
      return {
        ...state,
        cashAccountCreatedSuccess: true,
        accountCreationFlow: null,
      };
    }

    case PROCESSING_UPDATE_CLIENT_PROFILE:
      return {
        ...state,
        isProcessingUpdateClientProfile: action.payload,
        isOTPCalled: true,
      };
    case PROCESSING_CREATE_ACCOUNT_CLIENT_PROFILE:
      return {
        ...state,
        isProcessingCreateAccount: action.payload,
        isOTPCalled: true,
      };
    case PROCESSING_SETUP_RSP:
      return {
        ...state,
        isProcessingSetUpRsp: action.payload,
        isOTPCalled: true,
      };
    case CLEAR_CLIENT_PROFILE_UPDATE_OTP_DATA:
      return {
        ...state,
        initClientProfileChangeOtpError: null,
        showModalClientProfileChangeOtp: null,
        initClientProfileChangeOtpSuccessData: null,
        updateClientEmailError: null,
        updateClientEmailSuccess: null,
        isProcessingUpdateClientProfile: null,
        cashAccountCreationFailed: null,
        cashAccountCreationFailedMessage: null,
        createCashAccountClientError: null,
        isOTPCalled: false,
      };
    case RESENT_CONFIRMATION_EMAIL_STATUS:
      return {
        ...state,
        messageResentConfirmationEmailStatus: action.payload,
      };
    case CLEAR_STATE_OF_CONFIRMATION_EMAIL_RESENT:
      return {
        ...state,
        messageResentConfirmationEmailStatus: null,
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        [action.payload.errorName]: action.payload.message,
      };
    case CLEAR_NEW_EMAIL:
      return {
        ...state,
        newEmail: null,
        editedData: null,
      };
    case PROCESSING_TASK_CREATE_PAYMENT_REQUEST_WITH_DOC:
      return {
        ...state,
        isProcessingTaskCreatePaymentRequestWithDoc: action.payload,
      };
    case CLEAR_TRANSACTION_REQUEST:
      return {
        ...state,
        transactionRequest: null,
      };
    case SAVE_CLIENT_ACC_DETAIL:
      return {
        ...state,
        clientAccDetail: action.payload,
      };
    case RISK_QUESTIONS_ANSWERS_GET_SUCCES:
      return {
        ...state,
        questions: action.payload,
      };

    case CLEAR_ACCOUNT_CREATION_SUCCESS_VALUE: {
      return {
        ...state,
        cashAccountCreatedSuccess: null,
        kwspAccountCreatedSuccess: null,
        accountCreationFlow: null,
      };
    }

    case CREATE_CASH_ACCOUNT_FAILED: {
      return {
        ...state,
        cashAccountCreationFailed: true,
        cashAccountCreationFailedMessage: action.payload.errorMessage,
      };
    }

    case CREATE_KWSP_ACCOUNT_SUCCESS: {
      return {
        ...state,
        kwspAccountCreatedSuccess: action.payload,
        accountCreationFlow: null,
      };
    }

    case SAVE_SELECTED_ACCOUNT_DETAILS: {
      return {
        ...state,
        selectedAccountDetails: action.payload,
      };
    }

    case SET_ACCOUNT_CREATION_FLOW: {
      return {
        ...state,
        accountCreationFlow: action.payload,
      };
    }

    case SHOW_PAYMENT_SELECTION_SUBSCRIBE: {
      return {
        ...state,
        showPaymentSelection: action.payload.showPaymentSelection,
        subscribeAccountId: action.payload.accountId,
      };
    }

    case RESET_AMLA_ERROR_OBJECT: {
      return {
        ...state,
        amlaFailObj: initialState.amlaFailObj,
      };
    }

    case EMAIL_OTP_REQUEST: {
      return {
        ...state,
        processing: true,
        verificationError: initialState.verificationError,
      };
    }

    case EMAIL_OTP_SUCCESS: {
      return {
        ...state,
        isEmailVerificationSent: true,
        processing: false,
      };
    }

    case EMAIL_OTP_FAILURE: {
      return {
        ...state,
        isEmailVerificationSent: false,
        processing: false,
        verificationError: action.err,
      };
    }

    case RESET_EMAIL_OTP_STATE: {
      return {
        ...state,
        isEmailVerificationSent: initialState.isEmailVerificationSent,
        selectedVerificationOption: initialState.selectedVerificationOption,
        verificationError: initialState.verificationError,
      };
    }

    case CANCEL_PENDING_TRX_REQUEST: {
      return {
        ...state,
        processing: true,
      };
    }

    case CANCEL_PENDING_TRX_SUCCESS: {
      return {
        ...state,
        processing: false,
        isCancelPendingVerificationSuccessful: true,
      };
    }

    case CANCEL_PENDING_TRX_FAILURE: {
      return {
        ...state,
        processing: false,
      };
    }

    case RESET_CANCEL_PENDING_TRX_STATE: {
      return {
        ...state,
        isCancelPendingVerificationSuccessful: initialState.isCancelPendingVerificationSuccessful,
      };
    }

    case CANCEL_PENDING_RSP_REQUEST: {
      return {
        ...state,
        processing: true,
      };
    }

    case CANCEL_PENDING_RSP_SUCCESS: {
      return {
        ...state,
        processing: false,
        isCancelPendingVerificationSuccessful: true,
      };
    }

    case CANCEL_PENDING_RSP_FAILURE: {
      return {
        ...state,
        processing: false,
      };
    }

    case SET_SELECTED_VERIFICATION_OPTION: {
      return {
        ...state,
        selectedVerificationOption: action.selectedOption,
      };
    }

    case INIT_FUND_TRANSACTION_OTP: {
      return {
        ...state,
        processing: true,
        verificationError: initialState.verificationError,
      };
    }

    case INIT_TERMINATE_RSP_OTP: {
      return {
        ...state,
        processing: true,
        verificationError: initialState.verificationError,
      };
    }
    case INIT_EDIT_RSP_OTP: {
      return {
        ...state,
        processing: true,
        verificationError: initialState.verificationError,
      };
    }
    case INIT_RSP_OTP: {
      return {
        ...state,
        processing: true,
        verificationError: initialState.verificationError,
      };
    }

    case GET_DEFAULT_SALES_CHARGE_REQUEST: {
      return {
        ...state,
        salesCharges: [],
        processing: true,
      };
    }

    case GET_DEFAULT_SALES_CHARGE_SUCCESS: {
      return {
        ...state,
        salesCharges: action.res.data.response.map((data) => ({
          ...data,
          campaignSalesCharge: null,
          campaignCode: null,
          campaignMinInitialInvestment: null,
          campaignErrorMessage: null,
        })),
        processing: false,
      };
    }

    case GET_DEFAULT_SALES_CHARGE_FAILURE: {
      return {
        ...state,
        processing: false,
      };
    }

    case VERIFY_CAMPAIGN_CODE_REQUEST: {
      return {
        ...state,
        processing: true,
      };
    }

    case VERIFY_CAMPAIGN_CODE_SUCCESS: {
      const newArray = state.salesCharges.map((item) => {
        if (item.NEWFUNDCODE.trim() === action.res.fundCode) {
          return {
            ...item,
            campaignSalesCharge: action.res.salesCharge,
            campaignCode: action.res.campaignCode,
            campaignCodeId: action.res.campaignCodeId,
            campaignCodeSalesCharge: action.res.campaignCodeSalesCharge,
            campaignMinInitialInvestment: action.res.minInvestment,
            campaignErrorMessage: null,
          };
        }

        return item;
      });

      return {
        ...state,
        salesCharges: newArray,
        processing: false,
      };
    }

    case SAVE_DOCUMENTS_URL: {
      return {
        ...state,
        documentsUrl: action.payload,
      };
    }

    case VERIFY_CAMPAIGN_CODE_FAILURE: {
      const newArray = state.salesCharges.map((item) => {
        if (item.NEWFUNDCODE.trim() === action.fundCode) {
          return {
            ...item,
            campaignSalesCharge: null,
            campaignCode: null,
            campaignCodeId: null,
            campaignMinInitialInvestment: null,
            campaignErrorMessage: action.err.error.message,
          };
        }

        return item;
      });

      return {
        ...state,
        salesCharges: newArray,
        processing: false,
      };
    }

    case REMOVE_CAMPAIGN_CODE: {
      const newArray = state.salesCharges.map((item) => {
        if (item.NEWFUNDCODE.trim() === action.fundCode) {
          return {
            ...item,
            campaignSalesCharge: null,
            campaignCode: null,
            campaignCodeSalesCharge: null,
            campaignCodeId: null,
            campaignErrorMessage: null,
          };
        }

        return item;
      });

      return {
        ...state,
        salesCharges: newArray,
        processing: false,
      };
    }

    case SAVE_PENDING_TRANSACTIONS: {
      return {
        ...state,
        pendingTransactionsResponse: action.payload,
      };
    }

    default:
      return state;
  }
}

export default clientDetailsReducer;
