import styled from 'styled-components';
import Button from 'components/Button';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import BackgroundImage from './fund-details-header.jpg';
import Color from 'utils/StylesHelper/color';
import { isTablet } from "react-device-detect";

export const Header = styled.div`
  height: 144px;
  background: url(${BackgroundImage});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 24px 40px;
`;
// 12.9
// portrait : 1024, 1296
// landscape : 1366, 954
// 9.7
// portrait : 768, 954
// landscape : 1024, 698
let ContenWrapper1;
if (!isTablet) {
  ContenWrapper1 = styled.div`
    padding: 32px 28px;
    margin-bottom: ${(props) => (props.fundCode ? '0' : '150px')};             
  `;
} else { // @media only screen not working not sure why. support iPad first. 
  // unable to detect real time device rotation or orientation
  if (window.innerWidth === 768 && window.innerHeight === 954) { // portrait 9.7 iPad
    ContenWrapper1 = styled.div`
      padding: 32px 28px;
      margin-bottom: ${(props) => (props.fundCode ? '0' : '150px')};   
      height: 180%;                                   
    `;
  } else if (window.innerWidth === 1024 && window.innerHeight === 698) { // landscape 9.7 iPad
    ContenWrapper1 = styled.div`
      padding: 32px 28px;
      margin-bottom: ${(props) => (props.fundCode ? '0' : '150px')};   
      height: 220%;                                  
    `;
  } else  if (window.innerWidth === 1024 && window.innerHeight === 1296) { // portrait 12.9 iPad
    ContenWrapper1 = styled.div`
      padding: 32px 28px;
      margin-bottom: ${(props) => (props.fundCode ? '0' : '150px')};   
      height: 150%;                                   
    `;
  } else if (window.innerWidth === 1366 && window.innerHeight === 954) { // landscape 12.9 iPad
    ContenWrapper1 = styled.div`
      padding: 32px 28px;
      margin-bottom: ${(props) => (props.fundCode ? '0' : '150px')};   
      height: 170%;                                    
    `;
  } else { // other unknown screen size
    ContenWrapper1 = styled.div`
      padding: 32px 28px;
      margin-bottom: ${(props) => (props.fundCode ? '0' : '150px')};   
      height: 200%;                                    
    `;    
  }
}

export const ContenWrapper = ContenWrapper1;

export const PdfButton = styled(Button)`
  img {
    width: 15.9px;
    height: 15.4px;
    margin-right: 8px;
  }

  margin: 50px 4px;
  min-width: 224px;
`;

export const FullGridWidth = styled(Grid)`
  width: 100%;
`;

export const AddPortfolioBtn = styled(Button)`
  width: 160px;
  height: 40px;
  border-radius: 5px;
  background-color: #fff;
  border: none;
`;

export const Head1 = styled(Text)`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #28333e;
`;

export const Head2 = styled(Text)`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #28333e;
`;

export const Details = styled(Text)`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #28333e;
  text-align: justify;
`;

export const StyledDivider = styled(Divider)`
  margin: 16px 0 !important;
`;

export const UnitLabel = styled(Text)`
  font-size: 10px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  opacity: 0.4;
  letter-spacing: normal;
  text-align: left;
`;

export const UnitValue = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: #10151a;

  &.label {
    font-size: 10px !important;
  }
`;

export const PerformanceUnitValue = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => (props.value < 0? Color.C_RED: Color.C_GREEN)};

  &.label {
    font-size: 10px !important;
  }
`;
export const ContentGrid = styled(Grid)`
  padding: 0 12px !important;
`;

export const FundsName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  margin: 15px 0;
`;

export const ContainerImage = styled.div`
  position: relative;
  text-align: center;
  color: white;
`;

export const ContainerImageCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 40%;
  transform: translate(-50%, -50%);
  color: #6F6F73;
  font-size: 18px;
`;