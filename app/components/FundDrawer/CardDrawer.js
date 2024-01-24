import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';

import Text from 'components/Text';
import { ColumnGridLeft, RowGridSpaceBetween, ColumnGridCenter, RowGridLeft } from 'components/GridContainer';
import CloseIcon from './close.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 88px;
  width: 272px;
  margin: 8px 0;
  padding: 8px 16px;
  border-radius: 5px;
  background-color: #eeeef0;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
  &.--empty {
    height: 88px;
    opacity: 0.2;
    display: flex;
    border-radius: 5px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
    background-color: rgba(29, 29, 38, 0.1);
    border: dashed 1px #1d1d26;
  }
  @media screen and (max-width: 768px) {
    width: 239px;
  }
`;
const TextContainer = styled.div`
  flex-grow: 1;
`;

const InlineGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  &.first {
    /* border-right: 1px solid #000; */
    margin-right: 3px;
    .value {
      margin-right: 3px;
    }
  }

  &.second {
    margin-left: 3px;
  }
  .label {
    margin-right: 3px;
  }
`;

const StyledImg = styled.img`
  cursor: pointer;
`;

const StyledNumberFormat = styled(NumberFormat)`
  color: #1d1d26;
  font-size: 10px;
  font-weight: bold;
`;

function CardDrawer(props) {
  const { data = {}, select } = props;
  const hasData = !_isEmpty(data);
  const className = hasData ? '' : '--empty';
  return (
    <Container className={className}>
      {hasData && (
        <React.Fragment>
          <RowGridSpaceBetween>
            <Grid item>
              <Text size="10px" color="#1d1d26" weight="bold">
                {data && data.assetbreakdown ? data.assetbreakdown[0].class : ''}
              </Text>
            </Grid>
            <Grid item>
              <StyledImg onClick={() => select(data)} src={CloseIcon} alt="Close" />
            </Grid>
          </RowGridSpaceBetween>
          <TextContainer>
            <Text size="12px" weight="bold" color="#1d1d26" lineHeight="1.33" align="left">
              {data.name}
            </Text>
          </TextContainer>
          <RowGridLeft>
            <InlineGrid item className="first">
              <Text size="10px" color="#1d1d26" align="left" className="label">
                NAV PER UNIT
              </Text>
              {/* <Text size="10px" weight="bold" color="#1d1d26" align="left" className="value"> */}
              <StyledNumberFormat
                value={data.netAssetValue || 0}
                displayType={'text'}
                thousandSeparator
                prefix={'MYR '}
                className="value"
                decimalScale={4}
                fixedDecimalScale
              />
              {/* </Text> */}
            </InlineGrid>
            {/* <InlineGrid item className="second">
            <Text size="10px" color="#1d1d26" align="left" className="label">
              EXP. GROWTH
            </Text>
            <Text size="10px" weight="bold" color="#1d1d26" align="left">
              {(data.historical10YrAnnualizedReturn * 100).toFixed(2) || 0} %
            </Text>
          </InlineGrid> */}
          </RowGridLeft>
        </React.Fragment>
      )}
      {!hasData && (
        <Text color="#1d1d26" size="12px" opacity="0.5">
          Add Fund
        </Text>
      )}
    </Container>
  );
}

export default CardDrawer;
