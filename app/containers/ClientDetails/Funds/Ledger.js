/* eslint-disable react/sort-comp */
/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Filter from 'components/Filter';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Pagination from 'components/Pagination';
import moment from 'moment';
import { RowGridSpaceBetween, ColumnGridCenter } from 'components/GridContainer';
import { getTransaction, getTransactionForDownload, removeFundTransactionForDownload } from 'containers/ClientDetails/actions';
import SearchAutoComplete from 'components/SearchAutoComplete';
import {
  makeSelectClientDetails,
  makeSelectFundTransactions,
  makeSelectFundTransactionsForDownload,
} from 'containers/ClientDetails/selectors';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import ReactTooltip from 'react-tooltip';
import Button from 'components/Button';
import { CSVLink } from 'react-csv/lib';
import { isMobile } from 'react-device-detect';
import InfoFillIcon from '../images/info-fill.svg';
import TransactionTypesTooltip from './TransactionTypesTooltip';
import Columns from './Columns';
import FundHoldingDetails from './FundHoldingDetails';
import { StyledDatePicker, FilterContainerSmall } from './styles';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000000 !important;
  opacity: 0.8 !important;
`;

const InfoImage = styled.img`
  width: 16px;
  height: 16px;
  opacity: 0.6;
`;
const Container = styled.div`
  padding: 24px;
  .filter {
    margin: 32px 0 10px !important;
  }
  .pagination {
    justify-content: center;
  }
`;

const SearchAutoCompleteWrapper = styled.div`
  margin-top: 0;
  display: block;
  @media screen and (max-width: 768px) {
    margin-top: 15px;
  }
`;

const BtnDownload = styled(Button)`
  width: 150px;
  font-size: 16px;
  border-color: #979797;
  opacity: 0.9;
  color: #000;
`;

const CSVHeaders = [
  { label: 'TRX DATE', key: 'transactionDate' },
  { label: 'CONFIRMATION DATE', key: 'confirmationDate' },
  { label: 'TRX TYPE', key: 'transactionType' },
  { label: 'ACCT TYPE', key: 'partnerAccountType' },
  { label: 'REF ID', key: 'refNo' },
  { label: 'TRX NO', key: 'partnerTransactionNo' },
  { label: 'STATUS', key: 'transactionStatus' },
  { label: 'GROSS AMOUNT', key: 'grossAmount' },
  { label: 'CHARGES(%)', key: 'chargeSRT' },
  { label: 'CHARGES(RM)', key: 'charges' },
  { label: 'NET AMOUNT(RM)', key: 'netAmount' },
  { label: 'UNIT PRICE(RM)', key: 'unitPrice' },
  { label: 'UNITS CREDITED/(DEBITED)', key: 'transactionUnits' },
  { label: 'BALANCE OF UNITS', key: 'balanceUnitHolding' },
  { label: 'FUND NAME', key: 'fundName' },
  { label: 'FUND CODE', key: 'fundCode' },
  { label: 'REDEMPTION BANK', key: 'bankName' },
  { label: 'REDEMPTION BANK ACCOUNT NO.', key: 'bankAcctNumber' },
];

const CSVLinkDownload = styled(CSVLink)`
  width: 150px;
  height: 40px;
  border-radius: 5px;
  font-family: FSElliot-Pro;
  display: flex;
  -webkit-box-pack: center;
  font-size: 16px;
  border: 1px solid #979797;
  opacity: 0.9;
  color: #000;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
  float: right;
