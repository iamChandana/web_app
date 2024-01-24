/**
 *
 * Carousel
 *
 */

/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

import StyledCarousel, { Button } from './Atoms';

// import styled from 'styled-components';

class CustomCarousel extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    index: 0,
  };

  onCarouselChange = (i) => {
    this.setState({
      index: i,
    });
  };

  handleNext = () => {
    const { index } = this.state;
    const currentIndex = index;

    this.setState({
      index: currentIndex + 1,
    });
  };

  handlePrevious = () => {
    const { index } = this.state;
    const currentIndex = index;

    this.setState({
      index: currentIndex - 1,
    });
  };

  static GetNavigator(direction, component) {
    if (direction === 'left') {
      return (
        <Grid item xs={1}>
          <Button onClick={component.handlePrevious} disabled={component.state.index === 0}>
            <ChevronLeft />
          </Button>
        </Grid>
      );
    }

    return (
      <Grid item xs={1}>
        <Button onClick={component.handleNext} disabled={component.state.index === component.props.content.length - 1}>
          <ChevronRight />
        </Button>
      </Grid>
    );
  }

  render() {
    const { index } = this.state;
    const { settings, showNavigation, content } = this.props;
    const CarouselSettings = {
      showArrows: false,
      showThumbs: false,
      showStatus: false,
      autoPlay: true,
      interval: 5000,
      infiniteLoop: true,
      selectedItem: index,
      onChange: this.onCarouselChange,
      ...settings,
    };
    const CarouselGridSize = showNavigation ? 10 : 12;

    return (
      <Grid container alignItems="center" justify="center">
        {showNavigation && CustomCarousel.GetNavigator('left', this)}
        <Grid item xs={CarouselGridSize}>
          <StyledCarousel {...CarouselSettings}>{content.map((el, i) => <div key={i + 1}>{el}</div>)}</StyledCarousel>
        </Grid>
        {showNavigation && CustomCarousel.GetNavigator('right', this)}
      </Grid>
    );
  }
}

CustomCarousel.propTypes = {
  settings: PropTypes.object,
  showNavigation: PropTypes.bool,
  content: PropTypes.array,
};

CustomCarousel.defaultProps = {
  showNavigation: false,
};

export default CustomCarousel;
