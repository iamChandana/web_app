import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Radio from 'material-ui/Radio';
import _isEmpty from 'lodash/isEmpty';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import LoadingOverlay from 'components/LoadingOverlay';
import OtpBox from 'components/OtpBox';
import Button from 'components/Button';
import Text from 'components/Text';
import { reset as ResetForm } from 'redux-form';
import Color from 'utils/StylesHelper/color';
import { RowGridCenter, RowGridLeft } from 'components/GridContainer';
import SophisticatedDisclaimer from 'components/SophisticatedUsersDeclartion';
import PersonalDetailsFields from 'components/FormUtility/PersonalDetailsFields';
import {
  makeSelectPersonalDetails,
  makeSelectAnnualIncomeLOV,
  makeSelectAccount,
  makeSelectProcessing,
  makeSelectShowOnBoardingClientConfirmationOtpModal,
  makeSelectOTPSrcAccountCreation,
  makeSelectValidatedDetails,
  makeSelectSelectedFunds,
  makeSelectValidateErrorDetails,
} from 'containers/OnBoarding/selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import {
  setTitle,
  setStep,
  createAccount,
  resetAmla,
  openOnBoardingClientConfirmationOtpModal,
  initOnBoardingClientConfirmationOtp,
  accountCreationOtpCorrect,
  accountCreationOtpIncorrect,
  savePersonalDetails,
  validatePersonalDetails,
  resetOtp,
} from 'containers/OnBoarding/actions';
import {
  clearPaymentStatus,
  resendConfirmationEmail,
  clearStateOfConfirmationEmailResent,
} from 'containers/ClientDetails/actions';
import AmlaWarningModal from 'components/AmlaWarning';
import { rejectBackButton } from 'utils/helpers';
import Disclaimer from './Disclaimer';
import ConfirmModal from './Modal';
import Dialog from 'components/Dialog';
import defaultFont from 'utils/StylesHelper/font';
import { makeSelectMessageResentConfirmationEmailStatus } from 'containers/ClientDetails/selectors';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyledButton = styled(Button)`
  margin: 40px 4px;
`;

const StyledCheckbox = styled(Checkbox)`
  width: 20px !important;
  height: 20px !important;
  margin-right: 16px !important;
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;
const AgreementWrapper = styled.div`
  height: ${(props) => props.heightAgreementWrapper};
  width: 100%;
  background-color: rgba(0, 145, 218, 0.05);
  padding-top: 20px;
  .details {
    max-width: 600px;
  }
  &.verified {
    background-color: rgba(0, 145, 218, 0.08);
  }
`;

const RadioContainer = styled(RowGridCenter)`
  padding: 32px 0 44px;
`;

const PublicPositionText = styled(Text)`
  margin-right: 32px;
`;

const DisclaimerText = styled.span`
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: ${Color.C_LIGHT_BLUE};
  text-decoration: underline;
  cursor: pointer;
`;

const DisclaimerContainer = styled.div`
  width: 100%;
  max-width: 594px;
  margin: 0 auto;
