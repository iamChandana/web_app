import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import { primaryFont } from 'utils/StylesHelper/font';

const Input = styled.input`
  height: 40px;
  border-radius: 5px;
  border: solid 1px #cacaca;
  width: 100%;
  padding: 10px 12px;
  font-family: ${primaryFont};
  // font-size: 14px;
  // font-weight: 400;

  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #f5f5f5;
    border: none;
  }
`;

function TextInput(props) {
  const { value, handleInputChange, label, name, ...rest } = props;
  return (
    <React.Fragment>
      {label && (
        <Grid item xs={12}>
          <Text size="10px" weight="bold" color="#1d1d26" align="left" opacity="0.4">
            {label}
          </Text>
        </Grid>
      )}
      <Grid item xs={12}>
        <Input value={value} name={name} onChange={handleInputChange} {...rest} autoComplete="off"/>
      </Grid>
    </React.Fragment>
  );
}

TextInput.propTypes = {
  value: PropTypes.any,
  handleInputChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  rest: PropTypes.object,
};

export default TextInput;
