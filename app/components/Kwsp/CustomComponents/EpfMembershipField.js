import React from 'react';
import PropTypes from 'prop-types';
import InputField from 'components/FormUtility/FormFields/InputField';
import { length8 } from 'components/FormUtility/FormValidators';
import { StyledField } from '../../../containers/OnBoarding/Components/index';

export default function EpfMembershipNumber(props) {
  const { isEpfVisible, width, disabled, edit, epfErrorMessage } = props;
  const maxEpfNumberLength = 8;
  return (
    <StyledField
      name="epfMembershipNumber"
      InputLabelProps={{
        shrink: true,
      }}
      component={InputField}
      width={width}
      label="EPF MEMBERSHIP NO"
      type="text"
      placeholder="..."
      opacity={isEpfVisible ? 1 : 0}
      validate={epfErrorMessage ? [length8] : false}
      disabled={disabled}
      borderBottom={!disabled ? '1px solid rgba(29, 29, 38, 0.5)' : ''}
      // eslint-disable-next-line consistent-return
      parse={(value) => {
        if (
          (value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= maxEpfNumberLength) && value !== '00000000' ||
          value === ''
        ) {
          return value;
        }
      }}
    />
  );
}

EpfMembershipNumber.propTypes = {
  epfErrorMessage: PropTypes.bool,
};
