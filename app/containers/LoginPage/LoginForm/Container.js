import styled from 'styled-components';
import Paper from 'material-ui/Paper';

const Container = styled(Paper)`
  padding: 32px;
  min-height: 352px;
  width: 344px;
  border-radius: 5px !important;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2) !important;
  button {
    width: 100%;
  }
`;

export default Container;
