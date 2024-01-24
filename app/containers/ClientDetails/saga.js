/* eslint-disable import/first */
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import _has from 'lodash/has';
import { setToast } from 'containers/App/actions';
import { selectUserInfo } from 'containers/LoginPage/selectors';
import { makeSelectInterest } from 'containers/OnBoarding/selectors';
import {
  CUSTOMER_DETAILS_GET,
  SETUP_RSP,
  EDIT_RSP,
  INIT_EDIT_RSP_OTP,
  INIT_RSP_OTP,
  INIT_TERMINATE_RSP_OTP,
  TERMINATE_RSP,
  TOPUP_REDEEM_REQUEST,
  TRANSACTION_GET,
  BANK_ADD,
  PAYMENT_DOCS_CREATE,
  CUSTOMER_DETAILS_UPDATE,
  INIT_FUND_TRANSACTION_OTP,
  EXEC_AFTER_OTP_FUND_TRANSACTION_SUCCESS,
  EXEC_AFTER_OTP_FUND_TRANSACTION_FAIL,
  CHECK_AMLA_SUBSCRIBE,
  TRANSACTION_GET_FOR_DOWNLOAD,
  UPDATE_CLIENT_EMAIL,
  INIT_CLIENT_PROFILE_CHANGE_OTP,
  RESEND_CONFIRMATION_EMAIL,
  INIT_RETAKE_RISK_ASSESSMENT_OTP,
  RETAKE_RISK_ASSESSMENT,
  CREATE_ACCOUNT,
  CALL_UNSUBSCRIBE,
  CUSTOMER_PORTFOLIO_GET,
  GET_GROUPED_FUNDS,
  DISABLE_RSP_NOTIFICATION,
  WHOLESALE_DISCLAIMER_ACKNOWLEDGE,
  EMAIL_OTP_REQUEST,
  CANCEL_PENDING_TRX_REQUEST,
  CANCEL_PENDING_RSP_REQUEST,
  GET_DEFAULT_SALES_CHARGE_REQUEST,
  VERIFY_CAMPAIGN_CODE_REQUEST,
  GET_DOCUMENTS_URL,
  GET_PENDING_TRANSACTIONS,
  CALL_CANCEL_PENDING_TRANSACTIONS,
} from './constants';
import {
  processing,
  setUpRspSuccess,
  setUpRspFailure,
  editRspSuccess,
  editRspFailure,
  getCustomerDetailsSuccess,
  topUpOrRedeemSuccess,
  setError,
  setDBLockError,
  createPaymentDocsSuccess,
  getTransactionSuccess,
  addBankSuccess,
  initFundTransactionOtpSuccess,
  initFundTransactionOtpFail,
  allTransactionOTPSuccess,
  saveTransactionData,
  storeTransactionRequest,
  clearOTPError,
  topUpOrRedeemFail,
  checkAmlaFail,
  showPaymentSelectionSubscribe,
  getTransactionForDownloadSuccess,
  invalidCustomerId,
  initProfileChangeOtpSuccess,
  initClientProfileChangeOtpError,
  updateClientEmailError,
  updateClientEmailSuccess,
  processingUpdateClientProfile,
  resentConfirmationEmailStatus,
  setErrorMessage,
  processingTaskCreatePaymentRequestWithDoc,
  resetClientProfileData,
  initRspOtpSuccess,
  initRspOtpFailure,
  initEditRspOtpSuccess,
  initEditRspOtpFailure,
  initTerminateRspOtpSuccess,
  initTerminateRspOtpFailure,
  terminateRspSuccess,
  terminateRspFailure,
  processingSetUpRsp,
  initRetakeRiskAssessmentOtpSuccess,
  initRetakeRiskAssessmentOtpFailure,
  processingRetakeAssessment,
  retakeRiskAssessmentError,
  retakeRiskAssessmentSuccess,
  processingCreateAccountClientProfile,
  createAccountSuccess,
  callUnsubscribeSuccess,
  createCashAccountClientEmailError,
  setCreateCashAccountSuccessPopUp,
  saveGroupedFunds,
  saveSelectedFund,
  isTxnDoneUsingOnlineSuccess,
  setCreateKwspAccountSuccessPopUp,
  initAccountCreationType,
  emailOtpRequestSuccess,
  emailOtpRequestFailure,
  cancelPendingTrxSuccess,
  cancelPendingTrxFailure,
  cancelPendingRspSuccess,
  cancelPendingRspFailure,
  getDefaultSalesChargeSuccess,
  getDefaultSalesChargeFailure,
  verifyCampaignCodeSuccess,
  verifyCampaignCodeFailure,
  saveDocumentsUrl,
  savePendingTransactions,
} from './actions';
import { post, get, patch, update, remove } from '../../utils/api';
import {
  makeSelectClientDetails,
  makeSelectIsTxnDoneUsingOnlinePayment,
  makeSelectTransactionType,
  makeSelectSetAccountCreationFlow,
  makeSelectSelectedVerificationOption,
  makeSelectSalesCharges,
} from './selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { parseJSONSafely } from 'utils/helpers';
import { clearRiskProfileAnswers, queryISAFAmlaFail } from 'containers/OnBoarding/actions';

// eslint-disable-next-line consistent-return
function* callSharepointApi(custId, docId) {
  const endpoint = '/customer/api/Customers/getImageFromSharepoint';

  try {
    const res = yield call(get, `${endpoint}/${custId}/${docId}`);
    if (res.status === 200 && res.data) {
      return res.data;
    }
  } catch (err) {
    return err;
  }
}

function* getDocumentsUrlSaga() {
  const { info } = yield select(makeSelectClientDetails());
  let errorObj = null;

  try {
    yield put(processing(true));
    const docs = {
      customerId: info.id,
    };

    for (let i = 0; i < info.customerdocuments.length; i += 1) {
      const doc = info.customerdocuments[i];
      const sharepointRes = yield call(callSharepointApi, doc.customerId, doc.id);

      if (typeof sharepointRes === 'string') {
        docs[doc.id] = sharepointRes;
      } else {
        errorObj = sharepointRes.error;
      }
    }

    yield put(saveDocumentsUrl(docs));

    if (errorObj) {
      throw new Error(errorObj.message);
    }
  } catch (err) {
    const errorMessage = err.message || 'Unable to retrieve document images at the moment. Please try again later.';
    yield put(setToast({ type: 'error', message: errorMessage }));
  } finally {
    yield put(processing(false));
  }
}

function* getCustomerDetailsSaga(action) {
  let customerId;
  if (action && typeof action !== 'object') {
    customerId = action;
  } else if (action) {
    customerId = action.payload ? action.payload.idParam : null;
  }
  if (!customerId) {
    const clientDetails1 = yield select(makeSelectClientDetails());
    customerId = clientDetails1.info.account[0].customerId;
    if (!customerId) {
      console.log('unable to get customerId in getCustomerDetailsSaga', action);
      return;
    }
  }

  const customerEndpoint = `customer/api/Customers/getCustomerById?id=${customerId}`;
  const portfolioEndpoint = `portfolio/api/Portfolios/getPortfolioDetailsByCustomer/${customerId}`;
  const cwaDigitalChannelInsertWSEndpoint = `integration/api/cwaDigitalChannelInsertWS/updim/${customerId}`;
  const clientDetails = {};
  try {
    yield put(processing(true));
    yield call(post, cwaDigitalChannelInsertWSEndpoint);
    const [customerRes, portfolioRes] = yield all([call(get, customerEndpoint), call(get, portfolioEndpoint)]);

    if (!customerRes.data.response) {
      yield put(invalidCustomerId());
    } else {
      clientDetails.info = customerRes.data.response;
      // TODO: find a better way to "transform" the incomeTaxNo
      if (clientDetails.info.incomeTaxNo === '0') {
        clientDetails.info.incomeTaxNo = '-';
      }
      clientDetails.portfolio = portfolioRes.data.response;

      // if (customerdocuments && customerdocuments.length > 0) {
      //   const document = yield call(get, `customer/api/Customers/getImageFromSharepoint/${id}/${customerdocuments[0].id}`);
      //   console.log('boo: ', document);
      // }
      yield put(resetClientProfileData());
      yield put(getCustomerDetailsSuccess(clientDetails));
    }
  } catch (error) {
    yield call(errorHandler, error);
  } finally {
    yield put(processing(false));
  }
}

