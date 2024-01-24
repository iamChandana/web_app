/**
 *
 * CompareFunds
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import { toast } from 'react-toastify';
// import Parser from 'html-react-parser';
import Text from 'components/Text';
import Filter from 'components/Filter';
import LoadingIndicator from 'components/LoadingIndicator';
import { ColumnGridLeft, RowGridLeft, RowGridSpaceBetween } from 'components/GridContainer';
import injectSaga from 'utils/injectSaga';
import { makeSelectFundsDrawer, makeSelectSelectedFunds } from 'containers/OnBoarding/selectors';
import { saveFundsSelected, saveFunds, saveFundsDrawer } from 'containers/OnBoarding/actions';
import { makeSelectClientDetails } from 'containers/ClientDetails/selectors';
import BottomDrawer from 'components/FundDrawer';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';
import _pick from 'lodash/pick';
import {
  makeSelectGraphData,
  makeSelectFundHoldingList,
  makeSelectFundPerformanceList,
  makeSelectProcessing,
  makeSelectIsProcessingGetTimeSeriesList,
  makeSelectIsOnboardingFlow,
} from './selectors';
import { Container } from './styles';
import FundNamePill from './FundNamePill';
import FundDetailsCard from './FundDetailsCard';
import Graph from './Graph';
import { getGraph, clearGraphData, getFundHoldingList, getFundPerformanceList } from './actions';
import saga from './saga';
// import { EmptyError } from 'rxjs';
import { generateXAxisLabel, convertGraphDataForPloting } from 'utils/graphHelper';
const maxNumOfFundGraphToGet = 3;

export class CompareFunds extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // selectedFundPerformanceTimeRange: 'YeartoMonthEndPerformance',
      // fundPerformanceTimeRange: [{ value: 'YeartoMonthEndPerformance', name: 'Year to Date' }, { value: 'ThreeYearPerformancetoLastMonthEnd', name: '3 Year' }],
      selectedFundPerformanceTimeRange: 1,
      fundPerformanceTimeRange: [{ value: 1, name: '1 Year' }, { value: 3, name: '3 Year' }, { value: 5, name: '5 Year' }],
      selectedFundPill: props.fundsDrawer ? (props.fundsDrawer[0] ? props.fundsDrawer[0].id : null) : null,
    };
    this.addToPortfolio = this.addToPortfolio.bind(this);
    this.removeAllSelectedFund = this.removeAllSelectedFund.bind(this);
    this.select = this.select.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addToPortfolioFromFundDrawer = this.addToPortfolioFromFundDrawer.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentWillMount() {
    const { fundsDrawer } = this.props;
    if (fundsDrawer && fundsDrawer.length > 0) {
      const arr = [];
      for (const obj of this.props.fundsDrawer) {
        if (arr.length < maxNumOfFundGraphToGet) {
          const payload = {
            isin: obj.fundDetails.isin,
            fundName: obj.name,
            lipperId: obj.lipperId,
            ric: obj.ric,
            numOfYear: this.state.selectedFundPerformanceTimeRange,
          };
          arr.push(payload);
        } else {
          break;
        }
      }
      this.props.getFundPerformanceList(arr);
      this.props.getFundHoldingList(arr);
      this.props.getGraph(arr);
    }
  }

  componentWillUnMount() {
    this.props.clearGraphData();
  }
  componentDidUpdate(prevProps) {
    const { graphData } = this.props;
    if (prevProps.graphData !== graphData) {
      this.notify(graphData, 'error');
    }
  }

  notify(message, status) {
    if (!toast.isActive(this.toastId)) {
      if (status === 'error') {
        this.toastId = toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }

  renderGraph() {
    if (this.props.isProcessingGetTimeSeriesList) {
      return <LoadingIndicator />;
    }

    if (!_isEmpty(this.props.graphData)) {
      const { fundsDrawer } = this.props;

      const ticks = generateXAxisLabel(this.props.graphData[0].fundGraph, this.state.selectedFundPerformanceTimeRange);

      const data = convertGraphDataForPloting(this.props.graphData);

      const arrFund = [];

      for (let i = 0; i < fundsDrawer.length; i++) {
        if (i < maxNumOfFundGraphToGet) {
          arrFund.push({ name: fundsDrawer[i].name, isin: fundsDrawer[i].isin });
        } else {
          break;
        }
      }

      return (
        <Graph
          perfData={data}
          xAxisTicks={ticks}
          // funds={fundsDrawer.map((obj) => ({ name: obj.name, isin: obj.isin }))}
          funds={arrFund}
        />
      );
    }
    const message = 'No Graph Data';
    return <Text size="18px">{message}</Text>;
  }

  selectedFundToShowGraph(fund) {
    this.setState({
      selectedFundPill: fund.id,
    });
  }

  changeFilter(e) {
    this.setState(
      {
        selectedFundPerformanceTimeRange: e.target.value,
      },
      () => {
        this.props.clearGraphData();
        const arr = [];
        for (const obj of this.props.fundsDrawer) {
          if (arr.length < maxNumOfFundGraphToGet) {
            const payload = {
              isin: obj.fundDetails.isin,
              fundName: obj.name,
              lipperId: obj.lipperId,
              ric: obj.ric,
              numOfYear: this.state.selectedFundPerformanceTimeRange,
            };
            arr.push(payload);
          } else {
            break;
          }
        }
        this.props.getGraph(arr);
      },
    );
  }

  addToPortfolio(fund) {
    const payload = Object.assign({}, { ...fund }, { initialInvestment: fund.initialInvestment || fund.minInitialInvestmentAmt });
    const arr = [];

    if (!this.props.selectedFunds || this.props.selectedFunds.length < 1) {
      arr.push(payload);
      this.props.saveFundsSelected(arr);
    } else {
      const index = this.props.selectedFunds.filter((e) => e.fundcode === fund.fundcode).length;

      if (index < 1) {
        for (const obj of this.props.selectedFunds) {
          arr.push(obj);
        }

        arr.push(payload);

        this.props.saveFundsSelected(arr);
      }
    }

    if (this.props.location && this.props.location.state) {
      const { customerId, portfolioId } = this.props.location.state;
      if (!customerId || !portfolioId) {
        this.props.history.replace('/onboarding/select-funds/allocate');
      } else {
        this.props.history.push(`/clients/${customerId}/allocate-funds/${portfolioId}`);
      }
    } else {
      this.props.history.replace('/onboarding/select-funds/allocate');
    }
    // this.props.history.push(`/clients/${customerId}/allocate-funds/${id}`);
  }

  addToPortfolioFromFundDrawer() {
    const payload = this.props.fundsDrawer.map((element) =>
      Object.assign({}, { ...element }, { initialInvestment: element.initialInvestment || element.minInitialInvestmentAmt }),
    );
    this.props.saveFunds(payload);

    if (this.props.location && this.props.location.state) {
      const { customerId, portfolioId } = this.props.location.state;
      if (!customerId || !portfolioId) {
        this.props.history.replace('/onboarding/select-funds/allocate');
      } else {
        this.props.history.push(`/clients/${customerId}/allocate-funds/${portfolioId}`);
      }
    } else {
      this.props.history.replace('/onboarding/select-funds/allocate');
    }
  }

  removeAllSelectedFund() {
    this.props.saveFundsDrawer([]);
    this.props.saveFunds([]);
    // console.log('going back', this.props);
    // this.props.history.goBack();
  }

  handleAccept(data) {
    const selectedArray = [...this.props.fundsDrawer];
    const indexInSelected = _findIndex(selectedArray, ['id', data.id]);

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
        // if removed item is the selected fund pill, default select the first item
        if (data.id === this.state.selectedFundPill && !_isEmpty(this.state.selected)) {
          this.selectedFundToShowGraph(this.state.selected[0]);
        }
        this.props.saveFundsDrawer(selectedArray);
        this.handleClose();
      },
    );
    /*
    if (this.props.location && this.props.location.state) {

      let selectedFund = this.props.location.state.data;

      if (_isEmpty(selectedFund)) {
        selectedFund = this.props.location.state.selectedFundOnBoarding
      }

      const selectedArray = [...selectedFund];
      const indexInSelected = _findIndex(selectedFund, ['id', data.id]);
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
    */
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  select(data) {
    if (!_isEmpty(data) && !_isEmpty(this.props.customer) && !_isEmpty(this.props.customer.info)) {
      const {
        customer: {
          info: { riskAppetite },
        },
      } = this.props;
      this.setState(
        {
          selectedData: data,
        },
        () => {
          if (
            !_isEmpty(this.props.customer) &&
            !_isEmpty(this.props.customer.info) &&
            riskAppetite.toLowerCase() !== data.riskProfileType.toLowerCase() &&
            _findIndex(this.state.selected, ['id', data.id]) === -1
          ) {
            const an = data.riskProfileType === 'Aggressive' ? 'an' : 'a';
            const modalMessage = `Your risk profile is ${riskAppetite} but you have selected ${an} ${data.riskProfileType} fund.`;
            this.setState({
              open: true,
              modalMessage,
            });
          } else {
            this.handleAccept(data);
          }
        },
      );
    } else if (!_isEmpty(data)) {
      this.handleAccept(data);
    }
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    // console.log('FUNDS drawerr', this.props);
    const { fundsDrawer } = this.props;
    if (fundsDrawer.length === 0) {
      if (!this.props.isOnboardingFlow) {
        // console.log('The client details ', this.props.clientDetails);
        if (this.props.clientDetails) {
          const { info, portfolio } = this.props.clientDetails;
          if (info.id && portfolio[0].id) {
            this.props.history.push(`/clients/${info.id}/add-funds/${portfolio[0].id}`);
          } else {
            this.props.history.push('onboarding/select-funds/list');
          }
        }
      } else {
        this.props.history.push('onboarding/select-funds/list');
      }
    }

    return (
      <React.Fragment>
        <Container>
          <RowGridSpaceBetween>
            <Grid item>
              <Text size="18px" weight="600" color="#000" align="left">
                Compare Funds
              </Text>
            </Grid>
            <Grid item>
              <Text
                size="12px"
                onClick={() => {
                  if (this.props.clientDetails) {
                    const { info, portfolio } = this.props.clientDetails;
                    if (info.id && portfolio[0].id) {
                      this.props.history.push(`/clients/${info.id}/add-funds/${portfolio[0].id}`);
                    } else {
                      this.props.history.push('onboarding/select-funds/list');
                    }
                  } else {
                    this.props.history.push('onboarding/select-funds/list');
                  }
                }}>
                Close x
              </Text>
            </Grid>
          </RowGridSpaceBetween>
          <Text size="18px" weight="600" color="#000" align="left">
            Fund Performance
          </Text>
          <Grid container spacing={24}>
            <Grid item>
              <ColumnGridLeft>
                <Grid item style={{ marginBottom: '5px', marginTop: '20px' }}>
                  <Filter
                    lastItem
                    label="Time Range"
                    data={this.state.fundPerformanceTimeRange}
                    name="filterFundPerformanceTimeRange"
                    value={this.state.selectedFundPerformanceTimeRange}
                    onChange={this.changeFilter}
                  />
                </Grid>
                {fundsDrawer.map((item, i) => {
                  if (i < 3) {
                    return (
                      <Grid item key={item.id} onClick={this.selectedFundToShowGraph.bind(this, item, i)}>
                        <FundNamePill data={item} index={i} />
                      </Grid>
                    );
                  }
                })}
              </ColumnGridLeft>
            </Grid>
            <Grid item xs={9}>
              {this.renderGraph()}
            </Grid>
          </Grid>
          <RowGridLeft spacing={24}>
            {fundsDrawer.map((item, index) => {
              if (index < 3) {
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <FundDetailsCard
                      data={item}
                      dataIndex={index}
                      addFundToPortfolio={this.addToPortfolio}
                      fundHoldingList={this.props.fundHoldingList}
                      fundPerformanceList={this.props.fundPerformanceList}
                    />
                  </Grid>
                );
              }
            })}
          </RowGridLeft>
        </Container>
        <BottomDrawer
          addToPorfolio={this.addToPortfolioFromFundDrawer}
          fundsDrawer={fundsDrawer}
          select={this.select}
          removeAll={this.removeAllSelectedFund}
          disableCompareFund
        />
      </React.Fragment>
    );
  }
}

