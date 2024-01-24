import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';

import { ColumnGridCenter, RowGridLeft, RowGridSpaceBetween } from 'components/GridContainer';
import { setTitle, setStep, saveFunds, saveFundsDrawer, getFunds, getAllFunds, resetError } from 'containers/OnBoarding/actions';
import { setAddFundsFlow } from 'containers/CompareFunds/actions';
import FundCard from 'components/FundCard';
import Text from 'components/Text';
import Filter from 'components/Filter';
import BottomDrawer from 'components/FundDrawer';
import Pagination from 'components/Pagination';
import LoadingOverlay from 'components/LoadingOverlay';
import SearchAutoComplete from 'components/SearchAutoComplete';
import ConfirmRiskModal from 'components/ConfirmRiskModal';
import ShariahFundSwitch from 'components/ShariahFundSwitch';
import WholeSaleWarningModal from 'components/WholeSaleWarningModal';
import { rejectBackButton } from 'utils/helpers';
import { findSelectedFundIndex } from 'containers/ClientDetails/utils/getAccountHolderType.js';
import {
  makeSelectFundsDrawer,
  makeSelectFunds,
  makeSelectProcessing,
  makeSelectRiskScore,
  makeSelectAllFunds,
  makeSelectError,
  makeSelectFundFilterAsset,
  makeSelectFundFilterRiskProfileType,
  makeSelectFundFilterValueForMoney,
  makeSelectFundFilterFundType,
  makekwspCashIntroDetails,
} from 'containers/OnBoarding/selectors';

import { CardContainer, Container, TextNoData, PaddedGrid, FullWidthGrid, FilterContainerSmall } from './styles';
import { AssetClass, RiskLevel, ValueForMoney } from 'utils/Filters/Funds';

