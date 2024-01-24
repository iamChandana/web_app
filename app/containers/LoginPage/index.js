/**
 *
 * Login
 *
 */
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Redirect, withRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import AppWrapper from 'components/AppWrapper';
// custom components
import LoginForm from './LoginForm';
import InfoSlider from './InfoSlider';

// action, selectors, saga
import { selectProcessing, selectAuthenticated } from './selectors';
import {
  login,
  setMode,
  saveResetToken,
  verifyResetToken,
  resetError,
  sendOtpSuccessToken,
  sendOtpFailToken,
  openFirstTimeLoginOtpModal,
  execAfterOTPfirstTimeLoginOtpSuccess,
  reset,
  // getMarketNews,
} from './actions';

// styled components
import Header from './Header';
import Footer from './Footer';

import { LoginPageWrapper, ComponentWrapper } from './Atoms';

let queryParam;
let isChangePassword;
let isResetPassword = false;
let isFirstTimeLoginOtp = false;
let isOtpCorrect = false;

const styles = {
  grow: {
    flexGrow: 1,
  },
};

export class Login extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
    };
  }
  componentWillMount() {
    // reset always
    this.props.reset();
    // this.props.getMarketNews();
    if (!this.props.location || !this.props.location.search) {
      return;
    }

    // check if this is first time login url return from OTP
    if (this.props.location.pathname.indexOf('login/activate') > 0) {
      isFirstTimeLoginOtp = true;

      if (this.props.location.pathname.indexOf('login/activate/otpy') > 0) {
        isOtpCorrect = true;
      }

      if (this.props.location.pathname.indexOf('login/activate/otpn') > 0) {
        isOtpCorrect = false;
      }

      // check if this is reset password url return from OTP
    } else if (this.props.location.pathname.indexOf('login/reset') > 0) {
      isResetPassword = true;

      if (this.props.location.pathname.indexOf('login/reset/otpy') > 0) {
        isOtpCorrect = true;
      }

      if (this.props.location.pathname.indexOf('login/reset/otpn') > 0) {
        isOtpCorrect = false;
      }
    }

    const locationSearch = this.props.location.search;
    const urlParams = locationSearch.split('?');

    if (isFirstTimeLoginOtp && locationSearch) {
      queryParam = urlParams[1].split('=')[1];

      if (isOtpCorrect) {
        this.props.openFirstTimeLoginOtpModal(false);

        this.props.execAfterOTPfirstTimeLoginOtpSuccess(queryParam);
      } else {
        this.props.sendOtpFailToken(queryParam);
      }

      this.props.history.replace('/login');
    } else if (isResetPassword && locationSearch) {
      queryParam = urlParams[1].split('=')[1];

      if (isOtpCorrect) {
        //this.props.setMode('resetEmailSend');
        this.props.setMode('resetConfirm');

        this.props.sendOtpSuccessToken(queryParam);
      } else {
        this.props.sendOtpFailToken(queryParam);
      }

      this.props.history.replace('/login');
    } else {
      this.props.resetError();

      if (locationSearch) {
        queryParam = urlParams[1].split('=')[1];
        isChangePassword = urlParams[1].includes('t') && !urlParams[1].includes('open');
      }

      if (isChangePassword) {
        this.props.saveResetToken(queryParam);
        this.props.verifyResetToken({ queryParam });
        this.props.setMode('changePassword');
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      return true;
    }
    return false;
  }

  resetQueryValue() {
    queryParam = false;
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { isAuthenticated, news, classes } = this.props;

    if (isAuthenticated) {
      return <Redirect to={from} />;
    }
    return (
      <LoginPageWrapper>
        <AppWrapper>
          <Header onClickHandler={() => location.assign('/login')} />
          <Grid spacing={24} className={classes.grow} alignItems="center" justify="space-between" container>
            <Grid item xs={12} md={5} sm={7}>
              <InfoSlider />
            </Grid>
            <Grid item xs={12} md={4} sm={5}>
              <ComponentWrapper>
                <LoginForm />
              </ComponentWrapper>
            </Grid>
          </Grid>
        </AppWrapper>
        <Footer open={!isChangePassword && !isResetPassword && !isFirstTimeLoginOtp && queryParam} reset={this.resetQueryValue} />
      </LoginPageWrapper>
    );
  }
}

Login.propTypes = {
  location: PropTypes.object,
  news: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  resetError: PropTypes.func,
  setMode: PropTypes.func,
  getMarketNews: PropTypes.func,
  reset: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  processing: selectProcessing(),
  isAuthenticated: selectAuthenticated(),
});

function mapDispatchToProps(dispatch) {
  return {
    login: (payload) => dispatch(login(payload)),
    setMode: (payload) => dispatch(setMode(payload)),
    saveResetToken: (payload) => dispatch(saveResetToken(payload)),
    verifyResetToken: (payload) => dispatch(verifyResetToken(payload)),
    resetError: () => dispatch(resetError()),
    sendOtpSuccessToken: (payload) => dispatch(sendOtpSuccessToken(payload)),
    sendOtpFailToken: (payload) => dispatch(sendOtpFailToken(payload)),
    openFirstTimeLoginOtpModal: (payload) => dispatch(openFirstTimeLoginOtpModal(payload)),
    execAfterOTPfirstTimeLoginOtpSuccess: (payload) => dispatch(execAfterOTPfirstTimeLoginOtpSuccess(payload)),
    reset: () => dispatch(reset()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect, withStyles(styles))(Login);
