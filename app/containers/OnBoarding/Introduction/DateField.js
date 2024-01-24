import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _findIndex from 'lodash/findIndex';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';

const StyledDatePicker = styled(DatePicker)`
  &::after {
    display: none;
  }
  >div{
    &:: before{
      background-image: none !important;
      background:${(props) => props.disabled && 'none' || '#000 !important'} ;
    }
  }
  input {
    font-family: 'FSElliot-Pro';
    font-size: 18px;
    text-align: center;
    color: #000000;
  }
`;

class DateField extends React.Component {
  renderLabel = (date) => {
    if (date && date.isValid()) {
      const finalDate = date.format('DD/MM/YYYY');
      return finalDate;
    }
    return 'DD/MM/YYYY';
  };
  render() {
    const { input, input: { onChange, value }, ...rest } = this.props;
    let tmp = moment(input.value);

    if (typeof input.value === 'string' && input.value.length) {
      if (input.value.length < 11) {
        tmp = moment(input.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
      } else {
        tmp = moment(input.value).format('YYYY-MM-DD');
      }
    }
    return (
      <StyledDatePicker
        labelFunc={this.renderLabel}
        emptyLabel="dd/mm/yyyy"
        format="DD/MM/YYYY"
        {...rest}
        onChange={onChange}
        value={tmp}
      />
    );
  }
}

DateField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
  data: PropTypes.array,
};

export default DateField;
