import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import NumberFormat from 'react-number-format';
import Color from 'utils/StylesHelper/color';

const StyledNumberFormat = styled(NumberFormat)`
  outline: none;
  border-bottom: solid 1px #cacaca;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.45;
  letter-spacing: normal;
  color: #1d1d26;
`;

function NumberInputWithLabel(props) {
  const { value, onChange, label, withDecimal } = props;
  return (
    <Grid container spacing={24}>
      <Grid item xs={6}>
        <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
          {label}
        </Text>
        <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
          <StyledNumberFormat
            thousandSeparator
            allowNegative={false}
            value={value || ''}
            placeholder="RM..."
            prefix={'RM '}
            decimalScale={2}
            fixedDecimalScale
            onValueChange={(values) => {
              const { value } = values;
              onChange(value);
            }}
          />
        </Text>
      </Grid>
    </Grid>
  );
}

export default NumberInputWithLabel;
