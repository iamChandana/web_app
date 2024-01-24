import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import NumberFormat from 'react-number-format';
import Color from 'utils/StylesHelper/color';

const AssetClassLabel = styled.span`
  display: inline-block;
  margin-right: 10px;
  margin-left: 5px;
  opacity: 0.4;
  text-transform: uppercase;
`;

const FundToSwitchContainer = styled(Grid)`
  background-color: ${(props) => (props.order === 'odd' ? '#f5f5f5' : '#fafafa')};
  padding: 16px 24px;
`;

const FundToSwitchInnerContainer = styled(Grid)`
  padding-top: 10px;

  & > div {
    &:first-of-type {
      border-right: 1px solid #cacaca;
      width: 165px;
    }

    &:nth-of-type(2) {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
`;

const StyledNumberFormat = styled(NumberFormat)`
  border-bottom: solid 1px #cacaca;
  outline: none;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  text-align: left;
  width: 100%;
  color: ${Color.C_GRAY};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Img = styled.img`
  display: block;
  margin: 0 auto;
`;

const StyledSelect = styled(Select)`
  float: left;
  width: 100%;
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  text-align: left;
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

const Wrapper = styled.div`
  padding-left: 10px;
`;

const DownloadWrapper = styled.div`
  & > div {
    position: relative;
    left: 7px;
    top: 18px;
  }
`;

const AlertContent = styled(Grid)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const AlertActionContainer = styled(Grid)`
  text-align: center;
  padding-bottom: 10px;

  & > button {
    &:first-of-type {
      margin-right: 5px;
    }
    &:last-of-type {
      margin-left: 5px;
    }
  }
`;

const AlertDisclaimerButton = styled.button`
  font-family: inherit;
  font-size: inherit;
  color: ${Color.C_LIGHT_BLUE};
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;

  &:focus,
  &:active {
    outline: none;
  }
`;

export {
  AssetClassLabel,
  FundToSwitchContainer,
  FundToSwitchInnerContainer,
  StyledNumberFormat,
  StyledSelect,
  Img,
  Wrapper,
  DownloadWrapper,
  AlertContent,
  AlertActionContainer,
  AlertDisclaimerButton,
};
