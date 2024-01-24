/**
 *
 * Input
 *
 */

import Input from 'material-ui/Input';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  margin: 0 5px;
  &::after {
    background-color: '#333333';
  }
  input {
    width: ${(props) => (props.width ? props.width : '87px')};
    text-align: center;
    font-family: 'FSElliot-Pro';
    font-size: ${(props) => props.size || '18px'};
    color: ${(props) => props.color || '#333333'};
  }
`;
export default StyledInput;
