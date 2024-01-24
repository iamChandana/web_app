import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';

export const ProfileInfoContainer = styled(Grid)`
  // height: 232px;
  padding-bottom: 44px;
  background-color: #1d1d26;
  display: flex;
`;

export const InvestmentDataContainer = styled.div`
  height: 80px;
  background-color: #2b2b34;
  display: flex;
  .label {
    opacity: 0.75;
    font-size: 12px;
    color: #fff;
    line-height: 1.67;
  }
`;

export const TabContainer = styled.div`
  height: 48px;
  background-color: rgb(0, 112, 168);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  cursor: pointer;
  .active {
    background-color: ${Color.C_LIGHT_BLUE};
  }
`;

export const StyledNumberFormat = styled(NumberFormat)`
  font-size: 20px;
  @media screen and (max-width: 1024px) {
    font-size: 16px;
  }

  color: #fff;
  font-weight: bold;
  line-height: 1.4;
  text-align: center;
`;

export const TotalNetInvestedWrapper = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 10px;
    width: 10px;
    margin-left: 5px;
    cursor: pointer;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none !important;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InterestGrid = styled(Grid)`
  margin-bottom: 30px !important;
  margin-left: 40px !important;
  @media (max-width: 922px) {
    margin-left: 2px !important;
  }
`;

export const StatusGrid = styled(Grid)`
  margin-top: 25px !important;
  margin-left: 40px !important;
  @media (max-width: 922px) {
    margin-left: 2px !important;
  }
`;

export const InterestChip = styled.div`
  min-width: 127px;
  height: 24px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const DetailsText = styled(Text)`
  margin-bottom: 10px;
`;
export const SubText = styled(Text)`
  font-size: 14px;
  margin: 0px 10px 3px 10px;
  @media (max-width: 922px) {
    margin: 0px 1px 1px 1px;
  }
`;
export const Nvaldiv = styled.div`
  align-self: center;
  margin-right: 50px;
  margin-left: 50px;
`;