CompareFunds.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  fundsDrawer: PropTypes.array,
  saveFunds: PropTypes.func,
  getGraph: PropTypes.func,
  saveFundsDrawer: PropTypes.func,
  saveFundsSelected: PropTypes.func,
  graphData: PropTypes.object,
  processing: PropTypes.bool,
  customer: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  fundsDrawer: makeSelectFundsDrawer(),
  graphData: makeSelectGraphData(),
  fundHoldingList: makeSelectFundHoldingList(),
  fundPerformanceList: makeSelectFundPerformanceList(),
  processing: makeSelectProcessing(),
  clientDetails: makeSelectClientDetails(),
  selectedFunds: makeSelectSelectedFunds(),
  isProcessingGetTimeSeriesList: makeSelectIsProcessingGetTimeSeriesList(),
  isOnboardingFlow: makeSelectIsOnboardingFlow(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getGraph: (payload) => dispatch(getGraph(payload)),
    saveFundsSelected: (payload) => dispatch(saveFundsSelected(payload)),
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    saveFundsDrawer: (payload) => dispatch(saveFundsDrawer(payload)),
    clearGraphData: () => dispatch(clearGraphData()),
    getFundHoldingList: (payload) => dispatch(getFundHoldingList(payload)),
    getFundPerformanceList: (payload) => dispatch(getFundPerformanceList(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withSaga = injectSaga({ key: 'compareFunds', saga });

export default compose(
  withSaga,
  withConnect,
)(CompareFunds);
