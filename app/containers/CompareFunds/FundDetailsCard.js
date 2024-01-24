import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Chip from 'components/Chip';
import Text from 'components/Text';
import Button from 'components/Button';

import { ColumnGridLeft, RowGridSpaceAround, RowGridCenter, RowGridLeft, FullWidthGrid } from 'components/GridContainer';
import downIcon from './images/down.svg';
import BackgroundImage from './images/fund-details-header-new.png';
import FundInformation from './FundInformation';
import TopHoldings from 'components/TopHoldings';
import DLIcon from '../FundDetails/dl-icon.svg';
import _isEmpty from 'lodash/isEmpty';

const CustomIcon = () => <img src={downIcon} alt="test" />;

const PILL_COLOR = ['#bc8a54', '#e08272', '#848187'];

const Container = styled.div`
  border-radius: 5px;
  margin-top: 46px;
  box-shadow: 0 10px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  position: relative;
  height: 136px;
  background-image: url(${BackgroundImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 14px 16px;
  z-index: 1;
  
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ bgFilter }) => (bgFilter)};
    opacity: 0.6;
    z-index: -1;
  }
`;

const Units = styled.div`
  height: auto;
  display: flex;
`;

const StyledPanel = styled(ExpansionPanel)`
  background-color: #1d1d26 !important;
  min-height: 50px !important;
`;

const StyledDetails = styled(ExpansionPanelDetails)`
  flex-direction: column;
  color: #fff;
  display: flex;
  background-color: #fff;
`;

const PdfButton = styled(Button)`
  img {
    width: 15.9px;
    height: 15.4px;
    margin-right: 8px;
  }

  margin: 2px 20px 10px 20px;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin: 2px 20px 10px 20px;
  width: 100%;
`;

const redirectToUrl = (url) => {
  window.open(url, '_blank');
};

