/**
 *
 * OnBoarding
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import _isEmpty from 'lodash/isEmpty';
import Parser from 'html-react-parser';
import Introduction from './Introduction/Loadable';
import IntroductionQuestion1 from './Introduction/Question1';
import RiskProfile from './RiskProfile/Loadable';
import SelectFunds from './SelectFunds/Loadable';
import PersonalDetails from './PersonalDetails/Loadable';
import Confirmation from './Confirmation/Loadable';
import TranserFunds from './TransferFunds/Loadable';
import ProgressIndicator from './ProgressIndicator';
import makeSelectOnBoarding, { makeSelectStep, makeSelectRiskProfiles, makeSelectError } from './selectors';
import { getRiskQuestionsAnswers, getRiskProfiles, resetError } from './actions';

export class OnBoarding extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    if (!this.props.riskProfiles) {
      this.props.getRiskProfiles();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
      toast(Parser(nextProps.error));
      this.props.resetError();
    }
    return null;
  }

  render() {
    return (
      <div>
        <ProgressIndicator />
        <Switch>
          <Route path="/onboarding/introduction/" component={Introduction} />
          <Route path="/onboarding/introduction/question1" component={IntroductionQuestion1} />
          <Route path="/onboarding/risk-profile" name="Risk Profile" component={RiskProfile} />
          <Route path="/onboarding/select-funds" name="Select Funds" component={SelectFunds} />
          <Route path="/onboarding/personal-details" name="Personal Details" component={PersonalDetails} />
          <Route path="/onboarding/confirmation" name="Confirmation" component={Confirmation} />
          <Route path="/onboarding/confirmation/otpy" name="Confirmation OTP" component={Confirmation} />
          <Route path="/onboarding/confirmation/otpn" name="Confirmation OTP" component={Confirmation} />
          <Route path="/onboarding/transfer-funds" name="Transfer Funds" component={TranserFunds} />
          <Route path="/onboarding/transfer-funds/otpy" name="Transfer Funds" component={TranserFunds} />
          <Route path="/onboarding/transfer-funds/otpn" name="Transfer Funds" component={TranserFunds} />
          <Redirect from="/onboarding" to="/onboarding/introduction" />
        </Switch>
      </div>
    );
  }
}

OnBoarding.propTypes = {
  getRiskProfiles: PropTypes.func,
  riskProfiles: PropTypes.any,
  error: PropTypes.string,
  resetError: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  onBoarding: makeSelectOnBoarding(),
  step: makeSelectStep(),
  riskProfiles: makeSelectRiskProfiles(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    getRiskQuestionsAnswers: () => dispatch(getRiskQuestionsAnswers()),
    getRiskProfiles: () => dispatch(getRiskProfiles()),
    resetError: () => dispatch(resetError()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect)(OnBoarding);
