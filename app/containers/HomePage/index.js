/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _isEmpty from 'lodash/isEmpty';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import SessionWebSocket from 'components/SessionWebSocket';
import Dialog from 'components/Dialog';
import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';
import Clients from 'containers/Clients/Loadable';
import Header from 'components/Header';
import Dashboard from 'containers/Dashboard/Loadable';
import OnBoarding from 'containers/OnBoarding/Loadable';
import FundDetails from 'containers/FundDetails/Loadable';
import Funds from 'containers/Funds/Loadable';
import Logs from 'containers/Logs/Loadable';
import AgentProfile from 'containers/AgentProfile/Loadable';
import LoadingOverlay from 'components/LoadingOverlay';
import CompareFunds from 'containers/CompareFunds/Loadable';
import FundProjection from 'containers/FundProjection/Loadable';
import ClientDetailsFunds from 'containers/ClientDetails/Funds';
import RetakeRiskAssessment from 'containers/ClientDetails/RiskProfile/Result';
import ClientDetailsProfile from 'containers/ClientDetails/Profile';
import ClientAddFunds from 'containers/ClientDetails/AddFunds/Loadable';
import ClientAllocateFunds from 'containers/ClientDetails/AllocateFunds/Loadable';
import RetakeQuestions from 'containers/ClientDetails/RiskProfile/Loadable';
import AgentMultiMap from 'containers/OnBoarding/Introduction/CustomerExist';
import { saveDraft } from 'containers/OnBoarding/actions';

import { getLOV, logout } from './actions';

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${Color.C_LIGHT_BLUE};
  margin-top: 32px;
  color: #ffffff;
  outline: none;
