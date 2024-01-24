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
  const fprefix = prefix || '';
  const fsuffix = suffix || '';
  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value && typeof values.value === 'string' ? parseInt(values.value, 10) : values.value,
            name,
          },
        });
      }}
      thousandSeparator
      prefix={fprefix}
      suffix={fsuffix}
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
