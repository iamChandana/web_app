import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DatePicker } from 'material-ui-pickers';
import Color from 'utils/StylesHelper/color';
import moment from 'moment';

const StyledDatePicker = styled(DatePicker)`
  width: ${(props) => (props.fullWidth ? '100%' : '280px')};
  &.edit > div {
    &::after,
    &::before,
    svg {
      display: none;
    }
  }
  input {
    height: 23px;
    font-family: 'FSElliot-Pro';
    font-size: 14px;
    text-align: left;
    color: #000000;
  }
`;
const TextError = styled.p`
  font-size: 10px;
  color: ${Color.C_RED};
  text-align: left;
`;
class DateField extends React.Component {
  constructor() {
    super();
    this.invalidDate = 'Invalid date';
  }

  formatInputFieldValue(props) {
    const { meta: { initial } } = props;
    return initial !== this.invalidDate ? !initial.trim().length : true;
  }

  // eslint-disable-next-line no-undef
  renderLabel = (date) => {
    if (date && date.isValid()) {
      const d1 = moment(date).format('DD/MM/YYYY');
      return d1;
    }
    return 'DD/MM/YYYY';
  };

  render() {
    const {
      input,
      meta: { touched, error },
      shouldCheckIfEmpty,
      edit,
      ...rest

    } = this.props;
    let tmp = 'Invalid Date';

    if (typeof input.value === 'string') {
      if (input.value.length < 11) {
        tmp = moment(input.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
      } else {
        tmp = moment(input.value).format('YYYY-MM-DD');
      }
    } else {
      tmp = moment(input.value).format('YYYY-MM-DD');
    }
    return (
      <div>
        <StyledDatePicker
          labelFunc={this.renderLabel}
          emptyLabel="dd/mm/yyyy"
          format="DD/MM/YYYY"
          {...rest}
          {...input}
          error={touched && error}
          value={tmp}
          keyboard={false}
          invalidDateMessage=""
          placeholder="DD/MM/YYYY"
        />
        {(edit || touched) && (error || input.value === 'DD/MM/YYYY') && <TextError>{error !== 'Required' ? 'Required' : error}</TextError>}
        {
          (edit && shouldCheckIfEmpty && this.formatInputFieldValue(this.props)) ?
            <TextError size="12px" color="#fff" align="left">
              {`To update ${this.props.checkIfEmptyLabel}, client must contact Customer Care Center`}
            </TextError> :
            ''
        }
      </div>
    );
  }
}

DateField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
  data: PropTypes.array,
  meta: PropTypes.object,
};

export default DateField;