`;

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${(props) => props.btnBgColor};
  border: 1px solid ${Color.C_LIGHT_BLUE};
  margin-top: 32px;
  color: ${(props) => props.btnFontColor};
  font-family: ${defaultFont.primary.name};
  outline: none;
`;

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personalDetails: props.validatedDetails,
      acknowledge: false,
      publicPosition: props.validatedDetails ? props.validatedDetails.holdPositionFlag : undefined,
      verified: false,
      showConfirmModal: false,
      showAmlaError: false,
      SIWFPresence: false,
      showDisclaimerModal: false,
      acknowledgeSIWF: false,
      amlaError: { name: '', error: '' },
      natureOfBusiness: '',
      showTermOfUseModal: false,
      isOpenDialogConfirmEmailResent: false,
      openDialogConfirmEmail: false,
      isResendingConfirmationEmail: false,
      isOpenOtpModel: false,
    };

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.setAcknowledge = this.setAcknowledge.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.backToCurrentPageClick = this.backToCurrentPageClick.bind(this);
    this.setVerified = this.setVerified.bind(this);
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
    this.continue = this.continue.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.onChangeSIWFAck = this.onChangeSIWFAck.bind(this);
    this.agreeTerms = this.agreeTerms.bind(this);
    this.disagreeTerms = this.disagreeTerms.bind(this);
    this.handleCloseDisclaimerModal = this.handleCloseDisclaimerModal.bind(this);
    this.onClickDisclaimer = this.onClickDisclaimer.bind(this);
    this.onClickTermOfUse = this.onClickTermOfUse.bind(this);
    this.handleCloseTermOfUseModal = this.handleCloseTermOfUseModal.bind(this);
    this.handleCloseDialogConfirmEmailResent = this.handleCloseDialogConfirmEmailResent.bind(this);
    this.handleCloseDialogConfirmEmail = this.handleCloseDialogConfirmEmail.bind(this);
    this.handleDialogConfirmEmail = this.handleDialogConfirmEmail.bind(this);
    this.resendEmail = this.resendEmail.bind(this);
    this.wholeSaleDisclaimerVerified = this.wholeSaleDisclaimerVerified.bind(this);
  }

  toastId = null;

  notify = (message) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  componentWillMount() {
    rejectBackButton();
    // always close modal by default
    this.props.openOnBoardingClientConfirmationOtpModal(false);
    this.props.resetOtp();
    if (!this.props.location || !this.props.location.search) {
      return;
    }
    if (this.props.location.pathname.indexOf('/onboarding/confirmation/otpy') !== -1) {
      const otparams = this.props.location.search.split('=')[1];
      this.props.accountCreationOtpCorrect(otparams);
    }
    if (this.props.location.pathname.indexOf('/onboarding/confirmation/otpn') !== -1) {
      const otparams = this.props.location.search.split('=')[1];
      this.props.accountCreationOtpIncorrect(otparams);
    }

    this.props.resetAmla();
    this.props.setStep(6);
    this.props.setTitle('We’re almost there! Please confirm your personal details.');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.account !== nextProps.account) {
      this.setState({
        showConfirmModal: true,
      });
      this.props.clearPaymentStatus();
    }
    if (this.props.validationErrorDetails !== nextProps.validationErrorDetails) {
      if (nextProps.validationErrorDetails.error !== undefined) {
        this.setState({
          showAmlaError: true,
          amlaError: {
            error: nextProps.validationErrorDetails.error,
          },
        });
      }
      this.props.resetAmla();
    }
    if (nextProps.messageResentConfirmationEmailStatus === 'SUCCESS') {
      this.setState(() => ({
        isOpenDialogResentEmail: true,
        isResendingConfirmationEmail: false,
      }));
      setTimeout(() => {
        this.props.clearStateOfConfirmationEmailResent();
      }, 2000);
    }
    if (nextProps.messageResentConfirmationEmailStatus && nextProps.messageResentConfirmationEmailStatus !== 'SUCCESS') {
      this.setState(() => ({
        isOpenDialogResentEmail: true,
        isResendingConfirmationEmail: false,
        errorMessageInResendingConfirmationEmail: nextProps.messageResentConfirmationEmailStatus,
      }));
      setTimeout(() => {
        this.props.clearStateOfConfirmationEmailResent();
      }, 2000);
    }

    if (!this.props.showOnBoardingClientConfirmationOtpModal && nextProps.showOnBoardingClientConfirmationOtpModal) {
      this.setState({
        isOpenOtpModel: true,
      });
    }
  }

  componentDidMount() {
    this.props.selectedFunds.map((item) => {
      if (item.sophisticatedInvestor) {
        this.setState({ SIWFPresence: true });
      }
    });
  }

  handleChange = (event) => {
    if (event.target.value === 'Y') {
      this.setState({
        natureOfBusiness: '-20',
        publicPosition: event.target.value,
      });
    } else if (event.target.value === 'N') {
      this.setState({
        natureOfBusiness: '0',
        publicPosition: event.target.value,
      });
    }
  };

  backToCurrentPageClick() {
    this.setState({ showAmlaError: false });
    this.props.history.push('/onboarding/personal-details');
  }

  continue() {
    this.props.history.replace('/onboarding/transfer-funds');
  }

  next() {
    if (this.state.natureOfBusiness === '-20') {
      this.setState({ showAmlaError: true });
    } else {
      /*
      this.props.initOnBoardingClientConfirmationOtp({
        PPOC: this.state.publicPosition,
        details: this.state.personalDetails,
      });
      */
      this.setState((prevState) => ({
        openDialogConfirmEmail: true,
      }));
    }
    // this.props.createAccount(this.state.personalDetails);
  }

  back() {
    this.props.history.replace('/onboarding/personal-details');
  }

  setAcknowledge() {
    this.setState((prevState) => ({
      acknowledge: !prevState.acknowledge,
    }));
  }

  onClickDisclaimer() {
    this.setState({
      showDisclaimerModal: true,
    });
  }

  onClickTermOfUse() {
    this.setState({
      showTermOfUseModal: true,
    });
  }

  setVerified() {
    this.setState((prevState) => ({
      verified: !prevState.verified,
    }));
  }

  wholeSaleDisclaimerVerified() {
    this.setState((prevState) => ({
      wholeSaleDisclaimerVerified: !prevState.wholeSaleDisclaimerVerified,
    }));
  }

  handleCloseOtpModal() {
    this.setState({
      isOpenOtpModel: false,
    });
    this.props.resetOtp();
  }

  navigateTo(url) {
    if (url === 'home') {
      this.setState({
        showAmlaError: false,
      });
    } else {
      // reset form data
      this.props.formReset();
      this.props.history.push(url);
    }
  }
  // Disclaimer Modal Starts Here
  agreeTerms() {
    this.setState({
      showDisclaimerModal: false,
      acknowledge: true,
    });
  }

  disagreeTerms() {
    this.setState({
      showDisclaimerModal: false,
      acknowledge: false,
    });
  }

  onChangeSIWFAck() {
    this.setState((prevState) => ({
      acknowledgeSIWF: !prevState.acknowledgeSIWF,
    }));
  }

  handleCloseDisclaimerModal() {
    this.setState({
      showDisclaimerModal: false,
      acknowledge: false,
    });
  }

  handleCloseTermOfUseModal() {
    this.setState({
      showTermOfUseModal: false,
      acknowledge: false,
    });
  }

  handleCloseDialogConfirmEmailResent() {
    this.setState({
      isOpenDialogResentEmail: false,
    });
  }

  handleCloseDialogConfirmEmail() {
    this.setState((prevState) => ({
      openDialogConfirmEmail: !prevState.openDialogConfirmEmail,
    }));
  }

  handleDialogConfirmEmail() {
    this.setState((prevState) => ({
      openDialogConfirmEmail: !prevState.openDialogConfirmEmail,
    }));
    this.props.initOnBoardingClientConfirmationOtp({
      PPOC: this.state.publicPosition,
      details: this.state.personalDetails,
    });
  }

  resendEmail() {
    this.setState(
      {
        isResendingConfirmationEmail: true,
      },
      () => {
        if (this.props.account && this.props.account.Account) {
          this.props.resendConfirmationEmail(this.props.account.Account.customerId);
        } else {
          this.notify('Customer account information is unavailable!');
        }
      },
    );
  }

  checkForSophisticatedFund() {
    const { selectedFunds } = this.props;
    return selectedFunds.filter((fund) => fund.fundSubType === 'W').length > 0;
  }

  render() {
    if (_isEmpty(this.props.lov)) {
      return <LoadingOverlay show />;
    }
    const { personalDetails } = this.props;
    const { publicPosition, acknowledge, verified, wholeSaleDisclaimerVerified } = this.state;
    return (
      <React.Fragment>
        <ConfirmModal
          isOpen={this.state.showConfirmModal}
          continue={this.continue}
          resendConfirmationEmail={this.resendEmail}
          isResendingConfirmationEmail={this.state.isResendingConfirmationEmail}
          accountType={personalDetails.AccountType}
        />
        <AmlaWarningModal
          isOpen={this.state.showAmlaError}
          navigateTo={this.navigateTo}
          data={this.state.amlaError}
          fromPage={'Personal Details'}
          backButtonClick={() => this.backToCurrentPageClick()}
        />
        <OtpBox
          handleClose={this.handleCloseOtpModal}
          openModal={this.state.isOpenOtpModel}
          url={this.props.otpSrc ? this.props.otpSrc.otpiFrameUrl : null}
          error={this.props.errorOtp}
        />
        <LoadingOverlay show={this.props.processing} />
        <PersonalDetailsFields
          edit
          initialValues={this.props.personalDetails}
          uploadType={this.props.personalDetails.uploadType}
          lov={this.props.lov}
        />
        <DisclaimerContainer>
          <RadioContainer>
            <Grid item xs={8}>
              <PublicPositionText size="14px" lineHeight="1.43" color="#000" align="left">
                Do you hold any (or are related to such persons) Public or Political Office, including committee/council
                positions?
              </PublicPositionText>
            </Grid>
            <Grid item xs={2}>
              <StyledRadioButton
                checked={publicPosition === 'Y'}
                onChange={this.handleChange}
                value="Y"
                control={<Radio />}
                label="Yes"
              />
            </Grid>
            <Grid item xs={2}>
              <StyledRadioButton
                checked={publicPosition === 'N'}
                onChange={this.handleChange}
                value="N"
                control={<Radio />}
                label="No"
              />
            </Grid>
          </RadioContainer>
        </DisclaimerContainer>
        <AgreementWrapper heightAgreementWrapper="275px">
          <DisclaimerContainer>
            <Disclaimer
              SIWFPresence={this.state.SIWFPresence}
              acknowledge={this.state.acknowledge}
              acknowledgeSIWF={this.state.acknowledgeSIWF}
              onChange={this.setAcknowledge}
              agreeTerms={this.agreeTerms}
              disagreeTerms={this.disagreeTerms}
              showDisclaimerModal={this.state.showDisclaimerModal}
              onChangeSIWFAck={this.onChangeSIWFAck}
              handleClose={this.handleCloseDisclaimerModal}
              onClickDisclaimer={this.onClickDisclaimer}
              onClickTermOfUse={this.onClickTermOfUse}
              handleCloseTermOfUseModal={this.handleCloseTermOfUseModal}
              showTermOfUseModal={this.state.showTermOfUseModal}
            />
          </DisclaimerContainer>
        </AgreementWrapper>
        <AgreementWrapper className="verified" heightAgreementWrapper="110px">
          <DisclaimerContainer>
            <RowGridLeft>
              <Grid item style={{ height: '225px', position: 'relative', verticalAlign: 'top' }}>
                <StyledCheckbox checked={verified} onChange={this.setVerified} value="true" />
              </Grid>
              <Grid item style={{ position: 'relative', width: '550px' }}>
                <Text size="10px" weight="bold" lineHeight="1.6" color="#000" opacity="0.4" align="left">
                  Unit Trust Scheme Consultant (“Consultant”) Declaration;
                </Text>
                <Text size="12px" lineHeight="1.67" weight="bold" color="#000" style={{ width: '546px', textAlign: 'left' }}>
                  The Consultant hereby declares that the Consultant has read and understood, and agrees to the declaration
                  contained in the “Declaration by Consultant” in the{' '}
                  <a
                    href="https://www.principal.com.my/others/account-opening-terms-conditions"
                    target="_blank"
                    style={{ color: Color.C_LIGHT_BLUE }}>
                    terms and conditions
                  </a>{' '}
                  and the{' '}
                  <a href="https://www.principal.com.my/en/terms-of-use-my" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                    terms of use{' '}
                  </a>
                  (as may be amended from time to time).
                </Text>
              </Grid>
            </RowGridLeft>
          </DisclaimerContainer>
        </AgreementWrapper>
        {this.checkForSophisticatedFund() && (
          <AgreementWrapper heightAgreementWrapper="600px">
            <DisclaimerContainer>
              <RowGridLeft>
                <Grid item style={{ height: '225px', position: 'relative', verticalAlign: 'top' }}>
                  <StyledCheckbox
                    checked={wholeSaleDisclaimerVerified}
                    onChange={this.wholeSaleDisclaimerVerified}
                    value="true"
                  />
                </Grid>
                <Grid item style={{ position: 'relative', width: '550px' }}>
                  <SophisticatedDisclaimer clientName={this.props.personalDetails.fullName} />
                </Grid>
              </RowGridLeft>
            </DisclaimerContainer>
          </AgreementWrapper>
        )}
        <RowGridCenter>
          <Grid item>
            <StyledButton onClick={this.back}>Back</StyledButton>
          </Grid>
          <Grid item>
            <StyledButton
              primary
              onClick={this.next}
              disabled={
                !acknowledge || !verified || !publicPosition || (this.checkForSophisticatedFund() && !wholeSaleDisclaimerVerified)
              }>
              Confirm
            </StyledButton>
          </Grid>
        </RowGridCenter>
        <Dialog
          open={this.state.isOpenDialogResentEmail}
          closeHandler={this.handleCloseDialogConfirmEmailResent}
          title={this.state.errorMessageInResendingConfirmationEmail ? '' : 'Confirmation Email Resent'}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
                <Grid item xs={12}>
                  <Text size="14px" fontStyle="italic">
                    {this.state.errorMessageInResendingConfirmationEmail
                      ? this.state.errorMessageInResendingConfirmationEmail
                      : 'A confirmation email has been sent to'}
                  </Text>
                </Grid>
                {!this.state.errorMessageInResendingConfirmationEmail && (
                  <React.Fragment>
                    <Grid item xs={12} style={{ marginTop: 20 }}>
                      <Text size="10px" color={Color.C_GRAY}>
                        REGISTERED EMAIL ADDRESS
                      </Text>
                    </Grid>
                    <Grid item xs={12}>
                      <Text size="14px" weight="bold">
                        {this.props.personalDetails.email}
                      </Text>
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          }
        />
        <Dialog
          open={this.state.openDialogConfirmEmail}
          closeHandler={this.handleCloseDialogConfirmEmail}
          title="Confirm Email Address & Mobile Number"
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
                <Grid item xs={12}>
                  <Text size="14px" fontStyle="italic">
                    Please ensure the Registered Email Address and Mobile Number below is correct. The Email Address will be used
                    for online payment verification and confirmation. The mobile number will be used for transaction request
                    confirmation.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 20 }}>
                  <Text size="10px" color={Color.C_GRAY}>
                    REGISTERED EMAIL ADDRESS
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Text size="14px" weight="bold" style={{ wordWrap: 'break-word' }}>
                    {this.props.personalDetails.email}
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 10 }}>
                  <Text size="10px" color={Color.C_GRAY}>
                    MOBILE NUMBER
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Text size="14px" weight="bold" style={{ wordWrap: 'break-word' }}>
                    {this.props.personalDetails.mobileNo}
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 10 }}>
                  <Grid container justify="center" align="center" alignItems="center">
                    <Grid item xs={6} align="right" style={{ paddingRight: 5 }}>
                      <StyledBtn
                        onClick={this.handleCloseDialogConfirmEmail}
                        btnBgColor="#ffffff"
                        btnFontColor={Color.C_LIGHT_BLUE}>
                        Back
                      </StyledBtn>
                    </Grid>
                    <Grid item xs={6} align="left" style={{ paddingLeft: 5 }}>
                      <StyledBtn onClick={this.handleDialogConfirmEmail} btnBgColor={Color.C_LIGHT_BLUE} btnFontColor="#ffffff">
                        Submit
                      </StyledBtn>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          }
        />
      </React.Fragment>
    );
  }
}

