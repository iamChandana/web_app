// import { takeLatest, call, put, select } from 'redux-saga/effects';
// import isEmpty from 'lodash/isEmpty';
// import CalculateAge from 'utils/calculateAge';
// import {
//   INTRODUCTION_SAVE,
//   FUNDS_GET,
//   RISK_QUESTIONS_ANSWERS_GET,
//   RISK_SCORE_GET,
//   FILE_UPLOAD,
//   RISK_PROFILES_GET,
//   ACCOUNT_CREATE,
//   FUNDS_ALL_GET,
// } from './constants';
// import {
//   processing,
//   getFundsSuccess,
//   getRiskQuestionsAnswersSuccess,
//   saveRiskScore,
//   saveRiskProfiles,
//   getAllFundsSuccess,
// } from './actions';
// import {
//   makeSelectRiskProfile1,
//   makeSelectRiskProfile2,
//   makeSelectIntroduction,
//   makeSelectRiskScore,
//   makeSelectImage,
// } from './selectors';
// import { post, get, update } from '../../utils/api';

// function* getFundsSaga(action) {
//   const { payload } = action;
//   const skip = payload && payload.skip ? payload.skip : 0;
//   const searchInput = payload && payload.searchInput ? payload.searchInput : '';
//   const shariah = payload && payload.fundType ? 'Shariah-Compliant Funds' : '';
//   const riskProfileTypeFilter =
//     payload &&
//     payload.riskProfileType &&
//     payload.riskProfileType !== 'All' &&
//     encodeURIComponent(`{"riskProfileType": "${payload.riskProfileType}"}`);
//   let filter = `?limit=12&skip=${skip}`;
//   if (riskProfileTypeFilter) {
//     filter += `&PortfolioFilter=${riskProfileTypeFilter}`;
//   }
//   if (payload && payload.assetFilter && payload.assetFilter !== 'All') {
//     filter += `&fundAssetFilter=${encodeURIComponent(`{"class": "${payload.assetFilter}"}`)}`;
//   }
//   if (payload && payload.fundType && !payload.searchInput) {
//     filter += `&fundFilter=${encodeURIComponent('{"fundType": "Shariah-Compliant Funds"}')}`;
//   }
//   if (payload && payload.searchInput && !payload.fundType) {
//     filter += `&fundFilter=${encodeURIComponent(`{"name":{"like":"%${searchInput}%"}}`)}`;
//   }
//   if (payload && payload.fundType && payload.searchInput) {
//     filter += `&fundFilter=${encodeURIComponent(`{"fundType": "Shariah-Compliant Funds}", "name":{"like":"%${searchInput}%"}}`)}`;
//   }

//   // fundType: "Shariah-Compliant Funds"
//   const endpoint = `portfolio/api/ModelPortfolios/getAllModelPortfolioDetails${filter}`;
//   try {
//     yield put(processing(true));
//     const response = yield call(get, endpoint);
//     yield put(getFundsSuccess(response.data));
//   } catch (error) {
//   } finally {
//     yield put(processing(false));
//   }
// }

// function* getAllFundsSaga() {
//   try {
//     yield put(processing(true));
//     const response = yield call(get, 'portfolio/api/Funds');
//     yield put(getAllFundsSuccess(response.data));
//   } catch (error) {
//     // yield put(loginFail());
//   } finally {
//     yield put(processing(false));
//   }
// }

// function* saveIntroductionSaga(action) {
//   try {
//     yield put(processing(true));
//     const response = yield call(post, 'prospects', action.payload);
//   } catch (error) {
//     // yield put(loginFail());
//   } finally {
//     yield put(processing(false));
//   }
// }

// export function* getRiskQuestionsSaga() {
//   const questionsId = [1, 2]; // should be dynamic from console
//   const questionsApi = 'riskprofile/api/Answers/getAnswersByQuestions';
//   try {
//     yield put(processing(true));
//     const apiRes = yield call(post, questionsApi, questionsId);
//     const questionsAnswers = apiRes.data.response;
//     yield put(getRiskQuestionsAnswersSuccess(questionsAnswers));
//   } catch (err) {
//     yield put(processing(false));
//   }
// }

// export function* getRiskScoreSaga() {
//   const profile1 = yield select(makeSelectRiskProfile1());
//   const profile2 = yield select(makeSelectRiskProfile2());
//   const introData = yield select(makeSelectIntroduction());
//   const riskScoreApi = 'riskprofile/api/RiskScores/calculateRiskScore';
//   const { monthlySavings, dateOfBirth, annualIncome } = introData;
//   const payload = {
//     questionArray: [profile1.questionId, profile2.questionId],
//     answerArray: [profile1.id, profile2.id],
//     questionWeightArray: [0.5, 0.5],
//     netMonthlySavings: parseFloat(monthlySavings),
//     monthlyIncome: annualIncome / 12,
//     monthlyExpenses: 0,
//     initialInvestment: 0,
//     goalYear: 0,
//     age: CalculateAge(dateOfBirth),
//     incomeInvestmentWeight: 0.6,
//     ageWeight: 0.4,
//     goalWeight: 0,
//   };
//   try {
//     yield put(processing(true));
//     const apiRes = yield call(post, riskScoreApi, payload);
//     const riskScore = apiRes.data.Response;
//     yield put(saveRiskScore(riskScore));
//   } catch (err) {
//     // yield put(processing(false));
//     // trigger error that set handler to redirect directly to investment details
//   } finally {
//     yield put(processing(false));
//   }
// }

