import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import Text from 'components/Text';
import Chip from 'components/Chip';
import Slider from 'components/Slider';
import _isEmpty from 'lodash/isEmpty';
import Color from 'utils/StylesHelper/color';
import CardWrapper from 'components/Utility/CardWrapper';
import { RowGridLeft, ColumnGridLeft } from 'components/GridContainer';
import DownloadDropdown from 'components/DownloadDropdown';
import { primaryFont } from 'utils/StylesHelper/font';
import { isIE } from 'react-device-detect';
import CloseIcon from './images/close.svg';

// import 'rc-slider/assets/index.css';
// import 'rc-tooltip/assets/bootstrap.css';
// import Tooltip from 'rc-tooltip';
// import Slider from 'rc-slider';

// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);

const Close = styled.img`
  float: right;
  cursor: pointer;
`;
const StyledCardWrapper = styled(CardWrapper)`
  padding: 24px;
  .initial-invesment {
    margin-left: 20%;
  }
  height: ${(props) => (props.cardHeight ? props.cardHeight : '100%')};
`;

const StyledNumberFormat = styled(NumberFormat)`
  font-size: 18px;
  font-weight: bold;
  font-family: ${primaryFont};
  z-index: 1;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  border-bottom: ${(props) => (props.error ? 'solid 1px red' : 'solid 1px #cacaca')};
  color: #10151a;
  outline: none;
  max-width: ${(props) => (props.fieldMaxWidth ? props.fieldMaxWidth : '300px')};
`;

const InvestmentGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;
const FullGrid = styled(Grid)`
  width: 100%;
`;
const ErrorGrid = styled(Grid)`
  width: 100%;
  margin-top: ${!isIE ? '10px' : '35px'} !important;
`;
const TextError = styled.span`
  font-size: 10px;
  color: ${Color.C_RED};
`;
const GridSlider = styled(Grid)`
  .rc-slider {
    margin: 0 10px;
    pointer-events: none;
    .rc-slider-handle {
      pointer-events: auto;
    }
  }
`;
// const SLIDER_MIN = 1000;
// const SLIDER_MAX = 99000;
const SLIDER_STEP = 1;

function renderErrorMessage(error) {
  let message;
  if (_isEmpty(error)) return null;
  if (typeof error === 'string') {
    return (
      <ErrorGrid item>
        <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left" weight="600">
          {error}
        </Text>
      </ErrorGrid>
    );
  }
  message = error && error.message && error.message.length ? error.message[0].ErrorMessage[0] : '';
  return (<ErrorGrid item>
    <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left" weight="600">
      {message.ErrorDesc ? message.ErrorDesc : message.FrontEndErrorMessage}
    </Text>
  </ErrorGrid>);
}

function Fund(props) {
  const { data, onClose, onSliderChange, allFunds, errorMessage } = props;
  const SLIDER_MIN = data.minInitialInvestmentAmt || 0;
  const SLIDER_MAX = data.maxInitialInvestmentAmt || 99000;

  let SLIDER_MARKS = {
    [SLIDER_MIN]: {
      style: { width: 0, marginLeft: 0 },
      label: SLIDER_MIN,
    },
    [SLIDER_MAX]: {
      //style: { width: 0, marginLeft: 0, left: sliderMaxValueLeft },
      //label: isMobile ? abbreviate(SLIDER_MAX, 2) : SLIDER_MAX,
      label: SLIDER_MAX,
    },
  };
  const error = (data.initialInvestment ? parseFloat(data.initialInvestment) : 0) < SLIDER_MIN;
  // Internet Explorer 6-11
  let isIE6To11 = /*@cc_on!@*/ false || !!document.documentMode;
  return (
    <StyledCardWrapper cardHeight={isIE6To11 ? '160px' : '100%'}>
      <ColumnGridLeft>
        <FullGrid item>
          <Chip
            name={
              data
                ? data.assetbreakdown[0]
                  ? data.assetbreakdown[0].class
                    ? data.assetbreakdown[0].class.toUpperCase()
                    : ''
                  : ''
                : ''
            }
            bottom="22px"
          />
          <Close onClick={() => onClose(data)} src={CloseIcon} alt="Close" />
        </FullGrid>
        <FullGrid item xs={12}>
          <RowGridLeft>
            <Grid item>
              <DownloadDropdown allFunds={allFunds} switchFundInfo={data.fundcode} type="ALLOCATE" data={data} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Text size="18px" weight="bold" color="#1d1d26" align="left">
                {data.fundcode} {data.name}
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
                onChange={(value) => {
                  // if (value !== SLIDER_MIN) {
                  onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                  // }
                }}
                value={data.initialInvestment ? parseFloat(data.initialInvestment) : 0}
                defaultValue={10000}
              />
            </GridSlider>
            <Grid item xs={12} sm={3}>
              <ColumnGridLeft className="initial-invesment" style={{ paddingLeft: window.innerWidth <= 834 ? '30px' : '22px' }}>
                <Grid>
                  <Text color="#1d1d26" lineHeight="1.67" size="12px" weight="bold" opacity="0.4" align="left">
                    INITIAL INVESTMENT
                  </Text>
                </Grid>
                <InvestmentGrid>
                  <StyledNumberFormat
                    value={data.initialInvestment ? data.initialInvestment : ''}
                    thousandSeparator
                    allowNegative={false}
                    prefix={'RM '}
                    isNumericString
                    decimalScale={2}
                    onValueChange={(values) => {
                      const { value } = values;
                      if (value && value.trim() !== '.') {
                        onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                      }
                      if (!value) {
                        onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                      }
                    }}
                    fieldMaxWidth={window.innerWidth <= 768 ? '125px' : window.innerWidth <= 834 ? '135px' : null}
                    autoComplete="off"
                  />
                  {error && <TextError>Must not be less than the minimum amount</TextError>}
                </InvestmentGrid>
              </ColumnGridLeft>
            </Grid>
          </RowGridLeft>
        </FullGrid>
        {renderErrorMessage(errorMessage)}
      </ColumnGridLeft>
    </StyledCardWrapper>
  );
}

Fund.propTypes = {
  data: PropTypes.object,
  onClose: PropTypes.func,
  onSliderChange: PropTypes.func,
  allFunds: PropTypes.array,
  errorMessage: PropTypes.array,
};

Fund.defaultProps = {
  data: {},
};

export default Fund;
