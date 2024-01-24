import styled from 'styled-components';
import Paper from 'material-ui/Paper';

export const PaperForm = styled(Paper)`
  border-radius: 10px !important;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2) !important;
  min-height: ${(props) => (props.minHeightPaper ? props.minHeightPaper : '352px')};
  // width: 345px;
  max-width: 345px;
  padding: 32px;
  position: relative;

  button {
    width: 100%;
  }
`;
