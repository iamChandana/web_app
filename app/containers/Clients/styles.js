import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import Color from 'utils/StylesHelper/color';

import Text from 'components/Text';
import Search from 'components/Search';
import { RowGridLeft, ColumnGridLeft } from 'components/GridContainer';

export const ListContainer = styled(Grid)`
  width: calc(100% - 72px);
  padding: 32px;
`;

export const CardContainer = styled(RowGridLeft)`
  width: 100% !important;
  margin: 32px 0;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  padding: 45px 40px 40px 40px;
  .--search-below {
    margin-bottom: 16px;
  }
`;

export const FilterContainerSmall = styled.div`
  float: right;
  width: auto;
  @media screen and (max-width: 1200px) { 
    margin-top: -24px;
  }
  div {
    float: right;
    width: auto;
    @media screen and (max-width: 1200px) {
      flex-direction: column !important;
      align-items: flex-start;
      margin-right: 0;
      width: 150px;
    }
    div {
      width: 200px;
      @media screen and (max-width: 1200px) {
        padding-left: 0;
        margin-left: 0;
        width: 150px;
      }
      
      div div {
        box-sizing: border-box;
        padding-right: 10px;
        padding-left: 20px;
        text-align: left;
      }
    }
  }
 .label {
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 3.33 !important;
    letter-spacing: normal;
    opacity: 0.9;
    color: #979797;
    @media screen and (max-width: 1200px) { 
      line-height: 1.33 !important;
      width: 100%;
      text-align: left !important;
    }
  }
`;

export const StyledSearch = styled(Search)`
  input {
    background-color: #ffffff;
    border: solid 1px #979797;
  }
`;

export const Container = styled.div`
  padding: 32px 40px;
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
export const Filter = styled.div`
  @media screen and (max-width: 1200px) {
      margin-top: 24px;
  }
  .label {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.33;
    letter-spacing: normal;
    text-align: right;
    color: #979797;
  }
`;
export const RefreshBtn = styled.button`
  width: 100%;
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  cursor: pointer;
  outline: none;
  float: right;
  display: inline-block;
  font-family: 'FSElliot-Pro';
  
  img {
    margin-right: 5px;
  }
  @media screen and (max-width: 768px) {
    margin-top: 24px;
  }
  @media screen and (max-width: 1200px) {
     float: none;
     margin-top: 24px;
  }
`;
export const StyledSelect = styled(Select)`
  width: ${(props) => props.width || '112px'};
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  margin-left: 16px;
  margin-right: 25px;
  text-align: center;
  font-size: 12px;
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

export const LastUpdatedText = styled(Text)`
  margin-top: 8px;
  margin-bottom: 30px;
  span {
    color: #1d1d26;
  }
`;

export const SearchAutoCompleteWrapper = styled.div`
  @media screen and (max-width: 1200px) {
    margin-top: 24px;
  }
`;
