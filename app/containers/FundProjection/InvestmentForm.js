import React from 'react';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Chip from 'components/Chip';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import { ColumnGridLeft } from 'components/GridContainer';
import NumberFormat from 'react-number-format';
import Slider from 'components/Slider';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { toMoneyFormat } from 'utils/StringUtils';
import { primaryFont } from 'utils/StylesHelper/font';

const StyledNumberFormat = styled(NumberFormat)`
  width: ${(props) => (props.widthField ? props.widthField : '160px')};
  font-family: ${primaryFont};
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #10151a;
  border-bottom: solid 1px #cacaca;
  padding-bottom: 4px;
  font-family: ${primaryFont};
`;

const FormFieldContainer = styled(Grid)`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SliderContainer = styled(Grid)`
  padding-top: 24px;
  padding-left: 20px;
  .rc-slider {
    pointer-events: none;
    .rc-slider-handle {
      pointer-events: auto;
    }
  }
  justify-content: flex-start;
  align-content: flex-start;  
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export default function InvestmentForm({ fundDetails, onPlanChange, onRefetchProjection, loading, startInvesting }) {
  const {
    initialInvestment,
    monthlyContribution,
    goalYears,
    minAdditionalInvestmentAmt,
    maxAdditionalInvestmentAmt,
    minInitialInvestmentAmt,
    maxInitialInvestmentAmt,
    fundName,
    fundId,
    fullDetails = {},
  } = fundDetails;
  if (loading || _isEmpty(fullDetails)) {
    return <LoadingIndicator />;
  }
  return (
    <React.Fragment>
      <FormSection>
        <Text align="left" size="10px" color="#1d1d26" weight="bold" opacity="0.4" lineHeight={1.6}>
          FUND ISIN NO. {fundId}
        </Text>

        <Text align="left" size="10px" color="#1d1d26" weight="bold" opacity="0.4" lineHeight={1.6}>
          FUND CODE {fullDetails.fundDetails.fundcode}
        </Text>

        <Text align="left" size="18px" color="#000000" weight="bold" lineHeight="normal">
          {fundName}
        </Text>

        <Chip name={fullDetails?fullDetails.assetbreakdown[0]?fullDetails.assetbreakdown[0].class?fullDetails.assetbreakdown[0].class.toUpperCase():'':'':''} color="#1d1d26" />
        {fullDetails.riskProfileType !== 'NA' && <Chip name={fullDetails?fullDetails.riskProfileType?fullDetails.riskProfileType.toUpperCase():'':''} color="#676775"/>}
      </FormSection>

      <FormSection>
        <FormFieldContainer container>
          <Grid item xs={4}>

            <Text color="#1d1d26" lineHeight="1.67" size="12px" weight="bold" opacity="0.4" align="left">
              INITIAL INVESTMENT
            </Text>

            <StyledNumberFormat
              value={initialInvestment}
              displayType={'input'}
              thousandSeparator
              prefix={'RM '}
              onValueChange={(value) => {
                let newInitialInvestment;
                const { floatValue } = value;
                if (floatValue < 1) {
                  //newInitialInvestment = minInitialInvestmentAmt;
                  newInitialInvestment = 0;
                } else if (floatValue >= maxInitialInvestmentAmt) {
                  newInitialInvestment = maxInitialInvestmentAmt;
                } else {
                  newInitialInvestment = floatValue || 0;
                }

                onPlanChange({
                  ...fundDetails,
                  initialInvestment: newInitialInvestment,
                });
                onRefetchProjection();
              }}
              widthField={window.innerWidth <= 768?'200px':window.innerWidth <= 1024?'240px':null}
            />

          </Grid>
          <SliderContainer item xs={8}>
            <Slider
              min={minInitialInvestmentAmt}
              max={maxInitialInvestmentAmt}
              step={1}
              marks={{
                [minInitialInvestmentAmt]: {
                  style: { width: 0, marginLeft: 0 },
                  label: `${toMoneyFormat(minInitialInvestmentAmt)}`,
                },
                [maxInitialInvestmentAmt]: {
                  //style: { width: 0, marginLeft: 0, left: '90%' },
                  label: `${toMoneyFormat(maxInitialInvestmentAmt)}`,
                },
              }}
              name="initial investment"
              value={initialInvestment}
              onChange={(value) => {
                //if (value !== minInitialInvestmentAmt) { // do not call this function when it's minimum investment as it will display the minimum amount
                  onPlanChange({
                    ...fundDetails,
                    initialInvestment: value,
                  });
                //}
                onRefetchProjection();
              }}
              // if > 70%, ipad will have extra space on both left and right side when drag
              widthSlider={window.innerWidth <= 1024?'70%':'100%'}
            />
          </SliderContainer>
        </FormFieldContainer>
        <FormFieldContainer container>
          <Grid item xs={4}>

            <Text color="#1d1d26" lineHeight="1.67" size="12px" weight="bold" opacity="0.4" align="left">
              WITH A MONTHLY OF
            </Text>

            <StyledNumberFormat
              value={monthlyContribution}
              displayType={'input'}
              thousandSeparator
              prefix={'RM '}
              onValueChange={(value) => {
                let newMonthlyContribution;
                const { floatValue } = value;
                if (floatValue < 1) {
                  //newMonthlyContribution = minAdditionalInvestmentAmt;
                  newMonthlyContribution = 0;
                } else if (floatValue >= maxAdditionalInvestmentAmt) {
                  newMonthlyContribution = maxAdditionalInvestmentAmt;
                } else {
                  newMonthlyContribution = floatValue || 0;
                }

                onPlanChange({
                  ...fundDetails,
                  monthlyContribution: newMonthlyContribution,
                });
                onRefetchProjection();
              }}
              widthField={window.innerWidth <= 768?'200px':window.innerWidth <= 1024?'240px':null}
            />

          </Grid>
          <SliderContainer item xs={8}>
            <Slider
              min={minAdditionalInvestmentAmt}
              max={maxAdditionalInvestmentAmt}
              step={1}
              marks={{
                [minAdditionalInvestmentAmt]: {
                  style: { width: 0, marginLeft: 0 },
                  label: `${toMoneyFormat(minAdditionalInvestmentAmt)}`,
                },
                [maxAdditionalInvestmentAmt]: {
                  //style: { width: 0, marginLeft: 0, left: '90%' },
                  label: `${toMoneyFormat(maxAdditionalInvestmentAmt)}`,
                },
              }}
              name="monthly contribution"
              value={monthlyContribution}
              onChange={(value) => {
                //if (value !== minAdditionalInvestmentAmt) { // do not call this function when it's min Additional Investment Amt as it will display the minimum amount
                  onPlanChange({
                    ...fundDetails,
                    monthlyContribution: value,
                  });
                //}
                onRefetchProjection();
              }}
              // if > 70%, ipad will have extra space on both left and right side when drag
              widthSlider={window.innerWidth <= 1024?'70%':'100%'}
            />
          </SliderContainer>
        </FormFieldContainer>
        <FormFieldContainer container>
          <Grid item xs={4}>
            <ColumnGridLeft className="monthly-contribution">
              <Grid>
                <Text color="#1d1d26" lineHeight="1.67" size="12px" weight="bold" opacity="0.4" align="left">
                  DURATION
                </Text>
              </Grid>
              <Grid>
                <StyledNumberFormat
                  value={goalYears}
                  displayType={'input'}
                  suffix={' years'}
                  onValueChange={(value) => {
                    let duration;
                    const { floatValue } = value;
                    //if (!value || !value.floatValue || value.floatValue === NaN || value.floatValue < 1) {
                    if (floatValue < 1) {
                      duration = 0;
                    } else if (floatValue > 20) {
                      duration = 20;
                    } else {
                      duration = floatValue || 0;
                    }
                    onPlanChange({
                      ...fundDetails,
                      goalYears: duration,
                    });
                    onRefetchProjection();
                  }}
                  widthField={window.innerWidth <= 768?'200px':window.innerWidth <= 1024?'240px':null}
                />
              </Grid>
            </ColumnGridLeft>
          </Grid>
          <SliderContainer item xs={8}>
            <Slider
              min={1}
              max={20}
              step={1}
              marks={{
                1: {
                  style: { width: 0, marginLeft: 0 },
                  label: '1y',
                },
                20: {
                  //style: { width: 0, marginLeft: 0, left: '100%' },
                  label: '20y',
                },
              }}
              name="duration"
              value={goalYears}
              onChange={(value) => {
                //if (value !== 1) { // do not call this function when it's min year as it will display the minimum year
                  onPlanChange({
                    ...fundDetails,
                    goalYears: value,
                  });
                //}
                onRefetchProjection();
              }}
              // if > 70%, ipad will have extra space on both left and right side when drag
              widthSlider={window.innerWidth <= 1024?'70%':'100%'}
            />
          </SliderContainer>
        </FormFieldContainer>

        <FormFieldContainer container>
          <Grid item xs={4} />
          <SliderContainer item xs={8}>
            <Button primary onClick={startInvesting}>
              Start Investing
            </Button>
          </SliderContainer>
        </FormFieldContainer>
      </FormSection>
    </React.Fragment>
  );
}

InvestmentForm.propTypes = {
  fundDetails: PropTypes.object.isRequired,
  onPlanChange: PropTypes.func.isRequired,
  onRefetchProjection: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  startInvesting: PropTypes.func.isRequired,
};