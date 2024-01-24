import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { primaryFont } from 'utils/StylesHelper/font';
import { MAX_SM_DEVICE_BREAKPOINT } from 'utils/StylesHelper/mediaQuery';
import { isSafari, isFirefox, isIE } from 'react-device-detect';

export const GridMain = styled(Grid)`
  align-items: ${isIE ? 'center' : 'flex-end'};
  ${isIE ? 'bottom: 0; position: fixed; margin-bottom: 20;' : null}
`;

export const GridItem = styled(Grid)`
  &:nth-of-type(2) {
    position: relative;
  }
`;

export const HorizontalList = styled.ul`
  list-style-type: none;
  max-width: ${isSafari || isFirefox ? '900px' : '800px'};

  @media (max-width: ${MAX_SM_DEVICE_BREAKPOINT}) {
    display: block;
    margin: 0 auto;
  }
`;

export const HorizontalListItem = styled.li`
  color: #fff;
  cursor: pointer;
  float: left;
  font-family: ${primaryFont};
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;

  &:last-of-type {
    cursor: auto;
  }

  &:not(:last-of-type) {
    padding-right: 10px;
    border-right: 1px solid #fff;
  }

  &:not(:first-of-type) {
    padding-left: 10px;
  }

  span {
    text-transform: none;
  }
`;

export const Button = styled.button`
  background-color: #676775;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: block;
  float: right;
  font-family: ${primaryFont};
  font-size: 14px;
  opacity: 0.75;
  padding: 10px 20px;
  right: 0;
  ${isIE ? 'margin-right: 40px; margin-bottom: 20px;' : null}

  @media (max-width: ${MAX_SM_DEVICE_BREAKPOINT}) {
    float: none;
    margin: 0 auto;
  }

  img {
    margin-right: 8px;
  }
`;
