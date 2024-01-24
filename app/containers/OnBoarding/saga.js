/* eslint-disable no-console */
import { takeLatest, call, put, select } from 'redux-saga/effects';
import isEmpty from 'lodash/isEmpty';
import CalculateAge from 'utils/calculateAge';
import _find from 'lodash/find';
import omit from 'lodash/omit';
import moment from 'moment';
import { makeSelectClientDetails, makeSelectGetSelectionAccount } from 'containers/ClientDetails/selectors';
import { makekwspCashIntroDetails } from 'containers/OnBoarding/selectors';
import { getCustomerDetails, processingUpdateClientProfile } from 'containers/ClientDetails/actions';
import { getItem } from 'utils/tokenStore';
import BaseUrl from 'utils/getDomainUrl';
import { toUpperCase } from 'utils/StringUtils';
import _has from 'lodash/has';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { composeErrorMessage } from 'utils/messageHelper';
import { selectUserInfo } from 'containers/LoginPage/selectors';
import { setToast } from 'containers/App/actions';
import {
  INTRODUCTION_SAVE,
  FUNDS_GET,
  RISK_QUESTIONS_ANSWERS_GET,
  RISK_SCORE_GET,
  FILE_UPLOAD,
  DOC_REUPLOAD,
  RISK_PROFILES_GET,
  FUNDS_ALL_GET,
  IMAGE_REMOVE,
  ANNUAL_INCOME_GET,
  ORDER_CREATE,
  PAYMENT_DOCS_CREATE,
  AMLA_CHECK,
  INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP,
  ACCOUNT_CREATION_OTP_INCORRECT,
  ACCOUNT_CREATION_OTP_CORRECT,
  ADD_PRODUCT_TO_PORTFOLIO,
  TRANSACTION_FILE_UPLOAD,
  PERSONAL_DETAILS_VALIDATE,
  POSTAL_CODE_VALIDATE,
  GET_ALL_FUNDS_WITH_FUND_DETAILS,
  CHECK_CIF,
  INIT_MULTI_AGENT_MAP_OTP,
  MULTI_AGENT_MAP,
  SAVE_DRAFT,
  GET_DRAFT,
  FILE_UPLOAD_DOC,
  GET_DEFAULT_SALES_CHARGE_REQUEST,
  VERIFY_CAMPAIGN_CODE_REQUEST,
} from './constants';
import {
  processing,
  getFundsSuccess,
  getRiskQuestionsAnswersSuccess,
  saveRiskScore,
  saveRiskProfiles,
  getAllFundsSuccess,
  getAnnualIncomeSuccess,
  createAccountSuccess,
  saveImage,
  reUploadDocumentSuccess,
  reUploadDocumentFailure,
  createOrderSuccess,
  createPaymentDocsSuccess,
  setError,
  checkAmlaSuccess,
  initOnboardingClientConfirmationOtpSuccess,
  getCustomerSuccess,
  initOnboardingClientConfirmationOtpFail,
  addProductToPortfolioSuccess,
  uploadTransactionFileSuccess,
  validatePersonalDetailsSuccess,
  validatePersonalDetailsFail,
  validatePostalCodeSuccess,
  saveAllFundsWithFundDetails,
  validatePostalCodeFail,
  uploadPhotoFailed,
  addProductToPortfolioFail,
  createOrderFail,
  checkAmlaFail,
  checkAmlaFailOnAddFund,
  saveCifDetails,
  cifAlreadyExist,
  saveIntroductionSuccess,
  processingGetAllFundWithFundDetails,
  resetAddedProductToPortfolio,
  initMultiAgentMapOtpSuccess,
  initMultiAgentMapOtpFailure,
  processingMultiAgentMap,
  multiAgentMapError,
  multiAgentMapSuccess,
  notFoundPdaError,
  saveInterest,
  getDraftSuccess,
  docUploadPhotoFailed,
  clearUploadedUnsavedImages,
  getDefaultSalesChargeSuccess,
  getDefaultSalesChargeFailure,
  verifyCampaignCodeSuccess,
  verifyCampaignCodeFailure,
  queryISAFAmlaFail,
} from './actions';
import { setError as setClientPageError } from '../ClientDetails/actions';
import {
  makeSelectRiskProfile1,
  makeSelectRiskProfile2,
  makeSelectRiskProfile3,
  makeSelectRiskProfile4,
  makeSelectRiskProfile5,
  makeSelectIntroduction,
  makeSelectRiskScore,
  makeSelectImage,
  makeSelectSignUpToken,
  makeSelectIsExistingClientDetails,
  makeSelectCifDetails,
  makeSelectCustomer,
  makeSelectSelectedFunds,
} from './selectors';

import { post, get, remove, update } from '../../utils/api';
import { CUSTOMER_GET } from '../ClientDetails/constants';
import { encriptObject } from '../../utils/encodeDecode';

function* getFundsSaga(action) {
  const {
    payload: {
      skip = 0, // pagination
      portfolio = '', // filter
      searchInput = '', // search
      assetFilter = '', // asset class
      riskProfileType = '', // risk level
      ValueForMoney = '', // value for money
      fundType = '', // shariah
    },
  } = action;
  const fundFilters = [];
  const kwspCashIntroDetails = yield select(makekwspCashIntroDetails());
  const { createKwspAccountParams } = kwspCashIntroDetails;
  const customer = yield select(makeSelectCustomer());
  let accountSelected = yield select(makeSelectClientDetails());
  const selectedAccountDetails = yield select(makeSelectGetSelectionAccount());

  if (customer) {
    accountSelected = accountSelected.info.account.filter(
      (accountItem) => accountItem.partnerAccountMappingId === selectedAccountDetails.partnerAccountMappingId,
    )[0].islamicORConventionalFlag;
  } else {
    accountSelected = Object.keys(kwspCashIntroDetails).length ? createKwspAccountParams.islamicORConventionalFlag : null;
  }

  const isinFilter = portfolio && `"${portfolio.join('","')}"`;
  if (portfolio) fundFilters.push(`"isin":{"nin":[${isinFilter}]}`);
  if (searchInput) {
    const isFundCode = !isNaN(searchInput);
    const filterKey = isFundCode ? 'fundcode' : 'name';

    fundFilters.push(`"${filterKey}":{"like":"%${searchInput}%"}`);
  }
  if (riskProfileType && riskProfileType !== 'All') fundFilters.push(`"riskProfileType": "${riskProfileType}"`);
  if (ValueForMoney && ValueForMoney !== 'All') fundFilters.push(`"ValueForMoney": "${ValueForMoney}"`);
  if (accountSelected === 'I') {
    fundFilters.push(`"kwspType": "${accountSelected}"`);
  } else if (accountSelected === 'C') {
    const kwspTypeArray = [];
    kwspTypeArray.push(`{"kwspType": "C"}`);
    kwspTypeArray.push(`{"kwspType": "I"}`);
    fundFilters.push(`"and":[{"or":[${kwspTypeArray}]}]`);
  }
  if (fundType) fundFilters.push('"fundType": "Shariah-Compliant Funds"');
  fundFilters.push('"or":[{"description":null},{"description":{"neq":"NonPdaFund"}}]');
  let filter = `?limit=12&skip=${skip}&fundFilter=${encodeURIComponent(`{${fundFilters.join(',')}}`)}`;
  const fundAssetFilter =
    assetFilter && assetFilter !== 'All' ? `&fundAssetFilter=${encodeURIComponent(`{"class":{"like":"%${assetFilter}%"}}`)}` : '';
  filter += fundAssetFilter;
  const endpoint = `portfolio/api/Funds/getAllFundDetails${filter}`;
  try {
    yield put(processing(true));
    const response = yield call(get, endpoint);
    yield put(
      getFundsSuccess({
        funds: response.data,
        assetFilter,
        ValueForMoney,
        fundType,
        riskProfileType,
      }),
    );
  } catch (error) {
    yield call(errorHandler, error);
  } finally {
    yield put(processing(false));
  }
}

