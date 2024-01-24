import styled from 'styled-components';
import Card from 'material-ui/Card';

export const CardButton = styled(Card)`
  cursor: pointer;
  min-height: ${(props) => (props.minHeight ? props.minHeight : '72px')};
`;

export const CardNormal = styled(Card)`
  min-height: ${(props) => (props.minHeight ? props.minHeight : '144px')};
`;
