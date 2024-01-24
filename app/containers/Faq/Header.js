import styled from 'styled-components';
import Grid from 'material-ui/Grid';

import BG from './images/dashboard-lifestyle.jpg';

const Header = styled.div`
  height: 200px;
  background-image: url(${BG});
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export default Header;
