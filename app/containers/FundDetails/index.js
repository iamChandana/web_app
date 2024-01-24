/**
 *
 * FundDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _intersectionBy from 'lodash/intersectionBy';
import Color from 'utils/StylesHelper/color';
import Parser from 'html-react-parser';
import injectSaga from 'utils/injectSaga';
import _findIndex from 'lodash/findIndex';
import ConfirmRiskModal from 'components/ConfirmRiskModal';
import FundDrawer from 'components/FundDrawer';
import Chip from 'components/Chip';
import TopHoldings from 'components/TopHoldings';
import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import { RowGridLeft, ColumnGridLeft, RowGridSpaceBetween } from 'components/GridContainer';
import WholeSaleWarningModal from 'components/WholeSaleWarningModal';
import { makeSelectFundsDrawer, makeSelectRiskScore, makeSelectStep } from 'containers/OnBoarding/selectors';
import { saveFundsDrawer, saveFunds } from 'containers/OnBoarding/actions';
import saga from './saga';
import {
  makeSelectData,
  makeSelectDocs,
  makeSelectGraphData,
  makeSelectFundHoldingList,
  makeSelectFundPerformanceList,
  makeSelectProcessing,
  makeSelectFetchingFundGraph,
  makeSelectFetchingFundHoldingList,
  makeSelectFetchingFundPerformance,
} from './selectors';
import { makeSelectClientDetails } from 'containers/ClientDetails/selectors';
import {
  getFundDetails,
  getFundDocs,
  geFundDocsPdf,
  resetFundDetails,
  getGraph,
  getFundHoldingList,
  getFundPerformanceList,
  clearGraphData,
} from './actions';
import CheckIcon from './check.svg';
import DLIcon from './dl-icon.svg';
import Graph from './Graph';
import {
  Header,
  ContenWrapper,
  PdfButton,
  FullGridWidth,
  AddPortfolioBtn,
  Head1,
  Head2,
  Details,
  StyledDivider,
  UnitLabel,
  UnitValue,
  PerformanceUnitValue,
  ContentGrid,
  FundsName,
  ContainerImage,
  ContainerImageCenter,
} from './styles';
import LoadingIndicator from 'components/LoadingIndicator';
import { generateXAxisLabel, convertGraphDataForPloting } from 'utils/graphHelper';
import { isTablet } from 'react-device-detect';
import styled from 'styled-components';
import { findSelectedFundIndex } from '../ClientDetails/utils/getAccountHolderType'

const ButtonPdfSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${(props) =>
    props.paddingBottomOfFundPDFDownloadButton ? props.paddingBottomOfFundPDFDownloadButton : '20px'}; ;
`;

export class FundDetails extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      selected: props.fundsDrawer || [],
      selectedData: '',
      open: false,
      fetchingFundPerformanceList: false,
      fetchingFundHoldingList: false,
      fetchingFundGraph: false,
      selectedFundPerformanceTimeRange: 1,
      fundPerformanceTimeRange: [
        { value: 1, name: '1 Year' },
        { value: 3, name: '3 Year' },
        { value: 5, name: '5 Year' },
      ],
    };

    this.close = this.close.bind(this);
    this.select = this.select.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.redirectToUrl = this.redirectToUrl.bind(this);
    this.next = this.next.bind(this);
    this.removeAllSelectedFund = this.removeAllSelectedFund.bind(this);
    this.compareFunds = this.compareFunds.bind(this);
    this.addToPortfolio = this.addToPortfolio.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.notify = this.notify.bind(this);
    this.checkIfWholeSaleFund = this.checkIfWholeSaleFund.bind(this);
    this.closeWholeSaleWarningModal = this.closeWholeSaleWarningModal.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentWillMount() {
    const fundCode = (this.props.match && this.props.match.params && this.props.match.params.id) || this.props.fundCode;
    const { customerId,
      data,
      portfolioId,
      riskScore,
      selectedFund, } = this.props.match.params;
    this.props.getFundDetails(fundCode);
    this.setState({
      backUrl: `/clients/${customerId}/add-funds/${portfolioId}`,
      customerId,
      data,
      portfolioId,
      riskScore,
      selectedFund,
    });
  }

  componentWillUnmount() {
    this.props.resetFundDetails();
  }

  componentWillReceiveProps(nextProps) {
    // const { data } = nextProps;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.graphData !== this.props.graphData) {
      this.notify(this.props.graphData, 'error');
    }
  }

  redirectToUrl(url) {
    if (url) window.open(url, '_blank');
  }

  changeFilter(e) {
    this.setState(
      {
        selectedFundPerformanceTimeRange: e.target.value,
        fetchingFundGraph: false,
      },
      () => {
        /* const { data } = this.props;
      const payload = {
        isin: data.isin,
        fundName: data.name,
        lipperId: data.lipperId,
        ric: data.ric,
        numOfYear : this.state.selectedFundPerformanceTimeRange
      };
      this.props.getGraph(payload); */
        this.props.clearGraphData();
        this.renderFundGraph();
      },
    );
  }

  notify(message, status) {
    if (!toast.isActive(this.toastId)) {
      if (status === 'error') {
        this.toastId = toast.error(Parser(message), {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }

  select(args) {
    let riskScore = this.props.riskScore;
    let data = this.props.data;
    if (_has(args, 'id')) {
      data = args;
    }
    if (!riskScore) {
      riskScore = this.state.riskScore;
    }
    if (!data) {
      data = this.state.data;
    }

    if (data) {
      this.setState(
        {
          selectedData: data,
        },
        () => {
          if (
            riskScore &&
            riskScore.riskProfileType.toLowerCase() !== data.riskProfileType.toLowerCase() &&
            _findIndex(this.state.selected, ['id', data.id]) === -1
          ) {
            const an = data.riskProfileType === 'Aggressive' ? 'an' : 'a';
            const modalMessage = `Your risk profile is ${riskScore.riskProfileType} but you have selected ${an} ${data.riskProfileType} fund.`;
            this.setState({
              open: true,
              modalMessage,
            });
          } else {
            this.handleAccept(data);
          }
        },
      );
    }
  }

  next() {
    // inject initial investment field
    const payload = this.state.selected.map((element) =>
      Object.assign({}, { ...element }, { initialInvestment: element.minInitialInvestmentAmt }),
    );
    this.props.saveFunds(payload);
    this.props.history.push('/onboarding/select-funds/allocate');
  }

  handleAccept(data) {
    const selectedArray = [...this.state.selected];
    const indexInSelected = _findIndex(this.state.selected, ['id', data.id]);
    if (indexInSelected > -1) {
      selectedArray.splice(indexInSelected, 1);
    } else {
      selectedArray.push(data);
    }
    this.setState(
      {
        selected: selectedArray,
      },
      () => {
        this.props.saveFundsDrawer(selectedArray);
        this.handleClose();
      },
    );
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  close() {
    const backUrl = _get(this.props, ['location', 'state', 'backUrl'], null);
    if (backUrl) {
      this.props.history.replace(backUrl);
    } else {
      this.props.history.replace('/funds');
    }
  }

  removeAllSelectedFund() {
    this.setState(
      {
        selected: [],
      },
      () => {
        this.props.saveFundsDrawer([]);
        this.props.saveFunds([]);
      },
    );
  }

  compareFunds() {
    if (this.props.location && this.state) {
      const { customerId, portfolioId } = this.state;
      this.props.history.push('/compare-funds', { customerId, portfolioId });
    }
  }

  addInitialInvesmentProps(data) {
    return data.map((element) => {
      const updatedObject = Object.assign({}, element);
      updatedObject.initialInvestment = element.initialInvestment || element.minInitialInvestmentAmt;
      return updatedObject;
    });
  }

  addToPortfolio() {
    if (this.props.location && this.state) {
      const { customerId, portfolioId, selectedFundOnBoarding } = this.state;
      const drawerData = this.addInitialInvesmentProps(this.props.fundsDrawer);
      if (_isEmpty(_find(drawerData, { fundcode: this.props.data.fundcode }))) {
        const selectedData = Object.assign({}, this.props.data, {
          initialInvestment: this.props.data.initialInvestment || this.props.data.minInitialInvestmentAmt,
        });
        drawerData.push(selectedData);
      }

      if (!selectedFundOnBoarding) {
        this.props.saveFunds(drawerData);
        console.log('State', customerId, portfolioId, this.state);
        this.props.history.push(`/clients/${customerId}/allocate-funds/${portfolioId}`);
      } else {
        this.props.saveFunds(drawerData);
        this.props.history.push('/onboarding/select-funds/allocate');
      }
    }
  }

  renderFundPerformance() {
    const { data } = this.props;
    if (data) {
      if (
        _isEmpty(this.props.fundPerformanceList) &&
        !this.props.fetchingFundPerformance &&
        !this.state.fetchingFundPerformanceList
      ) {
        const payload = {
          isin: data.isin,
          fundName: data.name,
          lipperId: data.lipperId,
          ric: data.ric,
        };

        this.setState(
          {
            fetchingFundPerformanceList: true,
          },
          () => {
            this.props.getFundPerformanceList(payload);
          },
        );
      }
    }

    let yeartoMonthEndPerformance,
      threeYearPerformancetoLastMonthEnd;

    if (this.props.fundPerformanceList && !_isEmpty(this.props.fundPerformanceList.fundPerformance)) {
      yeartoMonthEndPerformance = this.props.fundPerformanceList.fundPerformance.filter(
        (obj) => obj.CalculationType === 'YeartoMonthEndPerformance',
      )[0];
      threeYearPerformancetoLastMonthEnd = this.props.fundPerformanceList.fundPerformance.filter(
        (obj) => obj.CalculationType === 'ThreeYearPerformancetoLastMonthEnd',
      )[0];

      return (
        <RowGridLeft spacing={24}>
          <Grid item>
            <UnitLabel>3 YEARS CUMULATIVE PERFORMANCE</UnitLabel>
            <PerformanceUnitValue value={threeYearPerformancetoLastMonthEnd ? threeYearPerformancetoLastMonthEnd.Value : 0}>
              {threeYearPerformancetoLastMonthEnd ? threeYearPerformancetoLastMonthEnd.Value.toFixed(4) : 0}%
            </PerformanceUnitValue>
          </Grid>
          <Grid item>
            <UnitLabel>YTD CUMULATIVE PERFORMANCE</UnitLabel>
            <PerformanceUnitValue value={yeartoMonthEndPerformance ? yeartoMonthEndPerformance.Value : 0}>
              {yeartoMonthEndPerformance ? yeartoMonthEndPerformance.Value.toFixed(4) : 0}%
            </PerformanceUnitValue>
          </Grid>
        </RowGridLeft>
      );
    }

    if (_isEmpty(this.props.fundPerformanceList) && this.props.fetchingFundPerformance) {
      return <LoadingIndicator />;
    }

    if (_isEmpty(this.props.fundPerformanceList) && !this.props.fetchingFundPerformance) {
      return (
        <p
          style={{
            padding: '30px',
            width: '100%',
            verticalAlign: 'middle',
            border: '1px solid #ccc',
            marginTop: '25px',
            marginBottom: '25px',
          }}
        >
          <Text size={'20px'}>No Fund Performance Data</Text>
        </p>
      );
    }
  }

  renderFundHoldingList() {
    const { data } = this.props;
    if (data) {
      if (_isEmpty(this.props.fundHoldingList) && !this.props.fetchingFundHoldingList && !this.state.fetchingFundHoldingList) {
        const payload = {
          isin: data.isin,
          fundName: data.name,
          lipperId: data.lipperId,
          ric: data.ric,
        };

        this.setState(
          {
            fetchingFundHoldingList: true,
          },
          () => {
            this.props.getFundHoldingList(payload);
          },
        );
      }
    }

    if (this.props.fundHoldingList && !_isEmpty(this.props.fundHoldingList.holdingList)) {
      return (
        <TopHoldings
          data={this.props.fundHoldingList.holdingList}
          imageSize={35}
          leftColumn={1}
          rightColumn={11}
          fontSize={'14px'}
        />
      );
    }

    if (this.props.fundHoldingList && _isEmpty(this.props.fundHoldingList.holdingList) && this.props.fetchingFundHoldingList) {
      return <LoadingIndicator />;
    }

    if (
      _isEmpty(this.props.fundHoldingList) ||
      (this.props.fundHoldingList && _isEmpty(this.props.fundHoldingList.holdingList) && !this.props.fetchingFundHoldingList)
    ) {
      return (
        <p
          style={{
            padding: '30px',
            width: '100%',
            verticalAlign: 'middle',
            border: '1px solid #ccc',
            marginTop: '25px',
            marginBottom: '25px',
          }}
        >
          <Text size={'20px'}>No Top Holdings</Text>
        </p>
      );
    }
  }

  renderFundGraph() {
    const { data, graphData, fetchingFundGraph } = this.props;
    if (data) {
      if (_isEmpty(graphData) && !fetchingFundGraph && !this.state.fetchingFundGraph) {
        const payload = {
          isin: data.isin,
          fundName: data.name,
          lipperId: data.lipperId,
          ric: data.ric,
          benchMarkRic: !_isEmpty(data.fundDetails) ? data.fundDetails.benchMarkRic : '',
          benchMarkName: !_isEmpty(data.fundDetails) ? data.fundDetails.benchMarkName : '',
          numOfYear: this.state.selectedFundPerformanceTimeRange,
        };

        this.setState(
          {
            fetchingFundGraph: true,
          },
          () => {
            this.props.getGraph(payload);
          },
        );
      }
    }

    if (!_isEmpty(graphData)) {
      let xaxisData;

      if (
        graphData.fundGraph &&
        graphData.fundGraph.length > 10 &&
        graphData.fundBenchmarkGraph &&
        graphData.fundBenchmarkGraph.length > 10
      ) {
        xaxisData = _intersectionBy(graphData.fundGraph, graphData.fundBenchmarkGraph, 'date');
      } else if (graphData.fundGraph && graphData.fundGraph.length > 10) {
        xaxisData = graphData.fundGraph;
      } else {
        xaxisData = graphData.fundBenchmarkGraph;
      }

      const ticks = generateXAxisLabel(xaxisData, this.state.selectedFundPerformanceTimeRange);

      const fund1 = {
        name: graphData.fundName,
        benchMarkRic: graphData.benchMarkRic,
        benchMarkName: graphData.benchMarkName,
        ric: graphData.ric,
      };

      // concate 2 graph both ric and benchmark graph
      const arr = [];
      if (graphData.fundGraph && graphData.fundGraph.length > 10) {
        arr.push({
          isin: graphData.ric,
          fundGraph: _intersectionBy(graphData.fundGraph, xaxisData, 'date'),
        });
      }

      if (graphData.fundBenchmarkGraph && graphData.fundBenchmarkGraph.length > 10) {
        arr.push({
          isin: graphData.benchMarkRic,
          fundGraph: _intersectionBy(graphData.fundBenchmarkGraph, xaxisData, 'date'),
        });
      }

      const gd = convertGraphDataForPloting(arr);

      return (
        <Graph
          graphData={gd}
          xAxisTicks={ticks}
          fund={fund1}
          displayFundGraph={graphData.fundGraph.length > 0}
          displayFundBenchmarkGraph={graphData.fundBenchmarkGraph.length > 0}
        />
      );
    }

    if (_isEmpty(this.props.graphData) && this.props.fetchingFundGraph) {
      return <LoadingIndicator />;
    }

    if (_isEmpty(this.props.graphData) && !this.props.fetchingFundGraph) {
      return (
        <p
          style={{
            padding: '30px',
            width: '100%',
            verticalAlign: 'middle',
            border: '1px solid #ccc',
            marginTop: '25px',
            marginBottom: '25px',
          }}
        >
          <Text size={'20px'}>No Graph Data</Text>
        </p>
      );
    }
  }

  checkIfWholeSaleFund(data) {
    let showWholeSaleWarningModal = false;
    if (data.fundSubType === 'W') {
      showWholeSaleWarningModal = true;
    } else {
      this.select(data);
    }

    this.setState({
      showWholeSaleWarningModal,
      selectedData: data,
    });
  }
  closeWholeSaleWarningModal() {
    this.setState({
      showWholeSaleWarningModal: false,
    });
  }

  handleContinue() {
    this.setState({
      showWholeSaleWarningModal: false,
    }, () => {
      this.select(this.state.selectedData);
    });
  }

  render() {
    const { data, fundsDrawer, fundCode } = this.props;
    const startInvest = !(this.state.customerId || this.state.portfolioId);
    if (data) {
      const selectedMatch = _find(fundsDrawer, { id: data.id });
      const isMatch = selectedMatch ? selectedMatch.id === data.id : false;
      const hasFundDetails = !_isEmpty(data.fundDetails);

      // this is for tablet where the 3 pdf download button unable to view as stuck below
      let paddingBottomOfFundPDFDownloadButton = '20px';
      if (isTablet) {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        if (windowWidth > windowHeight) {
          // landscape mode
          if (windowHeight <= 1112) {
            // 9 inch, 11 inch
            paddingBottomOfFundPDFDownloadButton = '150px';
          }
        } else {
          // portraint mode
          if (windowHeight <= 1120) {
            // 9 inch, 11 inch
            paddingBottomOfFundPDFDownloadButton = '170px';
          }
        }
      }

      return (
        <React.Fragment>
          <ConfirmRiskModal
            open={this.state.open}
            handleClose={this.handleClose}
            modalMessage={this.state.modalMessage}
            handleAccept={this.handleAccept}
            data={this.state.selectedData}
          />
          <WholeSaleWarningModal open={this.state.showWholeSaleWarningModal} handleClose={this.closeWholeSaleWarningModal} handleContinue={this.handleContinue} />
          {!fundCode && (
            <Header>
              <ColumnGridLeft>
                <FullGridWidth item>
                  <RowGridSpaceBetween>
                    <Grid item>
                      <Chip name={data && data.assetbreakdown ? data.assetbreakdown[0].class : ''} />
                      {data.riskProfileType !== 'NA' && <Chip name={data.riskProfileType} />}
                    </Grid>
                    <Grid item>
                      <Text color="#fff" size="14px" onClick={this.close} cursor="pointer">
                        Close X
                      </Text>
                    </Grid>
                  </RowGridSpaceBetween>
                </FullGridWidth>
                <FullGridWidth item>
                  <RowGridSpaceBetween>
                    <Grid item>
                      <FundsName color="#fff" size="18px" weight="bold">
                        {data.name}
                      </FundsName>
                    </Grid>
                    {!startInvest && (
                      <Grid item>
                        <AddPortfolioBtn onClick={() => this.checkIfWholeSaleFund(data)}>
                          {isMatch && <img src={CheckIcon} alt="selected" />}
                          {!isMatch && <Text color={Color.C_LIGHT_BLUE}>Add to Portfolio</Text>}
                        </AddPortfolioBtn>
                      </Grid>
                    )}
                  </RowGridSpaceBetween>
                </FullGridWidth>
                <FullGridWidth item>
                  <RowGridLeft>
                    <Grid item>
                      <Text size="10px" color="#fff" weight="bold" opacity="0.8" align="left">
                        {`FUND ISIN NO. ${data.isin}`}
                        &nbsp;
                      </Text>
                      <Text size="10px" color="#fff" weight="bold" opacity="0.8" align="left">
                        {`FUND CODE ${data.fundcode}`}
                        &nbsp;
                      </Text>
                    </Grid>
                    {hasFundDetails && (
                      <Grid item>
                        <Text size="10px" color="#fff" align="left">
                          {data.fundDetails.epfmemberstatustext}
                        </Text>
                      </Grid>
                    )}
                  </RowGridLeft>
                </FullGridWidth>
              </ColumnGridLeft>
            </Header>
          )}

          <ContenWrapper fundCode={startInvest}>
            <RowGridLeft>
              <ContentGrid item xs={12} sm={6}>
                <Head1>Fund Information</Head1>

                <Head1>Strategic investment for potentially higher capital growth.</Head1>

                <RowGridLeft>
                  <Grid item xs={2}>
                    <UnitLabel>UNIT NAV</UnitLabel>
                    <UnitValue>
                      <NumberFormat
                        value={parseFloat(data.netAssetValue) || 0}
                        displayType={'text'}
                        thousandSeparator={','}
                        prefix={'MYR '}
                        decimalScale={4}
                        fixedDecimalScale
                      />
                    </UnitValue>
                  </Grid>
                  {/* <Grid item xs={2}>
                        <UnitLabel>AVERAGE </UnitLabel>
                        <UnitValue>{(data.historical10YrAnnualizedReturn * 100).toFixed(2) || 0}%</UnitValue>
                      </Grid> */}
                  <Grid item xs={10}>
                    <UnitLabel>MINIMUM INVESTMENT</UnitLabel>
                    <Grid container direction="row" justify="flex-start" alignItems="flex-end">
                      <UnitValue>
                        <NumberFormat
                          value={parseFloat(data.minInitialInvestmentAmt)}
                          displayType={'text'}
                          thousandSeparator={','}
                          prefix={'MYR '}
                          decimalScale={2}
                          fixedDecimalScale
                        />
                        <span style={{ paddingLeft: '4px', paddingRight: '12px', fontSize: '12px' }}>(One Time)</span>
                      </UnitValue>

                      <UnitValue>
                        <NumberFormat
                          value={parseFloat(data.minAdditionalInvestmentAmt)}
                          displayType={'text'}
                          thousandSeparator={','}
                          prefix={'MYR '}
                          decimalScale={2}
                          fixedDecimalScale
                        />
                        <span style={{ paddingLeft: '4px', fontSize: '12px' }}>(Additional)</span>
                      </UnitValue>
                    </Grid>
                  </Grid>
                </RowGridLeft>
                <StyledDivider />
                {hasFundDetails && (
                  <React.Fragment>
                    <Head2>Strategy</Head2>
                    <Details>{Parser(data.fundDetails.strategy || '')}</Details>
                    <StyledDivider />

                    <Head2>Manager</Head2>
                    <Details>{data.fundDetails.manager}</Details>
                    <StyledDivider />

                    <Head2>Application Fee</Head2>
                    <Details>{data.fundDetails.applicationfee}</Details>
                    <StyledDivider />

                    <Head2>Management Fee</Head2>
                    <Details>{Parser(data.fundDetails.managementfee || '')}</Details>
                    <StyledDivider />

                    <Head2>Trustee Fee</Head2>
                    <Details>{data.fundDetails.trusteefee}</Details>
                    <StyledDivider />

                    <Head2>Distribution Policy</Head2>
                    <Details>{Parser(data.fundDetails.distributionpolicy || '')}</Details>
                    <StyledDivider />

                    <Head2>Cooling-off Period</Head2>
                    <Details>{Parser(data.fundDetails.coolingoffperiod || '')}</Details>
                    <StyledDivider />

                    <Head2>Switching Policy</Head2>
                    <Details>{Parser(data.fundDetails.switchingpolicy || '')}</Details>
                    <StyledDivider />
                  </React.Fragment>
                )}
              </ContentGrid>
              <ContentGrid item xs={12} sm={6}>
                <ContainerImage style={{ marginBottom: '25px' }}>
                  <img src={require('./image/cpam_dummy_fund.png')} alt="Comimng soon" style={{ width: '100%' }} />
                  <ContainerImageCenter>
                    <Text size="18px">Coming soon</Text>
                  </ContainerImageCenter>
                </ContainerImage>

                <Head1>Top Holdings</Head1>
                {this.renderFundHoldingList()}
              </ContentGrid>
            </RowGridLeft>
            <Grid item xs={12}>
              <ButtonPdfSection paddingBottomOfFundPDFDownloadButton={paddingBottomOfFundPDFDownloadButton}>
                {/* {hasFundDetails && data.fundDetails.productHighlightSheet && data.fundDetails.productHighlightSheet !== 'N/A' ? ( */}
                <PdfButton onClick={() => this.redirectToUrl(data.fundDetails.productHighlightSheet)}>
                  <img src={DLIcon} alt="Download" />
                  Product Highlight Sheet
                </PdfButton>
                {/* ) : null} */}

                {/* {hasFundDetails && data.fundDetails.fundFactsheet && data.fundDetails.fundFactsheet !== 'N/A' ? ( */}
                <PdfButton onClick={() => this.redirectToUrl(data.fundDetails.fundFactsheet)}>
                  <img src={DLIcon} alt="Download" />
                  Fund Fact Sheet
                </PdfButton>
                {/* ) : null} */}

                {/* {hasFundDetails && data.fundDetails.prospectus && data.fundDetails.prospectus !== 'N/A' ? ( */}
                <PdfButton onClick={() => this.redirectToUrl(data.fundDetails.prospectus)}>
                  <img src={DLIcon} alt="Download" />
                  {data.fundSubType === 'W' ? 'Info Memo' : 'Prospectus'}
                </PdfButton>
                {/* ) : null} */}
              </ButtonPdfSection>
            </Grid>
          </ContenWrapper>
          {!startInvest && (
            <FundDrawer
              addToPorfolio={this.addToPortfolio}
              fundsDrawer={fundsDrawer}
              select={this.select}
              removeAll={this.removeAllSelectedFund}
              compareFunds={this.compareFunds}
            />
          )}
        </React.Fragment>
      );
    }
    return <LoadingOverlay show />;
  }
}

FundDetails.propTypes = {
  fundsDrawer: PropTypes.array,
  data: PropTypes.object,
  riskScore: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  fundCode: PropTypes.string,
  getFundDetails: PropTypes.func,
  saveFunds: PropTypes.func,
  saveFundsDrawer: PropTypes.func,
  step: PropTypes.number,
  resetFundDetails: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  data: makeSelectData(),
  fundsDrawer: makeSelectFundsDrawer(),
  riskScore: makeSelectRiskScore(),
  docs: makeSelectDocs(),
  step: makeSelectStep(),
  graphData: makeSelectGraphData(),
  fundHoldingList: makeSelectFundHoldingList(),
  fundPerformanceList: makeSelectFundPerformanceList(),
  processing: makeSelectProcessing(),
  fetchingFundGraph: makeSelectFetchingFundGraph(),
  fetchingFundHoldingList: makeSelectFetchingFundHoldingList(),
  fetchingFundPerformance: makeSelectFetchingFundPerformance(),
  clientDetails: makeSelectClientDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    getFundDetails: (payload) => dispatch(getFundDetails(payload)),
    saveFundsDrawer: (payload) => dispatch(saveFundsDrawer(payload)),
    getFundDocs: (payload) => dispatch(getFundDocs(payload)),
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    geFundDocsPdf: (payload) => dispatch(geFundDocsPdf(payload)),
    resetFundDetails: () => dispatch(resetFundDetails()),
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    saveFundsDrawer: (payload) => dispatch(saveFundsDrawer(payload)),
    getGraph: (payload) => dispatch(getGraph(payload)),
    getFundHoldingList: (payload) => dispatch(getFundHoldingList(payload)),
    getFundPerformanceList: (payload) => dispatch(getFundPerformanceList(payload)),
    clearGraphData: () => dispatch(clearGraphData()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'fundDetails', saga });

export default compose(withSaga, withConnect)(FundDetails);
