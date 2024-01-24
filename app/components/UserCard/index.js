/**
 *
 * UserCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Color from 'utils/StylesHelper/color';
import moment from 'moment';

import UserImage from 'components/UserImage';
import Text from 'components/Text';
import StatusChip from 'components/Chip';
import CurrencyFormat from 'components/Utility/CurrencyFormat';
import { ColumnGridLeft } from 'components/GridContainer';
import ReactTooltip from 'react-tooltip';
import DueIcon from './assets/due.svg';
import ExpiredIcon from './assets/expired.svg';

const StyledReactTooltip = styled(ReactTooltip)`
  padding: 7px !important;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1) !important;
  background-color: #ffffff !important;
`;

const Container = styled.div`
  min-height: 190px;
  cursor: pointer;
  padding: 16px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  &.selected {
    background-color: #90909a;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    button {
      border: none;
    }
  }
`;
const StyledCurrency = styled(CurrencyFormat)`
  margin-bottom: 16px;
`;
const GridImage = styled.div`
  margin-bottom: 26px !important;
`;

const StyledUserImage = styled(UserImage)`
  margin-right: 16px !important;
`;

const InlineGridOne = styled.div`
  display: inline-block;
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
`;

const InlineGridTwo = styled.div`
  display: inline-block;
`;

const Overflow = {
  width: '8em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textAlign: 'left',
  textOverflow: 'ellipsis',
};

function profitLoss(data) {
  if (data.profitAndLossAmount > 0) {
    return (
      <StyledCurrency
        value={data.profitAndLossAmount ? data.profitAndLossAmount : 0}
        prefix="+RM"
        status="up"
        decimalScale={2}
        fixedDecimalScale
      />
    );
  }
  return (
    <StyledCurrency
      value={data.profitAndLossAmount ? Math.abs(data.profitAndLossAmount) : 0}
      prefix="(RM"
      suffix=")"
      status="down"
      decimalScale={2}
      fixedDecimalScale
    />
  );
}

function UserCard(props) {
  const { data } = props;
  const currentDate = moment(new Date());
  const assessmentDate = moment(data.ISAF_PERFORMANCE_DATE);
  const diff = currentDate.diff(assessmentDate, 'months', true);
  let message;
  let doShowRetakeRiskAssessment;
  let icon;
  if (!data.ISAF_SCORE || data.ISAF_SCORE === '' || !data.ISAF_PERFORMANCE_DATE || data.ISAF_PERFORMANCE_DATE === '') {
    doShowRetakeRiskAssessment = true;
    message = 'Suitability Assessment is expired';
    icon = ExpiredIcon;
  } else if (diff >= 11 && diff < 12) {
    doShowRetakeRiskAssessment = true;
    message = 'Suitability Assessment is due';
    icon = DueIcon;
  } else if (diff >= 12) {
    doShowRetakeRiskAssessment = true;
    message = 'Suitability Assessment is expired';
    icon = ExpiredIcon;
  }

  const cashAccountStatus = data && data.CSUTRACCOUNTNO;
  const kwAccountStatus = data && data.KWUTRACCOUNTNO;

  const getColorIndicator = (status) => {
    switch (status) {
      case 'A':
        return Color.C_GREEN;
      case 'S':
        return Color.C_ORANGE;
      default:
        return '#f5a623';
    }
  };

  // switch (data.AccountStatus) {
  //   case 'A':
  //     accountStatus = 'Active';
  //     chipBackgroundColor = Color.C_GREEN;
  //     break;
  //   case 'S':
  //     accountStatus = 'Suspended';
  //     chipBackgroundColor = Color.C_LIGHT_BLUE;
  //     break;
  //   default:
  //     accountStatus = 'In Progress';
  //     chipBackgroundColor = '#f5a623';
  // }
  return (
    <Container>
      <GridImage>
        <Grid container direction="row" justify="flex-start">
          <Grid item>
            <StyledUserImage />
          </Grid>

          <Grid item>
            {cashAccountStatus && (
              <StatusChip
                style={{ display: 'block' }}
                name={'CASH'}
                // color={getColorIndicator(data.CSAccountStatus)}
                color="#0091da"
                opacity={1}
              />
            )}
            {kwAccountStatus && (
              <StatusChip
                style={{ display: 'block', border: '1px solid' }}
                name={'KWSP'}
                // color={getColorIndicator(data.KWAccountStatus)}
                color="#0091da"
                opacity={1}
              />
            )}

            {doShowRetakeRiskAssessment && (
              <div style={{ display: 'inline-block' }}>
                <img src={icon} style={{ marginTop: '3px' }} data-tip data-for={`${data.customerId}-id`} />
                <StyledReactTooltip id={`${data.customerId}-id`} effect="solid" place="bottom">
                  <Text size="12px" color="#000" align="left" weight="bold">
                    {message}
                  </Text>
                </StyledReactTooltip>
              </div>
            )}

            <Text style={Overflow} size="18px" weight="bold" color="#000">
              {data.FullName || '-'}
            </Text>

            <Text style={Overflow} size="12px" color={Color.C_GRAY} opacity="0.4" lineHeight="1.33">
              {data.AccEmail}
            </Text>
          </Grid>
        </Grid>
      </GridImage>

      <Grid container>
        {cashAccountStatus && (
          <Grid item xs={5}>
            <InlineGridOne>
              <Text size="10px" color={Color.C_GRAY} opacity="0.4" lineHeight="1.6" align="left">
                TOTAL NAV (CASH)
              </Text>
              <StyledCurrency
                value={data.CStotalNetAssetValue ? data.CStotalNetAssetValue : 0}
                decimalScale={2}
                fixedDecimalScale
              />
            </InlineGridOne>
          </Grid>
        )}
        {kwAccountStatus && (
          <Grid item xs={5}>
            <InlineGridTwo>
              <Text size="10px" color={Color.C_GRAY} opacity="0.4" lineHeight="1.6" align="left">
                TOTAL NAV (KWSP)
              </Text>
              <StyledCurrency
                value={data.KWtotalNetAssetValue ? data.KWtotalNetAssetValue : 0}
                decimalScale={2}
                fixedDecimalScale
              />
            </InlineGridTwo>
          </Grid>
        )}
      </Grid>
      {/* <Grid item xs={12}>
          <Text size="10px" color={Color.C_GRAY} opacity="0.4" lineHeight="1.6" align="left">
            UNREALISED PROFIT & LOSS
          </Text>
          {profitLoss(data)}
        </Grid> */}
    </Container>
  );
}

UserCard.propTypes = {
  data: PropTypes.object,
};

export default UserCard;
