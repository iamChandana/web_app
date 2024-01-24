import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { colors } from 'utils/styles';

const StyledCarousel = styled(Carousel)`
  .carousel {
    .slide {
      height: ${(props) => (props.height ? `${props.height} !important` : '100px !important')};
    }

    .control-dots {
      margin: -6px 0;
      .dot {
        background-color: #1d1d26;
        box-shadow: none;
        opacity: 0.2;
        width: 36px;
        height: 3px;
        border-radius: 2px;

        &.selected {
          background-color: ${colors.primary};
          opacity: 1;
        }
      }
    }
  }
`;

export const Button = styled.button`
  color: ${colors.primary};
  cursor: pointer;
  display: block;
  margin: 0 auto;

  &:active,
  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export default StyledCarousel;
