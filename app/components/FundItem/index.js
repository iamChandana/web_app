import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';

import Text from 'components/Text';
import Chip from 'components/Chip';
import Slider from 'components/Slider';
import Color from 'utils/StylesHelper/color';
import LinearProgress from 'material-ui/Progress/LinearProgress';
import CardWrapper from 'components/Utility/CardWrapper';
import { RowGridLeft, ColumnGridLeft, ColumnGridCenter } from 'components/GridContainer';
import { primaryFont } from 'utils/StylesHelper/font';

import DownloadIcon from './download-1x.svg';
import CloseIcon from './close.svg';

// import 'rc-slider/assets/index.css';
// import 'rc-tooltip/assets/bootstrap.css';
// import Tooltip from 'rc-tooltip';
// import Slider from 'rc-slider';

// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);

const Download = styled.img`
  margin-right: 8px;
`;
const Close = styled.img`
  float: right;
  cursor: pointer;
`;
const StyledCardWrapper = styled(CardWrapper)`
  padding: 24px;
  .initial-invesment {
    margin-left: 20%;
  }
`;

const StyledNumberFormat = styled(NumberFormat)`
  font-family: ${primaryFont};
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  /* border-bottom: ${(props) => (props.error ? 'solid 1px red' : 'solid 1px #cacaca')}; */
  color: #10151a;
  outline: none;
`;

const InvestmentGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;
const FullGrid = styled(Grid)`
  width: 100%;
`;
const TextError = styled.span`
  font-size: 10px;
  color: ${Color.C_RED};
  font-family: ${primaryFont};
`;
const GridSlider = styled(Grid)`
  /* .rc-slider-mark-text {
    width: 0% !important;
    margin-left: -2% !important;
  }
  .rc-slider-handle {
    display: none !important;
  } */
  .rc-slider {
    margin: 0 10px;
  }
`;
// const SLIDER_MIN = 1000;
// const SLIDER_MAX = 99000;
const SLIDER_STEP = 1;

function FundItem(props) {
  const { data, onClose, onSliderChange } = props;
  const SLIDER_MIN = data.minInitialInvestmentAmt || 1000;
  const SLIDER_MAX = data.maxInitialInvestmentAmt || 99000;
  const SLIDER_MARKS = {
    [SLIDER_MIN]: {
      style: { width: 0, marginLeft: 0 },
      label: SLIDER_MIN,
    },
    [SLIDER_MAX]: {
      style: { width: 0, marginLeft: 0, left: '90%' },
      label: SLIDER_MAX,
    },
  };

  const error = parseFloat(data.initialInvestment) < SLIDER_MIN;

  let chipName = '';
  if (data && data.assetbreakdown[0] && data.assetbreakdown[0].class) {
    chipName = data.assetbreakdown[0].class.toUpperCase();
  }

  return (
    <StyledCardWrapper>
      <ColumnGridLeft>
        <FullGrid item>
          <Chip name={chipName} bottom="22px" />
          <Close onClick={() => onClose(data)} src={CloseIcon} alt="Close" />
        </FullGrid>
        <FullGrid item xs={12}>
          <RowGridLeft>
            <Grid item>
              <Download src={DownloadIcon} alt="Download" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Text size="18px" weight="bold" color="#1d1d26" align="left">
                {data.name}
              </Text>
            </Grid>
            <GridSlider item xs={12} sm={5}>
              {/* <LinearProgress variant="determinate" value={normalise(data.initialInvestment)} /> */}
              <Slider
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={SLIDER_STEP}
                marks={SLIDER_MARKS}
                name="initial investment"
                onChange={(value) => onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX)}
                value={parseFloat(data.initialInvestment)}
                defaultValue={10000}
              />
              {/* <Slider
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                marks={SLIDER_MARKS}
                name="initial investment"
                value={parseFloat(data.initialInvestment)}
                defaultValue={10000}
                onChange={(values) => {
                  const { value } = values;
                  onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                }}
                tipFormatter={(value) => value}
              /> */}
              {/* <Range
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                value={[SLIDER_MIN, parseFloat(data.initialInvestment)]}
                tipFormatter={(value) => `RM ${value}`}
              /> */}
            </GridSlider>
            <Grid item xs={12} sm={3}>
              <ColumnGridLeft className="initial-invesment">
                <Grid>
                  <Text color="#1d1d26" lineHeight="1.67" size="12px" weight="bold" opacity="0.4" align="left">
                    INITIAL INVESTMENT
                  </Text>
                </Grid>
                <InvestmentGrid>
                  <StyledNumberFormat
                    value={parseFloat(data.initialInvestment)}
                    thousandSeparator
                    allowNegative={false}
                    prefix={'RM '}
                    decimalScale={2}
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      return floatValue >= SLIDER_MIN && floatValue <= SLIDER_MAX;
                    }}
                    onValueChange={(values) => {
                      const { value } = values;
                      onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                    }}
                  />
                  {error && <TextError>Must not be less than the minimum amount</TextError>}
                </InvestmentGrid>
              </ColumnGridLeft>
            </Grid>
          </RowGridLeft>
        </FullGrid>
      </ColumnGridLeft>
    </StyledCardWrapper>
  );
}

FundItem.propTypes = {
  data: PropTypes.object,
  onClose: PropTypes.func,
  onSliderChange: PropTypes.func,
};

FundItem.defaultProps = {
  data: {},
};

export default FundItem;
