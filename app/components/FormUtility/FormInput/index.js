import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TextField } from 'redux-form-material-ui';

const InputLabel = styled(TextField)`
  &&.--bordered {
    input {
      height: 40px;
      border-radius: 5px;
      border: solid 1px #cacaca;
    }

    input:before {
      content: none;
    }
  }
`;

function FormInput(props) {
  return (
    <InputLabel
      {...props}
      InputLabelProps={{
        shrink: true,
      }}
      label={props.label}
      margin="normal"
      fullWidth
    />
  );
}

FormInput.propTypes = {
  label: PropTypes.string,
};

export default FormInput;
