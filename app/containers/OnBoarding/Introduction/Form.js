/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-useless-escape */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui/Menu';
import moment from 'moment';
import Button from 'components/Button';
import { required, minValue1 } from 'components/FormUtility/FormValidators';
import { numberWithCommas } from 'utils/StringUtils';

import FormText from './FormText';
import InputField from './InputField';
import SelectField from './SelectField';
import DateField from './DateField';
import MultiSelect from './MultiSelect';
// import NumberInput from './InputCurrencyField';

const StyledButton = styled(Button)`
  margin: 40px 10px;
`;

const MultiSelectSection = styled.div`
  font-size: 18px;
  color: #1a1a1a;
  line-height: 2.55;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: ${(props) => props.$justifyContent || 'normal'};
  @media screen and (max-width: 1200px) {
    font-size: 14px;
  }
`;

const MultiSelectWrapper = styled.div`
  font-size: 18px;
  line-height: initial;
  width: ${(props) => props.$width};
`;

const StyledField = styled(Field)`
  &.placeholder > div > div {
    color: #000000;
    opacity: 0.4;
    font-family: 'FSElliot-Pro';
  }
`;

const SecondFormSetContainer = styled.div`
  margin-top: 48px;
`;

const maxMonthlySavingAmount = 1000000000;