// eslint-disable-next-line consistent-return
function* callQueryISAFWithAmla(payload) {
  // const { info } = yield select(makeSelectClientDetails());
  // const queryISAFEndpoint = `integration/api/cwaDigitalChannelInsertWS/v2/queryISAF/${info.identificationType}/${info.identificationNumber}`;
  const amlaCheckEndpoint = 'integration/api/cwaDigitalChannelInsertWS/v2/AmlaCheck';

  try {
    yield put(processing(true));
    // const queryISAFResponse = yield call(get, queryISAFEndpoint);
    // if (queryISAFResponse.status === 200 && queryISAFResponse.data.action === 'updateAML') {
    //   const amlaResponse = yield call(post, amlaCheckEndpoint, payload);
    //   if (amlaResponse.status === 200) return amlaResponse;
    // } else {
    //   const isafErrMessage = (queryISAFResponse.data && queryISAFResponse.data.ErrorMessage) || 'Something went wrong!';
    //   yield put(queryISAFAmlaFail({ message: isafErrMessage }));
    //   yield put(processing(false));
    // }
    const amlaResponse = yield call(post, amlaCheckEndpoint, payload);
    if (amlaResponse.status === 200) return amlaResponse;
  } catch (error) {
    yield put(queryISAFAmlaFail(error.error));
    yield put(processing(false));
  }
}

function* topUpOrRedeemSaga(action) {
  const { payload } = action;
  // const clientDetails = yield select(makeSelectClientDetails());
  const salesCharges = yield select(makeSelectSalesCharges());

  const modifiedPayload = {
    ...payload,
    trxType: 'topUp',
    productBreakdown: payload.productBreakdown.map((product) => {
      if (product.txType.toUpperCase() === 'TOPUP') {
        const campaign = salesCharges.find((item) => item.NEWFUNDCODE.trim() === product.investmentPartnerProductId);
        return {
          ...product,
          defaultRateId: campaign ? campaign.id : null,
          defaultRate: campaign ? campaign.RATE : null,
          campaignCodeSalesCharge: campaign ? campaign.campaignCodeSalesCharge : null,
          campaignCode: campaign ? campaign.campaignCode : null,
          campaignCodeId: campaign ? campaign.campaignCodeId : null,
          lowerSalesCharge: campaign ? campaign.campaignSalesCharge || campaign.RATE : null,
        };
      }

      return product;
    }),
  };

  // const result = yield call(checkAmla, { txnPayload: modifiedPayload, clientId: clientDetails.info.id });
  const result = yield call(callQueryISAFWithAmla, modifiedPayload);
  if (!result) {
    return;
  }

  const endPoint = 'portfolio/api/Portfolios/requestForTopUpRedemptionOrSwitch';

  try {
    yield put(processing(true));
    // const apiRes = yield call(post, endPoint, payload);
    const apiRes = yield call(post, endPoint, { transactionToken: result.data.transactionToken });
    yield put(topUpOrRedeemSuccess(apiRes.data.response.transactionRequests));
  } catch (error) {
    // bad response payload TODO: slowly refactor backend to have a proper req/res payload with universal conversion
    if (_has(error.error, 'message') && !isEmpty(error.error.message)) {
      const err = parseJSONSafely(error.error.message);
      yield put(topUpOrRedeemFail(err));
    }
  } finally {
    yield put(processing(false));
  }
}

function* initRspOtp({ payload }) {
  const userInfo = yield select(selectUserInfo());
  const requestPayload = {
    ...payload.rspObject,
    userId: userInfo.agent.username,
  };

  if (window.location.host.indexOf('localhost') !== -1) {
    requestPayload.debug = 1;
  }
  try {
    if (payload.selectedVerificationOption === 'otp') {
      const otpEndpoint = '/investment/api/PaymentRequests/requestOtpForSetupRsp';
      yield put(processing(true));
      yield put(clearOTPError());
      const result = yield call(post, otpEndpoint, requestPayload);
      yield put(initRspOtpSuccess({ url: result.data, rspDataObj: payload.rspDataObj }));
    } else {
      const emailEndpoint = 'investment/api/PaymentRequests/requestForSetupRspBeforeOtp';
      const res = yield call(post, emailEndpoint, requestPayload);
      yield call(post, 'customer/api/Customers/setupRspVerify', { reqObj: res.data });

      yield put(emailOtpRequestSuccess());
    }
  } catch (err) {
    let errorMessage;
    if (err.error && err.error.message) {
      errorMessage = err.error.message;
    }
    const errorMsg = errorMessage || 'Failed to initialise OTP. Please try again later!';

    yield put(emailOtpRequestFailure(errorMessage));
    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(initRspOtpFailure(errorMsg));
  } finally {
    yield put(processing(false));
  }
}

function* setUpRsp(action) {
  const execAfterOTPEndPoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.tokenForSetUpRsp}`;
  let returnToken = null;
  try {
    yield put(processingSetUpRsp(true));
    const response = yield call(get, execAfterOTPEndPoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    yield put(processingSetUpRsp(false));
    const errorMessage = 'Failed to set up rsp. Please try again later!';
    // yield put(setUpRspFailure({ isError: true, message: errorMessage }));
    yield put(setUpRspFailure(errorMessage));
    return;
  }
  const clientDetails = yield select(makeSelectClientDetails());
  const endpoint = '/investment/api/PaymentRequests/setUpRsp';
  try {
    const result = yield call(post, endpoint, { SetupRspToken: returnToken });
    yield call(getCustomerDetailsSaga, clientDetails.portfolio.customerId);
    yield put(setUpRspSuccess());
    // console.log('RSP RESULT------>', result);
  } catch (err) {
    const errorMessage = 'Failed to set up rsp. Please try again later!';
    yield put(setUpRspFailure(errorMessage));
  } finally {
    yield put(processingSetUpRsp(false));
  }
}

function* initEditRspOtp({ payload, selectedVerificationOption }) {
  try {
    const userInfo = yield select(selectUserInfo());
    const requestPayload = {
      ...payload.payloadObj,
      userId: userInfo.agent.username,
    };

    if (selectedVerificationOption === 'otp') {
      const otpEndpoint = `/investment/api/PaymentRequests/requestOtpForEditRsp/${payload.rspRefNo}`;

      if (window.location.host.indexOf('localhost') !== -1) {
        requestPayload.debug = 1;
      }

      yield put(processing(true));
      yield put(clearOTPError());
      const result = yield call(update, otpEndpoint, requestPayload);
      yield put(initEditRspOtpSuccess({ uri: result.data, fundIds: payload.fundIds, rspRefNo: payload.rspRefNo }));
    } else {
      const emailEndpoint = `investment/api/PaymentRequests/requestForEditRspBeforeOtp/${payload.rspRefNo}`;

      yield put(processing(true));

      const res = yield call(update, emailEndpoint, requestPayload);
      yield call(post, 'customer/api/Customers/setupRspVerify', { reqObj: res.data });

      yield put(emailOtpRequestSuccess());
    }
  } catch (err) {
    console.log('Error found while editing RSP', err);
    let errorMessage;
    if (err.error && err.error.message) {
      errorMessage = err.error.message;
    }
    const errorMsg = errorMessage || 'Failed to initialise OTP. Please try again later!';
    yield put(emailOtpRequestFailure(errorMessage));
    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(initEditRspOtpFailure(errorMsg));
  } finally {
    yield put(processing(false));
  }
}

function* editRsp(action) {
  const execAfterOTPEndPoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.token}`;
  let returnToken = null;
  try {
    yield put(processingSetUpRsp(true));
    const response = yield call(get, execAfterOTPEndPoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    yield put(processingSetUpRsp(false));
    const errorMessage = 'Failed to set up rsp. Please try again later!';
    yield put(editRspFailure(errorMessage));
    return;
  }
  // yield put(editRspSuccess());
  const endpoint = '/investment/api/PaymentRequests/editRSP';
  const clientDetails = yield select(makeSelectClientDetails());

  try {
    const result = yield call(update, endpoint, { EditRspToken: returnToken });
    yield call(getCustomerDetailsSaga, clientDetails.portfolio.customerId);
    yield put(editRspSuccess());
    console.log('EDIT RSP RESULT------>', result);
  } catch (err) {
    const errorMessage = err.error.message || 'Failed to edit rsp. Please try again later!';
    yield put(editRspFailure(errorMessage));
    console.log('Something went wrong - EDIT RSP', err);
  } finally {
    yield put(processingSetUpRsp(false));
  }
}

