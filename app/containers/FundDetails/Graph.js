import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import _isEmpty from 'lodash/isEmpty';

const Container = styled.div`
  width: 100%;
`;

function Graph({
  graphData,
  xAxisTicks,
  fund,
  displayFundGraph,
  displayFundBenchmarkGraph
}) {
  return (
    <Container>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={graphData} margin={{ top: 35, left: 5, bottom: 35 }}>
          <XAxis dataKey="date" angle={-25} textAnchor="end" tick={{ fontSize: 12 }} ticks={xAxisTicks} interval={0} />
          <YAxis label={{ value: 'in %', angle: -90, position: 'insideLeft' }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => `${value}%`}/>
          <Legend iconType="circle" verticalAlign="top" align="left" height={60} wrapperStyle={{ marginTop: '-8px', marginLeft: '30px' }} />
          {displayFundGraph ?
            (<Line dataKey={fund.ric} name={fund.name} dot={false} stroke={Color.C_LIGHT_BLUE} />) : null
          }          
          {displayFundBenchmarkGraph ?
            (<Line dataKey={fund.benchMarkRic} name={fund.benchMarkName} dot={false} stroke={Color.C_GRAY} />) : null
          }
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}

Graph.propTypes = {
  perfData: PropTypes.array,
  perfGraphName: PropTypes.string,
  benchmarkGraphName: PropTypes.string,
};

export default Graph;
