import React from 'react';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import _isEmpty from 'lodash/isEmpty';
import { StyledDivider, NoticeWrapper } from './styles';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';

// put this in common utils if want to re-use
function suppressMobileNo(mobile) {
  if (mobile !== undefined && mobile !== null) {
    const len = mobile.length;
    const mobilepart = mobile.slice(3, len - 4);
    return mobile.replace(mobilepart, 'xxxxx');
  }
  return '';
}
function getIdNo(data) {
  if (!_isEmpty(data)) {
    return suppressMobileNo(data);
  }
  return '-';
}

function getFundNames(data) {
  let fund = '-';
  if (!_isEmpty(data.fund) || !_isEmpty(data.switchfund)) {
    if (data.transactionType === 'RD' || (data.partnerProductType === 'SW' && data.transactionType === 'SW')) {
      fund = !_isEmpty(data.switchfund) ? `${data.switchfund.fundcode} ${data.switchfund.name}` : '-';
    } else if (data.transactionType === 'SW' || data.transactionType === 'SA') {
      fund = !_isEmpty(data.fund) ? `${data.fund.fundcode} ${data.fund.name}` : '-';
    } else {
      fund = data.fund.name;
    }
  }
  return fund;
}

function getAccType(portfolio) {
  switch (portfolio.partnerAccountType) {
    case 'CS':
      return 'CASH';
    case 'KW':
      return 'KWSP';
    default:
      return '-';
  }
}

function getFundUnitLabel(data) {
  const label = {
    fund: '',
    unit: '',
  };

  switch (data.transactionType) {
    case 'SA':
      if (data.partnerProductType == 'SW') {
        label.fund = 'SWI Fund';
        label.unit = 'Units Credited';
      } else {
        label.fund = 'Fund';
        label.unit = 'Units Credited';
      }
      break;
    case 'RD':
      label.fund = 'Fund';
      label.unit = 'Units Debited';
      break;
    case 'SW':
      label.fund = 'SWO Fund';
      label.unit = 'Units Debited';
      break;
    case 'DD':
      label.fund = 'Fund';
      label.unit = 'Units Credited';
      break;
    case 'BI':
      label.fund = 'Fund';
      label.unit = 'Units Credited';
      break;
    case 'TR':
      label.fund = 'Fund';
      if (data.transactionUnits < 0) {
        label.unit = 'Units Debited';
      } else {
        label.unit = 'Units Credited';
      }
      break;
    case 'CO':
      label.fund = 'Fund';
      label.unit = 'Units Maintained';
      break;
    case 'UC':
      label.fund = 'Fund';
      label.unit = 'Units Maintained';
      break;
    default:
      break;
  }

  return label;
}

const StyledDiv1 = styled.div`
  flex: ${window.innerWidth > 1024 ? '4%' : '10%'};
`;
const StyledDiv2 = styled.div`
  flex: ${window.innerWidth > 1024 ? '9%' : '16%'};
`;
const StyledDiv3 = styled.div`
  flex: ${window.innerWidth > 1024 ? '7%' : '15%'};
`;
const StyledDiv4 = styled.div`
  flex: ${window.innerWidth > 1024 ? '35%' : '40%'};
`;
const StyledDiv5 = styled.div`
  flex: ${window.innerWidth > 1024 ? '3%' : '7%'};
`;
const StyledDiv6 = styled.div`
  flex: ${window.innerWidth > 1024 ? '33%' : '36%'};
`;

function TransactionDetails({ row }) {
  const { original } = row;
  const idNo = getIdNo(original.MainHolderlDNo);
  return original.transactions.map((item, i) => (
    <Grid container justify="flex-start" key={i}>
      <Grid item xs={12}>
        <div style={{ display: 'flex' }}>
          <StyledDiv1>
            <Text weight="bold" align="left" size="12px">
              ID NO.
            </Text>
          </StyledDiv1>
          <StyledDiv2>
            <Text align="left" size="12px">
              {idNo}
            </Text>
          </StyledDiv2>
          <StyledDiv3>
            <Text weight="bold" align="left" size="12px">
              {getFundUnitLabel(item).fund}
            </Text>
          </StyledDiv3>
          <StyledDiv4>
            <Text align="left" size="12px">
              {getFundNames(item)}
            </Text>
          </StyledDiv4>
          <StyledDiv5>
            <Text weight="bold" align="left" size="12px">
              Status
            </Text>
          </StyledDiv5>
          <StyledDiv6>
            <Text align="left" size="12px">
              {item.transactionStatus || '-'}
            </Text>
          </StyledDiv6>
        </div>
      </Grid>
      <Grid item xs={12}>
        <div style={{ display: 'flex' }}>
          <StyledDiv1>
            <Text weight="bold" align="left" size="12px">
              ACCT NO.
            </Text>
          </StyledDiv1>
          <StyledDiv2>
            <Text align="left" size="12px">
              {item.partnerAccountNO}
            </Text>
          </StyledDiv2>
          <StyledDiv3>
            <Text weight="bold" align="left" size="12px">
              ACCT TYPE.
            </Text>
          </StyledDiv3>
          <StyledDiv4>
            <Text weight="bold" align="left" size="12px">
              {getAccType(item.portfolio)}
            </Text>
          </StyledDiv4>
          <StyledDiv5>
            <Text weight="bold" align="left" size="12px">
              {getFundUnitLabel(item).unit}
            </Text>
          </StyledDiv5>
          <StyledDiv6>
            <Text align="left" size="12px">
              <NumberFormat
                value={
                  item.transactionUnits
                    ? item.transactionUnits < 0
                      ? item.transactionUnits * -1
                      : item.transactionUnits
                    : '0.00'
                }
                displayType={'text'}
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </StyledDiv6>
        </div>
      </Grid>
      <Grid item xs={12}>
        {item.isNonTradingHour || item.isFiveHundredResponse ? (
          <NoticeWrapper>
            <Text align="left" size="12px" color="#d8232a">
              {item.isNonTradingHour ? 'Order created but will be submitted in the next trading hour/ day.' : ''}
            </Text>
            <Text align="left" size="12px" color="#d8232a">
              {item.isFiveHundredResponse
                ? 'Order created but encountered some errors. Please review the order status after 30 mins.'
                : ''}
            </Text>
          </NoticeWrapper>
        ) : (
          ''
        )}
      </Grid>
      {original.transactions.length !== 1 + i && <StyledDivider />}
    </Grid>
  ));
}

export default TransactionDetails;
