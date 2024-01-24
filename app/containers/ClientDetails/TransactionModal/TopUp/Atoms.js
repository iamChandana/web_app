import styled from 'styled-components';
import Grid from 'material-ui/Grid';

const FundToTopUpContainer = styled(Grid)`
  background-color: ${(props) => (props.order === 'odd' ? '#f5f5f5' : '#fafafa')};
  padding: 16px 24px;
`;

const FundToTopUpInnerContainer = styled(Grid)`
  padding-top: 5px;

  & > div {
    &:first-of-type {
      border-right: 1px solid #cacaca;
      padding-right: 10px;
    }
    &:last-of-type {
      padding-left: 10px;
    }
  }
`;

export { FundToTopUpContainer, FundToTopUpInnerContainer };