function* initTerminateRspOtp(action) {
  try {
    const { reqPayload, fundIds } = action.payload;
    const userInfo = yield select(selectUserInfo());

    if (action.selectedVerificationOption === 'otp') {
      const otpEndpoint = '/investment/api/OtpTransactions/requestOTPVerification';

      const clientDetails = yield select(makeSelectClientDetails());
      const requestPayload = {
        reqPayload,
        TransactionType: 'TerminateRSP',
        userId: userInfo.agent.username,
        MobileNo: clientDetails.info.account[0].AccMobileNo,
      };
      if (window.location.host.indexOf('localhost') !== -1) {
        requestPayload.debug = 1;
      }

      yield put(processing(true));
      yield put(clearOTPError());
      const result = yield call(post, otpEndpoint, requestPayload);
      yield put(initTerminateRspOtpSuccess({ url: result.data.res, fundIds }));
    } else {
      const emailEndpoint = `/investment/api/PaymentRequests/requestForTerminateRspBeforeOtp/${reqPayload.rspRefNo}`;

      const payload = {
        rsp: [
          {
            accountId: reqPayload.accountId,
            maxAmount: reqPayload.maxAmount,
            fundCode: reqPayload.fundCode,
          },
        ],
        userId: userInfo.agent.username,
      };

      const res = yield call(update, emailEndpoint, payload);
      yield call(post, `customer/api/Customers/setupRspVerify`, { reqObj: res.data });

      yield put(processing(true));
      yield put(emailOtpRequestSuccess());
    }
  } catch (err) {
    let errorMessage;
    if (err.error && err.error.message) {
      errorMessage = err.error.message;
    }
    const errorMsg = errorMessage || 'Failed to initialise OTP. Please try again later!';
    yield put(emailOtpRequestFailure(errorMessage));
    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(initTerminateRspOtpFailure(errorMsg));
  } finally {
    yield put(processing(false));
  }
}