`;

class Ledger extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      currentPage: 1,
      trxTypeFilter: 'All',
      trxDate: 'All',
      selectedDate: '',
      searchInput: '',

      TrxDate: [{ name: 'All', value: 'All' }, { name: 'Custom Date', value: 'custom' }],
    };

    this.paginate = this.paginate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.onTrxDateFilterClick = this.onTrxDateFilterClick.bind(this);
    this.download = this.download.bind(this);
  }

  downloaded = false;

  componentWillMount() {
    const { data } = this.props;
    const partnerAccountNO = data.partnerAccountNo;
    const payload = {
      CustomerId: data.customerId,
      isin: data.fund.fundcode,
      partnerAccountNO,
      pid: data.pid,
    };
    this.props.getTransaction(payload);
    this.props.removeFundTransactionForDownload();
  }

  componentDidUpdate(prevProps) {
    if (this.props.fundTransactions !== prevProps.fundTransactions) {
      this.setState({ fundTransactions: this.props.fundTransactions });
    }

    // a hack to auto download as CSVDownload doesn't support custom filename
    const downloadCsvElement = document.getElementById('downloadLedgerCsv');
    if (!this.downloaded && downloadCsvElement && downloadCsvElement.getAttribute('downloaded') === null) {
      this.downloaded = true;
      downloadCsvElement.setAttribute('downloaded', 'true');
      setTimeout(() => {
        downloadCsvElement.click();
      }, 1000);
    }
  }

  onTrxDateFilterClick() {
    const TrxDateClone = [...this.state.TrxDate];
    TrxDateClone[1].name = 'Custom Date';
    this.setState({
      trxDate: 'All',
      selectedDate: '',
      TrxDate: TrxDateClone,
    });
  }
  handleSearch(searchInput) {
    const { data } = this.props;
    const partnerAccountNO = data.partnerAccountNo;
    this.setState({
      searchInput,
    });
    const payload = {
      CustomerId: data.customerId,
      partnerAccountNO,
      isin: data.fund.fundcode,
      searchInput,
      transactionType: this.state.trxTypeFilter,
      pid: data.pid,
    };
    this.props.getTransaction({
      ...payload,
    });
  }

  changeFilter(e, type) {
    this.setState({
      currentPage: 1,
    });
    const { data } = this.props;
    const partnerAccountNO = data.partnerAccountNo;
    const payload = {
      CustomerId: data.customerId,
      isin: data.fund.fundcode,
      partnerAccountNO,
      pid: data.pid,
    };
    if (type === 'trxTypeFilter') {
      this.props.getTransaction({
        ...payload,
        transactionType: e.target.value,
        transactionDate: this.state.selectedDate && moment(this.state.selectedDate).toDate(),
      });
      this.setState({
        trxTypeFilter: e.target.value,
        transactionType: this.state.trxTypeFilter,
      });
    }

    if (type === 'trxDate') {
      if (e.target.value === 'All') {
        this.setState({
          trxDate: 'All',
          selectedDate: '',
        });
        this.props.getTransaction({
          ...payload,
        });
      } else {
        this.setState(
          {
            showDatePicker: true,
          },
          () => {
            this.picker.wrapper.open();
          },
        );
      }
    }

    if (type === 'transactionDate') {
      const date = moment(e);
      if (date.isValid()) {
        const TrxDateClone = [...this.state.TrxDate];
        TrxDateClone[1].name = moment(e).format('DD-MM-YYYY');
        this.setState({
          trxDate: 'custom',
          selectedDate: e,
          TrxDate: TrxDateClone,
        });
        this.props.getTransaction({
          ...payload,
          transactionType: this.state.trxTypeFilter,
          transactionDate: moment(e).toDate(),
        });
      } else {
        this.setState({
          trxDate: 'All',
          selectedDate: '',
        });
        this.props.getTransaction({
          ...payload,
          transactionType: this.state.trxTypeFilter,
        });
      }
    }
  }

  paginate(current, pagesize) {
    // current
    this.setState({
      currentPage: current,
    });
    const skip = current !== 1 ? (current - 1) * pagesize : 0;
    const { data } = this.props;
    const partnerAccountNO = data.partnerAccountNo;
    const payload = {
      CustomerId: data.customerId,
      isin: data.fund.fundcode,
      skip,
      partnerAccountNO,
      pid: data.pid,
    };
    this.props.getTransaction({
      ...payload,
    });
  }

  download() {
    if (this.props.processing) {
      return;
    }
    const { data } = this.props;
    const partnerAccountNO = data.partnerAccountNo;
    const payload = {
      CustomerId: data.customerId,
      isin: data.fund.fundcode,
      searchInput: this.state.searchInput,
      transactionType: this.state.trxTypeFilter,
      partnerAccountNO,
      accountType: data.accountType,
    };
    this.props.getTransactionForDownload({
      ...payload,
    });
    this.downloaded = false;
  }

  render() {
    if (!_isEmpty(this.state.fundTransactions) && !_isEmpty(this.state.fundTransactions[this.props.data.pid])) {
      const { clientDetails, data, lov, fundTransactionsForDownload } = this.props;
      const { fundTransactions } = this.state;

      const fundTransaction = fundTransactions[data.pid].Funds.res;
      const fundtxn = [];
      for (const txn1 of fundTransaction) {
        for (const txn2 of txn1.transactions) {
          let trxType;
          if (txn2.transactionType === 'SW' && txn2.partnerProductType === 'SW') {
            trxType = 'SWO';
          } else if (txn2.transactionType === 'SA' && txn2.partnerProductType === 'SW') {
            trxType = 'SWI';
          } else {
            trxType = txn2.transactionType;
          }

          txn2.trxType = trxType;
          txn2.transactionType = txn2.transactionType;
          txn2.bankAcctNumber = txn1.bankAcctNumber;
          txn2.bankName = txn1.bankName;
          txn2.refNo = txn1.refNo;
          fundtxn.push(txn2);
        }
      }
      const count = fundTransactions[data.pid].Funds.count;
      const TrxType = lov.Dictionary[21].datadictionary;
      if (TrxType[0].codevalue !== 'All') {
        TrxType.unshift({
          codevalue: 'All',
          description: 'All',
        });
      }
      return (
        <Container>
          <FundHoldingDetails data={data} clientDetails={clientDetails} />
          {this.state.showDatePicker && (
            <StyledDatePicker
              clearable
              pickerRef={(node) => {
                this.picker = node;
              }}
              format="MM-DD-YYYY"
              value={this.state.selectedDate}
              onChange={(date) => this.changeFilter(date, 'transactionDate')}
            />
          )}
          <RowGridSpaceBetween className="filter">
            <Grid item xs={8}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Grid item>
                  <FilterContainerSmall>
                    <Filter
                      label="Trx Date"
                      data={this.state.TrxDate}
                      value={this.state.trxDate}
                      name="trxDate"
                      onChange={this.changeFilter}
                      onClick={this.onTrxDateFilterClick}
                    />
                  </FilterContainerSmall>
                </Grid>
                <Grid item>
                  <FilterContainerSmall>
                    <Filter
                      label="Trx Type"
                      data={TrxType}
                      name="trxTypeFilter"
                      value={this.props.trxTypeFilter ? this.props.trxTypeFilter : this.state.trxTypeFilter}
                      onChange={this.changeFilter}
                    />
                  </FilterContainerSmall>
                </Grid>
                <Grid item>
                  <a data-tip data-for="tooltipTxnType" style={{ marginLeft: -15 }}>
                    <InfoImage src={InfoFillIcon} className="info" alt="Info" />
                  </a>
                  <ReactTooltip1 id="tooltipTxnType" effect="solid" place="bottom">
                    <TransactionTypesTooltip data={TrxType} />
                  </ReactTooltip1>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4} direction="row" justify="flex-end" alignItems="flex-start">
              <SearchAutoCompleteWrapper>
                <SearchAutoComplete
                  placeholder="Search Transaction No."
                  data={[]}
                  handleSearch={(data) => {
                    this.handleSearch(data);
                  }}
                  width="100%"
                />
              </SearchAutoCompleteWrapper>
            </Grid>
          </RowGridSpaceBetween>
          <Grid container justify="flex-end">
            <Grid item>
              {_isEmpty(fundTransactionsForDownload) ? (
                <BtnDownload onClick={this.download} style={{ float: 'right', marginBottom: 15 }} disabled={fundtxn.length < 1}>
                  Download
                </BtnDownload>
              ) : null}
              {!_isEmpty(fundTransactionsForDownload) ? (
                <CSVLinkDownload
                  data={fundTransactionsForDownload}
                  headers={CSVHeaders}
                  filename={`my-ledger-${moment().format('YYYYMMDD')}.csv`}
                  onClick={() => {
                    setTimeout(() => {
                      this.props.removeFundTransactionForDownload();
                    }, 1000);
                  }}
                  id="downloadLedgerCsv">
                  Download
                </CSVLinkDownload>
              ) : null}
            </Grid>
          </Grid>
          {!isMobile ? (
            <ReactTable
              data={fundtxn}
              showPagination={false}
              columns={Columns}
              expanded={false}
              sortable={false}
              defaultPageSize={fundtxn.length}
              className="-striped -highlight table"
            />
          ) : (
            <ReactTable
              data={fundtxn}
              showPagination={false}
              columns={Columns}
              expanded={false}
              sortable={false}
              defaultPageSize={fundtxn.length}
              className="-striped -highlight table"
            />
          )}

          <ColumnGridCenter>
            <Pagination current={this.state.currentPage} count={count} onChange={this.paginate} />
          </ColumnGridCenter>
        </Container>
      );
    }
    return null;
  }
}

Ledger.propTypes = {
  getTransaction: PropTypes.func,
  clientDetails: PropTypes.object,
  fundTransactions: PropTypes.array,
  lov: PropTypes.object,
  data: PropTypes.object,
  removeFundTransactionForDownload: PropTypes.func,
  processing: PropTypes.bool,
  getTransactionForDownload: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  clientDetails: makeSelectClientDetails(),
  fundTransactions: makeSelectFundTransactions(),
  lov: makeSelectLOV(),
  fundTransactionsForDownload: makeSelectFundTransactionsForDownload(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransaction: (payload) => dispatch(getTransaction(payload)),
    getTransactionForDownload: (payload) => dispatch(getTransactionForDownload(payload)),
    removeFundTransactionForDownload: () => dispatch(removeFundTransactionForDownload()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Ledger);