Confirmation.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  createAccount: PropTypes.func,
  personalDetails: PropTypes.object,
  processing: PropTypes.bool,
  lov: PropTypes.any,
  validatedDetails: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  personalDetails: makeSelectPersonalDetails(),
  annualIncomeLOV: makeSelectAnnualIncomeLOV(),
  account: makeSelectAccount(),
  processing: makeSelectProcessing(),
  lov: makeSelectLOV(),
  showOnBoardingClientConfirmationOtpModal: makeSelectShowOnBoardingClientConfirmationOtpModal(),
  otpSrc: makeSelectOTPSrcAccountCreation(),
  validatedDetails: makeSelectValidatedDetails(),
  selectedFunds: makeSelectSelectedFunds(),
  validationErrorDetails: makeSelectValidateErrorDetails(),
  messageResentConfirmationEmailStatus: makeSelectMessageResentConfirmationEmailStatus(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    createAccount: (payload) => dispatch(createAccount(payload)),
    resetAmla: () => dispatch(resetAmla()),
    initOnBoardingClientConfirmationOtp: (payload) => dispatch(initOnBoardingClientConfirmationOtp(payload)),
    openOnBoardingClientConfirmationOtpModal: (payload) => dispatch(openOnBoardingClientConfirmationOtpModal(payload)),
    accountCreationOtpCorrect: (payload) => dispatch(accountCreationOtpCorrect(payload)),
    accountCreationOtpIncorrect: (payload) => dispatch(accountCreationOtpIncorrect(payload)),
    formReset: () => dispatch(ResetForm()),
    savePersonalDetails: (payload) => dispatch(savePersonalDetails(payload)),
    validatePersonalDetails: (payload) => dispatch(validatePersonalDetails(payload)),
    resetOtp: () => dispatch(resetOtp()),
    clearPaymentStatus: () => dispatch(clearPaymentStatus()),
    resendConfirmationEmail: (payload) => dispatch(resendConfirmationEmail(payload)),
    clearStateOfConfirmationEmailResent: () => dispatch(clearStateOfConfirmationEmailResent()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Confirmation);
