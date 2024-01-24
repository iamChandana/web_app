import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import _isEmpty from 'lodash/isEmpty';
import {
  setTitle,
  saveIntroduction,
  setStep,
  getRiskQuestionsAnswers,
  getAnnualIncome,
  saveIntroductionSuccess,
} from 'containers/OnBoarding/actions';
import {
  makeSelectIntroduction,
  makeSelectAnnualIncomeLOV,
  makeSelectSaveIntroSuccess,
  makeSelectProcessing,
} from 'containers/OnBoarding/selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { ColumnGridCenter } from 'components/GridContainer';
import LoadingOverlay from 'components/LoadingOverlay';
import { rejectBackButton } from 'utils/helpers';
import moment from 'moment';
import { numberWithCommas } from 'utils/StringUtils';
import { makeSelectClientDetails } from '../selectors';

import Form from './Form';

class Introduction extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      fullName,
      gender,
      birthDate,
      occupation,
      monthlySavings,
      noOfDependants,
      interests,
      id,
      educationLevel,
      investmentExperience,
      existingCommitments,
    } = props.clientDetails.info || {};
    const annualIncome = (occupation.length && occupation[0].yearlyIncome) || '';
    const dobDefault = moment()
      .subtract(18, 'years')
      .subtract(1, 'day');

    this.state = {
      fullName,
      gender: ['M', 'F'].includes(gender) ? gender : '',
      dateOfBirth: birthDate || dobDefault,
      annualIncome: annualIncome || 'none',
      monthlySavingsDisplay: monthlySavings ? 'RM' + numberWithCommas(monthlySavings) : null,
      noOfDependants: noOfDependants || 'none',
      hobby: interests ? interests.toUpperCase() : 'none',
      id,
      educationLevel: educationLevel || 'none',
      investmentExperience: investmentExperience || '',
      existingCommitments: existingCommitments || '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.saveIntroSuccess && nextProps.saveIntroSuccess === true) {
      this.props.history.push('/retake/risk-profile/question1');
    }
  }

  componentWillMount() {
    rejectBackButton();
    this.props.setStep(2);
    this.props.setTitle('Next, tell us on how would you react towards risk.');
    this.props.saveIntroductionSuccess(false);
  }

  handleInputChange(e) {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(values) {
    let clone = { ...values };
    if (clone.noOfDependants === '> 10') {
      clone.noOfDependants = 11;
    }
    const monthlySavings = clone.monthlySavingsDisplay.replace(/,/g, '');
    clone.monthlySavings = Number(monthlySavings.substr(2, monthlySavings.length - 1));
    delete clone.monthlySavingsDisplay;
    delete clone.id;

    clone = {
      ...clone,
      investmentExperience: clone.investmentExperience.split(','),
      existingCommitments: clone.existingCommitments.split(','),
    };

    this.props.saveIntroduction(clone);
    this.props.getRiskQuestionsAnswers();
  }

  render() {
    if (_isEmpty(this.props.lov)) {
      return <LoadingOverlay show />;
    }

    const { lov } = this.props;
    return (
      <ColumnGridCenter>
        <Form
          autoComplete="off"
          onSubmit={this.handleSubmit}
          handleInputChange={this.handleInputChange}
          initialValues={this.state}
          lov={lov}
          history={this.props.history}
        />
        <LoadingOverlay show={this.props.processing} />
      </ColumnGridCenter>
    );
  }
}

Introduction.propTypes = {
  setTitle: PropTypes.func,
  saveIntroduction: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  getRiskQuestionsAnswers: PropTypes.func,
  lov: PropTypes.any,
  saveIntroductionSuccess: PropTypes.func,
  saveIntroSuccess: PropTypes.bool,
  clientDetails: PropTypes.object,
  processing: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  introduction: makeSelectIntroduction(),
  annualIncomeLOV: makeSelectAnnualIncomeLOV(),
  lov: makeSelectLOV(),
  processing: makeSelectProcessing(),
  saveIntroSuccess: makeSelectSaveIntroSuccess(),
  clientDetails: makeSelectClientDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveIntroduction: (payload) => dispatch(saveIntroduction(payload)),
    getRiskQuestionsAnswers: () => dispatch(getRiskQuestionsAnswers()),
    getAnnualIncome: (payload) => dispatch(getAnnualIncome(payload)),
    saveIntroductionSuccess: (payload) => dispatch(saveIntroductionSuccess(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Introduction);
