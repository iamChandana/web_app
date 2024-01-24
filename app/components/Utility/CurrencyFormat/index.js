/**
 *
 * CurrencyFormat
 *
 */

import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';

const StyledNumberFormat = styled(NumberFormat)`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => (props.status === 'up' ? ' #35c12f' : props.status === 'down' ? Color.C_RED : '#000')};
`;

function CurrencyFormat(props) {
  const { value, prefix, status, suffix, decimalScale } = props;
    return (
      <StyledNumberFormat
        decimalSeparator={'.'}
        status={status}
        value={value}
        displayType={'text'}
        thousandSeparator
        prefix={prefix || 'RM'}
        suffix={suffix || ''}
        decimalScale={decimalScale?decimalScale:2}
        fixedDecimalScale
      />
    );
}

CurrencyFormat.propTypes = {
  value: PropTypes.number.isRequired,
};

export default CurrencyFormat;
