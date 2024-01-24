import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { ColumnGridCenter, RowGridLeft, RowGridSpaceBetween } from 'components/GridContainer';
import { saveFunds, saveFundsDrawer, getFunds, getAllFunds } from 'containers/OnBoarding/actions';
import { addFundPlan } from 'containers/FundProjection/actions';
import FundCard from 'components/FundCard';
import Text from 'components/Text';
import { compose } from 'redux';
import Filter from 'components/Filter';
import Pagination from 'components/Pagination';
import LoadingOverlay from 'components/LoadingOverlay';
import SearchAutoComplete from 'components/SearchAutoComplete';
import ShariahFundSwitch from 'components/ShariahFundSwitch';
import NavPillTab from 'components/NavPillTab';

import {
  makeSelectFundsDrawer,
  makeSelectFunds,
  makeSelectProcessing,
  makeSelectRiskScore,
  makeSelectAllFunds,
  makeSelectFundFilterAsset,
  makeSelectFundFilterFundType,
  makeSelectFundFilterRiskProfileType,
  makeSelectFundFilterValueForMoney,
} from 'containers/OnBoarding/selectors';

import { makeSelectFundPlans } from 'containers/FundProjection/selectors';
import { AssetClass, RiskLevel, ValueForMoney } from 'utils/Filters/Funds';
import { CardContainer, Container, TextNoData, PaddedGrid, FullWidthGrid, FilterGrid, FilterContainerSmall } from './styles';

class Funds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // if props N/A, use defaultProps value
      selected: props.fundsDrawer,
      riskProfileTypeFilter: props.riskProfileType, // props.riskScore.riskProfileType,
      assetClassFilter: props.assetFilter,
      valueForMoneyFilter: props.ValueForMoney,
      showShariah: props.fundType,
      currentPage: 1,
      searchInput: '',
      modalMessage: '',
      open: false,
      selectedData: '',
    };
    this.select = this.select.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.paginate = this.paginate.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
  }
  componentWillMount() {
    this.props.getFunds({
      skip: 0,
      riskProfileType: this.props.riskProfileType,
      assetFilter: this.props.assetFilter,
      ValueForMoney: this.props.ValueForMoney,
      fundType: this.props.fundType,
    });
    if (_isEmpty(this.props.allFunds)) {
      this.props.getAllFunds();
    }
  }

  select(data) {
    const fundId = data.id;
    const fundName = data.name;
    this.props.addFundPlan({
      fundId,
      fundName,
      initialInvestment: 0,
      monthlyContribution: 1000,
      goalYears: 10,
      minAdditionalInvestmentAmt: 0,
      maxAdditionalInvestmentAmt: 0,
      minInitialInvestmentAmt: 0,
      maxInitialInvestmentAmt: 0,
    });
    this.props.history.push(`/fund-projection/${fundId}`);
  }

  viewDetails(id) {
    this.props.history.push(`/funds/${id}`, { startInvest: true });
  }

  changeFilter(e, type) {
    // console.log(e, type, 'typedddddd')
    this.setState({
      currentPage: 1,
    });
    if (type === 'fundAssetFilter') {
      this.props.getFunds({
        riskProfileType: this.props.riskProfileType,
        assetFilter: e.target.value,
        fundType: this.state.showShariah,
        ValueForMoney: this.props.ValueForMoney,
        searchInput: this.state.searchInput,
      });
      this.setState({
        assetClassFilter: e.target.value,
      });
    } else if (type === 'fundFilter') {
      if (typeof e !== 'boolean') {
        this.props.getFunds({
          riskProfileType: this.props.riskProfileType,
          assetFilter: this.props.assetFilter,
          ValueForMoney: e.target.value,
          fundType: this.state.showShariah,
          searchInput: this.state.searchInput,
        });
        this.setState({
          valueForMoneyFilter: e.target.value,
        });
      } else {
        this.props.getFunds({
          riskProfileType: this.props.riskProfileType,
          assetFilter: this.props.assetFilter,
          fundType: e,
          ValueForMoney: this.props.ValueForMoney,
          searchInput: this.state.searchInput,
        });
        this.setState({
          showShariah: e,
        });
      }
    } else if (type === 'modelPortfolioFilter') {
      if (typeof e !== 'boolean') {
        this.props.getFunds({
          riskProfileType: e.target.value,
          assetFilter: this.props.assetFilter,
          ValueForMoney: this.props.ValueForMoney,
          fundType: this.state.showShariah,
          searchInput: this.state.searchInput,
        });
        this.setState({
          riskProfileTypeFilter: e.target.value,
        });
      } else {
        this.props.getFunds({
          riskProfileType: this.props.riskProfileType,
          assetFilter: this.props.assetFilter,
          fundType: e,
          ValueForMoney: this.props.ValueForMoney,
          searchInput: this.state.searchInput,
        });
        this.setState({
          showShariah: e,
        });
      }
    } else if (type === 'searchInput') {
      const value = e ? e.trim() : '';
      this.props.getFunds({
        riskProfileType: this.props.riskProfileType,
        assetFilter: this.props.assetFilter,
        fundType: this.state.showShariah,
        ValueForMoney: this.props.ValueForMoney,
        searchInput: value,
      });
      this.setState({
        searchInput: value,
      });
    } else {
      this.props.getFunds({
        riskProfileType: e.target.value,
        fundType: this.state.showShariah,
        assetFilter: this.props.assetFilter,
        ValueForMoney: this.props.ValueForMoney,
        searchInput: this.state.searchInput,
      });
      this.setState({
        riskProfileType: e.target.value,
      });
    }
  }

  paginate(current, pagesize) {
    // current
    this.setState({
      currentPage: current,
    });
    const skip = current !== 1 ? (current - 1) * pagesize : 0;
    this.props.getFunds({
      skip,
      riskProfileType: this.state.riskProfileType,
      fundType: this.state.showShariah,
      assetFilter: this.state.assetClassFilter,
      ValueForMoney: this.props.ValueForMoney,
      searchInput: this.state.searchInput,
    });
    window.scrollTo(0, 80);
  }
  render() {
    const { funds, processing, allFunds } = this.props;
    if (!_isEmpty(funds)) {
      const { count, res } = funds.Funds;
      const hasData = res.length > 0;
      return (
        <React.Fragment>
          <NavPillTab />
          <LoadingOverlay show={processing} />
          <Container>
            <PaddedGrid item xs={12}>
              <RowGridSpaceBetween>
                <Grid item>
                  <Text color="#000" weight="600" size="18px">
                    Fund List
                  </Text>
                </Grid>
                <ShariahFundSwitch currentState={this.state.showShariah} changeFilter={this.changeFilter} />
              </RowGridSpaceBetween>
            </PaddedGrid>
            <PaddedGrid item xs={12}>
              <RowGridSpaceBetween>
                <Grid item xs={12} sm={12} md={12} lg={3}>
                  <SearchAutoComplete
                    placeholder="Search Funds..."
                    data={allFunds}
                    handleSearch={(data) => {
                      this.changeFilter(data.replace(/\\/g, '').replace(/\"/g, ''), 'searchInput');
                    }}
                    type="dashboard"
                  />
                </Grid>
                <FilterGrid item>
                  <RowGridLeft>
                    <Grid item>
                      <FilterContainerSmall>
                        <Filter
                          label="Value for Money"
                          data={ValueForMoney}
                          name="fundFilter"
                          value={this.state.valueForMoneyFilter}
                          onChange={this.changeFilter}
                        />
                      </FilterContainerSmall>
                    </Grid>
                    <Grid item>
                      <FilterContainerSmall>
                        <Filter
                          label="Asset Classes"
                          data={AssetClass}
                          name="fundAssetFilter"
                          value={this.state.assetClassFilter}
                          onChange={this.changeFilter}
                        />
                      </FilterContainerSmall>
                    </Grid>
                    <Grid item>
                      <FilterContainerSmall>
                        <Filter
                          label="Risk Level"
                          data={RiskLevel}
                          name="modelPortfolioFilter"
                          value={this.state.riskProfileTypeFilter}
                          onChange={this.changeFilter}
                        />
                      </FilterContainerSmall>
                    </Grid>
                  </RowGridLeft>
                </FilterGrid>
              </RowGridSpaceBetween>
            </PaddedGrid>
            <FullWidthGrid item xs={12}>
              {hasData && (
                <CardContainer spacing={24}>
                  {res.map((data) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                      <FundCard data={data} onSelect={this.select} viewDetails={this.viewDetails} />
                    </Grid>
                  ))}
                </CardContainer>
              )}
              {!hasData && <TextNoData>No Available Funds</TextNoData>}
            </FullWidthGrid>
            <FullWidthGrid item xs={12}>
              <ColumnGridCenter>
                {hasData && <Pagination current={this.state.currentPage} count={count} onChange={this.paginate} />}
              </ColumnGridCenter>
            </FullWidthGrid>
          </Container>
        </React.Fragment>
      );
    }
    return <LoadingOverlay show={processing} />;
  }
}

