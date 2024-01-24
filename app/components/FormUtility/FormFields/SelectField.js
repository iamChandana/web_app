import React from 'react';
import PropTypes from 'prop-types';
import StyledSelect from 'components/Select';

class InputField extends React.Component {
  render() {
    const { input: { onChange, value }, ...rest } = this.props;
    return <StyledSelect {...rest} onChange={onChange} value={value} />;
  }
}

InputField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
  data: PropTypes.array,
};

export default InputField;
