import styled from 'styled-components';
import Grid from 'material-ui/Grid';

export const Container = styled.div`
  padding: 32px 40px;
  padding-bottom: 180px;

  @media (max-width: 959px) {
    padding-bottom: 225px;
  }
`;

export const FullWidthGrid = styled(Grid)`
  width: 100%;
`;

export const HalfGridWidth = styled(Grid)`
  width: 70%;
`;