Funds.propTypes = {
  history: PropTypes.object,
  funds: PropTypes.object,
  fundsDrawer: PropTypes.array,
  processing: PropTypes.bool,
  getFunds: PropTypes.func,
  addFundPlan: PropTypes.func,
  allFunds: PropTypes.array,
  getAllFunds: PropTypes.func,
  riskProfileType: PropTypes.string,
  assetFilter: PropTypes.string,
  ValueForMoney: PropTypes.string,
  fundType: PropTypes.bool,
};

Funds.defaultProps = {
  fundsDrawer: [],
  riskProfileType: 'All',
  assetFilter: 'All',
  ValueForMoney: 'All',
  fundType: false,
};
const mapStateToProps = createStructuredSelector({
  funds: makeSelectFunds(),
  fundsDrawer: makeSelectFundsDrawer(),
  processing: makeSelectProcessing(),
  riskScore: makeSelectRiskScore(),
  allFunds: makeSelectAllFunds(),
  fundPlans: makeSelectFundPlans(),
  assetFilter: makeSelectFundFilterAsset(),
  riskProfileType: makeSelectFundFilterRiskProfileType(),
  ValueForMoney: makeSelectFundFilterValueForMoney(),
  fundType: makeSelectFundFilterFundType(),
});
function mapDispatchToProps(dispatch) {
  return {
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    saveFundsDrawer: (payload) => dispatch(saveFundsDrawer(payload)),
    getFunds: (payload) => dispatch(getFunds(payload)),
    getAllFunds: () => dispatch(getAllFunds()),
    addFundPlan: (payload) => dispatch(addFundPlan(payload)),
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(Funds);

// const withSaga = injectSaga({ key: 'onBoarding', saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(Funds);