function* getAllFundsWithFundDetailsSaga() {
  const endpoint = 'portfolio/api/Funds/getAllFundDetails';
  try {
    yield put(processingGetAllFundWithFundDetails(true));
    const response = yield call(get, endpoint);
    yield put(saveAllFundsWithFundDetails(response.data.Funds.res));
  } catch (error) {
    yield call(errorHandler, error);
  } finally {
    yield put(processingGetAllFundWithFundDetails(false));
  }
}

function* getAllFundsSaga() {
  try {
    yield put(processing(true));
    const params = encodeURIComponent('{"where": {"or":[{"description":null},{"description":{"neq":"NonPdaFund"}}]}}');
    const filter = `?filter=${params}`;
    const response = yield call(get, `portfolio/api/Funds${filter}`);
    yield put(getAllFundsSuccess(response.data));
  } catch (errorObj) {
    yield call(errorHandler, errorObj);
  } finally {
    yield put(processing(false));
  }
}

function* saveIntroductionSaga(action) {
  try {
    yield put(processing(true));
    yield call(post, 'prospects', action.payload); // fire and forget for now
    yield put(saveInterest(action.payload.hobby));
    yield put(saveIntroductionSuccess(true));
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      yield put(saveIntroductionSuccess(false));
      yield call(errorHandler, errorObj);
    }
  } finally {
    yield put(processing(false));
  }
}

export function* getRiskQuestionsSaga() {
  const questionsId = [3, 4, 5, 6, 7]; // should be dynamic from console
  const questionsApi = 'riskprofile/api/Answers/getAnswersByQuestions';
  try {
    yield put(processing(true));
    const apiRes = yield call(post, questionsApi, questionsId);
    const questionsAnswers = apiRes.data.response;
    yield put(getRiskQuestionsAnswersSuccess(questionsAnswers));
  } catch (errorObj) {
    yield call(errorHandler, errorObj);
    yield put(processing(false));
  }
}

export function* getRiskScoreSaga() {
  const profile1 = yield select(makeSelectRiskProfile1());
  const profile2 = yield select(makeSelectRiskProfile2());
  const profile3 = yield select(makeSelectRiskProfile3());
  const profile4 = yield select(makeSelectRiskProfile4());
  const profile5 = yield select(makeSelectRiskProfile5());
  const introData = yield select(makeSelectIntroduction());
  const lov = yield select(makeSelectLOV());

  const riskScoreApi = 'riskprofile/api/RiskScores/calculateRiskScore/v2';
  const { monthlySavings, dateOfBirth, annualIncome } = introData;
  const annualIncomeLOV = lov.Dictionary[5].datadictionary;
  const annualIncomeData = _find(annualIncomeLOV, { codevalue: annualIncome });

  const monthlyIncome = annualIncomeData.customValue1;
  const payload = {
    questionArray: [profile1.questionId, profile2.questionId, profile3.questionId, profile4.questionId, profile5.questionId],
    answerArray: [profile1.id, profile2.id, profile3.id, profile4.id, profile5.id],
    questionWeightArray: [0.5, 0.5],
    netMonthlySavings: parseFloat(monthlySavings),
    monthlyIncome: parseInt(monthlyIncome, 10),
    monthlyExpenses: 0,
    initialInvestment: 0,
    goalYear: 0,
    age: CalculateAge(dateOfBirth),
    incomeInvestmentWeight: 0.6,
    ageWeight: 0.4,
    goalWeight: 0,
  };
  try {
    yield put(processing(true));
    const apiRes = yield call(post, riskScoreApi, payload);
    const riskScore = apiRes.data.Response;
    yield put(saveRiskScore(riskScore));
  } catch (errorObj) {
    yield call(errorHandler, errorObj);
  } finally {
    yield put(processing(false));
  }
}

export function* getRiskProfilesSaga() {
  // const riskProfileApi = 'riskprofile/api/RiskProfileToModelPortfolios';
  const newRiskProfileApi = 'riskprofile/api/RiskScores/getRiskProfiles';
  try {
    yield put(processing(true));
    const apiRes = yield call(get, newRiskProfileApi);
    const dataResponse = Object.values(apiRes.data.Response) || [];
    const riskProfiles = dataResponse.filter((d) => d.riskProfileType !== 'NA');
    yield put(saveRiskProfiles(riskProfiles));
  } catch (errorObj) {
    yield call(errorHandler, errorObj);
  } finally {
    yield put(processing(false));
  }
}

