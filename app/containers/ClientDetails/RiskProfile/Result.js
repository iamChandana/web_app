import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import styled from 'styled-components';
import LoadingOverlay from 'components/LoadingOverlay';
import _find from 'lodash/find';
import BaseUrl from 'utils/getDomainUrl';
import { toast } from 'react-toastify';

import Text from 'components/Text';
import Button from 'components/Button';
import { RowGridCenter, ColumnGridCenter } from 'components/GridContainer';
import { setTitle, setStep, setRiskProfileType, getRiskProfiles } from 'containers/OnBoarding/actions';
import { rejectBackButton } from 'utils/helpers';
import {
  makeSelectRiskScore,
  makeSelectProcessing,
  makeSelectRiskProfiles,
  makeSelectIntroduction,
} from 'containers/OnBoarding/selectors';
import OtpBox from 'components/OtpBox';
import RedirectButton from './Button';
import { initRetakeRiskAssessmentOtp, clearRiskAssessmentOtpData, retakeRiskAssessment } from '../actions';
import {
  makeSelectInitRetakeRiskAssessmentSuccessData,
  makeSelectInitRetakeRiskAssessmentError,
  makeSelectisOTPCalled,
  makeSelectIsProcessingRetakeAssessment,
  makeSelectRetakeAssessmentSuccess,
  makeSelectRetakeAssessmentError,
  makeSelectClientDetails,
} from '../selectors';

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MiddleText = styled(Text)`
  margin-top: 32px;
  max-width: 502px;
`;

