/* stylelint-disable */
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Select from 'components/Select';
import Color from 'utils/StylesHelper/color';

export const GridBloombergGraphContainer = styled(Grid)`
  background-color: #fafafa;
  padding: 20px;
`;

export const GridBloombergGraphControllerItem = styled(Grid)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const BloombergGraphContainerSubtitleText = styled(Text)`
  margin-right: 8px;
  margin-top: 10px;
`;

export const ButtonGroup = styled.div`
  display: inline-block;
  width: auto;
`;

export const Button = styled.button`
  border: 1px solid ${Color.C_LIGHT_BLUE};
  color: ${Color.C_LIGHT_BLUE};
  cursor: pointer;
  font-family: 'FSElliot-Pro', arial;
  font-size: 12px;
  min-width: 50px;
  height: 30px;

  &.active {
    background-color: ${Color.C_LIGHT_BLUE};
    color: #fff;
  }

  &:first-of-type {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-of-type {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

export const StyledSelect = styled(Select)`
  color: #000 !important;
  font-size: 14px;
`;
