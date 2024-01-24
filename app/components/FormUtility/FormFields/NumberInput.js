import React from 'react';
import PropTypes from 'prop-types';
import StyledInput from 'components/Input';
import NumberFormatCustom from 'components/NumberFormatCustom';

class NumberInputField extends React.Component {
  render() {
    const { input: { onChange, value }, ...rest } = this.props;
    return (
      <StyledInput
        {...rest}
        onChange={onChange}
        value={value}
        inputComponent={NumberFormatCustom}
        inputProps={{
          prefix: 'RM ',
        }}
      />
    );
  }
}

NumberInputField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
};

export default NumberInputField;
