import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';

const StyledImage = styled.img`
  width: 88px;
  height: 88px;
  border: solid 1px #cacaca;
  cursor: pointer;
  &&.selected {
    border: ${`solid 1px ${Color.C_LIGHT_BLUE}`};
  }
`;

export default StyledImage;