class FundList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.fundsDrawer,
      riskLevelFilter: 'All', // props.riskScore.riskProfileType,
      assetClassFilter: 'All',
      valueForMoneyFilter: 'All',
      showShariah:
        props.kwspCashIntroDetails &&
        props.kwspCashIntroDetails.createKwspAccountParams &&
        props.kwspCashIntroDetails.createKwspAccountParams.islamicORConventionalFlag === 'I',
      isShariahDisabled:
        props.kwspCashIntroDetails &&
        props.kwspCashIntroDetails.createKwspAccountParams &&
        props.kwspCashIntroDetails.createKwspAccountParams.islamicORConventionalFlag === 'I',
      currentPage: 1,
      searchInput: '',
      modalMessage: '',
      open: false,
      selectedData: '',
    };
    this.isAnExistingCustomer = false;
    this.existingCustomerId = null;

    this.next = this.next.bind(this);
    this.select = this.select.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.paginate = this.paginate.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.compareFunds = this.compareFunds.bind(this);
    this.checkIfWholeSaleFund = this.checkIfWholeSaleFund.bind(this);
    this.closeWholeSaleWarningModal = this.closeWholeSaleWarningModal.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentWillMount() {
    rejectBackButton();
    const fundType = this.props.kwspCashIntroDetails.createKwspAccountParams.islamicORConventionalFlag === 'I';
    this.props.getFunds({
      riskProfileType: this.props.riskProfileType
        ? this.props.riskProfileType
        : this.props.riskScore
        ? this.props.riskScore.riskProfileType
        : 'All',
      assetFilter: this.props.assetFilter,
      ValueForMoney: this.props.ValueForMoney,
      fundType,
    });

    if (_isEmpty(this.props.allFunds)) {
      this.props.getAllFunds();
    }

    if (this.props.kwspCashIntroDetails.createKwspAccountParams.islamicORConventionalFlag === 'I') {
      this.setState({
        showShariah: true,
        isShariahDisabled: true,
      });
    }
    this.props.setStep(4);

    this.props.setTitle('Please choose the funds to invest in.');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
      toast(nextProps.error);
      this.props.resetError();
    }
    return null;
  }

  select(data) {
    const { riskScore } = this.props;

    if (
      riskScore.riskProfileType.toLowerCase() !== data.riskProfileType.toLowerCase() &&
      _findIndex(this.state.selected, ['id', data.id]) === -1
    ) {
      const an = data.riskProfileType === 'Aggressive' ? 'an' : 'a';
      const riskProfileType = data.riskProfileType
        ? data.riskProfileType.toUpperCase() === 'NA'
          ? 'Money Market'
          : data.riskProfileType
        : '';
      const modalMessage = `Your risk profile is ${riskScore.riskProfileType} but you have selected ${an} ${riskProfileType} fund.`;
      this.setState({
        open: true,
        modalMessage,
      });
    } else {
      this.handleAccept(data);
    }
  }

  compareFunds() {
    this.props.setAddFundsFlow(true);
    this.props.history.push('/compare-funds', {
      riskScore: this.props.riskScore,
      selectedFundOnBoarding: this.state.selected,
    });
  }

  handleAccept(data) {
    // const data = this.state.selectedData;
    const selectedArray = [...this.state.selected];
    const indexInSelected = findSelectedFundIndex(this.state.selected, data);
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

  viewDetails(id) {
    this.props.history.push(`/funds/${id}`, {
      backUrl: '/onboarding/select-funds/list',
      selectedFundOnBoarding: this.state.selected,
    });
  }

  removeAll() {
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
  changeFilter(e, type) {
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
        riskLevelFilter: e.target.value,
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
      riskProfileType: this.props.riskProfileType,
      fundType: this.state.showShariah,
      assetFilter: this.props.assetFilter,
      ValueForMoney: this.props.ValueForMoney,
      searchInput: this.state.searchInput,
    });
    window.scrollTo(0, 80);
  }
  next() {
    // inject initial investment field
    const payload = this.state.selected.map((element) =>
      Object.assign({}, { ...element }, { initialInvestment: element.initialInvestment || element.minInitialInvestmentAmt }),
    );
    this.props.saveFunds(payload);
    if (this.isAnExistingCustomer) {
      this.props.history.push(`/clients/${this.existingCustomerId}/select-funds/allocate`);
    } else {
      this.props.history.push('/onboarding/select-funds/allocate');
    }
  }
  handleClose() {
    this.setState({
      open: false,
    });
  }

  checkIfWholeSaleFund(data) {
    let showWholeSaleWarningModal = false;
    const indexInSelected = findSelectedFundIndex(this.state.selected, data);
    if (data.fundSubType === 'W' && indexInSelected === -1) {
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
    this.setState(
      {
        showWholeSaleWarningModal: false,
      },
      () => {
        this.select(this.state.selectedData);
      },
    );
  }

  render() {
    const { fundsDrawer = [], funds, processing, allFunds } = this.props;
    if (!_isEmpty(funds) && !_isEmpty(allFunds)) {
      const { count, res } = funds.Funds;
      const hasData = res.length > 0;
      // getExistingCustomerDetails && this.setExistingCustomerFlags(getExistingCustomerDetails);
      const {
        kwspCashIntroDetails: { createKwspAccountParams },
      } = this.props;

      const selectedAccount = {
        partnerAccountType: createKwspAccountParams.AccountType,
      };
      return (
        <React.Fragment>
          <LoadingOverlay show={processing} />
          <ConfirmRiskModal
            open={this.state.open}
            handleClose={this.handleClose}
            modalMessage={this.state.modalMessage}
            handleAccept={this.handleAccept}
            data={this.state.selectedData}
          />
          <WholeSaleWarningModal
            open={this.state.showWholeSaleWarningModal}
            handleClose={this.closeWholeSaleWarningModal}
            handleContinue={this.handleContinue}
          />
          <Container>
            <PaddedGrid item xs={12}>
              <RowGridSpaceBetween>
                <Grid item>
                  <Text color="#000" weight="600" size="18px">
                    Fund List
                  </Text>
                </Grid>
                <ShariahFundSwitch
                  currentState={this.state.showShariah}
                  changeFilter={this.changeFilter}
                  isShariahDisabled={this.state.isShariahDisabled}
                />
              </RowGridSpaceBetween>
            </PaddedGrid>
            <PaddedGrid item xs={12}>
              <RowGridSpaceBetween>
                <Grid item xs={12} sm={12} md={4} lg={5} style={{ marginBottom: '15px' }}>
                  <SearchAutoComplete
                    placeholder="Search Funds..."
                    data={allFunds}
                    handleSearch={(data) => {
                      this.changeFilter(data.replace(/\\/g, '').replace(/\"/g, ''), 'searchInput');
                    }}
                    type="dashboard"
                  />
                </Grid>
                <Grid item xs={10} sm={10} md={8} lg={7} style={{ marginBottom: '15px' }}>
                  <RowGridLeft>
                    <Grid item xs={4}>
                      <FilterContainerSmall>
                        <Filter
                          label="Value for Money"
                          data={ValueForMoney}
                          name="fundFilter"
                          value={this.props.ValueForMoney ? this.props.ValueForMoney : this.state.valueForMoneyFilter}
                          onChange={this.changeFilter}
                        />
                      </FilterContainerSmall>
                    </Grid>
                    <Grid item xs={4}>
                      <FilterContainerSmall>
                        <Filter
                          label="Asset Classes"
                          data={AssetClass}
                          name="fundAssetFilter"
                          value={this.props.assetFilter ? this.props.assetFilter : this.state.assetClassFilter}
                          onChange={this.changeFilter}
                        />
                      </FilterContainerSmall>
                    </Grid>
                    <Grid item xs={4}>
                      <FilterContainerSmall>
                        <Filter
                          lastItem
                          label="Risk Level"
                          data={RiskLevel}
                          name="modelPortfolioFilter"
                          value={this.props.riskProfileType ? this.props.riskProfileType : this.state.riskLevelFilter}
                          onChange={this.changeFilter}
                        />
                      </FilterContainerSmall>
                    </Grid>
                  </RowGridLeft>
                </Grid>
              </RowGridSpaceBetween>
            </PaddedGrid>
            <FullWidthGrid item xs={12}>
              {hasData && (
                <CardContainer spacing={24}>
                  {res.map(
                    (data) =>
                      !(
                        (data.kwStatus === 'C' || data.kwStatus === 'S') &&
                        selectedAccount &&
                        selectedAccount.partnerAccountType === 'KW'
                      ) && (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                          <FundCard
                            data={data}
                            originScreen={'onboarding-funds'}
                            onSelect={this.checkIfWholeSaleFund}
                            selected={this.state.selected}
                            viewDetails={this.viewDetails}
                            selectedAccount={selectedAccount}
                          />
                        </Grid>
                      ),
                  )}
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
          <BottomDrawer
            addToPorfolio={this.next}
            fundsDrawer={fundsDrawer}
            select={this.select}
            removeAll={this.removeAll}
            compareFunds={this.compareFunds}
          />
        </React.Fragment>
      );
    }
    return <LoadingOverlay show={processing} />;
  }
}
FundList.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  saveFunds: PropTypes.func,
  saveFundsDrawer: PropTypes.func,
  funds: PropTypes.object,
  fundsDrawer: PropTypes.array,
  riskScore: PropTypes.object,
  processing: PropTypes.bool,
  getFunds: PropTypes.func,
  error: PropTypes.string,
};

FundList.defaultProps = {
  fundsDrawer: [],
};
const mapStateToProps = createStructuredSelector({
  funds: makeSelectFunds(),
  fundsDrawer: makeSelectFundsDrawer(),
  processing: makeSelectProcessing(),
  riskScore: makeSelectRiskScore(),
  allFunds: makeSelectAllFunds(),
  error: makeSelectError(),
  assetFilter: makeSelectFundFilterAsset(),
  riskProfileType: makeSelectFundFilterRiskProfileType(),
  ValueForMoney: makeSelectFundFilterValueForMoney(),
  fundType: makeSelectFundFilterFundType(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
});
function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    saveFundsDrawer: (payload) => dispatch(saveFundsDrawer(payload)),
    getFunds: (payload) => dispatch(getFunds(payload)),
    getAllFunds: () => dispatch(getAllFunds()),
    resetError: () => dispatch(resetError()),
    setAddFundsFlow: (payload) => dispatch(setAddFundsFlow(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FundList);
