/**
 *
 * FundCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'components/Button';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import Color from 'utils/StylesHelper/color';
//import { ColumnGridLeft, RowGridLeft } from 'components/GridContainer';
import { RowGridLeft } from 'components/GridContainer';
import Chip from 'components/Chip';
import DownloadIcon from './download.svg';
import WhiteDownload from './white.svg';
import CheckIcon from './check.svg';
import NumberFormat from 'react-number-format';
//import Badge from 'material-ui/Badge';

import DownloadContent from './DownloadContent';
import LipperAwardIcon from './lipper.png';
//import InfoIcon from './question-mark-circle.png';
import Dialog from 'components/Dialog';
import Parser from 'html-react-parser';
import { isIE } from 'react-device-detect';

const Container = styled.div`
  min-height: 320px;
  min-width: 288px;
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
const Banner = styled.div`
  position: relative;
  display: inline-block;
`;
let Name = styled(Text)`
  vertical-align: top;
  margin-top: 7px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

if (isIE) {
  Name = styled(Text)`
    vertical-align: top;
    margin-top: 7px;
    margin-bottom: 8px;
    text-overflow: ellipsis;
    overflow: hidden;

    max-width: 275px;
    position: relative;
    line-height: 1.2em;
    max-height: 3.6em;
    text-align: left;
    margin-right: -1em;
    padding-right: 0;

    &::before {
      content: '...';
      position: absolute;
      right: 0;
      bottom: 0;
    }

    &::after {
      content: '';
      position: absolute;
      right: 0;
      width: 1em;
      height: 1em;
      margin-top: 0.2em;
      background: white;
    }
  `;
}
const FundInfoSubText = styled(Text)`
  margin-right: 8px;
  margin-bottom: 16px;
`;

const ViewDetails = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 12px;
  cursor: pointer;
`;
const FullGrid = styled(Grid)`
  width: 100%;
`;
const Download = styled.img`
  float: right;
  cursor: pointer;
`;
const Header = styled.div`
  height: 32px;
`;
/*
const LipperText = styled(Text)`
  display: inline-block;
  margin-left: 10px;
`;
const Rating = styled.ul`
  list-style: none;
  display: inline-flex;
  margin-left: 12.5px;
  li {
    font-size: 10px;
    font-weight: bold;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    padding: 0 5px;
  }
`;

const RatingBadge = styled(Badge)`
  span {
    width: 15px !important;
    height: 15px !important;
    margin-top: -1px;
    margin-right: 5px;
    background: #fff;
    color: ${Color.C_LIGHT_BLUE};
  }
`;
*/
const DLContentWrapper = styled.div`
  // justify-content: flex-end;
  // display: flex;
  position: absolute;
  z-index: 3;
  right: 190px;
`;
const LipperAwardImg = styled.img`
  margin-top: -4px;
`;
const contentOfExpectedGrowthRate = Parser(
  '<p>The basis of estimating the fund’s expected return comes from observing its 10-year historical annualized returns. It also considers the reinvestment of dividends and the investment view of the Asset Manager. For funds with less than 10 years history, a proxy is used as a supplement to create the 10-year historical annualized returns.<br/><br/></p>',
);
class FundCard extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      showDownloadPdf: false,
      isOpenDialogExpectedGrowthRate: false,
    };

    this.toggleDownloadPdf = this.toggleDownloadPdf.bind(this);
    this.redirectToUrl = this.redirectToUrl.bind(this);
    this.showDialogExpectedGrowthRate = this.showDialogExpectedGrowthRate.bind(this);
  }

  toggleDownloadPdf() {
    this.setState((prevState) => ({
      showDownloadPdf: !prevState.showDownloadPdf,
    }));
  }

  redirectToUrl(url) {
    if (url) window.open(url, '_blank');
  }

  showDialogExpectedGrowthRate() {
    this.setState((prevState) => ({
      isOpenDialogExpectedGrowthRate: !prevState.isOpenDialogExpectedGrowthRate,
    }));
  }

  renderDialog() {
    return (
      <Dialog
        open={this.state.isOpenDialogExpectedGrowthRate}
        title={'Expected Return Methodology'}
        content={contentOfExpectedGrowthRate}
        closeHandler={this.showDialogExpectedGrowthRate}
      />
    );
  }

  render() {
    const { onSelect, data, selected, viewDetails, selectedAccount } = this.props;

    const selectedMatch = _find(selected, { id: data.id });
    const isMatch = selectedMatch ? selectedMatch.id === data.id : false;
    const className = isMatch ? 'selected' : '';
    const DLIcon = isMatch ? WhiteDownload : DownloadIcon;

    const fundName = data.name;
    /*if (isIE) {
      if (fundName.length > 86) {
        fundName = fundName.substring(0, 86) + ' ...';
      }      
    } else {
      if (fundName.length > 86) {
        fundName = fundName.substring(0, 86) + ' ...';
      }
    }*/

    if (!_isEmpty(data)) {
      return (
        <Container className={className} style={{ position: 'relative' }}>
          <Header>
            <Banner>
              {data.fundDetails && data.fundDetails.AwardValue && data.fundDetails.AwardValue.toLowerCase() === 'lipper' && (
                <LipperAwardImg src={LipperAwardIcon} alt="Lipper Award" />
              )}
            </Banner>
            <Download src={DLIcon} alt="Download" onClick={this.toggleDownloadPdf} />
          </Header>
          {this.state.showDownloadPdf && data.fundDetails && (
            // (data.fundDetails.productHighlightSheet || data.fundDetails.fundFactsheet || data.prospectus) && (
            <DLContentWrapper>
              <DownloadContent
                data={data.fundDetails}
                toggle={this.toggleDownloadPdf}
                download={this.redirectToUrl}
                isWholeSaleFunds={data.fundSubType === 'W'}
              />
            </DLContentWrapper>
          )
          // )
          }

          <div style={{ height: '70px' }}>
            <Name size={isIE ? '15px' : '15px'} color={isMatch ? '#fff' : '#1d1d26'} weight="bold" lineHeight="1.4" align="left">
              {fundName}
            </Name>
          </div>

          <RowGridLeft>
            <Chip name={data && data.assetbreakdown ? data.assetbreakdown[0].class : ''} />
            {data.riskProfileType !== 'NA' && <Chip color="#676775" name={data.riskProfileType} />}
          </RowGridLeft>

          <RowGridLeft style={{ marginBottom: '-12px' }}>
            <FundInfoSubText color="#1d1d26" size="10px" weight="bold" opacity="0.4">
              ISIN CODE
            </FundInfoSubText>
            <Text color="#1d1d26" size="10px" weight="bold" opacity="0.4">
              {data.isin}
            </Text>
          </RowGridLeft>

          <RowGridLeft>
            <FundInfoSubText color="#1d1d26" size="10px" weight="bold" opacity="0.4">
              FUND CODE
            </FundInfoSubText>
            <Text color="#1d1d26" size="10px" weight="bold" opacity="0.4">
              {data.fundcode}
            </Text>
          </RowGridLeft>

          <RowGridLeft spacing={24}>
            <Grid item>
              <Text color="#1d1d26" size="10px" weight="bold" opacity="0.4" lineHeight="1.6">
                LATEST NAV PER UNIT
              </Text>

              <Text color={isMatch ? '#fff' : '#1d1d26'} size="16px" weight="bold" lineHeight="1.25">
                <NumberFormat
                  value={data.netAssetValue || 0}
                  displayType={'text'}
                  prefix={'MYR '}
                  thousandSeparator
                  decimalScale={4}
                  fixedDecimalScale
                />
              </Text>
            </Grid>
            {/* <Grid item>
                  <ColumnGridLeft>
                    <Grid item>
                      <Text color="#1d1d26" size="10px" weight="bold" opacity="0.4" lineHeight="1.6">
                        EXPECTED GROWTH RATE <img src={InfoIcon} alt="Info" onClick={this.showDialogExpectedGrowthRate}/>
                      </Text>      
                    </Grid>
                    <Grid item>
                      <Text color={isMatch ? '#fff' : '#1d1d26'} size="16px" weight="bold" lineHeight="1.25">
                        {(data.historical10YrAnnualizedReturn * 100).toFixed(2) || 0} % per annum
                      </Text>
                    </Grid>
                  </ColumnGridLeft>
                </Grid> */}
          </RowGridLeft>
          <FullGrid item xs={12}>
            <ViewDetails
              decoration="underline"
              weight="600"
              lineHeight="1.67"
              color={isMatch ? '#fff' : `${Color.C_LIGHT_BLUE}`}
              size="12px"
              onClick={() => viewDetails(data.id)}>
              View Fund Details
            </ViewDetails>
          </FullGrid>
          <FullGrid item>
            <Button
              width="100%"
              onClick={() => onSelect(data)}
              disabled={
                (data.kwStatus === 'C' || data.kwStatus === 'S') && selectedAccount && selectedAccount.partnerAccountType === 'KW'
              }>
              {isMatch && <img src={CheckIcon} alt="selected" />}
              {!isMatch && <Text color={Color.C_LIGHT_BLUE}>Select Funds</Text>}
            </Button>
          </FullGrid>
          {this.renderDialog()}
        </Container>
      );
    }
    return null;
  }
}

FundCard.propTypes = {
  selectedAccount: PropTypes.object,
  data: PropTypes.object,
  onSelect: PropTypes.func,
  selected: PropTypes.array,
  viewDetails: PropTypes.func,
};

export default FundCard;
