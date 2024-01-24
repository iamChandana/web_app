/**
 *
 * Header
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { pick } from 'lodash';
import { reset as ResetForm } from 'redux-form';
import Grid from 'material-ui/Grid';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import {
  closeOtpModal,
  verifyUsernameAndPassword,
  changePasswordOtpRequest,
  setUsernameAndPasswordVerifyStatus,
  setChangePasswordModelOpen,
} from 'containers/LoginPage/actions';
import Modal from 'components/Modal';
import OtpBox from 'components/OtpBox';
import Text from 'components/Text';
import { logout } from 'containers/HomePage/actions';
import {
  makeSelectTitle,
  makeSelectRiskScore,
  makeSelectRiskProfiles,
  makeSelectFundFilterRiskProfileType,
} from 'containers/OnBoarding/selectors';
import {
  selectUserInfo,
  selectShowOtpModal,
  selectOtpiFrameUrl,
  selectIsUsernameAndPasswordVerified,
  selectProcessing,
  selectError,
  selectMessage,
  selectChangePasswordStep,
  selectChangePasswordModelOpen,
} from 'containers/LoginPage/selectors';
import { reset } from 'containers/OnBoarding/actions';
import { PASSWORD_REGEX } from 'containers/LoginPage/constants';
import { validatePasswordSchema } from 'components/FormUtility/FormValidators';
import CheckIcon from 'containers/LoginPage/LoginForm/images/check-success.svg';
import Step2 from './ResetPassword/Step2';
import Step3 from './ResetPassword/Step3';
import LogoImage from './images/logo.png';
import {
  LogoutButton,
  LogoImgWrap,
  AppBarContainer,
  HeaderTopBar,
  HeaderDashboardBar,
  MenuList,
  MenuListItem,
  UserImage,
  StyledLink,
  NavigationButton,
  TextOuterWrapper,
  TextInnerWrapper,
  TextOuterWrapperTabletPortrait,
  TextInnerWrapperTabletPortrait,
  TextOuterWrapperTabletLandscape,
  TextInnerWrapperTabletLandscape,
  TextOuterWrapperTabletPortraitFundlistPage,
  TextInnerWrapperTabletPortraitFundlistPage,
} from './Atoms';
import RiskDetail from './RiskDetail';
import ReactTooltip from 'react-tooltip';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #fff !important;
  padding: 7px !important;
  opacity: 0.75 !important;
  border-bottom: 5px solid #5d6d7e;
`;
const StyledText = styled(Text)`
  white-space: nowrap;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;
/*
const LinkEditProfile = styled.a`
  color: #ccc;
  opacity: 0.9;
  @media only screen and (max-width: 768px) and (-webkit-min-device-pixel-ratio: 1.5) {
    color: #000;
    opacity: 0.5;
  }
`;
*/
import { isTablet } from 'react-device-detect';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnboarding: props.location.pathname.includes('/onboarding'),
      isClients: props.location.pathname.includes('/clients'),
      isFundListPage: props.location.pathname.includes('/onboarding/select-funds/list'),
      isLogs: props.location.pathname.includes('/logs'),
      isFundsPage: props.location.pathname.includes('/funds') && !props.location.pathname.includes('/clients'),
      isLogoutSummary: props.location.pathname.includes('/logout-summary'),
      isInvalidToken: props.location.pathname.includes('/invalid-token'),
      isDashboard: props.location.pathname.includes('/dashboard'),
      isRetakeRiskAssessment: props.location.pathname.includes('retake/risk-profile'),
      // isModalOpen: false,
      // changePasswordStep: 1,
      existingPass: '',
      newPass: '',
      confirmPassword: '',
      error: '',
      isUsernameAndPasswordVerified: props.isUsernameAndPasswordVerified,
    };

    this.logout = this.logout.bind(this);
    this.goHome = this.goHome.bind(this);
    this.goToEditProfile = this.goToEditProfile.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.handleChange();
  }

  componentWillMount() {
    this.setState({
      deviceOrientation: window.orientation,
    });
  }

  handleChange() {
    if ('onorientationchange' in window) {
      window.addEventListener(
        'orientationchange',
        (event) => {
          this.setState({
            deviceOrientation: window.orientation,
          });
        },
        false,
      );
    }
  }

  getMenu() {
    if (
      this.state.isOnboarding ||
      this.state.isFundsPage ||
      this.state.isLogoutSummary ||
      this.state.isInvalidToken ||
      this.state.isRetakeRiskAssessment
    ) {
      let title = this.props.title;
      if (this.state.isLogoutSummary) {
        title = 'You have successfully logged out.';
      } else if (this.state.isInvalidToken) {
        title = 'Invalid Token.';
      }

      if (!isTablet) {
        return (
          <TextOuterWrapper>
            <TextInnerWrapper>
              <Text size="20px" color="#fff" weight="600" align="left">
                {title}
              </Text>
            </TextInnerWrapper>
          </TextOuterWrapper>
        );
      } else {
        const { riskScore } = this.props;

        if (!this.state.isFundListPage && (this.state.deviceOrientation == -90 || this.state.deviceOrientation == 90)) {
          return (
            <TextOuterWrapperTabletLandscape>
              <TextInnerWrapperTabletLandscape>
                <Text size="20px" color="#fff" weight="600" align="left">
                  {title}
                </Text>
              </TextInnerWrapperTabletLandscape>
            </TextOuterWrapperTabletLandscape>
          );
        }

        if (riskScore && this.state.isFundListPage) {
          return (
            <TextOuterWrapperTabletPortraitFundlistPage>
              <TextInnerWrapperTabletPortraitFundlistPage>
                <Text size="20px" color="#fff" weight="600" align="left">
                  {title}
                </Text>
              </TextInnerWrapperTabletPortraitFundlistPage>
            </TextOuterWrapperTabletPortraitFundlistPage>
          );
        } else {
          if (this.state.deviceOrientation == 0 || this.state.deviceOrientation == 180) {
            return (
              <TextOuterWrapperTabletPortrait>
                <TextInnerWrapperTabletPortrait>
                  <Text size="20px" color="#fff" weight="600" align="left">
                    {title}
                  </Text>
                </TextInnerWrapperTabletPortrait>
              </TextOuterWrapperTabletPortrait>
            );
          }
        }
      }
    }
    const myCommissionLink = window.location.host.includes('uat')
      ? 'https://principal-sandbox.performio.co/Login.do'
      : 'https://principal.performio.co';
    return (
      <MenuList container direction="row" justify="flex-end" alignItems="flex-end">
        {/* <MenuListItem size="12px" weight="bold" color="#fff" opacity="0.5">
          <a data-tip data-for="comingSoon">
            OVERVIEW
          </a>
        </MenuListItem> */}
        <MenuListItem size="12px" weight="bold" color="#fff">
          <StyledLink to={myCommissionLink} target="_blank">
            MY COMMISSIONS
          </StyledLink>
        </MenuListItem>
        <MenuListItem size="12px" weight="bold" color="#fff">
          <StyledLink to="/clients">MY CLIENTS</StyledLink>
        </MenuListItem>
        <MenuListItem size="12px" weight="bold" color="#fff">
          <StyledLink to={'https://forms.office.com/r/8Pm04R2y2f'} target="_blank">
            MY FEEDBACK
          </StyledLink>
        </MenuListItem>
        {/* <MenuListItem size="12px" weight="bold" color="#fff" opacity="0.5">
          <a data-tip data-for="comingSoon">
            {' '}
            MY TEAM
          </a>
        </MenuListItem> */}
        <MenuListItem size="12px" weight="bold" color="#fff">
          <StyledLink to="/logs">LOGS</StyledLink>
        </MenuListItem>
        <ReactTooltip1 id="comingSoon" effect="solid" place="bottom">
          <Text size="12px" color="#000" align="left">
            Coming soon
          </Text>
        </ReactTooltip1>
      </MenuList>
    );
  }

  goHome() {
    this.props.formReset(); // eslint-disable-line
    this.props.resetOnBoarding();
    this.props.history.replace('/');
  }

  goToEditProfile() {
    // this.props.history.push('/agent-profile');
  }

  toggleModal() {
    // eslint-disable-next-line
    this.setState((prevState) => ({
      // isModalOpen: !prevState.isModalOpen,
      // changePasswordStep: 1,
      error: null,
      existingPass: null,
      newPass: null,
      confirmPassword: null,
    }));

    this.props.setChangePasswordModelOpen(!this.props.changePasswordModelOpen);

    if (!this.props.changePasswordModelOpen) {
      this.props.setUsernameAndPasswordVerifyStatus({
        isUsernameAndPasswordVerified: false,
        changePasswordStep: 1,
        error: null,
      });
    }
  }

  logout() {
    this.props.logout();
  }

  handlePasswordInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
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

  handleChangePassword() {
    // const { isModalOpen, changePasswordStep } = this.state;
    // const { isModalOpen } = this.state;
    const { userInfo } = this.props;

    if (this.props.changePasswordModelOpen) {
      if (
        (this.props.changePasswordStep == 1 && !PASSWORD_REGEX.test(this.state.existingPass)) ||
        (this.props.changePasswordStep == 2 && !PASSWORD_REGEX.test(this.state.newPass))
      ) {
        // this.setState({error:'Password is invalid'});
        if (this.state.newPass && this.state.newPass.length > 0) {
          this.setState({
            error: this.getRuleMessage(
              validatePasswordSchema(this.props.changePasswordStep === 1 ? this.state.existingPass : this.state.newPass),
            ),
          });
          return;
        }
      }

      this.setState({ error: null });

      if (this.props.changePasswordStep < 2) {
        this.props.verifyUsernameAndPassword({
          username: userInfo.agent.username,
          password: this.state.existingPass,
        });
      } else if (this.props.changePasswordStep > 1) {
        const payload = {
          reqPayload: {
            ...pick(this.state, ['existingPass', 'newPass']),
            userId: userInfo.agent.username,
          },
          userId: userInfo.agent.username,
          TransactionType: 'ChangePassword',
          MobileNo: userInfo.agent.MobileNo,
          newPassword: this.state.newPass,
          // debug: 1
        };

        this.props.changePasswordOtpRequest(payload);

        this.props.setChangePasswordModelOpen(false);

        this.setState({
          // isModalOpen: false,
          resetPasswordState: 1,
          existingPass: '',
          // newPass: '',
          confirmPassword: '',
        });
      }
    }
  }

  get changePasswordView() {
    // const { isModalOpen, changePasswordStep } = this.state;
    // const { isModalOpen } = this.state;
    if (this.props.changePasswordModelOpen) {
      switch (this.props.changePasswordStep) {
        case 1:
          return (
            <Step2
              onClick={this.handleChangePassword}
              value={this.state.existingPass}
              handleInputChange={this.handlePasswordInputChange}
              isButtonDisabled={this.isButtonDisabled}
              error={this.state.error ? this.state.error : this.props.error}
              message={this.props.message}
            />
          );
        case 2:
          return (
            <Step3
              onClick={this.handleChangePassword}
              values={[this.state.newPass, this.state.confirmPassword]}
              handleInputChange={this.handlePasswordInputChange}
              isButtonDisabled={this.isButtonDisabled}
              error={this.state.error ? this.state.error : this.props.error}
              message={this.props.message}
            />
          );
        default:
          return (
            <Step2
              onClick={this.handleChangePassword}
              handleInputChange={this.handlePasswordInputChange}
              isButtonDisabled={this.isButtonDisabled}
              error={this.state.error ? this.state.error : this.props.error}
              message={this.props.message}
            />
          );
      }
    }

    return <div />;
  }

  // eslint-disable-next-line
  get isButtonDisabled() {
    // const { isModalOpen, changePasswordStep } = this.state;
    // const { isModalOpen } = this.state;
    if (this.props.changePasswordModelOpen) {
      switch (this.props.changePasswordStep) {
        case 1:
          return this.state.existingPass === '';
        case 2:
          return (
            this.state.newPass !== this.state.confirmPassword || (this.state.newPass === '' && this.state.confirmPassword === '')
          );
        default:
          return false;
      }
    }
  }

  render() {
    const {
      isOnboarding,
      isClients,
      isFundListPage,
      isLogs,
      isFundsPage,
      isLogoutSummary,
      isInvalidToken,
      isDashboard,
    } = this.state;
    const showOnBoardingBG = !!(isOnboarding || isFundsPage || isLogoutSummary || isInvalidToken);
    const theme = {
      showOnBoardingBG,
      isClients,
      isLogs,
    };
    const {
      userInfo,
      riskScore,
      riskProfiles,
      showOtpModal,
      otpiFrameUrl,
      processing,
      riskProfileType,
      hideActionItem,
    } = this.props;
    const hasInfo = !_isEmpty(userInfo);
    const lastLogin = moment(userInfo.lastLogin).format('h:mm A, D MMMM YYYY');
    const currentDateTime = moment().format('h:mm A, D MMMM YYYY');
    let riskDetails;
    if (isFundListPage && riskScore && riskProfiles) {
      riskDetails = _find(riskProfiles, { riskProfileType: riskScore.riskProfileType });
    }

    const otpModal =
      !processing && showOtpModal && otpiFrameUrl !== null ? (
        <OtpBox openModal={showOtpModal} url={otpiFrameUrl} handleClose={this.props.closeOtpModal} />
      ) : null;

    return (
      <ThemeProvider theme={theme}>
        <AppBarContainer position="static" color="default">
          <HeaderTopBar
            isPortraitOrientation={
              isTablet &&
              (this.state.deviceOrientation == 0 ||
                this.state.deviceOrientation == 180 ||
                (riskScore && this.state.isFundListPage))
                ? true
                : false
            }>
            <LogoImgWrap>
              <button onClick={this.goHome}>
                <img src={LogoImage} alt="CWA" />
              </button>
            </LogoImgWrap>
            {!hideActionItem && this.getMenu()}
            {!hideActionItem && isFundListPage && riskDetails && <RiskDetail riskDetails={riskDetails} />}
            {!hideActionItem && !isLogoutSummary && <LogoutButton onClick={this.logout}>Log Out</LogoutButton>}
          </HeaderTopBar>
          {isDashboard && hasInfo && (
            <HeaderDashboardBar container direction="row">
              <Grid item>
                <UserImage />
              </Grid>
              <Grid item>
                <Text size="12px" color="#fff" align="left">
                  Last login at {lastLogin} | Current Time: {currentDateTime}
                </Text>
                <StyledText size="18px" color="#fff" align="left" weight="bold">
                  {`Good Day, ${userInfo.agent ? userInfo.agent.firstName : ''}.`}
                </StyledText>
                <Text size="18px" color="#fff" align="left">
                  What would you like to do?
                </Text>
                <NavigationButton onClick={this.goToEditProfile}>
                  <a data-tip data-for="editProfile" style={{ color: '#ccc', opacity: 0.9 }}>
                    Edit Profile
                  </a>
                </NavigationButton>
                <ReactTooltip1 id="editProfile" effect="solid" place="bottom">
                  <Text size="12px" color="#000" align="left">
                    Coming soon
                  </Text>
                </ReactTooltip1>
                <NavigationButton onClick={this.toggleModal}>Change Password</NavigationButton>
              </Grid>
            </HeaderDashboardBar>
          )}
          {this.props.changePasswordModelOpen && (
            <Modal width={500} height={360} open={this.props.changePasswordModelOpen} handleClose={this.toggleModal}>
              {this.changePasswordView}
            </Modal>
          )}
          {otpModal}
        </AppBarContainer>
      </ThemeProvider>
    );
  }
}

