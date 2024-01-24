import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import { compose } from 'redux';
import Dialog from 'components/Dialog';
import Radio from 'material-ui/Radio';
import styled from 'styled-components';
import { FormControlLabel } from 'material-ui/Form';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
import { ColumnGridCenter, RowGridLeft, RowGridSpaceBetween } from 'components/GridContainer';
import WholeSaleWarningModal from 'components/WholeSaleWarningModal';
import { getAccountHolderType, findSelectedFundIndex } from '../utils/getAccountHolderType';
import {
  setTitle,
  setStep,
  saveFunds,
  saveFundsDrawer,
  getFunds,
  getAllFunds,
  resetError,
  getRiskProfiles,
  getCustomer,
  saveKWSPandCashDetails,
} from 'containers/OnBoarding/actions';
import FundCard from 'components/FundCard';
import Text from 'components/Text';
import Filter from 'components/Filter';
import BottomDrawer from 'components/FundDrawer';
import Pagination from 'components/Pagination';
import LoadingOverlay from 'components/LoadingOverlay';
import SearchAutoComplete from 'components/SearchAutoComplete';
import ConfirmRiskModal from 'components/ConfirmRiskModal';
import ShariahFundSwitch from 'components/ShariahFundSwitch';
import { makeSelectClientDetails } from 'containers/ClientDetails/selectors';
import {
  makeSelectFundsDrawer,
  makeSelectFunds,
  makeSelectProcessing,
  makeSelectRiskScore,
  makeSelectAllFunds,
  makeSelectError,
  makeSelectCustomer,
  makeSelectRiskProfiles,
  makeSelectFundFilterAsset,
  makeSelectFundFilterFundType,
  makeSelectFundFilterRiskProfileType,
  makeSelectFundFilterValueForMoney,
  makekwspCashIntroDetails,
  makeSelectSelectedFunds,
} from 'containers/OnBoarding/selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { getCustomerDetails, saveSelectedAccount } from 'containers/ClientDetails/actions';
import { AssetClass, RiskLevel, ValueForMoney } from 'utils/Filters/Funds';
import { CardContainer, Container, TextNoData, PaddedGrid, FullWidthGrid, FilterGrid } from './styles';
import AddNewFundsHeader from '../AddNewFundsHeader';
import { checkInHolderClass } from '../../ClientDetails/Funds/Utility';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  }
`;

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${(props) => props.btnBgColor};
  border: 1px solid ${Color.C_LIGHT_BLUE};
  margin-top: 32px;
  color: ${(props) => props.btnFontColor};
  font-family: ${defaultFont.primary.name};
  outline: none;
  cursor: pointer;
`;

