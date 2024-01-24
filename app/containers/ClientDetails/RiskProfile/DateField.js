import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DatePicker } from 'material-ui-pickers';

const StyledDatePicker = styled(DatePicker)`
  &::after {
    display: none;
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
      return date.format('DD/MM/YYYY');
    }
    return 'DD/MM/YYYY';
  };
  render() {
    const {
      input: { onChange, value },
      ...rest
    } = this.props;
    return (
      <StyledDatePicker
        labelFunc={this.renderLabel}
        emptyLabel="dd/mm/yyyy"
        format="DD/MM/YYYY"
        {...rest}
        onChange={onChange}
        value={value}
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
