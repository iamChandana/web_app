import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Search from 'components/Search';
import Select from 'material-ui/Select';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';
import DatePicker from 'material-ui-pickers/DatePicker';
import Text from 'components/Text';

export const Container = styled.div`
  padding: 32px 40px 150px;
`;

export const FullWidthGrid = styled(Grid)`
  width: 100%;
  margin-top: ${(props) => (props.top ? props.top : 0)};
  &.filter {
    margin-bottom: 24px;
  }

  &.--95 {
    width: 95%;
  }
`;

export const FilterContainerSmall = styled.div`
  div {
    flex-direction: row !important;
    align-items: center;
    @media screen and (max-width: 1024px) {
      flex-direction: column !important;
      align-items: flex-start;
    }
    div {
      @media screen and (max-width: 1024px) {
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

export const StyledSearch = styled(Search)`
  width: 400px;
  /* margin-top: 16px; */
  input {
    width: 400px !important;
  }
`;

export const Filter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .label {
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: right;
    color: #979797;
  }
`;
export const RefreshBtn = styled.button`
  width: 120px;
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  font-family: 'FSElliot-Pro';
`;
export const StyledSelect = styled(Select)`
  width: 112px;
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  margin-left: 16px;
  margin-right: 25px;
  text-align: center;
  font-weight: bolder;
  font-size: 12px;
  > div > div {
    margin-top: 5px;
    font-size: 12px;
  }
  &::before,
  &::after {
    display: none;
  }
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

export const AddFundsBtn = styled(Button)`
  width: 144px;
  margin-top: -10px;
  img {
    margin-right: 8px;
  }
  display: inline-block;
`;

export const StyledDatePicker = styled(DatePicker)`
  visibility: hidden;
  height: 0;
`;

export const FundName = styled(Text)`
  font-size: 14px;
  @media screen and (max-width: 1366px) {
    max-width: 400px;
  }
  @media screen and (max-width: 1024px) {
    max-width: 350px;
  }
  @media screen and (max-width: 768px) {
    max-width: 150px;
    font-size: 12px;
  }
  overflow-wrap: break-word;
`;

export const FundInfoSubText = styled(Text)`
  font-size: 10px;
  @media screen and (max-width: 1366px) {
    max-width: 400px;
  }
  @media screen and (max-width: 1024px) {
    max-width: 350px;
  }
  @media screen and (max-width: 768px) {
    max-width: 150px;
    font-size: 10px;
  }
  overflow-wrap: break-word;
`;

export const CancelTitleGrid = styled(Grid)`
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    padding-bottom: 50px;
  }
  padding-top: 0px;
  padding-bottom: 20px;
`;

export const CancelImageGrid = styled(Grid)`
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    padding-bottom: 71px;
  }
  padding-top: 0px;
  padding-bottom: 15px;
`;

export const CancelMessageGrid = styled(Grid)`
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    padding-bottom: 60px;
  }
  padding-top: 0px;
  padding-bottom: 20px;
`;
