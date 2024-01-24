import styled from 'styled-components';
import { colors, text } from 'utils/styles';

export const Button = styled.button`
  background-color: transparent;
  border: 1px solid ${colors.primary};
  border-radius: 5px;
  color: ${colors.primary};
  cursor: pointer;
  font-family: ${text.fontFamily.primary};
  font-size: 14px;
  padding: 10px 15px;

  img {
    margin-right: 4px;
  }
`;
