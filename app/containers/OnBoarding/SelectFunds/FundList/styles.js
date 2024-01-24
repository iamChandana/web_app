import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Switch from 'material-ui/Switch';
import Select from 'material-ui/Select';
import Button from 'components/Button';
import Text from 'components/Text';
import Search from 'components/Search';
import Color from 'utils/StylesHelper/color';
import { RowGridLeft, ColumnGridLeft } from 'components/GridContainer';

export const StyledSwitch = styled(Switch)`
  span {
    color: ${Color.C_LIGHT_BLUE};
  }
`;
export const CardContainer = styled(RowGridLeft)`
  width: 100% !important;
  margin: 32px 0 !important;
`;

export const StyledSearch = styled(Search)`
  width: 400px;
  input {
    background-color: #ffffff;
    border: solid 1px #979797;
  }
`;

export const Container = styled.div`
  padding: 0 40px;
  padding-bottom: 180px;

  @media (max-width: 959px) {
    padding-bottom: 225px;
  }
`;
export const PaddedGrid = styled(Grid)`
  padding: 8px 12px;
  width: 100%;
  justify-content: space-between;
  display: flex;
`;
export const SwitchGrid = styled(Grid)`
  display: flex;
  align-items: center;
`;
export const FilterContainerSmall = styled.div`
    div {
      flex-direction: row !important;
      align-items: center;
      @media screen and (max-width: 768px) {
        flex-direction: column !important;
        align-items: flex-start;
      }
     div {
      @media screen and (max-width: 768px) {
        padding-left: 0;
        margin-left: 0;
      }
     }
    }
   .label {
      font-size: 12px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: right;
      opacity: 0.9;
      color: #979797;
    }
`;

export const TextNoData = styled(Text)`
  font-size: 20px;
  padding: 10px;
`;

export const StyledSelect = styled(Select)`
  width: 150px;
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  margin-left: 16px;
  margin-right: 25px;
  text-align: center;
  > div > div {
    margin-top: 5px;
  }
  &::before,
  &::after {
    display: none;
  }
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

export const FullWidthGrid = styled(Grid)`
  width: 100%;
`;

export const StyledImage = styled.img`
  margin-bottom: 30px;
  width: 50px;
  height: 33px;
`;
export const ModalBtn = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 4px;
`;

export const FilterGrid = styled(Grid)`
  @media (max-width: 1280px) {
    margin-top: 16px;
  }
`;
