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
  saveDraft,
  getDraft,
} from 'containers/OnBoarding/actions';
import {
  makeSelectIntroduction,
  makeSelectAnnualIncomeLOV,
  makeSelectSaveIntroSuccess,
  makeSelectProcessing,
  makeSelectCifDetails,
  makeSelectDraftDetails,
  makekwspCashIntroDetails,
} from 'containers/OnBoarding/selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { ColumnGridCenter } from 'components/GridContainer';
import LoadingOverlay from 'components/LoadingOverlay';
import { rejectBackButton } from 'utils/helpers';
import moment from 'moment';
import { numberWithCommas } from 'utils/StringUtils';

import Form from './Form';

class Introduction extends React.Component {
  constructor(props) {
    super(props);
    const {
      fullName,
      gender,
      dateOfBirth,
      annualIncome,
      monthlySavings,
      noOfDependants,
      hobby,
      educationLevel,
      investmentExperience,
      existingCommitments,
    } = props.introduction || {};
    const dobDefault = moment()
      .subtract(18, 'years')
      .subtract(1, 'day');
    this.state = {
      fullName,
      gender: gender || 'none',
      dateOfBirth: dateOfBirth || dobDefault,
      annualIncome: annualIncome || 'none',
      monthlySavingsDisplay: monthlySavings ? `RM${numberWithCommas(monthlySavings)}` : null,
      noOfDependants: noOfDependants || 'none',
      hobby: hobby || 'none',
      educationLevel: educationLevel || 'none',
      investmentExperience: investmentExperience || [],
      existingCommitments: existingCommitments || [],
      isDateFieldDisabled: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaveDraft = this.handleSaveDraft.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.convertToArrOfStrings = this.convertToArrOfStrings.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.saveIntroSuccess && nextProps.saveIntroSuccess === true) {
      this.props.history.push('/onboarding/risk-profile');
    }
    if (this.props.kwspCashIntroDetails.idType === 'NRIC') {
      this.setState({
        isDateFieldDisabled: true,
      });
    }
  }

  componentWillMount() {
    const { cifDetails, getDraft } = this.props;
    rejectBackButton();
    this.props.setStep(2);
    this.props.setTitle('Hello! Please tell us about yourself.');
    this.props.saveIntroductionSuccess(false);
    getDraft(cifDetails);
  }

  getOptions(data, value) {
    const options = value.map((ele) => {
      const currentData = data.find((ele2) => ele2.codevalue === ele);
      if (currentData) {
        return {
          value: currentData.codevalue,
          label: currentData.description,
        };
      }
      return false;
    });
    return options;
  }

  handleSaveDraft(values) {
    const clone = { ...values };
    // clone.dateOfBirth = moment(values.dateOfBirth).format('DD-MM-YYYY');
    if (clone.noOfDependants === '> 10') {
      clone.noOfDependants = 11;
    }
    if (clone.monthlySavingsDisplay) {
      const monthlySavings = clone.monthlySavingsDisplay.replace(/,/g, '');
      clone.monthlySavings = Number(monthlySavings.substr(2, monthlySavings.length - 1));
      delete clone.monthlySavingsDisplay;
    }

    if (clone.existingCommitments && clone.existingCommitments.length) {
      clone.existingCommitments = clone.existingCommitments.map((item) => (item.value ? item.value : item));
    }

    if (clone.investmentExperience && clone.investmentExperience.length) {
      clone.investmentExperience = clone.investmentExperience.map((item) => (item.value ? item.value : item));
    }

    this.props.saveDraft(clone);
  }