function* terminateRsp(action) {
  const execAfterOTPEndPoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.token}`;
  let returnToken = null;
  try {
    yield put(processingSetUpRsp(true));
    const response = yield call(get, execAfterOTPEndPoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    yield put(processingSetUpRsp(false));
    const errorMessage = 'Failed to terminate rsp. Please try again later!';
    yield put(terminateRspFailure(errorMessage));
    return;
  }
  // yield put(terminateRspSuccess());
  const endpoint = '/investment/api/PaymentRequests/terminateRsp';
  const clientDetails = yield select(makeSelectClientDetails());

  try {
    const result = yield call(post, endpoint, { TerminateRspToken: returnToken });
    yield call(getCustomerDetailsSaga, clientDetails.portfolio.customerId);
    yield put(terminateRspSuccess());
    console.log('TERMINATE RSP RESULT------>', result);
  } catch (err) {
    let errorMessage;
    if (err.error && err.error.message) {
      errorMessage = err.error.message;
    }
    const errorMsg = errorMessage || 'Failed to terminate rsp. Please try again later!';
    yield put(terminateRspFailure(errorMsg));
    console.log('Error found while terminating RSP', err.error.message);
  } finally {
    yield put(processingSetUpRsp(false));
  }
}

function* transactionOnlineSuccessFailFlag(isTxnSuccess) {
  const transactionType = yield select(makeSelectTransactionType());
  if (transactionType === 'FUND_TOPUP' || transactionType === 'FUND_ADD') {
    yield put(isTxnDoneUsingOnlineSuccess(isTxnSuccess));
  }
}

function* createDocsPaymentSaga(TokenUponSuccess) {
  // const { payload } = action;
  const endpoint = '/investment/api/PaymentRequests/createPaymentRequestWithDocAfterOtp';
  const isTransactionTypeOnline = yield select(makeSelectIsTxnDoneUsingOnlinePayment());

  try {
    yield put(processing(true));
    yield put(processingTaskCreatePaymentRequestWithDoc(true));
    const res = yield call(post, endpoint, { reqPayload: TokenUponSuccess });
    yield put(storeTransactionRequest(res.data.response));
    yield put(allTransactionOTPSuccess());
    yield put(createPaymentDocsSuccess());
    yield put(saveTransactionData(res.data.response));
    if (isTransactionTypeOnline) {
      yield call(transactionOnlineSuccessFailFlag, true);
    }
    yield call(getCustomerDetailsSaga, res.data.response.CustomerId);
    yield put(processing(true));
  } catch (err) {
    yield put(processing(true));
    console.error('Error on createDocsPaymentSaga : ', err);
    if (isTransactionTypeOnline) {
      yield call(transactionOnlineSuccessFailFlag, false);
    }
    if (err && err.error && err.error.message) {
      err.error.errorName = 'errorCreatePaymentRequestWithDocAfterOtp';
      yield put(setErrorMessage(err.error));
    } else {
      yield call(errorHandler, err);
    }
  } finally {
    yield put(processing(false));
    yield put(processingTaskCreatePaymentRequestWithDoc(false));
  }
}

function* getTransactionSaga(action) {
  const { payload } = action;
  const { CustomerId, partnerAccountNO, isin, skip, searchInput, transactionType, transactionDate, pid } = payload;
  const endPoint = 'investment/api/TransactionRequests/getAllTransactions';

  // transaction filters
  const transactionFilters = [];
  transactionFilters.push(`"partnerAccountNO":"${partnerAccountNO}"`);
  if (transactionDate) transactionFilters.push(`"transactionDate":"${moment(transactionDate).format('YYYY-MM-DD')}"`);
  if (transactionType && transactionType !== 'All') transactionFilters.push(`"transactionType":"${transactionType}"`);
  const trxQuery = encodeURIComponent(`{${transactionFilters.join(',')}}`);

  // transaction details filters
  const transactionDetailsFilters = [];
  if (searchInput) transactionDetailsFilters.push(`"partnerTransactionNo":"${searchInput.trim()}"`);
  // transactionDetailsFilters.push(`"investmentPartnerProductId":"${isin}"`);
  if (!searchInput) {
    transactionDetailsFilters.push(
      // `"or":[{"investmentPartnerProductId":"${isin}"},{"switchorredeemPartnerProductId":"${isin}"}]`,
      `"transactionPartnerProductId":"${isin}"`,
    );
  }

  const trxDetailsQuery = encodeURIComponent(`{${transactionDetailsFilters.join(',')}}`);
  //   const trxDetailsQuery = encodeURIComponent(`{"or":[{"investmentPartnerProductId":"${isin}"},{"switchorredeemPartnerProductId":"${isin}"}
  // ]}`);

  // limit and skip
  const skipValue = skip || 0;
  const limitSkipFilter = `?limit=12&skip=${skipValue}`;
  const sort = encodeURIComponent('{"order": ["transactionDate DESC","id DESC"]}');

  // finalize with correct query params
  const transactionFilter = transactionFilters.length > 0 ? `&transactionFilter=${trxQuery}` : '';
  const transactionDetailsFilter = transactionDetailsFilters.length > 0 ? `&transactionDetailsFilter=${trxDetailsQuery}` : '';
  const finalUrl = `${endPoint + limitSkipFilter + transactionFilter + transactionDetailsFilter}&sortFilter=${sort}`;

  try {
    yield put(processing(true));
    const apiRes = yield call(get, finalUrl);
    yield put(getTransactionSuccess({ fund: pid, data: apiRes.data }));
  } catch (err) {
    yield call(errorHandler, err);
  } finally {
    yield put(processing(false));
  }
}

function* addBankSaga(action) {
  const { payload } = action;
  const lov = yield select(makeSelectLOV());
  const bankLOV = lov.Dictionary[19].datadictionary;

  if (payload && payload.customerId && payload.bank) {
    payload.bank.bankAcctName = payload.bank.bankAcctName ? payload.bank.bankAcctName.toUpperCase() : null;
    payload.bank.bankAcctNumber = payload.bank.bankAcctNumber ? payload.bank.bankAcctNumber.toUpperCase() : null;
    if (payload.bank.bankCode) {
      const selectedBank = bankLOV.find((item) => item.codevalue === payload.bank.bankCode);
      if (selectedBank) payload.bank.bankName = selectedBank.description || '';
    }
    const endpoint = `customer/api/Customers/${payload.customerId}/bank`;
    try {
      yield put(processing(true));
      const res = yield call(post, endpoint, payload.bank);
      yield put(addBankSuccess(res.data));
    } catch (error) {
      const errorMessage = 'Error encountered. Please try again.\n Error Details: Invalid data on Add Bank';
      yield put(setError(errorMessage));
    } finally {
      yield put(processing(false));
    }
  } else {
    yield put(setError('Invalid Bank Details.'));
  }
}

// not needed for phase 1a
function* updateCustomerDetailsUpdateSaga(action) {
  const { payload } = action;
  const {
    addressLine1,
    addressLine2,
    companyName,
    country: countryOfBirth,
    dateOfBirth: birthDate,
    email,
    fullName,
    gender,
    id,
    identificationNumber,
    identificationType,
    interests,
    mobileNo,
    nationality,
    natureofbusiness,
    occupationType,
    postalCode,
    purposeofinvestment,
    sourceoffunds,
    state,
    yearlyIncome,
    identificationId,
  } = payload;
  const customerApiBase = 'customer/api/Customers/';
  const customerPayload = {
    fullName,
    nationality,
    gender,
    birthDate,
    interests,
    sourceoffunds,
    purposeofinvestment,
  };
  const identificationPayload = {
    identificationNumber,
    identificationType,
  };
  try {
    yield put(processing(true));
    // const accountRes = yield call(get, `${customerApiBase + payload}/account`);
    // clientDetails.account = accountRes.data[0];
    // const bankRes = yield call(get, `${customerApiBase + payload}/bank`);
    // clientDetails.bank = bankRes.data;
    // const addressRes = yield call(get, `${customerApiBase + payload}/address`);
    // clientDetails.address = addressRes.data[0];
    // const occupationRes = yield call(get, `${customerApiBase + payload}/occupation`);
    // clientDetails.occupation = occupationRes.data[0];
    // const identificationRes = yield call(get, `${customerApiBase + payload}/identification`);
    // clientDetails.identification = identificationRes.data[0];
    const customerRes = yield call(patch, customerApiBase + id, customerPayload);
    const identificationRes = yield call(
      patch,
      `${customerApiBase + id}/identification/${identificationId}`,
      identificationPayload,
    );
    // clientDetails.info = customerRes.data;
    // const portfolioRes = yield call(get, `portfolio/api/Portfolios/getPortfolioDetailsByCustomer/${payload}`);
    // clientDetails.portfolio = portfolioRes.data.response[0];
    // yield put(getCustomerDetailsSuccess(clientDetails));
  } catch (error) {
    yield put(setError(error.error.message));
  } finally {
    yield put(processing(false));
  }
}

function* errorHandler(err) {
  if (err) {
    if (err.error) {
      if (err.error.statusCode) {
        if (err.error.statusCode === '400') {
          if (err.error.name === 'db_error') {
            yield put(setDBLockError('System is currently busy, please try again later'));
          } else {
            yield put(setError(err.error.message || 'Invalid information. Please check again.'));
          }
        } else {
          yield put(setError(err.error.message || 'Internal server error. Please try again.'));
        }
      }
    }
  }
}

function* submitTokenAfterOTPSuccessSaga(TokenUponSuccess) {
  const endpoint = 'portfolio/api/Portfolios/requestForTopUpRedemptionOrSwitchAfterOTP';

  try {
    yield put(processing(true));
    const res = yield call(post, endpoint, { reqPayload: TokenUponSuccess });
    yield put(allTransactionOTPSuccess());
    yield put(saveTransactionData(res.data.response.transactionRequests));
  } catch (error) {
    // yield put(submitTokenAfterOTPFail(error.message));
    console.error('error in submitTokenAfterOTPSuccessSaga : ', error);
    // yield put(allTransactionOTPSuccess());
    yield call(errorHandler, error);
  } finally {
    yield put(processing(false));
  }
}

const createPayloadByOtpType = (requestOtpType, data) => {
  const requestObj = {};

  switch (requestOtpType) {
    case 'FUND_SWITCH':
      requestObj.TransactionType = 'FundSwitch';
      requestObj.reqPayload = data;
      return requestObj;

    case 'FUND_REDEEM':
      requestObj.TransactionType = 'FundRedeem';
      requestObj.reqPayload = data;
      return requestObj;

    case 'FUND_TOPUP':
      requestObj.TransactionType = 'FundTopUp';
      requestObj.reqPayload = data;
      return requestObj;

    case 'FUND_PAYMENT':
      requestObj.TransactionType = 'FundPayment';
      requestObj.reqPayload = data;
      return requestObj;
    case 'FUND_ADD':
      requestObj.TransactionType = 'AddFund';
      requestObj.reqPayload = data;
      return requestObj;
    case 'INITIAL_SUBSCRIPTION':
      requestObj.TransactionType = 'InitialSubscription';
      requestObj.reqPayload = data;
      return requestObj;
    default:
      return requestObj;
  }
};

function* checkAmla(payload) {
  const endPoint = `integration/api/cwaDigitalChannelInsertWS/UpdateAmla/${payload.clientId}`;
  try {
    yield put(processing(true));
    const res = yield call(post, endPoint, payload.txnPayload);
    return res;
  } catch (error) {
    yield put(checkAmlaFail(error.error));
    /* const isRiskProfileHigh = error.error && (error.error.RiskProfile === 'HIGH' || error.error.RiskProfile === 'BLOCKED' || error.error.name === 'HIGH' || error.error.name === 'BLOCKED');
    if (isRiskProfileHigh) {
      error.error.amlaFail = true
      yield put(checkAmlaFail(error.error));
    } else {
      yield put(setError(error.error.message));
    } */

    return false;
  } finally {
    yield put(processing(false));
  }
}

function* checkAmlaSubscribeSaga(action) {
  const {
    payload: { accountId },
  } = action;
  yield put(showPaymentSelectionSubscribe({ showPaymentSelection: false, accountId }));
  const { info } = yield select(makeSelectClientDetails());

  const txnPayload = {
    customerId: info.id,
    productBreakdown: [{ partnerAccountNo: accountId }],
    trxType: 'subscribe',
  };
  // const result = yield call(checkAmla, {
  //   clientId: clientDetails.info.id,
  //   txnPayload,
  // });
  const result = yield call(callQueryISAFWithAmla, txnPayload);
  if (!result) {
    return;
  }
  yield put(showPaymentSelectionSubscribe({ showPaymentSelection: true, accountId }));
  yield put(processing(false));
}

function* initFundTransactionOtp(action) {
  const { payload } = action;
  const clientDetails = yield select(makeSelectClientDetails());

  const requestPayload = createPayloadByOtpType(payload.requestOtpType, payload.data);
  const userInfo = yield select(selectUserInfo());
  requestPayload.userId = userInfo.agent.username;
  requestPayload.MobileNo = clientDetails.info.account[0].AccMobileNo;
  requestPayload.reqPayload.customerId = clientDetails.info.id;

  try {
    const selectedVerificationOption = yield select(makeSelectSelectedVerificationOption());
    const selectedOption = payload.selectedVerificationOption || selectedVerificationOption;

    if (selectedOption === 'email') {
      yield put(processing(true));
      if (payload.requestOtpType === 'FUND_REDEEM' || payload.requestOtpType === 'FUND_SWITCH') {
        const modifiedPayload = {
          ...payload.data,
          trxType: payload.requestOtpType === 'FUND_REDEEM' ? 'redeem' : 'switch',
        };
        const result = yield call(callQueryISAFWithAmla, modifiedPayload);
        if (!result) {
          return;
        }

        yield call(post, 'investment/api/TransactionRequests/checkEmailVerifyCondition', {
          ...requestPayload,
          agentIdNo: Number(clientDetails.info.agentId),
        });
        const res = yield call(post, 'portfolio/api/Portfolios/requestForRedemptionOrSwitchBeforeOTP', {
          ...requestPayload,
          agentIdNo: Number(clientDetails.info.agentId),
        });

        yield call(post, `customer/api/Customers/transactionVerifySwRd/${res.data.response.transactionRequests.id}`);
      } else {
        yield call(post, 'investment/api/PaymentRequests/updateTransactionSubscribeBeforeOtp', requestPayload);
        const res = yield call(post, 'investment/api/PaymentRequests/createPaymentRequestBeforeOtp', requestPayload);
        yield call(post, `customer/api/Customers/transactionVerify/${res.data.response.TransactionRequestId}`);
      }
      yield put(emailOtpRequestSuccess());
    } else {
      // FUND_REDEEM, FUND_SWITCH
      if (payload.requestOtpType === 'FUND_REDEEM' || payload.requestOtpType === 'FUND_SWITCH') {
        // const result = yield call(checkAmla, clientDetails.info.id);
        // const result = yield call(checkAmla, { txnPayload: payload, clientId: clientDetails.info.id });
        const modifiedPayload = {
          ...payload.data,
          trxType: payload.requestOtpType === 'FUND_REDEEM' ? 'redeem' : 'switch',
        };
        const result = yield call(callQueryISAFWithAmla, modifiedPayload);
        if (!result) {
          return;
        }
      }

      if (window.location.host.indexOf('localhost') !== -1) {
        requestPayload.debug = 1;
      }
      yield put(processing(true));
      // clear previous error object
      yield put(clearOTPError());
      const endPoint = 'investment/api/OtpTransactions/requestOTPVerification';
      const response = yield call(post, endPoint, requestPayload);
      // console.log(response);
      if (!response.data) {
        // throw new Error('Incorrect User ID.');
        throw new Error('Failed to initialise OTP. Please try again later!');
      }
      // for topup or subscribe
      if (payload.requestOtpType === 'FUND_TOPUP' || payload.requestOtpType === 'FUND_ADD') {
        response.data.res.paymentType = payload.data.PaymentRequest ? payload.data.PaymentRequest[0].PaymentType : null;
        response.data.res.transactionType = payload.requestOtpType;
      }
      yield put(initFundTransactionOtpSuccess(response.data.res));
    }
  } catch (error) {
    // console.error('Error in initFundTransactionOtp : ', error);
    let errorMessage = 'Failed to initialise OTP. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    /* if(error && error.error && (typeof error.error.message === 'string')) {
      errorMessage = error.error.message;
    } else if (error && error.error &&
        //error.error.statusCode === 400 &&
        error.error.message[0] &&
        error.error.message[0].ErrorMessage[0]
        ) {
      errorMessage = error.error.message[0].ErrorMessage[0].ErrorDesc;
    } */
    yield put(emailOtpRequestFailure(errorMessage));

    yield put(initFundTransactionOtpFail(errorMessage));
  } finally {
    yield put(processing(false));
  }
}