function IntroductionForm(props) {
  const {
    handleSubmit,
    submitting,
    initialValues,
    valid,
    lov,
    formState,
    handleSaveDraft,
    draftDetails,
    isDateFieldDisabled,
  } = props;
  const { gender, annualIncome, noOfDependants, hobby, educationLevel } = initialValues;
  const ageMaxDate = moment()
    .subtract(18, 'years')
    .format('YYYY-MM-DD');
  const hasValues = formState && !_isEmpty(formState.values);
  const genderPlaceholder = !!(hasValues && formState.values.gender === 'none');
  const annualIncomePlaceholder = !!(hasValues && formState.values.annualIncome === 'none');
  const noOfDependantsPlaceholder = !!(hasValues && formState.values.noOfDependants === 'none');
  const hobbyPlaceholder = !!(hasValues && formState.values.hobby === 'none');
  const educationLevelPlaceholder = !!(hasValues && formState.values.educationLevel === 'none');

  const annualIncomeLOV = lov.Dictionary[5].datadictionary;
  const Interest = lov.Dictionary[16].datadictionary;
  // const Gender = lov.Dictionary[11].datadictionary;
  const educationLevelLOV = lov.Dictionary[34].datadictionary;
  const investmentExperienceLOV = lov.Dictionary[35].datadictionary;
  const existingCommitmentsLOV = lov.Dictionary[36].datadictionary;

  // eslint-disable-next-line eqeqeq
  if (hasValues && formState.values.noOfDependants == 11) {
    formState.values.noOfDependants = '> 10';
  }

  let saveDraftDisabled = true;

  const emptyArrayRemover = (falsyValues) => falsyValues.filter((item) => (Array.isArray(item) ? item.join('') : item));

  if (formState && formState.values) {
    const falsyValues = Object.values(formState.values).filter((item) => item && item !== 'none' && item);

    if (emptyArrayRemover(falsyValues).length > 2) {
      saveDraftDisabled = false;
    } else {
      saveDraftDisabled = true;
    }
  }

  // options generator for multi Select
  const getOptions = (data) => data.map((item) => ({ value: item.codevalue, label: item.description }));

  // valid property from redux-form is not checking array values, So here's the function
  // returns boolean value
  const checkMutliOptionsHasSelected = () => {
    if (formState && formState.values) {
      const { investmentExperience: valueA, existingCommitments: valueB } = formState.values;
      return !(valueA.length && valueB.length);
    }
    return false;
  };

  const getValue = (data, value) => {
    if (!value) return [];
    if (typeof value[0] === 'object') return value;

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
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
      <Grid item xs={12}>
        <FormText>
          My name is
          <Field
            name="fullName"
            width="200px"
            parse={(value) => {
              if (
                (value &&
                  value.trim().length > 0 &&
                  /^[a-zA-Z@&\/.,\"(\)\-'`\s]*$/.test(value) &&
                  parseInt(value.length, 10) <= 100) ||
                value === ''
              ) {
                return value;
              }
            }}
            component={InputField}
            type="text"
            placeholder="full name"
            validate={[required]}
          />
          , I am a successful
          <StyledField
            name="gender"
            width="141px"
            component={SelectField}
            validate={required}
            className={genderPlaceholder ? 'placeholder' : ''}>
            {gender === 'none' && (
              <MenuItem value="none" disabled>
                my gender
              </MenuItem>
            )}

            <MenuItem value="F">Woman</MenuItem>
            <MenuItem value="M">Man</MenuItem>
          </StyledField>
        </FormText>
      </Grid>
      <Grid item xs={12}>
        <FormText>
          and I was born on
          <Field
            name="dateOfBirth"
            width="137.8px"
            maxDate={ageMaxDate}
            maxDateMessage="Must be 18 or older."
            component={DateField}
            disabled={isDateFieldDisabled}
            validate={required}
            style={{ borderBottom: isDateFieldDisabled ? '1px solid rgba(29, 29, 38, .5)' : '0px' }}
          />
          . I earn
          <StyledField
            name="annualIncome"
            width="265px"
            component={SelectField}
            validate={required}
            className={annualIncomePlaceholder ? 'placeholder' : ''}>
            {annualIncome === 'none' && (
              <MenuItem value="none" disabled>
                my income
              </MenuItem>
            )}
            {annualIncomeLOV.map((option) => {
              if (option.codevalue !== 'NA') {
                return (
                  <MenuItem key={option.id} value={option.codevalue}>
                    {option.description}
                  </MenuItem>
                );
              }
            })}
          </StyledField>
          annually.
        </FormText>
      </Grid>
      <Grid item xs={12}>
        <FormText>
          I save
          <Field
            name="monthlySavingsDisplay"
            width="144px"
            component={InputField}
            placeholder="savings amount"
            validate={[required, minValue1]}
            parse={(value) => {
              let saving = value.trim();
              if (saving.length > 1) {
                saving = saving.substr(2, saving.length - 1);
                saving = saving.replace(/,/g, '');
              }
              if (saving && saving.length > 0 && /^[0-9]*$/.test(saving)) {
                const num = Number(saving);
                if (num > maxMonthlySavingAmount) {
                  return `RM${numberWithCommas(maxMonthlySavingAmount)}`;
                }
                return `RM${numberWithCommas(num)}`;
              }
              if (saving.length > 0 && !isNaN(saving)) {
                return `RM${numberWithCommas(saving.substr(0, saving.length - 1))}`;
              }
              return null;
            }}
          />
          every month. I support
          <StyledField
            name="noOfDependants"
            width="141px"
            component={SelectField}
            validate={required}
            className={noOfDependantsPlaceholder ? 'placeholder' : ''}>
            {noOfDependants === 'none' && (
              <MenuItem value="none" disabled>
                no.
              </MenuItem>
            )}
            {['0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '> 10'].map((data, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <MenuItem key={i} value={data}>
                {data}
              </MenuItem>
            ))}
          </StyledField>
          dependants at home.
        </FormText>
      </Grid>
      <Grid item xs={12}>
        <FormText>
          In my spare time, I like
          <StyledField
            name="hobby"
            width="160px"
            component={SelectField}
            validate={required}
            className={hobbyPlaceholder ? 'placeholder' : ''}>
            {hobby === 'none' && (
              <MenuItem value="none" disabled>
                my interest
              </MenuItem>
            )}
            {Interest.map((option) => (
              <MenuItem key={option.id} value={option.codevalue}>
                {option.description}
              </MenuItem>
            ))}
          </StyledField>
        </FormText>
      </Grid>

      <SecondFormSetContainer>
        <Grid item xs={12}>
          <FormText>
            The highest education level I have attained is
            <StyledField
              name="educationLevel"
              width="230px"
              component={SelectField}
              validate={required}
              className={educationLevelPlaceholder ? 'placeholder' : ''}>
              {educationLevel === 'none' && (
                <MenuItem value="none" disabled>
                  my education level
                </MenuItem>
              )}
              {educationLevelLOV.map((option) => {
                if (option.codevalue !== 'NA') {
                  return (
                    <MenuItem key={option.id} value={option.codevalue}>
                      {option.description}
                    </MenuItem>
                  );
                }
              })}
            </StyledField>
            . I have related
          </FormText>
        </Grid>
        <Grid item xs={12}>
          <MultiSelectSection>
            investment experience in
            <MultiSelectWrapper $width="295px">
              <MultiSelect
                options={getOptions(investmentExperienceLOV)}
                onChange={(values) => props.change('investmentExperience', values)}
                placeholder="my experience"
                value={getValue(
                  investmentExperienceLOV,
                  (formState && formState.values && formState.values.investmentExperience) || null,
                )}
              />
            </MultiSelectWrapper>
            . I curently have existing commitments
          </MultiSelectSection>
        </Grid>
        <Grid item xs={12}>
          <MultiSelectSection $justifyContent="center">
            such as
            <MultiSelectWrapper $width="265px">
              <MultiSelect
                options={getOptions(existingCommitmentsLOV)}
                onChange={(values) => props.change('existingCommitments', values)}
                placeholder="my commitments"
                value={getValue(
                  existingCommitmentsLOV,
                  (formState && formState.values && formState.values.existingCommitments) || null,
                )}
              />
            </MultiSelectWrapper>
          </MultiSelectSection>
        </Grid>
      </SecondFormSetContainer>

      <Grid container direction="row" justify="center" alignItems="flex-start">
        <StyledButton
          type="button"
          disabled={saveDraftDisabled}
          primary
          onClick={() => handleSaveDraft({ ...draftDetails, ...props.formState.values })}>
          Save
        </StyledButton>
        <StyledButton type="submit" disabled={!valid || submitting || checkMutliOptionsHasSelected()} primary>
          Continue
        </StyledButton>
      </Grid>
    </form>
  );
}

IntroductionForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  initialValues: PropTypes.object,
  formState: PropTypes.object,
  valid: PropTypes.bool,
  lov: PropTypes.object,
  handleSaveDraft: PropTypes.func,
  draftDetails: PropTypes.object,
  isDateFieldDisabled: PropTypes.bool,
  change: PropTypes.func,
};

const mapStateToProps = (state) => ({
  formState: state.form.introduction, // <== Inject the form store itself
});

function mapDispatchToProps(dispatch) {
  return {
    change: (name, value) => dispatch(change('introduction', name, value)),
  };
}

const ReduxIntroductionForm = reduxForm({
  form: 'introduction',
  destroyOnUnmount: false,
  enableReinitialize: true,
})(IntroductionForm);

// export default ReduxIntroductionForm;
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxIntroductionForm);
