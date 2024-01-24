import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import Grid from 'material-ui/Grid';
import Color from 'utils/StylesHelper/color';

const FundToRedeemContainer = styled(Grid)`
  padding: 16px 24px;
  background-color: ${(props) => (props.order === 'odd' ? '#f5f5f5' : '#fafafa')};
`;

const FundToRedeemInnerContainer = styled(Grid)`
  padding-top: 10px;
  & > div {
    padding-top: 5px;
    padding-right: 15px;
    padding-bottom: 5px;
    padding-left: 5px;

    &:first-of-type {
      border-right: 1px solid #cacaca;
      padding-left: 0;
    }

    &:last-of-type {
      padding-right: 0;
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

// hack to align the component with checkbox
const FundToRedeemInnerItem = styled.div`
  padding-left: 14px;
`;

export { FundToRedeemContainer, FundToRedeemInnerContainer, FundToRedeemInnerItem, StyledNumberFormat };
