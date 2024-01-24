/**
 *
 * Slider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';

function StyledSlider(props) {
  const { onChange, value, marks, min, max, step, widthSlider} = props;
  return <Slider min={min} max={max} marks={marks} step={step} dots={false} onChange={onChange} value={value} style={{ width: widthSlider?widthSlider:'100%'}}/>;
}

StyledSlider.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
  marks: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

export default StyledSlider;
