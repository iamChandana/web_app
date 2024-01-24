/**
 *
 * LoginBox
 *
 */
/* eslint-disable */
import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Parser from 'html-react-parser';
import { withRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import LoadingIndicator from 'components/LoadingIndicator';
import { validatePasswordSchema } from 'components/FormUtility/FormValidators';
import OTP from 'components/OtpBox';

import Modal from 'components/Modal';
import TermContent from 'utils/TermsContent/firstTimeLogin';
import CheckIcon from './images/check-success.svg';

import {
  selectProcessing,
  selectAuthenticated,
  selectError,
  selectUserInfo,
  selectMode,
  selectPrevMode,
  selectTokenUserId,
  selectTokenVerified,
  selectPasswordResetted,
  selectShowOtpModal,
  selectErrorOtp,
  selectShowFirstTimeLoginOtpModal,
  selectFirstTimeLoginSuccessTokenFromExecAfterOtp,
  selectUserInfoForResetPassword,
  selectMessage,
} from '../selectors';
import {
  login,
  checkUserId,
  verifyUserId,
  postOTP,
  postSecrets,
  acceptAgreement,
  setMode,
  recoverUserId,
  initResetPassword,
  resetPassword,
  verifyResetToken,
  executeResetToken,
  closeOtpModal,
  initFirstTimeLoginOtp,
  openFirstTimeLoginOtpModal,
} from '../actions';

import Container from './Container';
import InputUserId from './InputUserId';
import InputPassword from './InputPassword';
import PasswordRecovery from './PasswordRecovery';
import Confirm from './Confirmation';
import UserVerify from './UserVerify';
import SecretImageWord from './SecretImageWord';
import RecoveryConfirm from './RecoveryConfirm';
import AgreementBtn from './AgreementBtn';
import ResetPassword from './ResetPassword';
import ResetConfirmStep from './ResetConfirmStep';
import ChangePassword from './ChangePassword';
import ResetPasswordConfirm from './ResetPasswordConfirm';
import PasswordResetted from './PasswordResetted';
import InvalidTokenForm from './InvalidTokenForm';
import Lockout from './Lockout';

import { PaperForm } from './Atoms';

import { PASSWORD_REGEX } from 'containers/LoginPage/constants';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      openAgreementModal: false,
      password: '',
      imageId: '',
      secretWord: '',
      selectedImageName: '',
      selectedImage: null,
      openSnackbar: false,
      fromLogin: false,
      nric: '',
      newPassword: '',
      confirmPassword: '',
      passwordValid: false,
      changePasswordError: '',
    };

    // login/change-password?t=

    this.handleClose = this.handleClose.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.proceed = this.proceed.bind(this);
    this.resend = this.resend.bind(this);
    this.callSetMode = this.callSetMode.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.handleCloseOtp = this.handleCloseOtp.bind(this);
    this.handleCloseModalFirstTimeLoginOtp = this.handleCloseModalFirstTimeLoginOtp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userInfo !== nextProps.userInfo) {
      if (nextProps.userInfo && nextProps.userInfo.agent && nextProps.userInfo.agent.isFirstTime && nextProps.mode === 'login') {
        this.setState({
          openAgreementModal: true,
        });
      } else if (this.props.mode === 'login' && nextProps.mode === 'secrets') {
        this.setState({
          fromLogin: true,
        });
      } else if (this.props.mode === 'login' && nextProps.userInfo && nextProps.userInfo.agent) {
        this.setState({
          fromLogin: true,
        });
        this.callSetMode('password');
      } else if (nextProps.prevMode === 'resetConfirm' && nextProps.mode !== 'resetEmailSend' && nextProps.mode !== 'login') {
        this.callSetMode('resetConfirm');
      }
    }
    if (this.props.tokenVerified !== nextProps.tokenVerified && !nextProps.tokenVerified) {
      this.props.history.push('/login');
    }
  }

  getRuleMessage(validation) {
    const { characterRule, numberRule, uppercaseRule } = validation;
    return `<span className=${characterRule ? 'success' : 'fail'}>${
      characterRule ? `<img src=${CheckIcon} />` : ''
    }Minimum 8 characters</span><br/><span className=${uppercaseRule ? 'success' : 'fail'}>${
      uppercaseRule ? `<img src=${CheckIcon} />` : ''
    }A capital letter</span><br/><span className=${numberRule ? 'success' : 'fail'}>${
      numberRule ? `<img src=${CheckIcon} />` : ''
    }A number</span><br/>`;
  }

  getFormInput() {
    const { userId, nric, newPassword, confirmPassword } = this.state;
    const { processing, userInfo, setMode, password, error, prevMode } = this.props;

    if (error === 'LOCKOUT') {
      return (
        <PaperForm>
          <Lockout proceed={this.callSetMode} />
        </PaperForm>
      );
    }

    switch (this.props.mode) {
      case 'verify':
        return (
          <PaperForm>
            <UserVerify proceed={this.proceed} userInfo={userInfo} processing={processing} />
          </PaperForm>
        );
      case 'otp':
        break;
      /*
        return <OTP
          handleInputChange={this.handleInputChange}
          handleCloseOtp={this.handleCloseOtp}
          proceed={this.proceed}
          processing={processing}
          openDialog={this.state.openOtpModal} />; */
      case 'secrets':
        return (
          <PaperForm>
            <SecretImageWord
              handleInputChange={this.handleInputChange}
              selected={this.state.selectedImage}
              select={this.selectImage}
              proceed={this.proceed}
              processing={processing}
              userInfo={userInfo}
              secretWord={this.state.secretWord}
            />
          </PaperForm>
        );
      case 'password':
        // for 1st time login, the back link is hide under the button so need to shrink the height of the component for now till we able to find so better solution
        let paperHeight = '300px';
        if (prevMode === 'login') {
          paperHeight = null;
        }
        return (
          <PaperForm minHeightPaper={paperHeight}>
            <InputPassword
              handleInputChange={this.handleInputChange}
              proceed={this.proceed}
              processing={processing}
              setMode={this.callSetMode}
              userInfo={userInfo}
              error={error}
              password={this.state.password}
              fromLogin={this.state.fromLogin}
              prevMode={prevMode}
              message={this.props.message}
            />
          </PaperForm>
        );
      case 'confirm':
        return (
          <PaperForm>
            <Confirm proceed={this.callSetMode} userInfo={userInfo} />
          </PaperForm>
        );
      case 'recovery':
        return (
          <PaperForm>
            <PasswordRecovery
              handleInputChange={this.handleInputChange}
              proceed={this.proceed}
              processing={processing}
              setMode={setMode}
              nric={nric}
              error={error}
            />
          </PaperForm>
        );
      case 'recoveryConfirm':
        return (
          <PaperForm>
            <RecoveryConfirm proceed={this.callSetMode} userInfo={userInfo} />
          </PaperForm>
        );
      case 'reset':
        return (
          <PaperForm>
            <ResetPassword
              handleInputChange={this.handleInputChange}
              proceed={this.proceed}
              setMode={setMode}
              userId={userId}
              error={error}
              processing={processing}
            />
          </PaperForm>
        );
      case 'resetConfirm':
        return (
          <PaperForm>
            <ResetConfirmStep
              userInfo={this.props.userInfoForResetPassword}
              proceed={this.proceed}
              processing={processing}
              prevMode={prevMode}
              setMode={this.callSetMode}
            />
          </PaperForm>
        );
      case 'changePassword':
        if (this.props.tokenVerified && !processing) {
          return (
            <PaperForm>
              <ChangePassword
                handleInputChange={this.handleInputChange}
                proceed={this.proceed}
                processing={processing}
                error={this.state.changePasswordError}
                message={this.props.message}
                userId={this.props.userId}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
              />
            </PaperForm>
          );
        }
        if (!this.props.tokenVerified && !processing) {
          return (
            <PaperForm>
              <InvalidTokenForm proceed={this.callSetMode} />
            </PaperForm>
          );
        }
        return <LoadingIndicator />;
      case 'resetEmailSend':
        return (
          <PaperForm>
            <ResetPasswordConfirm proceed={this.callSetMode} />
          </PaperForm>
        );
      case 'passwordResetted':
        return (
          <PaperForm>
            <PasswordResetted proceed={this.callSetMode} />
          </PaperForm>
        );
      case 'initFirstTimeLoginOtp':
        return (
          <OTP
            handleInputChange={this.handleInputChange}
            handleClose={this.handleCloseModalFirstTimeLoginOtp}
            processing
            openModal={!this.props.showFirstTimeLoginOtpModal ? false : this.props.showFirstTimeLoginOtpModal}
            url={this.props.userInfo.otpParams ? this.props.userInfo.otpParams : null}
            error={this.props.errorOtp}
          />
        );

      default:
        return (
          <PaperForm>
            <InputUserId
              setMode={setMode}
              error={error}
              processing={processing}
              userId={userId}
              handleInputChange={this.handleInputChange}
              proceed={this.proceed}
            />
          </PaperForm>
        );
    }
  }

  callSetMode(mode) {
    if (mode === 'login') {
      this.props.history.replace('/login');
    }
    this.props.setMode(mode);
  }
  selectImage(data) {
    const { id, imagename } = data;
    this.setState({
      selectedImage: id,
      selectedImageName: imagename,
    });
  }
  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleClose() {
    this.setState({
      openAgreementModal: false,
    });
  }

  handleAccept() {
    this.props.acceptAgreement();
    this.setState({
      openAgreementModal: false,
    });
  }

  handleCloseOtp() {
    this.props.closeOtpModal();
    this.props.setMode('reset');
  }

  handleCloseModalFirstTimeLoginOtp() {
    this.callSetMode('verify');
    this.props.openFirstTimeLoginOtpModal(false);
  }

  renderResetPasswordOtpDialog() {
    const { userInfo } = this.props;

    return (
      <OTP
        handleInputChange={this.handleInputChange}
        handleClose={this.handleCloseOtp}
        proceed={this.proceed}
        processing
        openModal={!this.props.showOtpModal ? false : this.props.showOtpModal}
        url={userInfo.otpParams ? userInfo.otpParams.otpiFrameUrl : null}
        error={this.props.errorOtp}
      />
    );
  }

  renderFirstTimeLoginOtpDialog() {
    const { userInfo } = this.props;

    return (
      <OTP
        handleInputChange={this.handleInputChange}
        handleClose={this.handleCloseOtp}
        proceed={this.proceed}
        processing
        openModal={!this.props.showFirstTimeLoginOtpModal ? false : this.props.showFirstTimeLoginOtpModal}
        url={userInfo.otpParams ? userInfo.otpParams.otpiFrameUrl : null}
        error={this.props.errorOtp}
      />
    );
  }

  proceed(e) {
    e.preventDefault();
    const {
      userInfo: { agent = '' },
      mode,
      firstTimeLoginSuccessTokenFromExecAfterOtp,
    } = this.props || {};
    const { userId, selectedImage, secretWord, password, nric } = this.state;
    switch (mode) {
      case 'verify':
        this.props.verifyUserId(userId);
        this.props.initFirstTimeLoginOtp(userId);
        this.callSetMode('initFirstTimeLoginOtp');
        break;
      case 'otp':
        // this.props.postOTP();
        break;
      case 'recovery':
        this.props.recoverUserId(nric);
        break;
      case 'secrets':
        if (firstTimeLoginSuccessTokenFromExecAfterOtp) {
          this.props.postSecrets({ userId: firstTimeLoginSuccessTokenFromExecAfterOtp, simgid: selectedImage, sw: secretWord });
        } else {
          this.props.postSecrets({ userId: agent ? agent.username : null, simgid: selectedImage, sw: secretWord });
        }
        break;
      case 'password':
        ReactGA.event({
          category: 'User',
          action: 'Proceed',
        });
        this.props.login({ username: agent ? agent.username : null, password });
        break;
      case 'reset':
        this.props.initResetPassword(userId);
        // after successfully
        break;
      case 'resetConfirm':
        //this.props.resetPassword(userId);
        this.callSetMode('resetEmailSend');
        break;
      case 'resetEmailSend':
        this.props.resetPassword(this.props.userInfoForResetPassword.agent.username);
        break;
      case 'changePassword':
        const payload = {
          userId: this.props.userId,
          password: this.state.newPassword,
        };
        if (this.state.newPassword !== this.state.confirmPassword) {
          this.setState({
            changePasswordError: 'Password mismatch.',
          });
          break;
        }
        const newPasswordValid = PASSWORD_REGEX.test(this.state.newPassword);
        const confirmPasswordValid = PASSWORD_REGEX.test(this.state.confirmPassword);
        const validation = validatePasswordSchema(this.state.confirmPassword);
        if (!newPasswordValid || !confirmPasswordValid) {
          this.setState({
            changePasswordError: this.getRuleMessage(validation),
          });
          break;
        } else {
          this.props.executeResetToken(payload);
          break;
        }
      default:
        this.props.checkUserId(userId);
    }
  }

  resend() {
    this.props.verifyUserId(this.state.userId);
  }

  render() {
    return (
      <React.Fragment>
        <Modal open={this.state.openAgreementModal} handleClose={this.handleClose} title={'Terms and Conditions'}>
          {Parser(TermContent)}
          <AgreementBtn handleClose={this.handleClose} handleAccept={this.handleAccept} />
        </Modal>
        {this.renderResetPasswordOtpDialog()}
        {this.getFormInput()}
      </React.Fragment>
    );
  }
}