// export function* getRiskProfilesSaga() {
//   const riskProfileApi = 'riskprofile/api/RiskProfileToModelPortfolios';
//   try {
//     yield put(processing(true));
//     const apiRes = yield call(get, riskProfileApi);
//     const riskProfiles = apiRes.data;
//     yield put(saveRiskProfiles(riskProfiles));
//   } catch (err) {
//     // yield put(processing(false));
//     // trigger error that set handler to redirect directly to investment details
//   } finally {
//     yield put(processing(false));
//   }
// }
// function* upload(payload) {
//   const uploadApi = 'customer/api/Customers/uploadandwatermark';
//   let riskProfileData;
//   try {
//     const riskProfile = yield call(post, uploadApi, payload);
//     riskProfileData = riskProfile.data.Response;
//   } catch (err) {
//     // common error #todo
//   }
//   return riskProfileData;
// }

// export function* fileUploadSaga(payload) {
//   const { customerId, images } = payload;
//   const uploadApi = 'customer/api/Customers/uploadandwatermark';
//   try {
//     yield put(processing(true));

//     for (const i in images) {
//       if (images.hasOwnProperty(i)) {
//         const image = images[i];
//         const payload = {
//           base64img: image.base64img,
//           Customerdocs: {
//             CustomerId: customerId,
//             DocType: image.DocType,
//             Filename: image.Filename,
//           },
//         };
//         yield call(post, uploadApi, payload);
//       }
//     }

//     // const uploadRes = yield images.map((image) => {
//     //   const payload = {
//     //     base64img: image.base64img,
//     //     Customerdocs: {
//     //       CustomerId: action.response.Id.customerId,
//     //       DocType: image.DocType,
//     //       Filename: image.Filename,
//     //     },
//     //   };
//     //   return call(post, uploadAPI, payload);
//     // });

//     const apiRes = yield call(post, uploadAPI, action.payload);

//     const questionsAnswers = apiRes.data.response;
//     yield put(getRiskQuestionsAnswersSuccess(questionsAnswers));
//   } catch (err) {
//     yield put(processing(false));
//     // trigger error that set handler to redirect directly to investment details
//   }
// }

// export function* createAccountSaga(action) {
//   const { payload } = action;
//   const introData = yield select(makeSelectIntroduction());
//   const {
//     fullName,
//     nationality,
//     birthDate,
//     addressline1,
//     bankName,
//     bankAcctNumber,
//     iban,
//     swift_bic_code,
//     branchCode,
//     addressline2,
//     state,
//     country,
//     addresstype,
//     companyName,
//     natureofbusiness,
//     occupationType,
//     yearlyIncome,
//     postalCode,
//     sourceoffunds,
//     purposeofinvestment,
//     interests,
//   } = payload;
//   const firstName = fullName.split(' ')[0];
//   const lastName = fullName.split(' ')[1];
//   const requestPayload = {
//     ID: {
//       identificationType: 'NewIC',
//       identificationNumber: '8680898723',
//     },
//     firstName,
//     lastName,
//     nationality,
//     gender: introData.gender,
//     maritalStatus: 'M',
//     birthDate,
//     age: CalculateAge(birthDate),
//     interests,
//     sourceoffunds,
//     purposeofinvestment,
//     bank: {
//       bankName,
//       bankAcctNumber,
//       iban,
//       swift_bic_code,
//       branchCode,
//     },
//     address: {
//       addressline1,
//       addressline2,
//       postalCode,
//       state,
//       country,
//       addresstype,
//     },
//     Occupation: {
//       companyName,
//       natureofbusiness,
//       occupationType,
//       yearlyIncome,
//     },
//   };
//   const createAccountApi = 'customer/api/Customers/customerSignUp';
//   const images = yield select(makeSelectImage());
//   try {
//     yield put(processing(true));
//     const apiRes = yield call(post, createAccountApi, requestPayload);
//     // const uploadRes = yield images.map((image) =>
//     //   call(fileUploadSaga, { customerId: apiRes.data.response.ID.customerId, image })
//     // );
//     yield call(fileUploadSaga, { customerId: apiRes.data.response.ID.customerId, images });
//   } catch (err) {
//   } finally {
//     yield put(processing(false));
//   }
// }

// // Individual exports for testing
// export default function* defaultSaga() {
//   yield takeLatest(INTRODUCTION_SAVE, saveIntroductionSaga);
//   yield takeLatest(FUNDS_GET, getFundsSaga);
//   yield takeLatest(RISK_QUESTIONS_ANSWERS_GET, getRiskQuestionsSaga);
//   yield takeLatest(RISK_SCORE_GET, getRiskScoreSaga);
//   yield takeLatest(RISK_PROFILES_GET, getRiskProfilesSaga);
//   yield takeLatest(ACCOUNT_CREATE, createAccountSaga);
//   yield takeLatest(FUNDS_ALL_GET, getAllFundsSaga);
// }
