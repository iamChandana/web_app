import React, { PureComponent } from 'react';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import _has from 'lodash/has';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import Color from 'utils/StylesHelper/color';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import NumberFormat from 'react-number-format';
import { toMoneyFormat } from 'utils/StringUtils';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { generateXAxisLabel } from 'utils/graphHelper';

const ReturnValueContainer = styled.div`
  border-left: solid 5px ${Color.C_LIGHT_BLUE};
  padding-left: 16px;
`;

const OptimisticValueContainer = styled.div`
  border-left: solid 5px #f5a623;
  padding-left: 16px;
`;

const PessimisticValueContainer = styled.div`
  border-left: solid 5px #979797;
  padding-left: 16px;
`;

class GraphView extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  getPerformanceData(data) {
    let cummulativePerformance = 0;
    let calendarYearPerformance = 0;
    if (!_isEmpty(data) && !_isEmpty(data.performanceCalculationItem)) {
      cummulativePerformance = _find(data.performanceCalculationItem, {
        CalculationType: 'YeartoMonthEndPerformance',
      }).Value.toFixed(4);
      calendarYearPerformance = _find(data.performanceCalculationItem, {
        CalculationType: 'ThreeYearPerformancetoLastMonthEnd',
      }).Value.toFixed(4);
    }
    return { cummulativePerformance, calendarYearPerformance };
  }
  render() {
    const { projectionData, historyData, fetchingHistoryData, setTab, selectedTab } = this.props;
    const { loadingProjectionData: projectionGraphLoading, projectionData: projectionGraphData } = projectionData;
    const summaryPoint = projectionGraphData[projectionGraphData.length - 1] || {};
    const { optimistic, average, pessimistic, year } = summaryPoint;
    const { cummulativePerformance, calendarYearPerformance } = this.getPerformanceData(historyData);
    let xAxisTicks = [];
    if (!_isEmpty(historyData.threeYearPerformancetoLastMonthEnd)) {
      xAxisTicks = generateXAxisLabel(historyData.threeYearPerformancetoLastMonthEnd, 3);
      // xAxisTicks.splice(0, 0, historyData.threeYearPerformancetoLastMonthEnd[0].date);
    }
    return (
      <React.Fragment>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <Text
              display="inline-block"
              align="left"
              size="12px"
              color={selectedTab === 1 ? Color.C_LIGHT_BLUE : '#979797'}
              decoration={selectedTab === 1 ? 'underline' : '#none'}
              weight="bold"
              lineHeight="normal"
              cursor="pointer"
              onClick={() => {
                setTab(1);
              }}>
              PROJECTION
            </Text>
          </Grid>
          {/* <Grid item xs={2}>
              <Text
                align="left"
                size="12px"
                color={selectedTab === 2 ? Color.C_LIGHT_BLUE : '#979797'}
                decoration={selectedTab === 2 ? 'underline' : '#none'}
                weight="bold"
                lineHeight="normal"
                cursor="pointer"
                onClick={() => {
                  setTab(2);
                }}
              >
                HISTORY
              </Text>
            </Grid> */}
        </Grid>

        {
          selectedTab === 1 ? (
            <React.Fragment>
              <ReturnValueContainer>
                <Text align="left" size="10px" color="#1d1d26" weight="bold" opacity="0.4" lineHeight="normal">
                  Forecast Expected Return
                </Text>
                <Text display="inline-block" size="18px" color="rgb(0, 145, 218)" weight="bold" lineHeight={1.33}>
                  <NumberFormat
                    value={projectionGraphLoading ? '-' : average || ''}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                  />
                </Text>{' '}
                <Text display="inline-block" size="18px" color="#10151a" weight="bold" lineHeight={1.33}>
                  in {projectionGraphLoading ? '-' : year}
                </Text>
              </ReturnValueContainer>

              <OptimisticValueContainer>
                <Text
                  display="inline-block"
                  align="left"
                  size="14px"
                  color="#1d1d26"
                  weight="normal"
                  opacity="0.4"
                  lineHeight="normal">
                  Optimistic Scenario
                </Text>{' '}
                <Text
                  display="inline-block"
                  align="left"
                  size="14px"
                  color="#1d1d26"
                  weight="normal"
                  opacity="0.4"
                  lineHeight="normal">
                  <NumberFormat
                    value={projectionGraphLoading ? '-' : optimistic || ''}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                  />
                </Text>
              </OptimisticValueContainer>

              <PessimisticValueContainer>
                <Text
                  display="inline-block"
                  align="left"
                  size="14px"
                  color="#1d1d26"
                  weight="normal"
                  opacity="0.4"
                  lineHeight="normal">
                  Pessimistic Scenario
                </Text>{' '}
                <Text
                  display="inline-block"
                  align="left"
                  size="14px"
                  color="#1d1d26"
                  weight="normal"
                  opacity="0.4"
                  lineHeight="normal">
                  <NumberFormat
                    value={projectionGraphLoading ? '-' : pessimistic || ''}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                  />
                </Text>
              </PessimisticValueContainer>

              {projectionGraphLoading ? (
                <LoadingIndicator />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projectionGraphData}>
                    <XAxis dataKey="year" tickLine={false} />
                    <YAxis
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      width={150}
                      tickFormatter={(tick) => `RM ${toMoneyFormat(tick)}`}
                    />
                    <Line type="natural" dot={false} dataKey="optimistic" stroke="#f5a623" />
                    <Line type="natural" dot={false} dataKey="average" stroke={Color.C_LIGHT_BLUE} />
                    <Line type="natural" dot={false} dataKey="pessimistic" stroke="#979797" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </React.Fragment>
          ) : null
          // : (
          //   <Grid container spacing={24}>
          //     {fetchingHistoryData ? (
          //       <LoadingIndicator />
          //     ) : (
          //       <React.Fragment>
          //         <Grid item xs={12}>
          //           <Grid container>
          //             <Grid item xs={4}>
          //               <Text align="left" size="10px" weight="bold" lineHeight="normal" color="#1d1d26" opacity="0.4">
          //                 CUMULATIVE PERFORMANCE
          //               </Text>
          //               <Text align="left" size="16px" weight="600" lineHeight="normal" color={cummulativePerformance > 0?'#31c02b':'#d8232a'}>
          //                 {cummulativePerformance}%
          //               </Text>
          //             </Grid>
          //             <Grid item xs={4}>
          //               <Text align="left" size="10px" weight="bold" lineHeight="normal" color="#1d1d26" opacity="0.4">
          //                 CALENDAR YEAR PERFORMANCE
          //               </Text>
          //               <Text align="left" size="16px" weight="600" lineHeight="normal" color={calendarYearPerformance > 0?'#31c02b':'#d8232a'}>
          //                 {calendarYearPerformance}%
          //               </Text>
          //             </Grid>
          //           </Grid>
          //         </Grid>
          //         {_isEmpty(historyData) ? (
          //           <Grid item xs={12}>
          //             <Text align="left" size="16px" weight="600" lineHeight="normal">
          //               No graph data found
          //             </Text>
          //           </Grid>
          //         ) : (
          //           <Grid item xs={12}>
          //             <ResponsiveContainer width="100%" height={350}>
          //               <LineChart data={historyData.threeYearPerformancetoLastMonthEnd} margin={{ bottom: 15 }}>
          //                 <XAxis dataKey="date" angle={-25} textAnchor="end" tick={{ fontSize: 12 }} tickLine={false} ticks={xAxisTicks} />
          //                 <YAxis orientation="right" axisLine={false} tickLine={false} />
          //                 <CartesianGrid vertical={false} />
          //                 <Line dot={false} dataKey="value" stroke={Color.C_LIGHT_BLUE} />
          //               </LineChart>
          //             </ResponsiveContainer>
          //           </Grid>
          //         )}
          //       </React.Fragment>
          //     )}
          //   </Grid>
          // )
        }

        <Text align="left" size="10px" weight="normal" lineHeight="normal" color="#a3a3a3">
          DISCLAIMER: We assume that Forecast Expected Returns are normally distributed and that future prices are lognormally
          distributed, which is closer to reality. Hence, we transform the discrete returns and volatility into continuous form.
          Next, we can derive the annualized return and its interval of confidence. Finally, we convert back into discrete values.
          We are 95% confident that the mean returns fall within the Upper-bound (Optimistic scenario) and the Lower-bound
          (Pessimistic scenario).
        </Text>
      </React.Fragment>
    );
  }
}

GraphView.propTypes = {
  projectionData: PropTypes.object.isRequired,
  historyData: PropTypes.object,
  fetchingHistoryData: PropTypes.bool,
  setTab: PropTypes.func,
  selectedTab: PropTypes.number,
};

export default GraphView;