export function* fileUploadSaga(action) {
  const {
    payload: { payload },
  } = action;

  const uploadApi = 'customer/api/Customers/uploadandwatermark';
  const requestPayload = {
    base64img: payload.base64img,
    Customerdocs: {
      DocType: payload.DocType,
      Filename: `${moment().unix()}_${payload.Filename}`,
      token: getItem('access_token'),
      customerId: action.payload.customerId,
    },
  };

  try {
    yield put(processing(true));
    const res = yield call(post, uploadApi, requestPayload);
    const { DocType, id, token } = res.data.response;
    const data = {
      [DocType]: {
        image: `${BaseUrl}/api/getIdImg/${id}/${token}`,
        id,
        type: DocType,
        base64img: `data:image/jpeg;base64,${payload.base64img}`,
        fileName: res.data.response.Filename,
        createdAt: new Date(),
      },
    };
    yield put(saveImage(data));
  } catch (errorObj) {
    // yield put(setError('Uploading file failed. Please try again.'));
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      console.error('errorObj', errorObj.error.message);
      yield put(setError(errorObj.error.message));
      yield put(docUploadPhotoFailed());
    }
    // trigger error that set handler to redirect directly to investment details
  } finally {
    yield put(processing(false));
  }
}

export function* imageUploadSaga(action) {
  const { payload } = action;

  const uploadApi = 'customer/api/Customers/uploadandwatermark';
  const requestPayload = {
    base64img: payload.base64img,
    Customerdocs: {
      DocType: payload.DocType,
      Filename: `${moment().unix()}_${payload.Filename}`,
      token: getItem('access_token'),
    },
  };

  try {
    yield put(processing(true));
    const res = yield call(post, uploadApi, requestPayload);
    const { DocType, id, token } = res.data.response;
    const data = {
      [DocType]: {
        image: `${BaseUrl}/api/getIdImg/${id}/${token}`,
        id,
        type: DocType,
        base64img: `data:image/jpeg;base64,${payload.base64img}`,
      },
    };
    yield put(saveImage(data));
  } catch (errorObj) {
    // yield put(setError('Uploading file failed. Please try again.'));
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      console.error('errorObj', errorObj.error.message);
      yield put(setError(errorObj.error.message));
      yield put(uploadPhotoFailed());
    }
    // trigger error that set handler to redirect directly to investment details
  } finally {
    yield put(processing(false));
  }
}

