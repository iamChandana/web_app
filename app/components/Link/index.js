import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';

export const StyledLink = styled.a`
  color: ${Color.C_LIGHT_BLUE};
  text-decoration: ${(props) => props ? props.underline : 'none'};
`;