Header.propTypes = {
  history: PropTypes.object,
  logout: PropTypes.any,
  location: PropTypes.object,
  title: PropTypes.string,
  riskScore: PropTypes.object,
  riskProfiles: PropTypes.array,
  userInfo: PropTypes.object,
  showOtpModal: PropTypes.bool,
  otpiFrameUrl: PropTypes.string,
  resetOnBoarding: PropTypes.func,
  changePasswordOtpRequest: PropTypes.func,
  processing: PropTypes.bool,
  closeOtpModal: PropTypes.func,
  riskProfileType: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  title: makeSelectTitle(),
  riskScore: makeSelectRiskScore(),
  riskProfiles: makeSelectRiskProfiles(),
  userInfo: selectUserInfo(),
  showOtpModal: selectShowOtpModal(),
  otpiFrameUrl: selectOtpiFrameUrl(),
  processing: selectProcessing(),
  isUsernameAndPasswordVerified: selectIsUsernameAndPasswordVerified(),
  error: selectError(),
  changePasswordStep: selectChangePasswordStep(),
  message: selectMessage(),
  changePasswordModelOpen: selectChangePasswordModelOpen(),
  riskProfileType: makeSelectFundFilterRiskProfileType(),
});

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
    resetOnBoarding: () => dispatch(reset()),
    closeOtpModal: () => dispatch(closeOtpModal()),
    formReset: () => dispatch(ResetForm()),
    verifyUsernameAndPassword: (payload) => dispatch(verifyUsernameAndPassword(payload)),
    changePasswordOtpRequest: (payload) => dispatch(changePasswordOtpRequest(payload)),
    setUsernameAndPasswordVerifyStatus: (payload) => dispatch(setUsernameAndPasswordVerifyStatus(payload)),
    setChangePasswordModelOpen: (payload) => dispatch(setChangePasswordModelOpen(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(Header);
