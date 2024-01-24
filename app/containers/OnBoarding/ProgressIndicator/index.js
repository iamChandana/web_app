/**
 *
 * ProgressIndicator
 *
 */

import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Slider from 'rc-slider';
import Color from 'utils/StylesHelper/color';
import { setTitle, setStep } from 'containers/OnBoarding/actions';
import { makeSelectStep } from 'containers/OnBoarding/selectors';
import 'rc-slider/assets/index.css';

const SliderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0 !important;
  margin-bottom: 40px;
  height: 60px;
  background-color: #eeeef0 !important;
  padding: 0 !important;
  .rc-slider {
    max-width: 720px !important;
    margin-top: 19px;
  }
  .rc-slider-mark-text {
    opacity: 0.4;
    font-family: FSElliot-Pro;
    font-size: 10px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1d1d26;
  }
  .rc-slider-mark-text-active {
    opacity: 1;
    font-weight: bold;
  }
  .rc-slider-handle {
    width: 9px;
    height: 9px;
    background-color: ${Color.C_LIGHT_BLUE};
    margin-top: -3px;
  }
  .rc-slider-mark {
    top: 8px;
  }
`;

const SLIDER_MARKS = {
  1: '',
  2: 'Introduction',
  3: 'Risk Profile',
  4: 'Select Funds',
  5: 'Personal Details',
  6: 'Confirmation',
  7: 'Transfer Funds',
  8: '',
};
const SLIDER_MIN = 1;
const SLIDER_MAX = 8;
const SLIDER_STEP = 1;
// eslint-disable-next-line react/prefer-stateless-function
class ProgressIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.clickLabel = this.clickLabel.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  clickLabel(step) {
    if (this.props.step !== 7 && step > 1 && step < this.props.step) {
      this.redirect(step);
    }
  }

  redirect(step) {
    const data = {
      2: {
        title: 'Hello! Please tell us about yourself.',
        link: '/onboarding/introduction/introDetailInput',
      },
      3: {
        title: 'Next, we would like to know your risk appetite.',
        link: '/onboarding/risk-profile',
      },
      4: {
        title: 'Please choose the funds to invest in.',
        link: '/onboarding/select-funds',
      },
      5: {
        title: 'Next, please provide us with your personal details.',
        link: '/onboarding/personal-details',
      },
      6: {
        title: 'We\'re almost there! Please confirm your personal details.',
        link: '/onboarding/confirmation',
      },
      7: {
        title: 'Great! Let\'s start funding your investment.',
        link: '/onboarding/transfer-funds',
      },
    };

    this.props.setTitle(data[step].title);
    this.props.history.push(data[step].link);
  }

  render() {
    const { step } = this.props;
    return (
      <SliderContainer>
        <Slider
          min={SLIDER_MIN}
          value={step}
          max={SLIDER_MAX}
          dots={false}
          step={SLIDER_STEP}
          marks={SLIDER_MARKS}
          onChange={this.clickLabel}
          name="progress"
        />
      </SliderContainer>
    );
  }
}

ProgressIndicator.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  step: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  step: makeSelectStep(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect)(ProgressIndicator);