export function* fileReUploadSaga(action) {
  const { payload } = action;

  let endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${payload.tokenReUploadDocs}`;
  const idParam = payload.id;
  let returnToken;
  try {
    yield put(processingUpdateClientProfile(true));
    // yield put(processing(true));
    const response = yield call(get, endpoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      yield put(processingUpdateClientProfile(false));
      // yield put(processing(false));
      console.error('error from reuploadDocs: execAfterOTP : ', error);
      let errorMessage = 'Failed to reupload docs. Please try again later!';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      return;
    }
  }

  endpoint = 'customer/api/Customers/reUploadAndWatermark';
  let imageBase64Obj;

  Object.keys(payload.rawImagePayload).forEach((imageItem) => {
    imageBase64Obj = {
      ...imageBase64Obj,
      [`${payload.rawImagePayload[`${imageItem}`].id}`]: payload.rawImagePayload[`${imageItem}`].base64img,
    };
  });

  try {
    yield put(processingUpdateClientProfile(true));
    yield call(update, endpoint, { reqPayload: returnToken, imageBase64: imageBase64Obj });
    yield put(getCustomerDetails({ idParam, url: 'profile' }));
    // yield put(processing(false));
    yield put(processingUpdateClientProfile(false));
    yield put(reUploadDocumentSuccess(true));
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      yield put(processingUpdateClientProfile(true));
      yield put(reUploadDocumentFailure(errorObj.message || 'Failed to upload Documents!'));
    }
  } finally {
    yield put(clearUploadedUnsavedImages());
    yield put(processingUpdateClientProfile(false));
    // yield put(processing(false));
  }
}

export function* removeImageSaga(action) {
  const { id, type } = action.payload;
  const api = `customer/api/Customers/removeIdImg/${id}`;
  try {
    yield put(processing(true));
    yield call(remove, api);
    yield put(saveImage({ [type]: '' }));
  } catch (errorObj) {
    console.log('Error: ', errorObj);
  } finally {
    yield put(processing(false));
  }
}

function* getLOVDetailSaga(action) {
  const type = action.payload;
  const endpoint = `DataDictionaryTypes/${type}/datadictionary`;
  try {
    yield put(processing(true));
    const response = yield call(get, endpoint);
    if (type === 5) {
      response.data.pop();
      yield put(getAnnualIncomeSuccess(response.data));
    }
  } catch (error) {
    // yield put(recoverUserIdFail());
  } finally {
    yield put(processing(false));
  }
}

function* createOrderSaga(action) {
  const { payload } = action;
  const endpoint = 'portfolio/api/Portfolios/createPortfolioWithProducts';
  yield put(createOrderFail(null));
  try {
    yield put(processing(true));
    const res = yield post(endpoint, payload);
    yield put(createOrderSuccess(res.data.response));
  } catch (error) {
    if (error.error.name !== 'db_error' && error.error.statusCode !== 500 && error.error.statusCode !== 502) {
      if (_has(error.error, 'message') && !isEmpty(error.error.message)) {
        yield put(createOrderFail(error.error.message));
      } else {
        yield call(errorHandler, errorObj);
      }
    }
  } finally {
    yield put(processing(false));
  }
}

function* createDocsPaymentSaga(action) {
  const { payload } = action;
  const endpoint = 'investment/api/PaymentRequests/createPaymentRequestWithDoc';
  try {
    yield put(processing(true));
    const res = yield post(endpoint, payload);
    yield put(createPaymentDocsSuccess(res.data.response));
  } catch (errorObj) {
    yield call(errorHandler, errorObj);
  } finally {
    yield put(processing(false));
  }
}

function createAmlaCheckPayload(args) {
  const {
    address,
    ID: { identificationType, identificationNumber },
    fullName,
    email,
    nationality,
    Occupation: { occupationType, natureofbusiness },
    MobileNumber,
  } = args;

  const payload = {
    CorrCountry: address[2].country, // change on 20190125 to take correspondance country. it was 0
    CustomerIdType: identificationType,
    CustomerName: fullName,
    CustomerType: 'N',
    CustomerId: identificationNumber,
    email,
    MobileNumber,
    Nationality: nationality,
    NatureOfBusiness: natureofbusiness ? parseInt(natureofbusiness, 10) : '',
    OccupationType: occupationType,
    ISAFPerformedDate: moment().format('YYYY-MM-DD'),
  };

  return payload;
}

function* checkAmlaSaga(action) {
  // const payload = createAmlaCheckPayload(action.payload);
  // const { riskScore } = yield select(makeSelectRiskScore());
  // payload.ISAFScore = riskScore;
  const endpoint = 'integration/api/cwaDigitalChannelInsertWS/AMLCheck';
  try {
    yield put(processing(true));
    // const res = yield post(endpoint, payload);
    const res = yield post(endpoint, { i: action.payload.AMLToken });
    /* const result = _get(
      res.data,
      ['status', 'SOAP-ENV:Envelope', 'SOAP-ENV:Body', 'rpc:insertCustProfileResponse', 'SiebelMessageOut'],
      null,
    ); */
    // const isSuccess = res.data.ResponseStatus === 'OK';
    // const message = res.data.ErrorMessage || res.data.message;
    /* if (isSuccess) {
      yield put(checkAmlaSuccess());
    } else {
      yield put(setError(message));
    } */
    // console.log('checkAmlaSaga res.data : ', res.data.signUpToken);
    yield put(checkAmlaSuccess(res.data.signUpToken));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      const isRiskProfileHigh =
        error.error &&
        (error.error.RiskProfile === 'HIGH' ||
          error.error.RiskProfile === 'BLOCKED' ||
          error.error.name === 'HIGH' ||
          error.error.name === 'BLOCKED');
      if (isRiskProfileHigh) {
        yield put(checkAmlaFail(error));
      } else {
        yield call(errorHandler, error);
      }

      yield put(checkAmlaFail(error));
    }
  } finally {
    yield put(processing(false));
  }
}

function* errorHandler(err) {
  if (err) {
    if (err.error) {
      if (err.error.statusCode) {
        // TODO: refactor this when requirement is clearer
        if (err.error.message) {
          // if (err.error.message !== 'Customer already exists in the system') {
          yield put(setError(err.error.message));
          yield put(setClientPageError(err.error.message));
          // }
        } else if (err.error.statusCode == 427) {
          const errMessage = composeErrorMessage(err.error);

          yield put(setError(`<div>${errMessage}</div>`));
        } else {
          yield put(setError('Internal server error. Please try again.'));
        }
      }
    }
  }
}

// eslint-disable-next-line consistent-return
function* callQueryISAFWithAmlaForCreation(payload) {
  const { ID } = payload;
  const queryISAFEndpoint = `integration/api/cwaDigitalChannelInsertWS/v2/queryISAF/${ID.identificationType}/${ID.identificationNumber}`;
  const amlaCheckEndpoint = 'integration/api/cwaDigitalChannelInsertWS/v2/AmlaCheck';

  try {
    yield put(processing(true));
    const queryISAFResponse = yield call(get, queryISAFEndpoint);
    if (
      queryISAFResponse.status === 200 &&
      (queryISAFResponse.data.action === 'updateAML' || queryISAFResponse.data.action === 'insertAML')
    ) {
      const amlaResponse = yield call(post, amlaCheckEndpoint, {
        ...payload,
        action: queryISAFResponse.data.action,
      });
      if (amlaResponse.status === 200) {
        yield put(checkAmlaSuccess(amlaResponse.data.signUpToken));
        return true;
      }
    } else {
      const isafErrMessage = (queryISAFResponse.data && queryISAFResponse.data.ErrorMessage) || 'Something went wrong!';
      yield put(queryISAFAmlaFail({ message: isafErrMessage }));
      yield put(processing(false));
    }
  } catch (error) {
    yield put(queryISAFAmlaFail(error.error));
    yield put(processing(false));
  }
}

function* validatePersonalDetailsSaga(action) {
  const { payload } = action;
  const riskScoreEnum = {
    CONSERVATIVE: '1',
    'MODERATELY CONSERVATIVE': '19',
    MODERATE: '26',
    'MODERATELY AGGRESSIVE': '35',
    AGGRESSIVE: '43',
  };
  const lov = yield select(makeSelectLOV());
  const bankLOV = lov.Dictionary[19].datadictionary;
  const IdTypesLOV = lov.Dictionary[9].datadictionary;
  const bankSelected = payload.bankName ? _find(bankLOV, { codevalue: payload.bankName }) : null;
  const {
    fullName,
    nationality,
    dateOfBirth,
    bankAcctNumber,
    permanentAddressLine1,
    permanentAddressLine2,
    permanentAddressLine3,
    permanentState,
    permanentCountry,
    permanentPostalCode,
    correspondenceAddressLine1,
    correspondenceAddressLine2,
    correspondenceAddressLine3,
    // correspondenceStateInCodeValue,
    correspondenceState,
    correspondenceCountry,
    correspondencePostalCode,
    companyAddressLine1,
    companyAddressLine2,
    companyAddressLine3,
    companyState,
    companyCountry,
    companyPostalCode,
    maritalStatus,
    race,
    companyName,
    natureofbusiness,
    occupationType,
    yearlyIncome,
    sourceoffunds,
    purposeofinvestment,
    interests,
    expiryDate,
    expiryDateVisa,
    identificationNumber,
    identificationType,
    gender,
    email,
    uploadType,
    passportIdentificationType,
    passportNumber,
    mobileNo,
    title,
    bankAcctName,
    motherMaidenName, // new rq
    // isUSTaxResident, // new rq
    incomeTaxNumber = 0, // new rq
    // foreignTaxNumber, // new rq
    taxResidentCountryOfBirth,
    isTaxResidentOfMalaysia,
    isTaxResidentOfOtherCountryInfo,
    isTaxResidentOfOtherCountry,
    AccountType,
    islamicORConventionalFlag,
    epfMembershipNumber,
    educationLevel,
    investmentExperience,
    noOfDependants,
    existingCommitments,
    monthlySavings,
  } = payload;

  const idType = uploadType === 'IC' ? payload.identificationType : payload.passportIdentificationType;
  const IdSelectedObject = _find(IdTypesLOV, { codevalue: idType });
  const identificationTypeDescription = IdSelectedObject.description;
  const docs = [];
  const annualIncome = payload.annualIncome;
  const images = yield select(makeSelectImage());
  if (!isEmpty(images)) {
    const keys = Object.keys(images);
    keys.map((key) => {
      if (uploadType === 'IC') {
        if (key.includes('IC')) {
          docs.push(images[key].id);
        }
      }
      if (uploadType === 'Passport') {
        if (key.includes('Passport')) {
          docs.push(images[key].id);
        }
      }
    });
  }
  const riskScore = yield select(makeSelectRiskScore());
  const ICTypeID = {
    identificationType,
    identificationNumber: identificationNumber ? identificationNumber.trim() : null,
    identificationTypeDescription,
  };
  const PassportTypeID = {
    identificationType: passportIdentificationType,
    identificationNumber: passportNumber ? passportNumber.trim() : null,
    // expiryDate,
    // expiryDateVisa,
    expiryDate: moment(expiryDate, 'DD/MM/YYYY')
      .format('YYYY-MM-DD')
      .toString(),
    expiryDateVisa: moment(expiryDateVisa, 'DD/MM/YYYY')
      .format('YYYY-MM-DD')
      .toString(),
    identificationTypeDescription,
  };
  const ID = uploadType === 'IC' ? ICTypeID : PassportTypeID;
  ID.identificationNumber = toUpperCase(ID.identificationNumber);
  const riskAppetite = riskScore.riskProfileType ? toUpperCase(riskScore.riskProfileType) : '';

  const requestPayload = {
    riskAppetite,
    Docs: docs,
    ID,
    fullName: fullName ? toUpperCase(fullName.trim()) : '',
    nationality,
    gender,
    email: email ? email.trim() : '',
    maritalStatus,
    title: title ? toUpperCase(title) : '',
    birthDate: moment(dateOfBirth).format('YYYY/MM/DD'),
    age: CalculateAge(moment(dateOfBirth, 'DD/MM/YYYY')),
    interests: interests ? toUpperCase(interests) : '',
    sourceoffunds,
    purposeofinvestment: purposeofinvestment ? toUpperCase(purposeofinvestment) : '',
    MobileNumber: mobileNo,
    race,
    usTaxResident: 'N',
    holderCategory: '',
    deceasedIndicator: 'N',
    incomeTaxNo: incomeTaxNumber ? toUpperCase(incomeTaxNumber.trim()) : '',
    foreignTaxNo: '',
    motherMaidenName: motherMaidenName ? toUpperCase(motherMaidenName.trim()) : '',
    AccountType,
    islamicORConventionalFlag,
    epfMembershipNumber,
    bank: {
      bankName: (bankSelected && bankSelected.description) || '',
      bankCode: (bankSelected && bankSelected.codevalue) || '',
      bankAcctNumber: bankAcctNumber ? toUpperCase(bankAcctNumber.trim()) : '',
      bankAcctName: bankAcctName ? toUpperCase(bankAcctName.trim()) : '',
    },
    address: [
      {
        addressline1: permanentAddressLine1 ? toUpperCase(permanentAddressLine1.trim()) : '',
        addressline2: permanentAddressLine2 ? toUpperCase(permanentAddressLine2.trim()) : '',
        addressline3: permanentAddressLine3 ? toUpperCase(permanentAddressLine3.trim()) : '',
        postalCode: permanentPostalCode,
        state: permanentState ? toUpperCase(permanentState) : '',
        country: permanentCountry,
        addresstype: 'PERMANENT',
      },
      {
        addressline1: correspondenceAddressLine1 ? toUpperCase(correspondenceAddressLine1.trim()) : '',
        addressline2: correspondenceAddressLine2 ? toUpperCase(correspondenceAddressLine2.trim()) : '',
        addressline3: correspondenceAddressLine3 ? toUpperCase(correspondenceAddressLine3.trim()) : '',
        postalCode: correspondencePostalCode,
        // state: correspondenceStateInCodeValue?toUpperCase(correspondenceStateInCodeValue):'',
        state: correspondenceState,
        country: correspondenceCountry,
        addresstype: 'CORRESPONDENCE',
      },
    ],
    Occupation: {
      companyName: companyName || '',
      natureofbusiness: natureofbusiness || '',
      occupationType,
      yearlyIncome: annualIncome,
    },
    PPOC: 'N',
    holdPositionFlag: 'N',
    isTaxResidentOfMalaysia: isTaxResidentOfMalaysia ? 1 : 0,
    ISAFScore: riskScoreEnum[riskAppetite],
    educationLevel,
    investmentExperience,
    noOfDependants,
    existingCommitments,
    monthlySavings,
  };

  // const nonWorkers = ['91', '90', '62'];
  // if (!nonWorkers.includes(occupationType)) {
  const companyAddObj = {
    addressline1: companyAddressLine1 ? toUpperCase(companyAddressLine1.trim()) : '',
    addressline2: companyAddressLine2 ? toUpperCase(companyAddressLine2.trim()) : '',
    addressline3: companyAddressLine3 ? toUpperCase(companyAddressLine3.trim()) : '',
    postalCode: companyPostalCode,
    state: companyState ? toUpperCase(companyState) : '',
    country: companyCountry,
    addresstype: 'COMPANY',
  };
  requestPayload.address.push(companyAddObj);
  // }

  if (isTaxResidentOfOtherCountry) {
    requestPayload.PlaceandCountryBirth = taxResidentCountryOfBirth;
    requestPayload.isTaxResidentOfOtherCountryInfo = isTaxResidentOfOtherCountryInfo;
  } else {
    requestPayload.PlaceandCountryBirth = null;
    requestPayload.isTaxResidentOfOtherCountryInfo = [];
  }

  const endpoint = 'customer/api/Customers/customerSignUpValidation';
  const queryISAFAmlaRes = yield call(callQueryISAFWithAmlaForCreation, { ...requestPayload, trxType: 'signUp' });
  if (!queryISAFAmlaRes) return;

  try {
    yield put(processing(true));
    const encryptedPayload = encriptObject(requestPayload);
    const response = yield call(post, endpoint, { i: encryptedPayload });
    const data = response.data.response;
    delete data.id;
    delete data.agentId;
    yield put(validatePersonalDetailsSuccess(data));
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      if (_has(errorObj.error, 'name')) {
        yield put(validatePersonalDetailsFail(errorObj));
        if (errorObj.error.name === 'HIGH') {
          yield put(processing(false));
          // commented out on 20190613
          // yield call(checkAmla, requestPayload);
        }
      } else {
        yield call(errorHandler, errorObj);
      }
    }
  } finally {
    yield put(processing(false));
  }
}

// fire and forget amla check
function* checkAmla(args) {
  const payload = createAmlaCheckPayload(args);
  const { riskScore } = yield select(makeSelectRiskScore());
  payload.ISAFScore = riskScore;
  const endpoint = 'integration/api/cwaDigitalChannelInsertWS/AMLCheck';
  try {
    yield post(endpoint, payload);
  } catch (errorObj) {
    console.error('checkAmla error : ', errorObj);
  }
}

function* initOnboardingClientConfirmationOtp() {
  // const {
  //   payload: { details, PPOC },
  // } = action;
  // // console.log(action);
  // const docs = [];
  // const uploadType = details.ID.identificationType === 'PSPORT' ? 'Passport' : 'IC';
  // // add ppoc
  // const finalPPOC = PPOC === 'Y' ? 'Y' : 'N';
  // details.PPOC = finalPPOC;
  // details.holdPositionFlag = finalPPOC;
  // const images = yield select(makeSelectImage());
  // if (!isEmpty(images)) {
  //   const keys = Object.keys(images);
  //   keys.map((key) => {
  //     if (uploadType === 'IC') {
  //       if (key.includes('IC')) {
  //         docs.push(images[key].id);
  //       }
  //     }
  //     if (uploadType === 'Passport') {
  //       if (key.includes('Passport')) {
  //         docs.push(images[key].id);
  //       }
  //     }
  //   });
  // }

  // const userInfo = yield select(selectUserInfo());
  const signUpToken = yield select(makeSelectSignUpToken());
  // const endpoint = 'gateway/_internal/OtpTransactions/requestOTPVerification';
  const endpoint = 'customer/api/OtpTransactions/requestSignUpOTPVerification';
  /* const finalRequestPayload = {
    reqPayload: details,
    TransactionType: 'SignUp',
    MobileNo: details.MobileNumber,
    userId: userInfo.agent.username,
  }; */
  const finalRequestPayload = {
    signUpToken,
  };
  if (window.location.host.indexOf('localhost') !== -1) {
    finalRequestPayload.debug = 1;
  }
  try {
    yield put(processing(true));
    const response = yield call(post, endpoint, finalRequestPayload);
    yield put(initOnboardingClientConfirmationOtpSuccess(response.data.res));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      let errorMessage = 'Failed to initialise OTP. Please try again later!';
      if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
        if (error && error.error.message) {
          errorMessage = error.error.message;
        }
        yield put(initOnboardingClientConfirmationOtpFail(errorMessage));
      }
    }
  } finally {
    yield put(processing(false));
  }
}

function* accountCreationOtpCorrectSaga(action) {
  const { payload } = action;
  const endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${payload}`;
  try {
    yield put(processing(true));
    const res = yield call(get, endpoint);
    const data = res.data.res;
    if (data.message === 'This is expired OTP') {
      yield put(setError(data.message));
      yield put(processing(false));
    } else {
      const createAccountPayload = {
        reqPayload: res.data.res.TokenUponSuccess,
      };
      const customerRes = yield call(post, 'customer/api/Customers/customerSignUp', createAccountPayload);
      yield put(createAccountSuccess(customerRes.data.response));
    }
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      let errorMessage = '';
      if (typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else {
        errorMessage = error.error.message.join('</br>');
      }
      yield put(setError(`<div>${errorMessage}</div>`));
    }
  } finally {
    yield put(processing(false));
  }
}

