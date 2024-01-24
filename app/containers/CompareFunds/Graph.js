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

const Container = styled.div`
  width: 100%;
`;

const LINE_COLOR = ['#bc8a54', '#e08272', '#848187'];

function Graph({
  perfData,
  xAxisTicks,
  funds,
}) {
  return (
    <Container>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={perfData} margin={{ top: 55, left: 20, bottom: 25 }}>
          <XAxis dataKey="date" angle={-25} textAnchor="end" tick={{ fontSize: 12 }} ticks={xAxisTicks} interval={0} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend
            iconType="circle"
            verticalAlign="top"
            align="left"
            height={'auto'}
            wrapperStyle={{ marginTop: '-25px', marginLeft: '30px' }}
          />
          {
            funds.map((obj, i) => <Line dataKey={obj.isin} name={obj.name} dot={false} stroke={LINE_COLOR[i]} />)
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
