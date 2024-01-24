import React from 'react';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';
import moment from 'moment';
import InputField from 'components/FormUtility/FormFields/InputField';
import { minLength8 } from 'components/FormUtility/FormValidators';
import EpfMembershipNumber from 'components/Kwsp/CustomComponents/EpfMembershipField';
import Grid from 'material-ui/Grid';
import { RowGridCenter, RowGridRight } from 'components/GridContainer';
import Color from 'utils/StylesHelper/color';
import DateField from 'containers/OnBoarding/Introduction/DateField';

const GridHere = styled(Grid)`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const Form = styled.div`
  position: relative;
  margin-top: 10px;
  width: 100%;
`;

const StyledField = styled(Field)`
  > div {
    &::before,
    &::after {
      background-color: #cacaca;
    }
  }

  label {
    opacity: 0.4;
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
  input,
  div {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #1d1d26;
    &::before,
    &::after {
      background-image: ${(props) => props.borderBottom && 'none'} !important;
      background: ${(props) => (props.disabled && 'none') || (props.borderBottom && 'currentColor')} !important;
    }
  }
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyledDateField = styled(Field)`
  width: 280px;
  label {
    opacity: 0.4;
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: ${(props) => props.lineHeightLabel || 1.0};
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
  > div {
    input {
      font-size: 14px;
      text-align: left;
    }
  }
`;

class KwspFields extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { epfMembershipNumber } = this.props;
    if (epfMembershipNumber) {
      this.props.change('epfMembershipNumber', epfMembershipNumber);
    }
  }

  disableFutureDate(date) {
    return date.diff(moment(), 'months') >= 1;
  }
  render() {
    const { onChangeKwspApplicationNumber, onChangeKwspApplicationDate, disabled, disableAll } = this.props;
    return (
      <Form autoComplete="off">
        <RowGridCenter spacing={24}>
          <GridHere item>
            <Field component={EpfMembershipNumber} isEpfVisible disabled={disabled || disableAll} />
          </GridHere>
          <GridHere item>
            <StyledField
              component={InputField}
              name="kwspApplicationNumber"
              parse={(value) => {
                if ((value && value.trim().length > 0 && /^[0-9]*$/.test(value)) || value === '') {
                  return value;
                }
              }}
              onChange={(e, index) => onChangeKwspApplicationNumber(e, index)}
              label={'KWSP 9N SERIAL NO.'}
              placeholder="..."
              borderBottom={'1px solid rgba(29, 29, 38, .5)'}
              validate={minLength8}
              disabled={disableAll}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              multiline={disableAll}
              rows={5}
            />
          </GridHere>
        </RowGridCenter>
        <RowGridRight spacing={24}>
          <GridHere item>
            <StyledDateField
              name="applicationDate"
              component={DateField}
              disablePast
              validate={false}
              label="KWSP 9N APPLICATION DATE"
              onChange={(dateValue) => onChangeKwspApplicationDate(dateValue)}
              shouldDisableDate={this.disableFutureDate}
              disabled={disableAll}
            />
          </GridHere>
        </RowGridRight>
      </Form>
    );
  }
}

const KWSPFields = reduxForm({
  form: 'KWSPFields', // a unique identifier for this form
  destroyOnUnmount: false,
})(KwspFields);

export default KWSPFields;
