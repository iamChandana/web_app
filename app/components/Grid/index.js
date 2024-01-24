import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { MAX_SM_DEVICE_BREAKPOINT } from 'utils/styles';

export const GridPadded = styled(Grid)`
  background-color: ${(props) => (props.bgcolor ? props.bgcolor : 'transparent')};
  padding: ${(props) => (props.padding ? props.padding : '40px')};

  @media (max-width: ${MAX_SM_DEVICE_BREAKPOINT}) {
    padding: 10px;
  }
`;