`;
let timerInterval;

export class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();

    this.state = {
      isIdle: false,
      timeout: 600000, // expired. 10 (mins) * 60000
      isIdle1: false,
      timeout1: 540000, // time to show timeout warning in secs. 9 (mins) * 60000
      openDialogSessionTimeoutSoon: false,
    };
    this.onActive = this.onActive.bind(this);
    this.onIdle = this.onIdle.bind(this);
    this.onActive1 = this.onActive1.bind(this);
    this.onIdle1 = this.onIdle1.bind(this);
    this.checkForFalsyValues = this.checkForFalsyValues.bind(this);
    this.handleCloseSessionTimeoutSoon = this.handleCloseSessionTimeoutSoon.bind(this);
    this.checkisSameAddress = this.checkisSameAddress.bind(this);
  }

  componentWillMount() {
    if (_isEmpty(this.props.homePage.lov)) {
      this.props.getLOV();
    }
  }

  onActive() {
    this.setState({
      isIdle: false,
    });
  }

  checkForFalsyValues(values) {
    let count = 0;
    for (const key in values) {
      if (values[key] && values[key] !== 'none') {
        count++;
      }
    }

    return count;
  }

  checkisSameAddress({
    permanentAddressLine1,
    permanentAddressLine2,
    permanentCountry,
    permanentPostalCode,
    permanentState,
    correspondenceAddressLine1,
    correspondenceAddressLine2,
    correspondenceCountry,
    correspondencePostalCode,
    correspondenceState,
  }) {
    if (
      permanentAddressLine1 &&
      correspondenceAddressLine1 === permanentAddressLine1 &&
      permanentAddressLine2 &&
      correspondenceAddressLine2 === permanentAddressLine2 &&
      permanentCountry &&
      correspondenceCountry === permanentCountry &&
      permanentPostalCode &&
      correspondencePostalCode === permanentPostalCode &&
      permanentState &&
      correspondenceState === permanentState
    ) {
      return true;
    }
    return false;
  }

  isRiskRetakeFlow() {
    return this.props.location.pathname.indexOf('retake') > 0;
  }

  onIdle() {
    const { formState } = this.props;
    if (!_isEmpty(formState) && !_isEmpty(formState.PersonalDetails)) {
      const payload = { ...formState.PersonalDetails.values };
      payload.isPermanentCorrespondenceAddress = this.checkisSameAddress(formState.PersonalDetails.values);
      this.props.saveDraft(payload);
    } else if (!_isEmpty(formState) && !_isEmpty(formState.introduction)) {
      const res = this.checkForFalsyValues(formState.introduction.values);
      const checkIfRiskRetakeFlow = this.isRiskRetakeFlow();
      const payload = { ...formState.introduction.values };
      const monthlySavings = payload.monthlySavingsDisplay ? payload.monthlySavingsDisplay.replace(/,/g, '') : '';
      payload.monthlySavings =
        String(monthlySavings).length > 0 ? Number(monthlySavings.substr(2, monthlySavings.length - 1)) : '';
      delete payload.monthlySavingsDisplay;
      if (res > 1 && !checkIfRiskRetakeFlow) this.props.saveDraft(payload);
    }
    this.setState({
      isIdle: true,
    });
    clearInterval(timerInterval);
    // if (window.location.host.indexOf('localhost') === -1) {
    // never logout in localhost for development
    this.props.logout();
    // }
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.timeLeft && prevState.timeLeft !== this.state.timeLeft && this.state.timeLeft < 0) {
      this.props.logout();
      this.props.history.push('/logout-summary');
    }
  }

  onActive1() {
    /*
    this.setState({
      isIdle1: false,
      timeLeft: this.state.timeout - this.state.timeout1,
      openDialogSessionTimeoutSoon: false
    });
    clearInterval(timerInterval);
    */
  }

  onIdle1() {
    // if (window.location.host.indexOf('localhost') === -1) {
    this.setState(
      {
        isIdle1: true,
        openDialogSessionTimeoutSoon: true,
      },
      () => {
        this.setState(
          {
            timeLeft: this.state.timeout - this.state.timeout1,
          },
          () => {
            timerInterval = setInterval(() => {
              this.setState({
                timeLeft: this.state.timeLeft - 1000,
              });
            }, 1000);
          },
        );
      },
    );
    // }
  }

  handleCloseSessionTimeoutSoon() {
    this.setState({ openDialogSessionTimeoutSoon: false });
    clearInterval(timerInterval);
  }

  render() {
    const { processing } = this.props;
    return (
      <React.Fragment>
        <IdleTimer activeAction={this.onActive1} idleAction={this.onIdle1} timeout={this.state.timeout1} startOnLoad>
          <IdleTimer />
        </IdleTimer>
        <IdleTimer activeAction={this.onActive} idleAction={this.onIdle} timeout={this.state.timeout} startOnLoad>
          <IdleTimer />
        </IdleTimer>
        <LoadingOverlay show={processing} />
        <Header />
        <Switch>
          <Route exact path="/funds/:id" name="Fund Details" component={FundDetails} />
          <Route exact path="/:customerId/funds/:portfolioId/:id" name="Fund Details" component={FundDetails} />
          <Route exact path="/fund-projection/:id" name="Fund Projection" component={FundProjection} />
          <Route exact path="/funds" name="Funds" component={Funds} />
          <Route exact path="/clients" name="Clients" component={Clients} />
          <Route exact path="/clients/:searchText" name="Clients" component={Clients} />
          <Route path="/clients/:id/funds" name="Client Details" component={ClientDetailsFunds} />
          <Route path="/clients/:id/profile" name="Client Details" component={ClientDetailsProfile} />
          <Route path="/clients/:id/createAccount" name="Client Details" component={ClientDetailsProfile} />
          <Route path="/clients/:id/reUploadDocument" name="Client Details" component={ClientDetailsProfile} />
          {/* <Redirect from="/clients/:id/createAccount" to="/clients/:id/profile" /> */}
          <Route path="/clients/:id/add-funds/:portfolioId" name="Client Add Funds " component={ClientAddFunds} />
          <Route path="/clients/:id/allocate-funds/:portfolioId" name="Client Add Funds " component={ClientAllocateFunds} />
          <Route path="/clients/:id/allocate-funds/:portfolioId/otpy" name="Client Add Funds " component={ClientAllocateFunds} />
          <Route path="/clients/:id/allocate-funds/:portfolioId/otpn" name="Client Add Funds " component={ClientAllocateFunds} />
          <Route path="/retake/risk-profile" name="Client Risk Profile" component={RetakeQuestions} />
          <Route exact path="/dashboard" name="Dashboard" component={Dashboard} />
          <Route exact path="/dashboard/change-password/otpy" name="Dashboard" component={Dashboard} />
          <Route exact path="/dashboard/change-password/otpn" name="Dashboard" component={Dashboard} />
          <Route path="/onboarding" name="OnBoarding" component={OnBoarding} />
          <Route path="/compare-funds" name="Compare Funds" component={CompareFunds} />
          <Route exact path="/logs" name="Logs" component={Logs} />
          <Route exact path="/agent-profile" name="Agent Profile" component={AgentProfile} />

          <Route exact path="/clients/:id/funds/switchfund/otpy" name="Switch Fund" component={ClientDetailsFunds} />
          <Route exact path="/clients/:id/funds/switchfund/otpn" name="Switch Fund" component={ClientDetailsFunds} />

          <Route exact path="/clients/:id/funds/redeemfund/otpy" name="Redeem Fund" component={ClientDetailsFunds} />
          <Route exact path="/clients/:id/funds/redeemfund/otpn" name="Redeem Fund" component={ClientDetailsFunds} />

          <Route exact path="/clients/:id/funds/topupfund/otpy" name="Topup Fund" component={ClientDetailsFunds} />
          <Route exact path="/clients/:id/funds/topupfund/otpn" name="Topup Fund" component={ClientDetailsFunds} />

          <Route exact path="/clients/:id/funds/setuprsp/otpy" name="Setup RSP fund" component={ClientDetailsFunds} />
          <Route exact path="/clients/:id/funds/setuprsp/otpn" name="Setup RSP fund" component={ClientDetailsFunds} />

          <Route
            exact
            path="/retake/risk-profile/result/updateRiskAssessment/otpy"
            name="Retake risk assessment"
            component={RetakeRiskAssessment}
          />
          <Route
            exact
            path="/retake/risk-profile/result/updateRiskAssessment/otpn"
            name="Retake risk assessment"
            component={RetakeRiskAssessment}
          />

          <Route exact path="/clients/:id/agentAccess/otpy" name="Agent mapping" component={AgentMultiMap} />
          {/* <Route exact path="/clients/:id/select-funds/list" name="Funds List" component={FundList} /> */}
          {/* <Route exact path="/clients/:id/select-funds/allocate" name="Allocate Funds" component={() => <AllocateFunds {...this.props.getExistingCustomerDetails} />} /> */}
          <Route exact path="/clients/:id/agentAccess/otpn" name="Agent mapping" component={AgentMultiMap} />

          <Redirect from="/" to="/dashboard" />
        </Switch>
        <Dialog
          open={this.state.openDialogSessionTimeoutSoon}
          closeHandler={this.handleCloseSessionTimeoutSoon}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="left" alignItems="center">
                <Grid item xs={12}>
                  {this.state.isIdle1 && (
                    <Text size="14px">
                      You have been idle for more than {this.state.timeout1 / (this.state.timeout1 >= 60000 ? 60000 : 1000)}{' '}
                      {this.state.timeout1 >= 60000 ? 'minutes' : 'seconds'} & will be logged out in {this.state.timeLeft / 1000}{' '}
                      seconds
                    </Text>
                  )}
                  {/*! this.state.isIdle1 &&
                    <Text size="14px">
                      You were idle for more than {this.state.timeout1/((this.state.timeout1>=60000)?60000:1000)} {(this.state.timeout1>=60000)?'minutes':'seconds'}
                    </Text>
                  */}
                </Grid>
                <Grid item xs={12} align="center" style={{ marginTop: 5, marginBottom: 30 }}>
                  <StyledBtn onClick={this.handleCloseSessionTimeoutSoon} btnBgColor={Color.C_LIGHT_BLUE} btnFontColor="#ffffff">
                    Ok
                  </StyledBtn>
                </Grid>
              </Grid>
            </Grid>
          }
        />
        <SessionWebSocket />
      </React.Fragment>
    );
  }
}

HomePage.propTypes = {
  processing: PropTypes.bool,
  getLOV: PropTypes.func,
  homePage: PropTypes.object,
  logout: PropTypes.func,
};

// const mapStateToProps = createStructuredSelector({
//   homePage: makeSelectHomePage(),
//   isLogout: makeSelectLogout(),
//   processing: makeSelectProcessing(),
// });

const mapStateToProps = (state) => {
  const { home, form, clientDetails } = state;
  return {
    homePage: home,
    isLogout: home.isLogout,
    processing: home.processing,
    formState: form,
    clientDetails,
    // getExistingCustomerDetails: makeExistingCustomerDetails(),
  };
};

function mapDispatchToProps(dispatch) {
  return {
    getLOV: () => dispatch(getLOV()),
    logout: () => dispatch(logout()),
    saveDraft: (payload) => dispatch(saveDraft(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(HomePage);