LoginForm.propTypes = {
  processing: PropTypes.bool,
  error: PropTypes.string,
  userInfo: PropTypes.object,
  login: PropTypes.func,
  checkUserId: PropTypes.func,
  verifyUserId: PropTypes.func,
  postOTP: PropTypes.func,
  postSecrets: PropTypes.func,
  mode: PropTypes.string,
  acceptAgreement: PropTypes.func,
  recoverUserId: PropTypes.func,
  setMode: PropTypes.func,
  prevMode: PropTypes.string,
  initResetPassword: PropTypes.func,
  resetPassword: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  processing: selectProcessing(),
  isAuthenticated: selectAuthenticated(),
  error: selectError(),
  userInfo: selectUserInfo(),
  mode: selectMode(),
  prevMode: selectPrevMode(),
  selectError: selectError(),
  tokenVerified: selectTokenVerified(),
  userId: selectTokenUserId(),
  passwordResetted: selectPasswordResetted(),
  showOtpModal: selectShowOtpModal(),
  errorOtp: selectErrorOtp(),
  showFirstTimeLoginOtpModal: selectShowFirstTimeLoginOtpModal(),
  firstTimeLoginSuccessTokenFromExecAfterOtp: selectFirstTimeLoginSuccessTokenFromExecAfterOtp(),
  userInfoForResetPassword: selectUserInfoForResetPassword(),
  message: selectMessage(),
});

function mapDispatchToProps(dispatch) {
  return {
    login: (payload) => dispatch(login(payload)),
    checkUserId: (payload) => dispatch(checkUserId(payload)),
    verifyUserId: (payload) => dispatch(verifyUserId(payload)),
    postOTP: (payload) => dispatch(postOTP(payload)),
    postSecrets: (payload) => dispatch(postSecrets(payload)),
    acceptAgreement: () => dispatch(acceptAgreement()),
    setMode: (payload) => dispatch(setMode(payload)),
    recoverUserId: (payload) => dispatch(recoverUserId(payload)),
    initResetPassword: (payload) => dispatch(initResetPassword(payload)),
    resetPassword: (payload) => dispatch(resetPassword(payload)),
    verifyResetToken: (payload) => dispatch(verifyResetToken(payload)),
    executeResetToken: (payload) => dispatch(executeResetToken(payload)),
    closeOtpModal: () => dispatch(closeOtpModal()),
    initFirstTimeLoginOtp: (payload) => dispatch(initFirstTimeLoginOtp(payload)),
    openFirstTimeLoginOtpModal: (payload) => dispatch(openFirstTimeLoginOtpModal(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect)(LoginForm);
