import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { MAX_SM_DEVICE_BREAKPOINT } from 'utils/StylesHelper/mediaQuery';
import BackgroundImage from './images/login_bg.jpg';
import { isIE } from "react-device-detect";

export const GridContainer = styled(Grid)`
  background: url(${BackgroundImage});
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100vh;
  padding: 28px 40px 52px 40px;

  @media (max-width: ${MAX_SM_DEVICE_BREAKPOINT}) {
    padding: 10px;
  }
`;

export const GridContainerContent = styled(Grid)`
  padding-top: 0;
  padding-bottom: 0;
`;

export const LoginPageWrapper = styled.div`
  background: url(${BackgroundImage});
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  padding: 20px;
  min-height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 100%;
`;

export const ComponentWrapper = styled.div`
  text-align: right;
  ${isIE?'margin-top: 60px;':null}
`;