function* accountCreationOtpIncorrectSaga(action) {
  const { payload } = action;
  const endpoint = `gateway/_internal/OtpTransactions/stopAfterOTPInvalid?encP=${payload}`;
  try {
    yield put(processing(true));
    yield call(get, endpoint);
    yield put(setError('Invalid OTP'));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(setError('Invalid OTP'));
    }
  } finally {
    yield put(processing(false));
  }
}

function* getCustomerSaga(action) {
  const { id, portfolioId } = action.payload;
  const endpoint = `customer/api/Customers/${id}`;
  const clientDetails = yield select(makeSelectClientDetails());

  const accountType = clientDetails.portfolio.find((portfolioItem) => parseInt(portfolioItem.id) === parseInt(portfolioId))
    .partnerAccountType;

  const customer = {};
  let accountRes = [];

  try {
    yield put(processing(true));
    const customerRes = yield call(get, endpoint);
    customer.info = customerRes.data;

    const accountResData = yield call(get, `${endpoint}/Account?filter[where][UTRACCOUNTTYPE]=${accountType}`);
    if (accountResData) {
      accountRes = accountResData.data;
    }

    customer.account = [accountRes];
    yield put(getCustomerSuccess(customer));
  } catch (error) {
    yield setError(error.error.message);
  } finally {
    yield put(processing(false));
  }
}

