import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';

export default styled.button`
  width: ${(props) => (props.width ? props.width : '200px')};
  height: 40px;
  border-radius: 5px;
  font-size: 14px;
  font-family: FSElliot-Pro;
  display: ${(props) => (props.display ? props.display : 'flex')};
  justify-content: center;
  align-items: center;
  outline: none;
  cursor: pointer;
  color: ${(props) => (props.primary ? '#fff' : Color.C_LIGHT_BLUE)};
  background-color: ${(props) => (!props.primary ? '#fff' : Color.C_LIGHT_BLUE)};
  border: ${`1px solid ${Color.C_LIGHT_BLUE}`};
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  ${(props) => (props.paddingTop ? `padding-top: ${props.paddingTop};`: null)};
  
`;
