import { createSelector } from 'reselect';
import { getItem } from 'utils/tokenStore';

/**
 * Direct selector to the login state domain
 */
const login = (state) => state.login;

/**
 * Other specific selectors
 */

const selectProcessing = () =>
  createSelector(
    login,
    (loginState) => loginState.processing,
  );
const selectAuthenticated = () =>
  createSelector(
    login,
    (loginState) => {
      if (getItem('access_token') && loginState.authenticated) {
        return true;
      }
      return false;
    },
  );
const selectUserInfo = () =>
  createSelector(
    login,
    (loginState) => loginState.userInfo,
  );
const selectError = () =>
  createSelector(
    login,
    (loginState) => loginState.error,
  );
const selectMode = () =>
  createSelector(
    login,
    (loginState) => loginState.mode,
  );
const selectPrevMode = () =>
  createSelector(
    login,
    (loginState) => loginState.prevMode,
  );
const selectResetToken = () =>
  createSelector(
    login,
    (loginState) => loginState.resetToken,
  );
const selectOTPParams = () =>
  createSelector(
    login,
    (loginState) => loginState.userInfo.otpParams,
  );
const selectTokenVerified = () =>
  createSelector(
    login,
    (loginState) => loginState.tokenVerified,
  );
const selectTokenUserId = () =>
  createSelector(
    login,
    (loginState) => loginState.userId,
  );
const selectPasswordResetted = () =>
  createSelector(
    login,
    (loginState) => loginState.passwordResetted,
  );
const selectShowOtpModal = () =>
  createSelector(
    login,
    (loginState) => loginState.showOtpModal,
  );
const selectOtpiFrameUrl = () =>
  createSelector(
    login,
    (loginState) => loginState.otpiFrameUrl,
  );
const selectErrorOtp = () =>
  createSelector(
    login,
    (loginState) => loginState.errorOtp,
  );
const selectShowFirstTimeLoginOtpModal = () =>
  createSelector(
    login,
    (loginState) => loginState.showFirstTimeLoginOtpModal,
  );
const selectFirstTimeLoginSuccessTokenFromExecAfterOtp = () =>
  createSelector(
    login,
    (loginState) => loginState.firstTimeLoginSuccessTokenFromExecAfterOtp,
  );
const selectIsUsernameAndPasswordVerified = () =>
  createSelector(
    login,
    (loginState) => loginState.isUsernameAndPasswordVerified,
  );
const selectNewPassword = () =>
  createSelector(
    login,
    (loginState) => loginState.newPassword,
  );
const selectNews = () =>
  createSelector(
    login,
    (loginState) => loginState.news,
  );
const selectChangePasswordStep = () =>
  createSelector(
    login,
    (loginState) => loginState.changePasswordStep,
  );
const selectUserInfoForResetPassword = () =>
  createSelector(
    login,
    (loginState) => loginState.userInfoForResetPassword,
  );
const selectIsPasswordChangedSuccess = () =>
  createSelector(
    login,
    (loginState) => loginState.isPasswordChangedSuccess,
  );
const selectMessage = () =>
  createSelector(
    login,
    (loginState) => loginState.message,
  );
const selectChangePasswordModelOpen = () =>
  createSelector(
    login,
    (loginState) => loginState.changePasswordModelOpen,
  );

export {
  selectProcessing,
  selectAuthenticated,
  selectUserInfo,
  selectError,
  selectMode,
  selectPrevMode,
  selectResetToken,
  selectOTPParams,
  selectTokenVerified,
  selectTokenUserId,
  selectPasswordResetted,
  selectShowOtpModal,
  selectOtpiFrameUrl,
  selectErrorOtp,
  selectShowFirstTimeLoginOtpModal,
  selectFirstTimeLoginSuccessTokenFromExecAfterOtp,
  selectIsUsernameAndPasswordVerified,
  selectNewPassword,
  selectNews,
  selectChangePasswordStep,
  selectUserInfoForResetPassword,
  selectIsPasswordChangedSuccess,
  selectMessage,
  selectChangePasswordModelOpen,
};
