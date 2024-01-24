import React from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import DateField from 'containers/OnBoarding/Introduction/DateField';
import { required } from 'components/FormUtility/FormValidators';

const StyledDateField = styled(Field)`
width: ${(props) => props.width || '280px'};
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
  > div{
      &::before, &::after{
          content: ${(props) => props.disabled ? 'none' : ''};
      }
      input{
          text-align: left;
          font-size: ${(props) => props.fontSize}
      }
  }
`;

export default function EffectiveDatePicker(props) {
    const { fontSize, disabled } = props;
    return (
        <StyledDateField
            name="effectiveDate"
            disableFuture
            component={DateField}
            validate={required}
            label="EFFECTIVE DATE"
            width={props.width}
            fontSize={fontSize}
            disabled={disabled}
        />
    );
}