class Result extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showModalForRetakeRisk: false,
      isCalled: 0,
    };
    this.accept = this.accept.bind(this);
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
  }

  toastId = null;

  notify = (msg) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  componentWillMount() {
    this.props.clearRiskAssessmentOtpData();
    rejectBackButton();
    this.props.setStep(3);
    this.props.getRiskProfiles();
    const { info } = this.props.clientDetails;
    this.props.setTitle(`Congratulations, ${info.fullName}! Here is your risk profile.`);
  }

  processUrlParam() {
    if (!this.props.location || !this.props.location.search) {
      return;
    }
    if (this.props.location.pathname.indexOf('updateRiskAssessment/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const retakeRiskAssessmentToken = urlParams[1].split('=')[1];
      this.setState(
        (prevstate) => ({ isCalled: prevstate.isCalled + 1 }),
        () => {
          if (this.state.isCalled === 1) {
            this.props.retakeRiskAssessment({
              retakeRiskAssessmentToken,
            });
            this.setState({ showModalForRetakeRisk: false });
          }
        },
      );
    }

    if (this.props.location.pathname.indexOf('updateRiskAssessment/otpn') > 0) {
      this.notify('Otp failed!');
    }
  }

  componentWillUnmount() {
    this.setState({ isCalled: 0 });
    this.props.clearRiskAssessmentOtpData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initRetakeRiskAssessmentOtpSuccessData) {
      this.setState({ showModalForRetakeRisk: true });
    }

    if (!this.props.isOTPCalled) {
      this.processUrlParam();
    }

    if (
      nextProps.initRetakeRiskAssessmentOtpError &&
      this.props.initRetakeRiskAssessmentOtpError !== nextProps.initRetakeRiskAssessmentOtpError
    ) {
      this.notify(nextProps.initRetakeRiskAssessmentOtpError);
    }

    if (this.props.retakeRiskAssessmentSuccess) {
      const { info } = this.props.clientDetails;
      this.props.history.push(`/clients/${info.id}/funds`);
    }

    if (nextProps.retakeRiskAssessmentError && this.props.retakeRiskAssessmentError !== nextProps.retakeRiskAssessmentError) {
      const { info } = this.props.clientDetails;
      this.props.history.push(`/clients/${info.id}/funds`);
    }
  }

  handleCloseOtpModal() {
    this.setState({
      showModalForRetakeRisk: false,
    });
    this.props.clearRiskAssessmentOtpData();
  }

  accept() {
    const {
      riskScore,
      introduction: {
        annualIncome,
        monthlySavings,
        noOfDependants,
        gender,
        educationLevel,
        existingCommitments,
        investmentExperience,
      },
    } = this.props;
    // console.log('Props', this.props);
    const payload = {
      riskProfileType: riskScore.riskProfileType,
      riskScore: riskScore.riskScore || riskScore.riskToleranceScore,
      yearlyIncome: annualIncome,
      monthlySavings,
      noOfDependants,
      gender,
      educationLevel,
      existingCommitments,
      investmentExperience,
    };
    this.props.initRetakeRiskAssessmentOtp(payload);
    // this.props.setRiskProfileType(this.props.riskScore.riskProfileType);
    // this.props.history.push('/onboarding/select-funds');
  }
  render() {
    const { riskScore, processing, riskProfiles, isProcessingRetakeAssessment } = this.props;
    if (riskScore && !processing) {
      const riskDetails = _find(riskProfiles, { riskProfileType: riskScore.riskProfileType });
      const src = `${BaseUrl}${riskDetails.iconURL}`;
      return (
        <React.Fragment>
          <LoadingOverlay show={processing || isProcessingRetakeAssessment} />
          <ResultContainer>
            <img src={src} alt="Type" />
            <Text size="18px" color="#1d1d26" weight="600">
              {riskScore.riskProfileType}
            </Text>
            <MiddleText color="#1d1d26" lineHeight="1.43">
              {Parser(riskDetails.description)}
            </MiddleText>
            <RowGridCenter spacing={24}>
              <RedirectButton label="Select Another Risk Profile" link="risk-profile/select" />
              <Button primary onClick={this.accept}>
                Accept Risk Profile
              </Button>
            </RowGridCenter>
          </ResultContainer>

          {/* Calling OTP */}
          <OtpBox
            handleClose={this.handleCloseOtpModal}
            openModal={this.state.showModalForRetakeRisk}
            url={
              this.props.initRetakeRiskAssessmentOtpSuccessData
                ? this.props.initRetakeRiskAssessmentOtpSuccessData.otpiFrameUrl
                : null
            }
            error={this.props.initRetakeRiskAssessmentOtpError}
          />
        </React.Fragment>
      );
    }
    return <LoadingOverlay show />;
  }
}
Result.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  riskScore: PropTypes.object,
  processing: PropTypes.bool,
  riskProfiles: PropTypes.array,
  introduction: PropTypes.object,
  setRiskProfileType: PropTypes.func,
  initRetakeRiskAssessmentOtp: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  riskScore: makeSelectRiskScore(),
  processing: makeSelectProcessing(),
  riskProfiles: makeSelectRiskProfiles(),
  introduction: makeSelectIntroduction(),
  isOTPCalled: makeSelectisOTPCalled(),
  initRetakeRiskAssessmentOtpSuccessData: makeSelectInitRetakeRiskAssessmentSuccessData(),
  initRetakeRiskAssessmentOtpError: makeSelectInitRetakeRiskAssessmentError(),
  retakeRiskAssessmentSuccess: makeSelectRetakeAssessmentSuccess(),
  retakeRiskAssessmentError: makeSelectRetakeAssessmentError(),
  isProcessingRetakeAssessment: makeSelectIsProcessingRetakeAssessment(),
  clientDetails: makeSelectClientDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    setRiskProfileType: (payload) => dispatch(setRiskProfileType(payload)),
    getRiskProfiles: () => dispatch(getRiskProfiles()),
    initRetakeRiskAssessmentOtp: (payload) => dispatch(initRetakeRiskAssessmentOtp(payload)),
    clearRiskAssessmentOtpData: () => dispatch(clearRiskAssessmentOtpData()),
    retakeRiskAssessment: (payload) => dispatch(retakeRiskAssessment(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Result);
