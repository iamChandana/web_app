/* eslint-disable */
import styled from 'styled-components';
import Button from 'components/Button';
import Text from 'components/Text';
import AppBar from 'material-ui/AppBar';
import Grid from 'material-ui/Grid';
import { Link } from 'react-router-dom';
import HeaderBG from './images/dashboard-lifestyle-2.jpg';
import OnBoardingBG from './images/onboarding.jpg';
import MyClientsBG from './images/my-clients.jpg';
import LogBG from './images/log.jpg';

export const LogoutButton = styled(Button)`
  border: solid 1px #ffffff;
  color: #fff;
  background: transparent;
  width: 120px;
  height: 40px;

  background-color: ${(props) => (props.theme.isOnboarding ? 'rgba(29, 29, 38, 0.3)' : 'transparent')};
`;

export const StyledEditLink = styled(Link)`
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  text-decoration: underline;
  cursor: pointer;
`;
export const LogoImgWrap = styled.div`
  flex: 1;
`;
export const RiskButton = styled(Button)`
  @media (max-width: 720px) {
    display: none;
  }
  min-width: 154px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
  /* display: flex;
justify-content: space-evenly; */
  img {
    width: 20px;
    height: 15px;
    margin-right: 3px;
  }
  .info {
    margin-left: 5px;
  }
`;

export const AppBarContainer = styled(AppBar)`
  max-height: 200px;
  color: white;
  z-index: 0 !important;
  padding: 0 40px;
  background: ${(props) => {
    return props.theme.showOnBoardingBG
      ? `url(${OnBoardingBG})`
      : props.theme.isClients
      ? `url(${MyClientsBG})`
      : props.theme.isLogs
      ? `url(${LogBG})`
      : `url(${HeaderBG})`;
  }};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const HeaderTopBar = styled.div`
  display: flex;
  align-items: center;
  height: ${(props) => {return !props.isPortraitOrientation?'104px':'135px';}}; 

  > * {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const HeaderDashboardBar = styled(Grid)`
  height: 96px;
`;

export const MenuList = styled.nav`
  display: flex;
`;

export const MenuListItem = styled(Text)`
  margin-right: 19px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;

export const UserImage = styled.img`
  width: 64px;
  margin-right: 24px;
  height: 64px;
  background-color: #d8d8d8;
  box-shadow: 0 4px 12px 0 rgba(16, 16, 16, 0.2);
  border-radius: 50%;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;
export const InfoWrapper = styled.div`
  min-width: 32px;
`;

export const NavigationButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  color: white;
  font-family: 'FSElliot-Pro';
  font-size: 12px;
  margin-right: 8px;
  text-decoration: underline;
`;

export const TextOuterWrapper = styled.div`
  position: absolute;
  left: 50%;
`;

export const TextInnerWrapper = styled.div`
  position: relative;
  left: -50%;
  width: 100%;
`;

export const TextOuterWrapperTabletPortrait = styled.div`
  position: absolute;
  left: 100%;
  padding-top: 85px;
  width: 100%;
`;

export const TextInnerWrapperTabletPortrait = styled.div`
  position: relative;
  left: -94.5%;
`;

export const TextOuterWrapperTabletPortraitFundlistPage = styled.div`
  position: absolute;
  left: 100%;
  padding-top: 85px;
  width: 100%;
`;

export const TextInnerWrapperTabletPortraitFundlistPage = styled.div`
  position: relative;
  left: -96%;
`;

export const TextOuterWrapperTabletLandscape = styled.div`
  position: absolute;
  width: 100%;
`;

export const TextInnerWrapperTabletLandscape = styled.div`
  position: relative;
  left: 30%;
`;