class AddFunds extends React.Component {
  constructor(props) {
    super(props);

    let riskLevelFilter = 'All';

    if (props.customer && props.customer.info && props.customer.info.riskAppetite) {
      riskLevelFilter = props.customer.info.riskAppetite;
    }
    this.state = {
      selected: props.fundsDrawer,
      riskLevelFilter, // props.riskScore.riskProfileType,
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
      selectedAccount: '',
      toggleAccountSelection: false,
    };

    this.next = this.next.bind(this);
    this.select = this.select.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.paginate = this.paginate.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.compareFunds = this.compareFunds.bind(this);
    this.cancel = this.cancel.bind(this);
    this.getProductPortfolio = this.getProductPortfolio.bind(this);
    this.handleSelectAccountSubmit = this.handleSelectAccountSubmit.bind(this);
    this.handleSelectAccountChange = this.handleSelectAccountChange.bind(this);
    this.checkIfWholeSaleFund = this.checkIfWholeSaleFund.bind(this);
    this.closeWholeSaleWarningModal = this.closeWholeSaleWarningModal.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentWillMount() {
    this.getSelectedAccountDetails();
    this.props.getCustomer({ id: this.props.match.params.id, portfolioId: this.props.match.params.portfolioId });
    this.props.getRiskProfiles();
    if (_isEmpty(this.props.allFunds)) {
      this.props.getAllFunds();
    }

    // Just as the user enters the page , store the selected account details in the redux store
    if (this.props.location.state) {
      this.props.saveSelectedAccount(this.getSelectedAccountDetails());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
      toast(nextProps.error);
      this.props.resetError();
    }
    if (this.props && this.props.customer) {
      this.setState({
        selectedAccount: this.state.selectedAccount || this.getSelectedAccountDetails().partnerAccountMappingId,
      });
    }

    if (
      (this.props.customer !== nextProps.customer && nextProps.customer) ||
      this.props.match.params.portfolioId !== nextProps.match.params.portfolioId
    ) {
      this.props.getFunds({
        skip: 0,
        ...this.getPortfolioPayload(),
        riskProfileType: nextProps.riskProfileType ? nextProps.riskProfileType : nextProps.customer.info.riskAppetite,
        assetFilter: this.props.assetFilter,
        ValueForMoney: this.props.ValueForMoney,
        fundType: this.state.showShariah,
      });
      if (nextProps.customer && nextProps.customer.info && nextProps.customer.info.riskAppetite) {
        const riskLevelFilter = nextProps.customer.info.riskAppetite;
        this.setState({
          riskLevelFilter,
        });
      }
    }
  }

  getSelectedAccountDetails() {
    const accountSelected = this.props.match.params.portfolioId;
    const selectedPortfolioDetails = this.props.clientDetails.portfolio.filter(
      (portfolioItem) => portfolioItem.id === parseInt(accountSelected),
    )[0].accountId;
    const selectedAccountDetails = this.props.clientDetails.info.account.filter(
      (accountItem) => accountItem.partnerAccountMappingId === selectedPortfolioDetails,
    )[0];
    const shariahCondition =
      selectedAccountDetails.UTRACCOUNTTYPE === 'KW' && selectedAccountDetails.islamicORConventionalFlag !== 'C';
    this.setState({
      showShariah: shariahCondition,
      isShariahDisabled: shariahCondition,
    });
    return selectedAccountDetails;
  }

  getProductPortfolio(clientDetails) {
    const productIds = [];
    const clientDetailsData = clientDetails || this.props.clientDetails;
    const currentPortfolio =
      clientDetailsData &&
      clientDetailsData.portfolio &&
      clientDetailsData.portfolio.filter((item) => item.id == this.props.match.params.portfolioId);
    if (clientDetailsData && clientDetailsData.portfolio && !_isEmpty(currentPortfolio)) {
      currentPortfolio[0].productbreakdown.forEach((item) => {
        if (item.status !== 'resubscribe') {
          productIds.push(item.investmentProductId);
        }
      });
    }
    return productIds;
  }

  getPortfolioPayload() {
    const portfolioPayload = {
      portfolio: this.getProductPortfolio(),
    };
    return portfolioPayload;
  }

  cancel() {
    this.props.saveSelectedAccount(null);
    this.props.saveKWSPandCashDetails(null);
    this.props.history.replace(`/clients/${this.props.match.params.id}/funds`);
  }

  select(data) {
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
          !_isEmpty(data) &&
          !_isEmpty(this.props.customer.info) &&
          !_isEmpty(riskAppetite) &&
          riskAppetite.toLowerCase() !== data.riskProfileType.toLowerCase() &&
          _findIndex(this.state.selected, ['id', data.id]) === -1
        ) {
          // make first letter uppercase only
          const riskAppetite1 =
            riskAppetite
              .toLowerCase()
              .charAt(0)
              .toUpperCase() + riskAppetite.toLowerCase().slice(1);
          const an = data.riskProfileType === 'Aggressive' ? 'an' : 'a';
          const riskProfileType = data.riskProfileType
            ? data.riskProfileType.toUpperCase() === 'NA'
              ? 'Money Market'
              : data.riskProfileType
            : '';
          const modalMessage = `Your risk profile is ${riskAppetite1} but you have selected ${an} ${riskProfileType} fund.`;
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

  compareFunds() {
    const { id, portfolioId } = this.props.match.params;
    this.props.history.push('/compare-funds', {
      customerId: id,
      portfolioId,
      riskScore: this.props.riskScore,
      data: this.state.selected,
    });
  }

  handleAccept(data) {
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
    const customerId = this.props.match.params.id;
    const { id: pageId, portfolioId } = this.props.match.params;
    this.props.history.push(`/${customerId}/funds/${portfolioId}/${id}`, {
      customerId,
      portfolioId,
      selectedFund: this.state.selected,
      riskScore: this.props.riskScore,
      data: this.state.selectedData,
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
        ...this.getPortfolioPayload(),
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
          ...this.getPortfolioPayload(),
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
          ...this.getPortfolioPayload(),
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
        ...this.getPortfolioPayload(),
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
        ...this.getPortfolioPayload(),
        searchInput: this.state.searchInput,
      });
      this.setState({
        riskLevelFilter: e.target.value,
      });
    }
  }
  paginate(current, pagesize) {
    this.setState({
      currentPage: current,
    });
    const skip = current !== 1 ? (current - 1) * pagesize : 0;
    this.props.getFunds({
      skip,
      riskProfileType: this.props.riskProfileType ? this.props.riskProfileType : this.state.riskLevelFilter,
      fundType: this.state.showShariah,
      assetFilter: this.state.assetClassFilter,
      ValueForMoney: this.props.ValueForMoney,
      searchInput: this.state.searchInput,
      portfolio: this.getProductPortfolio(),
    });
    window.scrollTo(0, 80);
  }
  next() {
    const { selectedFunds } = this.props;
    const { selected } = this.state;
    const { id, portfolioId } = this.props.match.params;

    const payload = [...selectedFunds];

    for (let i = 0; i < selected.length; i++) {
      const isExist = selectedFunds.some((fund) => fund.id === selected[i].id);

      if (!isExist) {
        payload.push({
          ...selected[i],
          initialInvestment: selected[i].initialInvestment || selected[i].minInitialInvestmentAmt,
          defaultSalesCharge: selected[i].defaultSalesCharge || 0,
          campaignSalesCharge: selected[i].campaignSalesCharge || null,
          campaignCode: selected[i].campaignCode || null,
          campaignMinInitialInvestment: selected[i].campaignMinInitialInvestment || null,
          campaignErrorMessage: null,
        });
      }
    }

    this.props.saveFunds(payload);
    this.props.history.push(`/clients/${id}/allocate-funds/${portfolioId}`);
  }
  handleClose() {
    this.setState({
      open: false,
    });
  }

  replaceUrl(accountSelected) {
    const {
      clientDetails: { portfolio },
    } = this.props;
    const portfolioId = portfolio.find((portfolioItem) => portfolioItem.accountId === accountSelected).id;
    const id = this.props.match.params.id;
    this.props.getCustomer({ id, portfolioId });
    this.props.history.replace(`/clients/${id}/add-funds/${portfolioId}`);
  }

  handleSelectAccountChange({ target: { value } }) {
    this.setState({ currentSelectedAccount: value });
  }

  handleSelectAccountSubmit() {
    const { id } = this.props.match.params;
    const { info, portfolio } = this.props.clientDetails;

    // Updating selected account
    if (this.state.currentSelectedAccount) {
      const accountObjet = info.account.filter(
        (accountItem) => accountItem.partnerAccountMappingId === this.state.currentSelectedAccount,
      )[0];
      this.props.saveSelectedAccount(accountObjet);
    }

    const activeAccount = this.state.currentSelectedAccount ? this.state.currentSelectedAccount : this.state.selectedAccount;

    const selectedAccIndex = _findIndex(portfolio, ['accountId', activeAccount]);
    if (selectedAccIndex !== -1) {
      const mobileFormat = /^[+]?[0-9- ]+$/;
      if (!info.account[selectedAccIndex].AccMobileNo || !info.account[selectedAccIndex].AccMobileNo.match(mobileFormat)) {
        toast.error("Please update the Client's Mobile Number to continue with transactions", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      } else {
        this.setState(
          {
            toggleAccountSelection: !this.state.toggleAccountSelection,
            selectedAccount: this.state.currentSelectedAccount,
            // currentSelectedAccount: null,
          },
          () => {
            this.props.getFunds({
              riskProfileType: this.props.riskProfileType,
              assetFilter: this.props.value,
              fundType: this.state.showShariah,
              ValueForMoney: this.props.ValueForMoney,
              ...this.getPortfolioPayload(),
              searchInput: this.state.searchInput,
            });
            this.replaceUrl(activeAccount);
          },
        );
      }
    } else {
      this.props.history.push(`/clients/${id}/add-funds/create`);
    }
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

  checkEmis(accountItem) {
    return accountItem.UTRACCOUNTTYPE === 'KW' && accountItem.isEmis;
  }

  render() {
    const {
      fundsDrawer = [],
      funds,
      processing,
      riskScore,
      allFunds,
      customer,
      riskProfiles,
      clientDetails,
      lov,
      match,
    } = this.props;

    if (!_isEmpty(funds) && !_isEmpty(customer)) {
      const { portfolio } = clientDetails;
      const selectedAccount = portfolio.find((item) => String(item.id) === match.params.portfolioId);
      const { count, res } = funds.Funds;
      const hasData = res.length > 0;
      // let rpt = this.props.riskProfileType
      //   ? this.props.riskProfileType.toLowerCase().charAt(0).toUpperCase() + this.props.riskProfileType.toLowerCase().slice(1)
      //   : null;
      const rpt = this.state.riskLevelFilter
        ? this.state.riskLevelFilter
            .toLowerCase()
            .charAt(0)
            .toUpperCase() + this.state.riskLevelFilter.toLowerCase().slice(1)
        : null;
      return (
        <React.Fragment>
          <AddNewFundsHeader
            customer={customer}
            riskProfiles={riskProfiles}
            cancel={this.cancel}
            handleToggleAccountSelectionModal={() => this.setState({ toggleAccountSelection: true })}
          />
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
            <PaddedGrid>
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
            <PaddedGrid>
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
                      <Filter
                        label="Value for Money"
                        data={ValueForMoney}
                        name="fundFilter"
                        value={this.props.ValueForMoney ? this.props.ValueForMoney : this.state.valueForMoneyFilter}
                        onChange={this.changeFilter}
                        flexDirection={window.innerWidth <= 768 ? 'column' : null}
                      />
                    </Grid>
                    <Grid item>
                      <Filter
                        label="Asset Classes"
                        data={AssetClass}
                        name="fundAssetFilter"
                        value={this.props.assetFilter ? this.props.assetFilter : this.state.assetClassFilter}
                        onChange={this.changeFilter}
                        flexDirection={window.innerWidth <= 768 ? 'column' : null}
                      />
                    </Grid>
                    <Grid item>
                      <Filter
                        lastItem
                        label="Risk Level"
                        data={RiskLevel}
                        name="modelPortfolioFilter"
                        page="addFunds"
                        value={rpt || this.state.riskLevelFilter.toLowerCase()}
                        onChange={this.changeFilter}
                        flexDirection={window.innerWidth <= 768 ? 'column' : null}
                      />
                    </Grid>
                  </RowGridLeft>
                </FilterGrid>
              </RowGridSpaceBetween>
            </PaddedGrid>
            <FullWidthGrid>
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
                            onSelect={this.checkIfWholeSaleFund}
                            selected={this.state.selected}
                            viewDetails={this.viewDetails}
                            selectedAccount={selectedAccount || {}}
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

          {/* Modal for selecting fund */}
          <Dialog
            open={this.state.toggleAccountSelection}
            noClose
            maxWidth="sm"
            content={
              <Grid container direction="column" justify="center" alignItems="center" style={{ padding: '26px 0px' }}>
                <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
                  <Grid item xs={12}>
                    <Text size="14px" weight="bolder">
                      Choose Your Account
                    </Text>
                  </Grid>
                  <Grid item xs={12}>
                    <Text size="14px">Select the account type to purchase the funds, then click continue to proceed.</Text>
                  </Grid>

                  <div style={{ marginTop: '26px' }}>
                    {this.props.clientDetails.info &&
                      this.props.clientDetails.info.account.length &&
                      this.props.clientDetails.info.account.map((item, index) => {
                        const accountType = item.UTRACCOUNTTYPE === 'CS' ? 'Cash' : 'KWSP';
                        return (
                          <Grid item xs={12} style={{ marginBottom: '-8px' }} key={index}>
                            <StyledRadioButton
                              checked={
                                (this.state.currentSelectedAccount
                                  ? this.state.currentSelectedAccount
                                  : this.state.selectedAccount) === item.partnerAccountMappingId
                              }
                              value={item.partnerAccountMappingId}
                              onChange={this.handleSelectAccountChange}
                              control={<Radio />}
                              label={`${accountType} Account No. ${getAccountHolderType(item) + item.partnerAccountMappingId}`}
                              disabled={item.AccountStatus === 'S' || this.checkEmis(item)}
                            />
                          </Grid>
                        );
                      })}
                  </div>
                  <Grid item xs={12} style={{ marginTop: 5 }}>
                    <Grid container justify="center" align="center" alignItems="center">
                      <Grid item xs={6} align="right" style={{ paddingRight: 5 }}>
                        <StyledBtn
                          onClick={() => this.setState({ toggleAccountSelection: false })}
                          btnBgColor={'white'}
                          btnFontColor={Color.C_LIGHT_BLUE}>
                          Back
                        </StyledBtn>
                      </Grid>
                      <Grid item xs={6} align="left" style={{ paddingLeft: 5 }}>
                        <StyledBtn
                          onClick={this.handleSelectAccountSubmit}
                          btnBgColor={Color.C_LIGHT_BLUE}
                          btnFontColor="#ffffff">
                          Continue
                        </StyledBtn>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            }
          />
        </React.Fragment>
      );
    }
    return <LoadingOverlay show />;
  }
}
AddFunds.propTypes = {
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
  saveSelectedAccount: PropTypes.func,
};

AddFunds.defaultProps = {
  fundsDrawer: [],
};
const mapStateToProps = createStructuredSelector({
  funds: makeSelectFunds(),
  fundsDrawer: makeSelectFundsDrawer(),
  processing: makeSelectProcessing(),
  riskScore: makeSelectRiskScore(),
  allFunds: makeSelectAllFunds(),
  error: makeSelectError(),
  customer: makeSelectCustomer(),
  riskProfiles: makeSelectRiskProfiles(),
  assetFilter: makeSelectFundFilterAsset(),
  riskProfileType: makeSelectFundFilterRiskProfileType(),
  ValueForMoney: makeSelectFundFilterValueForMoney(),
  fundType: makeSelectFundFilterFundType(),
  clientDetails: makeSelectClientDetails(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
  lov: makeSelectLOV(),
  selectedFunds: makeSelectSelectedFunds(),
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
    getRiskProfiles: () => dispatch(getRiskProfiles()),
    getCustomer: (payload) => dispatch(getCustomer(payload)),
    getCustomerDetails: (payload) => dispatch(getCustomerDetails(payload)),
    saveSelectedAccount: (payload) => dispatch(saveSelectedAccount(payload)),
    saveKWSPandCashDetails: (payload) => dispatch(saveKWSPandCashDetails(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AddFunds);