  handleInputChange(e) {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  convertToArrOfStrings(values) {
    if (typeof values[0] === 'string') {
      return values;
    } else {
      return values.map((ele) => ele.value);
    }
  }

  handleSubmit(values) {
    const clone = {
      ...values,
      existingCommitments: this.convertToArrOfStrings(values.existingCommitments),
      investmentExperience: this.convertToArrOfStrings(values.investmentExperience),
    };
    if (clone.noOfDependants === '> 10') {
      clone.noOfDependants = 11;
    }
    const monthlySavings = clone.monthlySavingsDisplay.replace(/,/g, '');
    clone.monthlySavings = Number(monthlySavings.substr(2, monthlySavings.length - 1));
    delete clone.monthlySavingsDisplay;
    this.props.saveIntroduction(clone);
    this.props.getRiskQuestionsAnswers();
  }

  render() {
    const { lov, draftDetails, introduction } = this.props;
    const { isDateFieldDisabled } = this.state;
    const {
      fullName,
      gender,
      dateOfBirth,
      annualIncome,
      monthlySavings,
      noOfDependants,
      hobby,
      educationLevel,
      investmentExperience,
      existingCommitments,
    } = introduction || {};

    if (_isEmpty(lov)) {
      return <LoadingOverlay show />;
    }
    if (_isEmpty(draftDetails) || _isEmpty(draftDetails.data)) return <LoadingOverlay show />;

    let formValues = {};
    let dobDefault;
    if (this.props.kwspCashIntroDetails.idType === 'NRIC') {
      dobDefault = this.props.kwspCashIntroDetails.dateOfBirth;
    } else {
      dobDefault = moment()
        .subtract(18, 'years')
        .subtract(1, 'day');
    }

    const investmentExperienceLOV = lov.Dictionary[35].datadictionary;
    const existingCommitmentsLOV = lov.Dictionary[36].datadictionary;

    if (Object.values(draftDetails).length && Object.keys(draftDetails.data).length > 2 && _isEmpty(this.props.introduction)) {
      const { data } = draftDetails;
      let savedDateOfBirth = data.dateOfBirth;

      if (savedDateOfBirth) {
        savedDateOfBirth =
          typeof savedDateOfBirth === 'string' && savedDateOfBirth.includes('/')
            ? new Date(moment(savedDateOfBirth, 'DD/MM/YYYY'))
            : new Date(data.dateOfBirth);
      }

      formValues = {
        fullName: data.fullName || fullName,
        gender: data.gender || gender || 'none',
        dateOfBirth: savedDateOfBirth || dateOfBirth || dobDefault,
        annualIncome: data.annualIncome || annualIncome || 'none',
        educationLevel: data.educationLevel || educationLevel || 'none',
        investmentExperience:
          data.investmentExperience && data.investmentExperience.length
            ? this.getOptions(investmentExperienceLOV, data.investmentExperience)
            : [],
        existingCommitments:
          data.existingCommitments && data.existingCommitments.length
            ? this.getOptions(existingCommitmentsLOV, data.existingCommitments)
            : [],
        monthlySavingsDisplay:
          data && data.monthlySavings
            ? `RM${numberWithCommas(data.monthlySavings)}`
            : monthlySavings
            ? `RM${numberWithCommas(monthlySavings)}`
            : null,
        noOfDependants: data.noOfDependants || noOfDependants || 'none',
        hobby: data.hobby || hobby || 'none',
      };
    } else {
      formValues = {
        fullName,
        gender: gender || 'none',
        dateOfBirth: dateOfBirth || dobDefault,
        annualIncome: annualIncome || 'none',
        educationLevel: educationLevel || 'none',
        investmentExperience:
          investmentExperience && investmentExperience.length
            ? this.getOptions(investmentExperienceLOV, investmentExperience)
            : [],
        existingCommitments:
          existingCommitments && existingCommitments.length ? this.getOptions(existingCommitmentsLOV, existingCommitments) : [],
        monthlySavingsDisplay: monthlySavings ? `RM${numberWithCommas(monthlySavings)}` : null,
        noOfDependants: noOfDependants || 'none',
        hobby: hobby || 'none',
      };
    }

    return (
      <ColumnGridCenter>
        <Form
          autoComplete="off"
          onSubmit={this.handleSubmit}
          handleInputChange={this.handleInputChange}
          initialValues={formValues}
          handleSaveDraft={this.handleSaveDraft}
          lov={lov}
          draftDetails={draftDetails.data}
          isDateFieldDisabled={isDateFieldDisabled}
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
  introduction: PropTypes.object,
  getRiskQuestionsAnswers: PropTypes.func,
  lov: PropTypes.any,
  saveDraft: PropTypes.func,
  draftDetails: PropTypes.object,
  processing: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  introduction: makeSelectIntroduction(),
  annualIncomeLOV: makeSelectAnnualIncomeLOV(),
  lov: makeSelectLOV(),
  processing: makeSelectProcessing(),
  saveIntroSuccess: makeSelectSaveIntroSuccess(),
  cifDetails: makeSelectCifDetails(),
  draftDetails: makeSelectDraftDetails(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveIntroduction: (payload) => dispatch(saveIntroduction(payload)),
    getRiskQuestionsAnswers: () => dispatch(getRiskQuestionsAnswers()),
    getAnnualIncome: (payload) => dispatch(getAnnualIncome(payload)),
    saveIntroductionSuccess: (payload) => dispatch(saveIntroductionSuccess(payload)),
    saveDraft: (payload) => dispatch(saveDraft(payload)),
    getDraft: (payload) => dispatch(getDraft(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Introduction);