// function* checkAmlaTransaction(payload) {
//   const endPoint = `integration/api/cwaDigitalChannelInsertWS/UpdateAmla/${payload.clientId}`;

//   try {
//     yield put(processing(true));
//     return yield call(post, endPoint, payload.txnPayload);
//     // const response = yield call(get, endPoint);
//     // console.log('response from checkAmla : ', response);
//   } catch (error) {
//     if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
//       console.error('error from checkAmla before initFundTransactionOtp', error);
//       error.error.amlaFail = true;
//       yield put(checkAmlaFailOnAddFund(error.error));
//       /* const isRiskProfileHigh = error.error && (error.error.RiskProfile === 'HIGH' || error.error.RiskProfile === 'BLOCKED' || error.error.name === 'HIGH' || error.error.name === 'BLOCKED');
//       if (isRiskProfileHigh) {
//         yield put(checkAmlaFailOnAddFund(true));
//       } else {
//         yield call(errorHandler, error);
//       } */
//       return false;
//     }
//   } finally {
//     yield put(processing(false));
//   }
// }

// eslint-disable-next-line consistent-return
function* callQueryISAFWithAmla(payload) {
  // const { info } = yield select(makeSelectClientDetails());
  // const queryISAFEndpoint = `integration/api/cwaDigitalChannelInsertWS/v2/queryISAF/${info.identificationType}/${info.identificationNumber}`;
  const amlaCheckEndpoint = 'integration/api/cwaDigitalChannelInsertWS/v2/AmlaCheck';

  try {
    yield put(processing(true));
    // const queryISAFResponse = yield call(get, queryISAFEndpoint);
    // if (queryISAFResponse.status === 200 && queryISAFResponse.data.action === 'updateAML') {
    //   const amlaResponse = yield call(post, amlaCheckEndpoint, {
    //     ...payload,
    //     trxType: 'addFunds',
    //     productBreakdown: payload.productBreakdown.map((ele) => ({ ...ele, partnerAccountNo: payload.accountId })),
    //   });
    //   if (amlaResponse.status === 200) return 'Success';
    // } else {
    //   const isafErrMessage = (queryISAFResponse.data && queryISAFResponse.data.ErrorMessage) || 'Something went wrong!';
    //   yield put(queryISAFAmlaFail({ message: isafErrMessage }));
    //   yield put(processing(false));
    // }
    const amlaResponse = yield call(post, amlaCheckEndpoint, {
      ...payload,
      trxType: 'addFunds',
      productBreakdown: payload.productBreakdown.map((ele) => ({ ...ele, partnerAccountNo: payload.accountId })),
    });
    if (amlaResponse.status === 200) return 'Success';
  } catch (error) {
    yield put(queryISAFAmlaFail(error.error));
    yield put(processing(false));
  }
}

