/* eslint-disable */
import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Color from 'utils/StylesHelper/color';
import { MenuItem } from 'material-ui';
import BloombergGraph from 'components/BloombergGraph';
import Text from 'components/Text';
import InfoText from './InfoText';
import {
  ButtonGroup,
  Button,
  GridBloombergGraphContainer,
  GridBloombergGraphControllerItem,
  BloombergGraphContainerSubtitleText,
  StyledSelect,
} from './Atoms';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';

// import Placeholder from './images/bloomberg.png';
const market = [
  'FTSE Bursa Malaysia KLCI Index - Kuala Lumpur Composite Index',
  'MSCI Asia Pac',
  'FTSE Bursa Malaysia EMAS Index',
  'Dow Jones',
];

const colors = {
  negative: '#d8232a',
  positive: '#35c12f',
};

//const buttons = ['1D', '1M', '1Y', '5Y'];
const buttons = ['1M', '1Y', '3Y', '5Y'];

function BloombergGraphContainer(props) {
  const { periodId, marketId, handler, selectHandler, graphData } = props;
  //const latestValue = data.price[data.price.length - 1].value;
  let latestValue = null,
    changesInDecimal = 0,
    changesInPercentage = '0',
    infoTexts = [];

  if (graphData && !_isEmpty(graphData.quotesList)) {
    const { quotesList } = graphData;
    let openPRC = quotesList.filter((data) => data.Name === 'OPEN_PRC')[0];
    openPRC = openPRC ? openPRC.Double : 0.0;
    let low = quotesList.filter((data) => data.Name === 'LOW_1')[0];
    low = low ? low.Double : 0.0;
    let high = quotesList.filter((data) => data.Name === 'HIGH_1')[0];
    high = high ? high.Double : 0.0;
    let hstClose = quotesList.filter((data) => data.Name === 'HST_CLOSE')[0];
    hstClose = hstClose ? hstClose.Double : 0.0;
    let yrLow = quotesList.filter((data) => data.Name === 'YRLOW')[0];
    yrLow = yrLow ? yrLow.Double : 0.0;
    let yrHigh = quotesList.filter((data) => data.Name === 'YRHIGH')[0];
    yrHigh = yrHigh ? yrHigh.Double : 0.0;
    let trdPrc = quotesList.filter((data) => data.Name === 'TRDPRC_1')[0];
    trdPrc = trdPrc ? trdPrc.Double : 0.0;
    infoTexts = [
      { title: 'OPEN', value: openPRC },
      { title: 'DAY RANGE', value: low + ' - ' + high },
      { title: 'PREVIOUS CLOSE', value: hstClose },
      { title: '52WK RANGE', value: yrLow + ' - ' + yrHigh },
      //{ title: '1YR RETURN', value: '-' },
      //{ title: 'YTD RETURN', value: '-' },
    ];
    latestValue = trdPrc;
    changesInDecimal = trdPrc - hstClose;
    changesInPercentage = ((changesInDecimal / hstClose) * 100).toFixed(2);
  }

  //if (graphData && !_isEmpty(graphData.quotesList)) {
  //changesInDecimal = graphData.timeSeriesList[graphData.timeSeriesList.length - 1].value - graphData.timeSeriesList[0].value;
  //changesInPercentage = ((changesInDecimal / graphData.timeSeriesList[0].value) * 100).toFixed(2);
  //}

  const icon =
    changesInDecimal === 0 ? null : changesInDecimal > 0 ? (
      <ArrowDropUp style={{ fill: colors.positive }} />
    ) : (
      <ArrowDropDown style={{ fill: colors.negative }} />
    );

  const buttonList = buttons.map((button, i) => (
    <Button onClick={handler} key={`button-${i + 1}`} className={periodId === i ? 'active' : null} id={i}>
      {button}
    </Button>
  ));

  const infoTextList = infoTexts.map((info, i) => (
    <Grid key={`infotext-${i + 1}`} item xs={6} md={4}>
      <InfoText title={info.title} value={info.value} />
    </Grid>
  ));

  const now = moment();

  return (
    <GridBloombergGraphContainer container>
      <Grid item xs={12}>
        <Text color="#000" align="left" weight="bold" style={{ marginLeft: '-25px' }}>
          <StyledSelect value={marketId} onChange={selectHandler} dropdowniconcolor={Color.C_LIGHT_BLUE}>
            <MenuItem value={'.KLSE'}>{market[0]}</MenuItem>
            <MenuItem value={'.MIAPJ0000PUS'}>{market[1]}</MenuItem>
            <MenuItem value={'.FTFBMEMAS'}>{market[2]}</MenuItem>
            <MenuItem value={'.DJI'}>{market[3]}</MenuItem>
          </StyledSelect>
          <Text color="#90909a" display="inline" size="10px" fontStyle="italic" weight="normal">
            As of {now.format('HH:mm a') + ' EDT ' + now.format('DD/MM/YYYY')}
          </Text>
        </Text>
      </Grid>
      <Grid item xs={12} style={{ marginLeft: '-10px' }}>
        <BloombergGraphContainerSubtitleText color="#000" align="left" size="18px" weight="bold" display="inline-block">
          {icon}
          <NumberFormat value={latestValue || '-'} displayType={'text'} thousandSeparator />
        </BloombergGraphContainerSubtitleText>
        <BloombergGraphContainerSubtitleText
          color={changesInDecimal === 0 ? '#000' : changesInDecimal > 0 ? colors.positive : colors.negative}
          align="left"
          display="inline-block">
          <NumberFormat value={changesInDecimal || '-'} displayType={'text'} decimalScale={2} />
        </BloombergGraphContainerSubtitleText>
        <Text
          color={changesInDecimal === 0 ? '#000' : changesInDecimal > 0 ? colors.positive : colors.negative}
          align="left"
          display="inline-block">
          {changesInPercentage + '%'}
        </Text>
      </Grid>
      <GridBloombergGraphControllerItem item xs={12}>
        <BloombergGraphContainerSubtitleText color="#90909a" display="inline" size="12px">
          Sort by
        </BloombergGraphContainerSubtitleText>
        <ButtonGroup>{buttonList}</ButtonGroup>
      </GridBloombergGraphControllerItem>
      <Grid item xs={12} style={{ marginLeft: '-50px', marginBottom: '-65px' }}>
        <BloombergGraph graphData={graphData ? graphData.timeSeriesList : []} periodId={periodId} />
      </Grid>
      {infoTextList}
    </GridBloombergGraphContainer>
  );
}

BloombergGraphContainer.propTypes = {
  data: PropTypes.object,
  periodId: PropTypes.number,
  marketId: PropTypes.string,
  handler: PropTypes.func,
  selectHandler: PropTypes.func,
};

BloombergGraphContainer.defaultProps = {
  periodId: 0,
  marketId: 0,
};

export default BloombergGraphContainer;
