/**
 *
 * BloombergGraph
 *
 */

/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { extent, max, min } from 'd3-array';
import { axisTop, axisRight } from 'd3-axis';
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, line } from 'd3-shape';
import { timeParse, timeFormat } from 'd3-time-format';
import ResponsiveWrapper from 'components/ResponsiveWrapper';
import Color from 'utils/StylesHelper/color';

import './styles.css';
import Data from './data';

class BloombergGraph extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      periodId: props.periodId,
      graphData: props.graphData,
    };

    this.svg = null;
    this.xScale = scaleTime();
    this.yScale = scaleLinear();

    this.padding = 0;
    this.dimension = {
      width: 0,
      height: 0,
    };

    this.initialize = this.initialize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      periodId: nextProps.periodId,
      graphData: nextProps.graphData,
    });
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    this.initialize();
  }

  initialize() {
    const { node } = this;
    const { periodId, graphData } = this.state;
    if (!graphData || graphData.length < 0) {
      return;
    }
    let timeKey = 'date';
    //if (periodId === 0) {
    //  timeKey = 'dateTime';
    //}
    const parseTime = timeParse('%Y-%m-%d');
    //const hourParseTime = timeParse('%Y-%m-%dT%H:%M:%S%Z');
    //const hourFormat = timeFormat('%H:%M');
    const dayFormat = timeFormat('%d %b');
    const monthFormat = timeFormat('%b %Y');
    const yearFormat = timeFormat('%Y');

    //const timeParser = periodId === 0 ? hourParseTime : parseTime;
    const timeParser = parseTime;
    const minimumValue = min(graphData, d => d.value);
    const maximumValue = max(graphData, d => d.value);
    let minimum = (minimumValue - (minimumValue * 0.02)).toFixed(2); // 2%
    let maximum = (maximumValue + (maximumValue * 0.02)).toFixed(2); // 2%

    if (periodId === 0) {
      maximum = (maximumValue + (maximumValue * 0.025)).toFixed(2); // 3%  
    }

    this.padding = 50;
    this.dimension = {
      width: Math.max(this.props.parentWidth, 300) - this.padding,
      height: Math.max(this.props.parentWidth / 4, 400) - this.padding,
    };
    this.svg = select(node);
    this.svg.selectAll('*').remove();
    this.xScale.domain(extent(graphData, d => timeParser(d[timeKey]))).rangeRound([this.padding, this.dimension.width]);
    this.yScale.domain([minimum, maximum]).range([this.dimension.height, 50]);
    
    this.svg = select(node)
      .append('g')
      .attr('transform', `translate(0, 25)`);
      
    this.svg
      .append('g')
      .classed('BloombergGraph--XAxis', true)
      .call(
        axisTop(this.xScale)
          .ticks(5)
          .tickSize(-6)
          .tickFormat(d => {
            /*if (periodId === 0) {
              return hourFormat(d);
            } else if (periodId === 1) {
              return dayFormat(d);
            } else if (periodId === 3) {
              return yearFormat(d);
            }*/
            if (periodId === 0) {
              return dayFormat(d);
            } else {
              return monthFormat(d);
            }          
            return monthFormat(d);
          })
      );
      
    this.svg
      .append('g')
      .attr('transform', `translate(${this.dimension.width}, ${-this.padding})`)
      .classed('BloombergGraph--YAxis', true)
      .call(
        axisRight(this.yScale)
          .ticks(5)
          .tickSize(0)
      );
      
    this.svg
      .selectAll('g.BloombergGraph--YAxis g.tick')
      .append('line')
      .classed('grid-line', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', -(this.dimension.width - this.padding))
      .attr('y2', 0);
      
    const areaChart = area()
      .x(d => this.xScale(timeParser(d[timeKey])))
      .y0(d => this.yScale(d.value) - this.padding)
      .y1(this.dimension.height - this.padding);

    this.svg
      .append('path')
      // .classed('EducationGraph--AreaChart', true)
      .data([graphData])
      .attr('d', areaChart)
      .style('fill', Color.C_LIGHT_BLUE)
      .style('fill-opacity', '0.2');
      
    const lineBorder = line()
      .x(d => this.xScale(timeParser(d[timeKey])))
      .y(d => this.yScale(d.value) - this.padding);
      
    this.svg
      .append('path')
      .datum(graphData)
      .attr('d', lineBorder)
      .style('fill', 'none')
      .style('stroke', Color.C_LIGHT_BLUE)
      .style('stroke-width', '2');
  }

  render() {
    const { parentWidth } = this.props;

    const svgDimension = {
      width: Math.max(parentWidth, 300),
      height: Math.max(parentWidth / 4, 400),
    };

    return (
      <svg
        className="BloombergGraph"
        ref={node => (this.node = node)} // eslint-disable-line
        width={svgDimension.width}
        height={svgDimension.height}
      />
    );
  }
}

BloombergGraph.propTypes = {
  parentWidth: PropTypes.number,
  data: PropTypes.array,
};

export default ResponsiveWrapper(BloombergGraph);