function* addProductPortfolioSaga(action) {
  const { payload } = action;
  // const clientDetails = yield select(makeSelectClientDetails());
  // const result = yield call(checkAmlaTransaction, { txnPayload: payload, clientId: clientDetails.info.id });
  //
  // if (!result) {
  //   return;
  // }

  let endpoint;
  if (payload.portfolioId === 'create') {
    endpoint = 'portfolio/api/Portfolios/createPortfolioWithProducts';
  } else {
    const res = yield call(callQueryISAFWithAmla, payload.req);
    if (!res) return;
    endpoint = `portfolio/api/Portfolios/addNewProductsToPortfolio/${payload.portfolioId}`;
  }
  try {
    yield put(processing(true));
    const apiRes = yield call(post, endpoint, payload.req);
    yield put(resetAddedProductToPortfolio());
    yield put(addProductToPortfolioSuccess(apiRes.data.response));
  } catch (error) {
    if (_has(error.error, 'message') && !isEmpty(error.error.message)) {
      if (error.error.statusCode === 500 || error.error.statusCode === 502) {
        console.log('Error: 500/502');
      } else {
        console.log('Error ', error);
        yield put(addProductToPortfolioFail(error.error.message));
      }
    }
  } finally {
    yield put(processing(false));
  }
}

export function* transactionFileUploadSaga(action) {
  const {
    payload: { base64img, fileName, transactionRequest, type, fullName, identificationInfo },
  } = action;
  if (!fileName) return; // temporary for redundant calls, need to check saga
  const lov = yield select(makeSelectLOV());
  const paymentMethodsLov = lov.Dictionary[20].datadictionary;
  const selectedPaymentMethod = paymentMethodsLov.find((item) => item.codevalue === type);

  const uploadApi = 'customer/api/Customers/uploadPaymentRequestDoc';
  const requestPayload = {
    chequebdbase64: base64img,
    ChequeOrBDFileName: `${moment().unix()}_${fileName}`,
    token: getItem('access_token'),
    transactionRequest: omit(transactionRequest, ['transactions']),
    type: selectedPaymentMethod ? selectedPaymentMethod.description : '',
    codeValue: type,
    fullName,
    identificationInfo,
  };

  try {
    yield put(processing(true));
    const res = yield call(post, uploadApi, requestPayload);
    const { id } = res.data.response;

    yield put(uploadTransactionFileSuccess({ id }));
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      // yield put(setError('Uploading file failed. Please try again.'));
      console.error('error in transactionFileUploadSaga : ', errorObj);
      yield put(setError(errorObj.error ? errorObj.error.message : 'Uploading file failed. Please try again.'));
      // trigger error that set handler to redirect directly to investment details
    }
  } finally {
    yield put(processing(false));
  }
}

export function* validatePostalCodeSaga(action) {
  const {
    payload: { value, type },
  } = action;
  if (value.length < 5) {
    yield put(setError('Invalid postal code!'));
    yield put(validatePostalCodeFail({ type, errorMsg: 'Invalid postal code' }));
  } else {
    const filter = encodeURIComponent(`{"where":{"and":[{"start":{"lte":"${value}"}},{"end":{"gte":"${value}"}}]}}`);
    const endpoint = `customer/api/PostalcodeMappings/findOne?filter=${filter}`;
    try {
      yield put(processing(true));
      const res = yield call(get, endpoint);
      yield put(validatePostalCodeSuccess({ data: res.data, type }));
    } catch (err) {
      yield put(setError('Postal code not found!'));
      yield put(validatePostalCodeFail({ type, errorMsg: 'Postal code not found!' }));
    } finally {
      yield put(processing(false));
    }
  }
}

export function* checkCifSaga(action) {
  const {
    payload: { identificationType, identificationNumber, uploadType },
  } = action;
  const userInfo = yield select(selectUserInfo());
  const { agent } = userInfo;
  // const endpoint = `integration/api/cwaDigitalChannelInsertWS/checkIfExistingClient/${identificationType}/${identificationNumber}`;
  try {
    yield put(processing(true));
    const getCustomerDetailsEndpoint = `customer/api/Customers/getAccountDetailsFromIdentification?identificationType=${identificationType}&identificationNumber=${identificationNumber}`;
    const response = yield call(get, getCustomerDetailsEndpoint);
    const { data } = response;

    console.log('isEmpty: ', isEmpty(data.response.data));

    if (isEmpty(data.response.data)) {
      console.log('saveCifDetails');

      const obj = {
        ...action.payload,
        isExistingClient: false,
      };
      yield put(saveCifDetails(obj));
    } else {
      const payload = data.response.data;
      payload.agentUsername = agent.username;
      payload.agentName = `${agent.firstName === 'null' || !agent.firstName ? '' : agent.firstName} ${
        agent.lastName === 'null' || !agent.lastName ? '' : agent.lastName
      }`;
      payload.uploadType = uploadType;
      payload.identificationNumber = identificationNumber;
      payload.identificationType = identificationType;
      yield put(cifAlreadyExist(payload));
      // yield put(setError(`Client id ${identificationNumber} already has an account.`));
    }
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      const errorMessage = errorObj.error.message;
      if (errorMessage === 'Cash Account for this customer Exist in Horizon but not available in PDA') {
        yield put(notFoundPdaError());
      } else {
        yield put(setError(errorObj.error.message));
      }
      yield put(processing(false));
    }
  } finally {
    yield put(processing(false));
  }
}

function* initMultiAgentMapOtp() {
  const userInfo = yield select(makeSelectIsExistingClientDetails());
  const endPoint = 'customer/api/OtpTransactions/requestOTPVerification';
  const requestPayload = {
    TransactionType: 'AgentAccess',
    userId: userInfo.customerId,
    MobileNo: userInfo.mobileNumber,
    reqPayload: {
      customerId: userInfo.customerId,
    },
  };

  if (window.location.host.indexOf('localhost') !== -1) {
    requestPayload.debug = 1;
  }

  try {
    yield put(processing(true));
    const response = yield call(post, endPoint, requestPayload);
    yield put(initMultiAgentMapOtpSuccess(response.data));
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      let errorMessage = 'Failed to initialise OTP. Please try again later!';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      yield put(initMultiAgentMapOtpFailure(errorMessage));
    }
  } finally {
    yield put(processing(false));
  }
}

