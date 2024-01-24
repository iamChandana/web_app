/* stylelint-disable */
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Color from 'utils/StylesHelper/color';

export const GridItem = styled(Grid)`
  padding: 10px 20px;
  ${({ secondary }) =>
    secondary &&
    `
    background-color: ${Color.C_LIGHT_BLUE};
    text-align: center;
    span, button {
      color: white;
    }
  `};
`;

export const Button = styled.button`
  cursor: pointer;
  display: block;
  float: right;

  &:active,
  &:focus {
    outline: none;
  }
`;

export const Container = styled(Grid)`
  max-height: 380px;
  overflow-y: auto;
`;