function* execAfterOTPFundTransactionSuccess(action) {
  const {
    payload: { queryParam, type },
  } = action;
  const endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${queryParam}`;

  try {
    yield put(processing(true));
    const response = yield call(get, endpoint);
    if (response.data && response.data.res) {
      console.log('Response is', response);
      if (type) {
        if (type === 'topup') {
          yield call(createDocsPaymentSaga, response.data.res.TokenUponSuccess);
        } else {
          yield call(submitTokenAfterOTPSuccessSaga, response.data.res.TokenUponSuccess);
        }
      }
    } else {
      throw new Error('ClientDetails => saga => execAfterOTPFundTransactionSuccess : Response data is empty');
    }
  } catch (error) {
    console.error('error from execAfterOTPFundTransactionSuccess : ', error);
    let err = error;
    if (typeof error.constructor === {}.constructor) {
      err = JSON.stringify(error);
    }
  } finally {
    yield put(processing(false));
  }
}

function* execAfterOTPFundTransactionFail(action) {
  const endpoint = `gateway/_internal/OtpTransactions/stopAfterOTPInvalid?encP=${action.payload}`;

  try {
    const response = yield call(get, endpoint);
  } catch (error) {
    console.error('error from execAfterOTPFundTransactionFail : ', error);
    let err = error;
    if (typeof error.constructor === {}.constructor) {
      err = JSON.stringify(error);
    }
  }
}

function* getTransactionForDownloadSaga(action) {
  const { payload } = action;
  const { isin, searchInput, transactionType, transactionDate, accountType, partnerAccountNO } = payload;
  const endPoint = 'investment/api/TransactionRequests/getAllTransactions';

  // transaction filters
  const transactionFilters = [];
  // transactionFilters.push(`"customerId":"${CustomerId}"`);
  transactionFilters.push(`"partnerAccountNO":"${partnerAccountNO}"`);
  if (transactionDate) transactionFilters.push(`"transactionDate":"${moment(transactionDate).format('YYYY-MM-DD')}"`);
  if (transactionType && transactionType !== 'All') transactionFilters.push(`"transactionType":"${transactionType}"`);
  const trxQuery = encodeURIComponent(`{${transactionFilters.join(',')}}`);

  // transaction details filters
  const transactionDetailsFilters = [];
  if (searchInput) transactionDetailsFilters.push(`"partnerTransactionNo":"${searchInput.trim()}"`);
  // transactionDetailsFilters.push(`"investmentPartnerProductId":"${isin}"`);
  if (!searchInput) {
    transactionDetailsFilters.push(
      // `"or":[{"investmentPartnerProductId":"${isin}"},{"switchorredeemPartnerProductId":"${isin}"}]`,
      `"transactionPartnerProductId":"${isin}"`,
    );
  }

  const trxDetailsQuery = encodeURIComponent(`{${transactionDetailsFilters.join(',')}}`);

  // limit and skip
  const limitSkipFilter = '?limit=10000&skip=0';
  const sort = encodeURIComponent('{"order": ["transactionDate DESC","id DESC"]}');

  // finalize with correct query params
  const transactionFilter = transactionFilters.length > 0 ? `&transactionFilter=${trxQuery}` : '';
  const transactionDetailsFilter = transactionDetailsFilters.length > 0 ? `&transactionDetailsFilter=${trxDetailsQuery}` : '';
  const finalUrl = `${endPoint + limitSkipFilter + transactionFilter + transactionDetailsFilter}&sortFilter=${sort}`;

  try {
    yield put(processing(true));
    const apiRes = yield call(get, finalUrl);
    // eslint-disable-next-line no-nested-ternary
    const arr = apiRes.data ? (apiRes.data.Funds ? (apiRes.data.Funds.res ? apiRes.data.Funds.res : []) : []) : [];
    const picked = [];
    for (const objTxn of arr) {
      const { transactions, refNo } = objTxn;
      for (let i = 0; i < transactions.length; i += 1) {
        const txn = transactions[i];
        const { bankAcctNumber, bankName } = objTxn;
        const {
          transactionType,
          partnerProductType,
          transactionDate,
          confirmationDate,
          portfolio,
          partnerTransactionNo,
          transactionStatus,
          grossAmount,
          chargeSRT,
          charges,
          netAmount,
          unitPrice,
          transactionUnits,
          balanceUnitHolding,
          agentCode,
          fund,
          switchfund,
        } = txn;
        const fundDetails = transactionType === 'SW' || transactionType === 'RD' ? switchfund : fund;
        let trxType;
        if (transactionType === 'SW' && partnerProductType === 'SW') {
          trxType = 'SWO';
        } else if (transactionType === 'SA' && partnerProductType === 'SW') {
          trxType = 'SWI';
        } else {
          trxType = transactionType;
        }
        picked.push({
          transactionDate: moment(transactionDate).format('DD-MM-YYYY'),
          confirmationDate: confirmationDate ? moment(confirmationDate).format('DD-MM-YYYY') : '',
          transactionType: trxType,
          partnerAccountType: portfolio.partnerAccountType,
          refNo,
          partnerTransactionNo,
          transactionStatus,
          grossAmount,
          chargeSRT,
          charges,
          netAmount,
          unitPrice: unitPrice || '',
          transactionUnits: transactionUnits || '',
          balanceUnitHolding,
          agentCode,
          bankName,
          bankAcctNumber,
          fundName: fundDetails ? fundDetails.name : '-',
          fundCode: fundDetails ? fundDetails.fundcode : '-',
        });
      }
    }

    let filteredData = [...picked];
    if (accountType) filteredData = picked.filter((item) => item.partnerAccountType === accountType);
    yield put(getTransactionForDownloadSuccess(filteredData));
  } catch (err) {
    yield call(errorHandler, err);
  } finally {
    yield put(processing(false));
  }
}

// ***** WAS THERE FOR EMAIL UPDATE *****

// function* initClientProfileChangeOtp(action) {
//   const { payload } = action;
//   const clientDetails = yield select(makeSelectClientDetails());
//   const endPoint = 'customer/api/OtpTransactions/requestOTPVerification';
//   const userInfo = yield select(selectUserInfo());

//   // ***** WAS THERE FOR EMAIL UPDATE
//   // const requestPayload = {
//   //   TransactionType: payload.requestOtpType,
//   //   userId: userInfo.agent.username,
//   //   MobileNo: clientDetails.info.account[0].AccMobileNo,
//   //   reqPayload: {
//   //     agentId: clientDetails.info.agentId,
//   //     accountId: clientDetails.info.account[0].id,
//   //     customerId: payload.data.CustomerId,
//   //     email: payload.data.email,
//   //   },
//   // };

//   if (window.location.host.indexOf('localhost') !== -1) {
//     requestPayload.debug = 1;
//   }

//   try {
//     yield put(processing(true));
//     yield put(clearOTPError());
//     const response = yield call(post, endPoint, requestPayload);
//     response.data.newEmail = payload.data.email;
//     yield put(initProfileChangeOtpSuccess(response.data));
//   } catch (error) {
//     let errorMessage = 'Failed to initialise OTP for update client profile. Please try again later!';
//     if (error.error && error.error.message) {
//       errorMessage = error.error.message;
//     }
//     yield put(initClientProfileChangeOtpError(errorMessage));
//   } finally {
//     yield put(processing(false));
//   }
// }

// function* updateClientEmail(action) {
//   let endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.tokenUpdateEmail}`;
//   let returnToken = null;
//   try {
//     yield put(processingUpdateClientProfile(true));
//     const response = yield call(get, endpoint);
//     returnToken = response.data.res.TokenUponSuccess;
//   } catch (error) {
//     yield put(processingUpdateClientProfile(false));
//     console.error('error from updateClientEmail: execAfterOTP : ', error);
//     let errorMessage = 'Failed to update email. Please try again later!';
//     if (error.error && error.error.message) {
//       errorMessage = error.error.message;
//     }
//     yield put(updateClientEmailError(errorMessage));
//     return;
//   }

//   const clientDetails = yield select(makeSelectClientDetails());
//   endpoint = `customer/api/Customers/updateEmail/${clientDetails.info.account[0].customerId}`;

//   try {
//     yield call(post, endpoint, { UpdateEmailToken: returnToken });
//     yield put(updateClientEmailSuccess());
//   } catch (error) {
//     console.error('error from updateClientEmail : ', error);
//     let errorMessage = 'Failed to update email. Please try again later!';
//     if (error.error && error.error.message) {
//       errorMessage = error.error.message;
//     }
//     yield put(updateClientEmailError(errorMessage));
//   } finally {
//     yield put(processingUpdateClientProfile(false));
//   }
// }

function* initClientProfileChangeOtp(action) {
  const { payload } = action;
  const clientDetails = yield select(makeSelectClientDetails());
  const endPoint = 'customer/api/OtpTransactions/requestOTPVerification';
  const userInfo = yield select(selectUserInfo());
  const requestPayload = {
    TransactionType: payload.requestOtpType,
    userId: userInfo.agent.username,
    MobileNo: clientDetails.info.account[0].AccMobileNo,
    reqPayload: {
      agentId: clientDetails.info.agentId,
      accountId: clientDetails.info.account[0].id,
      ...payload.data,
    },
  };

  // if (payload.requestOtpType === 'ReUploadDocument') {
  //   requestPayload = {
  //     TransactionType: payload.requestOtpType,
  //     userId: userInfo.agent.username,
  //     MobileNo: clientDetails.info.account[0].AccMobileNo,
  //     reqPayload: payload.data.values,
  //   };
  // } else {
  //   requestPayload = {
  //     TransactionType: payload.requestOtpType,
  //     userId: userInfo.agent.username,
  //     MobileNo: clientDetails.info.account[0].AccMobileNo,
  //     reqPayload: {
  //       agentId: clientDetails.info.agentId,
  //       accountId: clientDetails.info.account[0].id,
  //       ...payload.data,
  //     },
  //   };
  // }

  // console.log('OTP payload is', payload);
  if (window.location.host.indexOf('localhost') !== -1) {
    requestPayload.debug = 1;
  }

  try {
    yield put(processing(true));
    yield put(clearOTPError());
    const response = yield call(post, endPoint, requestPayload);
    response.data.newEmail = payload.data.email;
    const editedData = { ...payload.data };
    response.data = {
      ...response.data,
      editedData,
    };
    switch (payload.requestOtpType) {
      case 'CreateAccount': {
        yield put(initAccountCreationType(payload.data.AccountType));
        break;
      }
      default: {
        yield put(initAccountCreationType(null));
        break;
      }
    }
    yield put(initProfileChangeOtpSuccess(response.data));
  } catch (error) {
    let errorMessage = 'Failed to initialise OTP for update client profile. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    console.log('OTP ERROR', errorMessage);
    yield put(initClientProfileChangeOtpError(errorMessage));
  } finally {
    yield put(processing(false));
  }
}

function* updateClientEmail(action) {
  let endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.tokenUpdateEmail}`;
  let returnToken = null;
  try {
    yield put(processingUpdateClientProfile(true));
    const response = yield call(get, endpoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    yield put(processingUpdateClientProfile(false));
    console.error('error from updateClientEmail: execAfterOTP : ', error);
    let errorMessage = 'Failed to update email. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(updateClientEmailError(errorMessage));
    return;
  }

  const clientDetails = yield select(makeSelectClientDetails());
  endpoint = `customer/api/Customers/updateProfile/${clientDetails.info.account[0].customerId}`;

  try {
    yield call(update, endpoint, { UpdateProfileToken: returnToken });
    yield call(getCustomerDetailsSaga, clientDetails.info.account[0].customerId);
    yield put(updateClientEmailSuccess());
  } catch (error) {
    console.error('error from updateClientEmail : ', error);
    let errorMessage = 'Failed to update email. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(updateClientEmailError(errorMessage));
  } finally {
    yield put(processingUpdateClientProfile(false));
  }
}

function* resendConfirmationEmail(action) {
  let customerId = action.payload;
  if (!customerId) {
    const clientDetails = yield select(makeSelectClientDetails());
    customerId = clientDetails.info.account[0].customerId;
  }
  if (!customerId) {
    yield put(resentConfirmationEmailStatus('Unable to get customer id to resend email!'));
    return;
  }
  const endpoint = `customer/api/Customers/resendEmail/${customerId}`;

  try {
    yield put(processing(true));
    yield call(post, endpoint);
    yield put(resentConfirmationEmailStatus('SUCCESS'));

    const lov = yield select(makeSelectLOV());
    const emailResendTimeoutData = lov.Dictionary[37].datadictionary;
    const timeout = emailResendTimeoutData[0].codevalue; // will be in milliseconds

    const unParsedData = localStorage.getItem('emailSentInfo');
    const currentCustomerTime = { [customerId]: new Date().getTime() + Number(timeout) };
    if (unParsedData) {
      let parsedData = JSON.parse(unParsedData);
      parsedData = {
        ...parsedData,
        ...currentCustomerTime,
      };
      localStorage.setItem('emailSentInfo', JSON.stringify({ ...parsedData }));
    } else {
      localStorage.setItem('emailSentInfo', JSON.stringify({ ...currentCustomerTime }));
    }
  } catch (error) {
    let errorMessage = 'Failed to resend confirmation email. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(resentConfirmationEmailStatus(errorMessage));
  } finally {
    yield put(processing(false));
  }
}

function* initRetakeRiskAssessmentOtp({ payload }) {
  const userInfo = yield select(selectUserInfo());
  const interests = yield select(makeSelectInterest());
  const clientDetails = yield select(makeSelectClientDetails());
  const endPoint = 'customer/api/OtpTransactions/requestOTPVerification';
  const requestPayload = {
    TransactionType: 'RecalculateRiskProfile',
    userId: userInfo.agent.username,
    MobileNo: clientDetails.info.account[0].AccMobileNo,
    reqPayload: {
      customerId: clientDetails.info.id,
      agentId: clientDetails.info.agentId,
      interests,
      ...payload,
    },
  };

  if (window.location.host.indexOf('localhost') !== -1) {
    requestPayload.debug = 1;
  }

  try {
    yield put(processing(true));
    yield put(clearOTPError());
    const response = yield call(post, endPoint, requestPayload);
    yield put(initRetakeRiskAssessmentOtpSuccess(response.data));
  } catch (error) {
    let errorMessage = 'Failed to initialise OTP. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(initRetakeRiskAssessmentOtpFailure(errorMessage));
  } finally {
    yield put(processing(false));
    yield put(clearRiskProfileAnswers());
  }
}

function* retakeRiskAssessment(action) {
  let endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.retakeRiskAssessmentToken}`;
  let returnToken = null;
  try {
    yield put(processingRetakeAssessment(true));
    const response = yield call(get, endpoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    yield put(processingRetakeAssessment(false));
    let errorMessage = 'Failed to update assessment. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(retakeRiskAssessmentError(errorMessage));
    return;
  }

  const clientDetails = yield select(makeSelectClientDetails());
  endpoint = `customer/api/Customers/updateRiskAssessment/${clientDetails.info.id}`;
  try {
    yield call(post, endpoint, { RecalculateRiskProfile: returnToken });
    yield call(getCustomerDetailsSaga, clientDetails.info.id);
    yield put(retakeRiskAssessmentSuccess());
  } catch (error) {
    let errorMessage = 'Failed to update assessment. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(retakeRiskAssessmentError(errorMessage));
  } finally {
    yield put(processingRetakeAssessment(false));
  }
}

function* createAccountCustomerSaga(action) {
  let endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.tokenUpdateEmail}`;
  const accountType = yield select(makeSelectSetAccountCreationFlow());
  let returnToken = null;

  try {
    // yield put(processingUpdateClientProfile(true));
    yield put(processingCreateAccountClientProfile(true));
    const response = yield call(get, endpoint);
    returnToken = response.data.res.TokenUponSuccess;
    // yield put(updateClientEmailSuccess());
  } catch (error) {
    yield put(processing(false));
    console.error('error from createAccount : execAfterOTP : ', error);
    let errorMessage = '';
    if (error.error && error.error.name === 'HZAccountCreation_Error' && error.error.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        'The Client already has an existing account with Principal but is \n currently not available in Principal Direct Access (PDA).';
    }
    yield put(createCashAccountClientEmailError(errorMessage));
    return;
  }
  // const clientDetails = yield select(makeSelectClientDetails());
  endpoint = 'customer/api/Customers/createAccount ';
  const idParam = action.payload.id;

  try {
    yield put(processing(true));
    yield call(post, endpoint, { token: returnToken });
    yield put(createAccountSuccess());
    yield call(getCustomerDetailsSaga, idParam);
    if (accountType === 'CS') {
      yield put(setCreateCashAccountSuccessPopUp());
    } else {
      yield put(setCreateKwspAccountSuccessPopUp(true));
    }
  } catch (error) {
    let errorMessage = 'Failed to create cash account';
    if (error.error && error.error.message) {
      if (Array.isArray(error.error.message)) {
        let res = '';
        error.error.message.forEach((item) => {
          res += `${item},`;
        });
        errorMessage = res.slice(0, -1);
      } else {
        errorMessage = error.error.message;
      }
    }
    // yield put(createClientAccountError(errorMessage));
    yield put(createCashAccountClientEmailError(errorMessage));
  } finally {
    // yield put(processingUpdateClientProfile(false));
    yield put(processing(false));
  }
}

function* callPortfolio() {
  try {
    yield put(processing(true));
    const clientDetails = yield select(makeSelectClientDetails());
    const customerId = clientDetails.info.id;
    const portfolioEndpoint = `portfolio/api/Portfolios/getPortfolioDetailsByCustomer/${customerId}`;
    const portfolioRes = yield call(get, portfolioEndpoint);
    clientDetails.portfolio = portfolioRes.data.response;
    yield put(resetClientProfileData());
    yield put(getCustomerDetailsSuccess(clientDetails));
  } catch (error) {
    yield call(errorHandler, error);
  } finally {
    yield put(processing(false));
  }
}

function* callUnsubscribe({ payload }) {
  const { investmentProductId, customerId, fund } = payload;
  const endpoint = `portfolio/api/Portfolios/removeUnsubscribedFund?customerId=${customerId}&investmentProductId=${fund.fundcode}`;
  try {
    yield call(remove, endpoint);
    yield put(callUnsubscribeSuccess([investmentProductId]));
    yield call(callPortfolio);
    yield put(setToast({ type: 'success', message: 'Successfully unsubscribed!' }));
  } catch (error) {
    let errorMessage = 'Something went wrong!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(setToast({ type: 'error', message: errorMessage }));
  }
}

function* getGroupedFunds({ payload }) {
  const {
    customerId,
    fund: { fundcode },
    partnerAccountNo,
  } = payload;
  const endpoint = `portfolio/api/Portfolios/getGroupedFunds?customerId=${customerId}&investmentProductId=${fundcode}`;
  try {
    yield put(processing(true));
    const {
      data: { response },
    } = yield call(get, endpoint);
    const { portfolio } = yield select(makeSelectClientDetails());
    const currentPortfolio = portfolio.find((item) => item.accountId == partnerAccountNo);
    const groupedInvestmentProductIds = currentPortfolio.productbreakdown.map(
      (item) => response.includes(item.fund.fundcode) && { fundName: item.fund.name, fundCode: item.fund.fundcode },
    );
    const filterFalsyValues = groupedInvestmentProductIds.filter(Boolean);
    yield put(saveGroupedFunds(filterFalsyValues));
    yield put(saveSelectedFund(payload));
  } catch (error) {
    let errorMessage = 'Something went wrong!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(setToast({ type: 'error', message: errorMessage }));
  } finally {
    yield put(processing(false));
  }
}

// function* createKwspAccountCustomerSaga({ payload }) {
//   yield put(setCreateKwspAccountSuccessPopUp(true));
// }
function* disableRspNotificationSaga({ payload }) {
  const { customerId, investmentProductId } = payload;
  const disableRspEndpoint = `portfolio/api/Portfolios/rspNotificationDisabled?customerId=${customerId}&investmentProductId=${investmentProductId}`;
  try {
    yield put(processing(true));
    yield call(update, disableRspEndpoint);
    yield call(getCustomerDetailsSaga, customerId);
  } catch (error) {
    yield call(errorHandler, error);
  } finally {
    yield put(processing(false));
  }
}

function* callWholeSaleDisclaimerAcknowledgeSaga({ payload }) {
  const { customerId } = payload;
  const wholeSaleDisclaimerEndPoint = `customer/api/Customers/tncAcknowledgement/${customerId}`;
  const reqPayload = { tncType: 'WHOLESALE_FUND' };
  try {
    yield call(post, wholeSaleDisclaimerEndPoint, reqPayload);
  } catch (error) {
    yield call(errorHandler, error);
  }
}

function* emailOtpRequestSaga({ payload }) {
  try {
    yield put(processing(true));
    const { trxRequestId } = payload;
    const clientDetails = yield select(makeSelectClientDetails());

    const requestPayload = createPayloadByOtpType(payload.requestOtpType, payload.data);
    const userInfo = yield select(selectUserInfo());
    requestPayload.userId = userInfo.agent.username;
    requestPayload.MobileNo = clientDetails.info.account[0].AccMobileNo;
    requestPayload.reqPayload.customerId = clientDetails.info.id;

    yield call(post, 'investment/api/PaymentRequests/createPaymentRequestBeforeOtp', requestPayload);
    yield call(post, `customer/api/Customers/transactionVerify/${trxRequestId}`);

    yield put(emailOtpRequestSuccess());
  } catch (err) {
    const errorMessage = err.error.message || 'Something went wrong';

    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(emailOtpRequestFailure(errorMessage));
  } finally {
    yield put(processing(false));
  }
}

function* cancelPendingTrxSaga({ payload }) {
  try {
    const { trxRequestId } = payload;

    const cancelVerificationRes = yield call(get, `investment/api/PaymentRequests/cancelVerification?transId=${trxRequestId}`);

    yield put(setToast({ type: 'success', message: cancelVerificationRes.data.message }));
    yield put(cancelPendingTrxSuccess());
  } catch (err) {
    const errorMessage = err.error.message || 'Something went wrong';

    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(cancelPendingTrxFailure(err));
  }
}

function* cancelPendingRspSaga({ payload }) {
  try {
    const { rspRefNo, accountId, fundCode } = payload;
    const reqPayload = {
      accountId,
      fundCode,
    };
    const cancelVerificationRes = yield call(
      update,
      `investment/api/PaymentRequests/cancelRspVerification/${rspRefNo}`,
      reqPayload,
    );

    yield put(setToast({ type: 'success', message: cancelVerificationRes.data.message }));
    yield put(cancelPendingRspSuccess());
  } catch (err) {
    const errorMessage = err.error.message || 'Something went wrong';

    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(cancelPendingRspFailure(err));
  }
}

export function* getDefaultSalesChargeSaga(action) {
  try {
    const res = yield call(post, 'investment/api/HZFUNDSARATES/defaultRate', {
      fundCodes: action.funds.map((fund) => ({
        fundCode: fund.fund.fundcode,
        utrAccountType: fund.accountType,
      })),
    });

    yield put(getDefaultSalesChargeSuccess(res));
  } catch (err) {
    yield put(getDefaultSalesChargeFailure(err));
  }
}

export function* verifyCampaignCodeSaga({ payload }) {
  const { campaignCode, fundCode, fundName, minimumInvestment, accountType } = payload;
  try {
    const res = yield call(
      get,
      `investment/api/CampaignCodes/CampaignCode?campaignCode=${encodeURIComponent(
        campaignCode,
      )}&fundCode=${fundCode}&fundName=${fundName}&accountType=${accountType}&minimumInvestment=${minimumInvestment}`,
    );

    yield put(
      verifyCampaignCodeSuccess({
        salesCharge: res.data.response.SalesCharge,
        minInvestment: res.data.response.MinimumInvestment,
        fundCode,
        campaignCode,
        campaignCodeId: res.data.response.id,
        campaignCodeSalesCharge: res.data.response.campaignCodeSalesCharge,
      }),
    );
  } catch (err) {
    yield put(verifyCampaignCodeFailure(err, fundCode));
  }
}

function* getPendingTransactionsSaga({ payload }) {
  const { fundCode, utrAccountNo, isRspPayment, rspRefNo } = payload;
  try {
    yield put(processing(true));

    const endpoint = isRspPayment
      ? `investment/api/PaymentRequests/getPendingRsp/${rspRefNo}`
      : 'investment/api/TransactionRequests/getTransactionRequestFromFundCode';
    const method = isRspPayment ? get : post;
    const requestPayload = isRspPayment ? {} : { UTRACCOUNTNO: utrAccountNo, FUNDCODES: [fundCode] };

    const res = yield call(method, endpoint, requestPayload);

    if (res.status === 200) {
      const data = isRspPayment ? res.data : res.data.response;
      yield put(savePendingTransactions({ data, error: undefined }));
    } else {
      yield put(savePendingTransactions({ data: [], error: undefined }));
    }
  } catch ({ error }) {
    yield put(setToast({ type: 'error', message: error.message }));
    yield put(savePendingTransactions({ data: undefined, error: error.message }));
  } finally {
    yield put(processing(false));
  }
}

function* callCancelPendingTransactionsSaga({ payload, isRspPayment }) {
  const userInfo = yield select(selectUserInfo());

  const endPoint = isRspPayment
    ? `investment/api/PaymentRequests/cancelPendingRspPayment/${payload.rspRefNo}`
    : 'investment/api/TRs/cancelPaymentLink';
  const method = isRspPayment ? update : post;
  const requestPayload = isRspPayment ? { userId: userInfo.agent.username } : { ...payload };

  yield put(processing(true));
  try {
    const response = yield call(method, endPoint, requestPayload);
    yield put(setToast({ type: 'success', message: response.data.message }));
    yield put(cancelPendingTrxSuccess());
  } catch (error) {
    let errorMessage = 'Failed to initialise Cancel Payment. Please try again later!';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    yield put(setToast({ type: 'error', message: errorMessage }));
    yield put(cancelPendingTrxFailure(errorMessage));
  }
}

// Individual exports for testing
export default function* clientDetailsSaga() {
  yield takeLatest(CUSTOMER_DETAILS_GET, getCustomerDetailsSaga);
  yield takeLatest(TOPUP_REDEEM_REQUEST, topUpOrRedeemSaga);
  yield takeLatest(INIT_RSP_OTP, initRspOtp);
  yield takeLatest(INIT_EDIT_RSP_OTP, initEditRspOtp);
  yield takeLatest(INIT_TERMINATE_RSP_OTP, initTerminateRspOtp);
  yield takeLatest(INIT_RETAKE_RISK_ASSESSMENT_OTP, initRetakeRiskAssessmentOtp);
  yield takeLatest(SETUP_RSP, setUpRsp);
  yield takeLatest(EDIT_RSP, editRsp);
  yield takeLatest(TERMINATE_RSP, terminateRsp);
  yield takeLatest(PAYMENT_DOCS_CREATE, createDocsPaymentSaga);
  yield takeLatest(TRANSACTION_GET, getTransactionSaga);
  yield takeLatest(BANK_ADD, addBankSaga);
  yield takeLatest(CUSTOMER_DETAILS_UPDATE, updateCustomerDetailsUpdateSaga);
  yield takeLatest(INIT_FUND_TRANSACTION_OTP, initFundTransactionOtp);
  yield takeLatest(EXEC_AFTER_OTP_FUND_TRANSACTION_SUCCESS, execAfterOTPFundTransactionSuccess);
  yield takeLatest(EXEC_AFTER_OTP_FUND_TRANSACTION_FAIL, execAfterOTPFundTransactionFail);
  yield takeLatest(CHECK_AMLA_SUBSCRIBE, checkAmlaSubscribeSaga);
  yield takeLatest(TRANSACTION_GET_FOR_DOWNLOAD, getTransactionForDownloadSaga);
  yield takeLatest(UPDATE_CLIENT_EMAIL, updateClientEmail);
  yield takeLatest(INIT_CLIENT_PROFILE_CHANGE_OTP, initClientProfileChangeOtp);
  yield takeLatest(RESEND_CONFIRMATION_EMAIL, resendConfirmationEmail);
  yield takeLatest(RETAKE_RISK_ASSESSMENT, retakeRiskAssessment);
  yield takeLatest(CREATE_ACCOUNT, createAccountCustomerSaga);
  yield takeLatest(CALL_UNSUBSCRIBE, callUnsubscribe);
  yield takeLatest(CUSTOMER_PORTFOLIO_GET, callPortfolio);
  yield takeLatest(GET_GROUPED_FUNDS, getGroupedFunds);
  // yield takeLatest(CREATE_KWSP_ACCOUNT, createKwspAccountCustomerSaga);
  yield takeLatest(DISABLE_RSP_NOTIFICATION, disableRspNotificationSaga);
  yield takeLatest(WHOLESALE_DISCLAIMER_ACKNOWLEDGE, callWholeSaleDisclaimerAcknowledgeSaga);
  yield takeLatest(EMAIL_OTP_REQUEST, emailOtpRequestSaga);
  yield takeLatest(CANCEL_PENDING_TRX_REQUEST, cancelPendingTrxSaga);
  yield takeLatest(CANCEL_PENDING_RSP_REQUEST, cancelPendingRspSaga);
  yield takeLatest(GET_DEFAULT_SALES_CHARGE_REQUEST, getDefaultSalesChargeSaga);
  yield takeLatest(VERIFY_CAMPAIGN_CODE_REQUEST, verifyCampaignCodeSaga);
  yield takeLatest(GET_DOCUMENTS_URL, getDocumentsUrlSaga);
  yield takeLatest(GET_PENDING_TRANSACTIONS, getPendingTransactionsSaga);
  yield takeLatest(CALL_CANCEL_PENDING_TRANSACTIONS, callCancelPendingTransactionsSaga);
}