function* multiAgentMap(action) {
  let endpoint = `gateway/_internal/OtpTransactions/execAfterOTP?encP=${action.payload.agentAccessToken}`;
  let returnToken = null;
  try {
    yield put(processingMultiAgentMap(true));
    const response = yield call(get, endpoint);
    returnToken = response.data.res.TokenUponSuccess;
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      yield put(processingMultiAgentMap(false));
      let errorMessage = 'Something went wrong, Please try again later!';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      yield put(multiAgentMapError(errorMessage));
      return;
    }
  }

  const userInfo = yield select(makeSelectIsExistingClientDetails());
  endpoint = `customer/api/Customers/agentAccess/${userInfo.customerId}`;
  try {
    yield call(post, endpoint, { AgentAccess: returnToken });
    yield put(multiAgentMapSuccess());
  } catch (error) {
    if (_has(error.error, 'statusCode') && (error.error.statusCode !== 500 && error.error.statusCode !== 502)) {
      let errorMessage = 'Failed to assign. Please try again later!';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      yield put(multiAgentMapError(errorMessage));
    }
  } finally {
    yield put(processingMultiAgentMap(false));
  }
}

export function* saveDraft(action) {
  const { payload } = action;
  const cifData = yield select(makeSelectCifDetails());
  const { identificationType } = cifData;
  let identificationNumber = payload.identificationNumber;

  const endpoint = 'customer/api/Drafts/';
  if (identificationNumber && identificationType === 'NRIC') {
    identificationNumber = payload.identificationNumber;
  } else {
    identificationNumber = cifData.identificationNumber;
  }
  try {
    yield put(processing(true));
    yield call(post, endpoint, { data: payload, identificationType, identificationNumber });
    yield put(getDraftSuccess({ data: payload }));
    yield put(setToast({ type: 'success', message: 'Saved successfully!' }));
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      yield put(setToast({ type: 'error', message: 'Something went wrong!' }));
    }
  } finally {
    yield put(processing(false));
  }
}

export function* getDraft({ payload }) {
  const { identificationNumber, identificationType } = payload;
  const endpoint = `customer/api/Drafts?filter[where][identificationNumber]=${identificationNumber}&filter[where][identificationType]=${identificationType}`;
  try {
    yield put(processing(true));
    const res = yield call(get, endpoint);
    yield put(getDraftSuccess(res.data[res.data.length - 1]));
  } catch (errorObj) {
    if (_has(errorObj.error, 'statusCode') && (errorObj.error.statusCode !== 500 && errorObj.error.statusCode !== 502)) {
      yield put(setToast({ type: 'error', message: 'Something went wrong in getting draft details!' }));
    }
  } finally {
    yield put(processing(false));
  }
}

export function* getDefaultSalesChargeSaga({ accountType }) {
  try {
    const selectedFunds = yield select(makeSelectSelectedFunds());

    const res = yield call(post, 'investment/api/HZFUNDSARATES/defaultRate', {
      fundCodes: selectedFunds.map((fund) => ({
        fundCode: fund.fundcode,
        utrAccountType: accountType,
      })),
    });
    yield put(getDefaultSalesChargeSuccess(res.data.response));
  } catch (err) {
    yield put(getDefaultSalesChargeFailure(err));
  }
}

export function* verifyCampaignCodeSaga({ payload }) {
  try {
    const { campaignCode, fundCode, fundName, minimumInvestment, accountType } = payload.payload;

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
        fundCode: payload.payload.fundCode,
        campaignCode: payload.payload.campaignCode,
        campaignCodeId: res.data.response.id,
        initialInvestment: payload.initialInvestment,
        campaignCodeSalesCharge: res.data.response.campaignCodeSalesCharge,
      }),
    );
  } catch (err) {
    yield put(verifyCampaignCodeFailure(payload.payload.fundCode, err));
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(INTRODUCTION_SAVE, saveIntroductionSaga);
  yield takeLatest(FUNDS_GET, getFundsSaga);
  yield takeLatest(RISK_QUESTIONS_ANSWERS_GET, getRiskQuestionsSaga);
  yield takeLatest(RISK_SCORE_GET, getRiskScoreSaga);
  yield takeLatest(RISK_PROFILES_GET, getRiskProfilesSaga);
  yield takeLatest(FUNDS_ALL_GET, getAllFundsSaga);
  yield takeLatest(ANNUAL_INCOME_GET, getLOVDetailSaga);
  yield takeLatest(FILE_UPLOAD_DOC, fileUploadSaga);
  yield takeLatest(FILE_UPLOAD, imageUploadSaga);
  yield takeLatest(DOC_REUPLOAD, fileReUploadSaga);
  yield takeLatest(IMAGE_REMOVE, removeImageSaga);
  yield takeLatest(ORDER_CREATE, createOrderSaga);
  yield takeLatest(PAYMENT_DOCS_CREATE, createDocsPaymentSaga);
  yield takeLatest(AMLA_CHECK, checkAmlaSaga);
  yield takeLatest(INIT_ONBAORDING_CLIENT_CONFIRMATION_OTP, initOnboardingClientConfirmationOtp);
  yield takeLatest(ACCOUNT_CREATION_OTP_CORRECT, accountCreationOtpCorrectSaga);
  yield takeLatest(ACCOUNT_CREATION_OTP_INCORRECT, accountCreationOtpIncorrectSaga);
  yield takeLatest(CUSTOMER_GET, getCustomerSaga);
  yield takeLatest(ADD_PRODUCT_TO_PORTFOLIO, addProductPortfolioSaga);
  yield takeLatest(TRANSACTION_FILE_UPLOAD, transactionFileUploadSaga);
  yield takeLatest(PERSONAL_DETAILS_VALIDATE, validatePersonalDetailsSaga);
  yield takeLatest(POSTAL_CODE_VALIDATE, validatePostalCodeSaga);
  yield takeLatest(GET_ALL_FUNDS_WITH_FUND_DETAILS, getAllFundsWithFundDetailsSaga);
  yield takeLatest(CHECK_CIF, checkCifSaga);
  yield takeLatest(INIT_MULTI_AGENT_MAP_OTP, initMultiAgentMapOtp);
  yield takeLatest(MULTI_AGENT_MAP, multiAgentMap);
  yield takeLatest(SAVE_DRAFT, saveDraft);
  yield takeLatest(GET_DRAFT, getDraft);
  yield takeLatest(GET_DEFAULT_SALES_CHARGE_REQUEST, getDefaultSalesChargeSaga);
  yield takeLatest(VERIFY_CAMPAIGN_CODE_REQUEST, verifyCampaignCodeSaga);
}
