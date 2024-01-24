import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { Link } from 'react-router-dom';

export const AvatarGrid = styled(Grid)`
  text-align: center;
`;
export const Container = styled.div`
  margin: 24px 40px;
`;

export const FullWidthGrid = styled(Grid)`
  width: 100%;
`;

export const UnPaddedGrid = styled(Grid)`
  padding: 0 12px !important;
`;

export const StyledLink = styled(Link)`
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #1d1d26;
`;

export const StyledBackImage = styled.img`
  width: 7px;
  height: 12px;
  margin-right: 5px;
`;
