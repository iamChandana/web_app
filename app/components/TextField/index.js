import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import TextField from 'material-ui/TextField';
import Color from 'utils/StylesHelper/color';

const StyledTextField = styled(TextField)`
  width: ${(props) => (props.theme.width ? props.theme.width : '280px')};
  font-size: 18px;
  input {
    height: 23px;
  }
  // div {
  //   &::before,
  //   svg {
  //     display: none;
  //   }
  // }

  &.edit > div {
    &::after,
    &::before,
    svg {
      display: none;
    }
  }
  &:focus {
    background: none;
  }
  svg {
    color: Color.C_LIGHT_BLUE;
  }
  ul {
    margin: 0 10px;
    li {
      text-align: center;
    }
  }
`;

function CustomTextField(props) {
  const { width, ...rest } = props;
  const sTheme = {
    width,
  };
  return (
    <ThemeProvider theme={sTheme}>
      <StyledTextField {...rest} />
    </ThemeProvider>
  );
}

export default CustomTextField;
