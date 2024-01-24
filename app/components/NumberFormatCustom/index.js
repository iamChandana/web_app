/**
 *
 * NumberFormatCustom
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, prefix, suffix, ...other } = props;
  const fprefix = prefix || 'RM';
  const fsuffix = suffix || '';
  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={(values) => {
        let finalValue = 0;
        if (values.value && typeof values.value === 'string' && values.floatValue !== 'NAN') {
          finalValue = parseInt(values.value, 10);
        }
        onChange(finalValue);
      }}
      decimalScale={0}
      thousandSeparator=" "
      prefix={fprefix}
      suffix={fsuffix}
      allowNegative={false}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
};

export default NumberFormatCustom;
