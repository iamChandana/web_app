/* stylelint-disable */
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { Carousel } from 'react-responsive-carousel';
import Color from 'utils/StylesHelper/color';
import { primaryFont } from 'utils/StylesHelper/font';

export const GridItemContent = styled(Grid)`
  padding-top: 2.5%;
  padding-bottom: 1.8%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 100px; /* fallback */
  max-height: 200px; /* fallback */
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
`;

export const Button = styled.button`
  background-color: transparent !important;
  border: 1px solid #000 !important;
  border-radius: 4px;
  color: #000;
  cursor: pointer;
  font-family: ${primaryFont};
  font-size: 14px;
  padding: 10px 20px;
  text-transform: capitalize;
`;

export const GridItemNewsHeader = styled(Grid)`
  padding-bottom: 20px;

  & > span {
    margin-bottom: 5px;
  }
`;

export const StyledCarousel = styled(Carousel)`
  padding-top: 100px;
  padding-left: 50px;
  padding-right: 30px;
  width: 100%;
  color: #000;

  @media (min-width: 1200px) {
    min-width: 60%;
    padding-left: 100px;
    padding-right: 0;
  }

  .control-dots {
    position: absolute;
    bottom: 0;
    text-align: left;
    width: 100%;

    .dot {
      box-shadow: none;
      width: 36px;
      height: 4px;
      opacity: 0.4;
      border-radius: 2.5px;
      background-color: #fff;

      &:hover,
      &.selected {
        background-color: ${Color.C_LIGHT_BLUE};
      }
    }
  }
`;