const platform = window.navigator.platform;
const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
/*
const renderDownloadButtons = (fundDocs) => (

  <Grid container spacing={24}>
    <Grid item xs={6} sm={3}>
      <PdfButton
        key={0}
        item={0}
        onClick={() =>
              redirectToUrl(fundDocs.url?fundDocs.url:`${BaseUrl}/api/portfolio/api/funddocscontainers/pdfs/download/Prospectus_45.pdf`)
            }
      >
        <img src={DLIcon} alt="Download" />
        {'Prospectus'}
      </PdfButton>
    </Grid>
    <Grid item xs={6} sm={3}>
      <PdfButton
        key={1}
        item={1}
        onClick={() =>
              redirectToUrl(fundDocs.url?fundDocs.url:`${BaseUrl}/api/portfolio/api/funddocscontainers/pdfs/download/Prospectus_45.pdf`)
            }
      >
        <img src={DLIcon} alt="Download" />
        {'Fund Fact Sheet'}
      </PdfButton>
    </Grid>
    <Grid item xs={12} sm={6}>
      <PdfButton
        key={2}
        item={2}
        onClick={() =>
              redirectToUrl(fundDocs.url?fundDocs.url:`${BaseUrl}/api/portfolio/api/funddocscontainers/pdfs/download/Prospectus_45.pdf`)
            }
      >
        <img src={DLIcon} alt="Download" />
        {'Product Highlight Sheet'}
      </PdfButton>
    </Grid>
  </Grid>

  );
*/
function FundDetailsCard(props) {
  const { name, fundDetails, assetclass, riskProfileType } = props.data;
  const asset = assetclass?assetclass.toUpperCase():'';
  const profile = riskProfileType?riskProfileType.toUpperCase():'';
  const performanceObj = _isEmpty(props.fundPerformanceList)
    ? []
    : props.fundPerformanceList.filter((obj) => obj.lipperId === props.data.lipperId)[0];
  const fundHoldingList = props.fundHoldingList.filter((obj) => obj.lipperId === props.data.lipperId)[0];
  let threeYearPerformance, yearToDatePerformance;
  if (performanceObj && !_isEmpty(performanceObj.fundPerformance)) {
    threeYearPerformance = performanceObj.fundPerformance.filter(
      (obj) => obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd',
    )[0];
    yearToDatePerformance = performanceObj.fundPerformance.filter(
      (obj) => obj.CalculationType === 'YeartoMonthEndPerformance',
    )[0];
  }
  // Internet Explorer 6-11
  let isIE = /*@cc_on!@*/false || !!document.documentMode;
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  let isWindowsPlatform = false;
  if (windowsPlatforms.indexOf(platform) !== -1) {
    isWindowsPlatform = true;
  }
  return (
    <Container>

      {/* Images and Chips */}
      <Header bgFilter={PILL_COLOR[props.dataIndex]}>
        <RowGridLeft>
          <Grid item>
            <Chip name={asset} />
            {
              profile !== 'NA'?<Chip name={profile} />:null
            }
          </Grid>
        </RowGridLeft>
        <Text color="#fff" size="13px" weight="bold"  align="left">
          {name}
        </Text>
        <Text size="10px" color="#fff" align="left">
          {fundDetails ? fundDetails.epfmemberstatustext : ''}
        </Text>
      </Header>
        {/* 3 years performance and calendar year performance */}
          <Units>
            <RowGridSpaceAround style={{ padding: '20px' }}>
              <Grid item xs={12} lg={6}>
                <ColumnGridLeft>
                  <Grid item>
                    {
                      (isIE || isSafari || isWindowsPlatform)?
                        <Text size="10px" color="#1d1d26" weight="bold" opacity="0.4" style={{wordWrap: 'break-word', maxWidth: '165px', textAlign: 'left'}}>
                          3 YEARS CUMULATIVE PERFORMANCE
                        </Text>
                      :
                        <Text size="10px" color="#1d1d26" weight="bold" opacity="0.4">
                          3 YEARS CUMULATIVE PERFORMANCE
                        </Text>                                         
                    }
                  </Grid>
                  <Grid item>
                    <Text>
                      {threeYearPerformance ? (threeYearPerformance.Value ? threeYearPerformance.Value.toFixed(4) : 0) : 0}%
                    </Text>
                  </Grid>
                </ColumnGridLeft>
              </Grid>
              <Grid item xs={12} lg={6}>
                <ColumnGridLeft>
                  <Grid item>
                    {
                      (isIE || isSafari || isWindowsPlatform)?
                        <Text size="10px" color="#1d1d26" weight="bold" opacity="0.4" style={{wordWrap: 'break-word', maxWidth: '140px', textAlign: 'left'}}>
                           YTD CUMULATIVE PERFORMANCE
                        </Text>
                      :
                        <Text size="10px" color="#1d1d26" weight="bold" opacity="0.4">
                           YTD CUMULATIVE PERFORMANCE
                        </Text>                                         
                    }
                  </Grid>
                  <Grid item>
                    <Text>
                      {yearToDatePerformance ? (yearToDatePerformance.Value ? yearToDatePerformance.Value.toFixed(4) : 0) : 0}%
                    </Text>
                  </Grid>
                </ColumnGridLeft>
              </Grid>
            </RowGridSpaceAround>
          </Units>

        {/* Funds Info */}
          <StyledPanel>
            <ExpansionPanelSummary expandIcon={<CustomIcon />} style={{ marginBottom: '-15px' }}>
              <Text color="#fff" weight="bold" size="16px">
                Fund Information
              </Text>
            </ExpansionPanelSummary>
            <StyledDetails>
              <FundInformation data={fundDetails} />
            </StyledDetails>
          </StyledPanel>

        {/* Top Holdings */}
          <StyledPanel>
            <ExpansionPanelSummary expandIcon={<CustomIcon />} style={{ marginBottom: '-15px' }}>
              <Text color="#fff" weight="bold" size="16px">
                Top Holdings
              </Text>
            </ExpansionPanelSummary>
            <StyledDetails>
              <TopHoldings data={_isEmpty(fundHoldingList) ? [] : fundHoldingList.holdingList} />
            </StyledDetails>
            <Grid item xs={12} style={{ paddingBottom: '20px', backgroundColor: '#fff' }}>
              <RowGridCenter style={{ backgroundColor: '#fff' }}>
                {fundDetails.productHighlightSheet && fundDetails.productHighlightSheet !== 'N/A' ? (
                  <PdfButton onClick={() => redirectToUrl(fundDetails.productHighlightSheet)}>
                    <img src={DLIcon} alt="Download" />
                    Product Highlight Sheet
                  </PdfButton>
                ) : null}

                {fundDetails.fundFactsheet && fundDetails.fundFactsheet !== 'N/A' ? (
                  <PdfButton onClick={() => redirectToUrl(fundDetails.fundFactsheet)}>
                    <img src={DLIcon} alt="Download" />
                    Fund Fact Sheet
                  </PdfButton>
                ) : null}

                {fundDetails.prospectus && fundDetails.prospectus !== 'N/A' ? (
                  <PdfButton onClick={() => redirectToUrl(fundDetails.prospectus)}>
                    <img src={DLIcon} alt="Download" />
                    Prospectus
                  </PdfButton>
                ) : null}

                <StyledButton
                  primary
                  onClick={() => {
                    props.addFundToPortfolio(props.data);
                  }}>
                  Add to Portfolio
                </StyledButton>
              </RowGridCenter>
            </Grid>
          </StyledPanel>

        {/* <FullWidthGrid item>
          <StyledPanel>
            <ExpansionPanelSummary expandIcon={<CustomIcon />}>
              <Text color="#fff" weight="bold" size="16px">
                Top Holdings
              </Text>
            </ExpansionPanelSummary>
            <StyledDetails>
              <TopHoldings />
            </StyledDetails>
          </StyledPanel>
        </FullWidthGrid> */}
    </Container>
  );
}

FundDetailsCard.propTypes = {
  data: PropTypes.any,
};

export default FundDetailsCard;
