/**
 *
 * App
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Login from 'containers/LoginPage/Loadable';
import Page404 from 'containers/Page404';
import Page500 from 'containers/Page500';
import HomePage from 'containers/HomePage/Loadable';
import FAQ from 'containers/Faq/Loadable';
import TNC from 'containers/Tnc';
import LogoutSummary from 'containers/LogoutSummary/Loadable';
import InvalidToken from 'containers/InvalidToken/Loadable';

// saga
import OnBoardingSaga from 'containers/OnBoarding/saga';
import ClientDetailsSaga from 'containers/ClientDetails/saga';
import HomePageSaga from 'containers/HomePage/saga';
import DashboardSaga from 'containers/Dashboard/saga';
import LoginSaga from 'containers/LoginPage/saga';
import ClientsSaga from 'containers/Clients/saga';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectAuthenticated } from 'containers/LoginPage/selectors';
import { makeSelectLogout } from 'containers/HomePage/selectors';
import OnlinePayment from 'containers/OnlinePayment/Loadable';
import EnrolPayment from 'containers/EnrolmentPayment/Loadable';
import EditRspPayment from 'containers/EditRSPPayment/Loadable';
import EmailTransaction from 'containers/EmailTransaction/Loadable';
import TransactionConfirmation from 'containers/TransactionConfirmation/Loadable';
import ToastNotification from 'components/ToastNotification';
import injectSaga from 'utils/injectSaga';
import makeSelectApp from './selectors';
import Analytics from './Analytics';

class App extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  // componentWillReceiveProps(nextProps) {
  // console.log('componentWillReceiveProps props userInfo.access_token : ', this.props.userInfo?this.props.userInfo.access_token:'');
  //   console.log('componentWillReceiveProps nextProps userInfo.access_token : ', nextProps.userInfo?nextProps.userInfo.access_token:'');
  //   console.log('socket.connected', socket.connected);
  //   if ( nextProps.userInfo && nextProps.userInfo.access_token ) {

  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      ReactGA.pageview(nextProps.location.pathname);
    }
  }

  componentWillUpdate() {
    history.pushState(null, null, location.href);
    window.onpopstate = () => {
      history.go(1);
    };
  }

  render() {
    const { isAuthenticated, isLogout } = this.props;
    const pathNameRedirect = isLogout ? '/logout-summary' : '/login';
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: pathNameRedirect,
                state: '', // { from: this.props.location },
              }}
            />
          )
        }
      />
    );
    return (
      <React.Fragment>
        <Analytics />
        <Helmet titleTemplate="Principal Direct Access">
          <meta name="description" content="CIMB ROBO" />
        </Helmet>
        <ToastContainer hideProgressBar toastClassName="red-toast" style={{ width: 'max-content', maxWidth: '450px' }} />
        <Switch>
          <Route path="/customers" name="Transaction Confirmation" component={TransactionConfirmation} />
          <Route exact path="/faq" name="FAQ" component={FAQ} />
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/login/change-password" name="Login Page" component={Login} />
          <Route exact path="/login/reset/otpy" name="Reset Password" component={Login} />
          <Route exact path="/login/reset/otpn" name="Reset Password" component={Login} />
          <Route exact path="/login/activate/otpy" name="First Time Login" component={Login} />
          <Route exact path="/login/activate/otpn" name="First Time Login" component={Login} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/server-down" name="Server Down" component={Page500} />
          <Route exact path="/logout-summary" name="Logout Summary" component={LogoutSummary} />
          <Route exact path="/online-payment" name="Online Payment" component={OnlinePayment} />
          <Route exact path="/enrolment/payment" name="Enrolment Payment" component={EnrolPayment} />
          <Route exact path="/edit-rsp/payment" name="Edit RSP Payment" component={EditRspPayment} />
          <Route exact path="/invalid-token" name="Invalid Token" component={InvalidToken} />
          <Route exact path="/tnc" name="Term and Condition" component={TNC} />
          <Route exact path="/email-success-verification" name="EmailTransaction" component={EmailTransaction} />
          <Route exact path="/email-error-verification" name="EmailTransaction" component={EmailTransaction} />
          <Route exact path="/email-verification" name="EmailTransaction" component={EmailTransaction} />
          <PrivateRoute path="/" component={HomePage} />
        </Switch>
        <ToastNotification />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  // location: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  isLogout: PropTypes.bool,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  isAuthenticated: selectAuthenticated(),
  isLogout: makeSelectLogout(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const onBoardingSaga = injectSaga({ key: 'onBoarding', saga: OnBoardingSaga });
const clientDetailsSaga = injectSaga({ key: 'clientDetails', saga: ClientDetailsSaga });
const homePageSaga = injectSaga({ key: 'home', saga: HomePageSaga });
const dashboardSaga = injectSaga({ key: 'dashboard', saga: DashboardSaga });
const loginSaga = injectSaga({ key: 'login', saga: LoginSaga });
const clientsSaga = injectSaga({ key: 'clients', saga: ClientsSaga });

export default compose(
  onBoardingSaga,
  homePageSaga,
  clientDetailsSaga,
  dashboardSaga,
  loginSaga,
  clientsSaga,
  withRouter,
  withConnect,
)(App);
