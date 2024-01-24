import styled from 'styled-components';
import Select from 'material-ui/Select';
import Color from 'utils/StylesHelper/color';

const StyledSelect = styled(Select)`
  width: ${(props) => props.width || '281px'};
  margin: 0 28px;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize} !important` : '18px !important')};
  font-family: 'FSElliot-Pro' !important;
  &::after {
    display: none;
  }
  &:focus {
    background: none;
  }
  svg {
    color: ${(props) => (props.dropdowniconcolor ? props.dropdowniconcolor : Color.C_LIGHT_BLUE)};
  }
  ul {
    margin: 0 10px;
    li {
      text-align: center;
    }
  }
`;

export default StyledSelect;
