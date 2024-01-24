/**
 *
 * Logs
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Text from 'components/Text';
import Filter from 'components/Filter';
import ReactTable from 'react-table';
import _isEmpty from 'lodash/isEmpty';
import 'react-table/react-table.css';
import Pagination from 'components/Pagination';
import moment from 'moment';
import LoadingOverlay from 'components/LoadingOverlay';

import { RowGridSpaceBetween, RowGridLeft, ColumnGridCenter } from 'components/GridContainer';
import { getAllTransactions, getAllTransactionsForDownload, removeAllTransactionsForDownload } from './actions';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { makeSelectAllTransactions, makeSelectProcessing, makeSelectAllTransactionsForDownload } from './selectors';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { Container, StyledDatePicker } from './styles';
import TransactionDetails from './TransactionDetails';
import Columns from './Columns';
import { SortBy, TrxDate } from './FilterData';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import Icon from 'components/SearchAutoComplete/search-small.svg';
import { getLOV } from 'containers/HomePage/actions';
import Button from 'components/Button';
import { CSVLink } from 'react-csv/lib';
import { isIOS } from 'react-device-detect';
import ReactTooltip from 'react-tooltip';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000 !important;
  padding: 10px !important;
  opacity: 1 !important;
`;

const Input = styled(TextField)`
  height: 40px !important;
  border-radius: 5px !important;
  border: solid 1px #cacaca !important;
  width: 100% !important;
  padding: 0px !important;
  padding-left: 30px !important;
  font-size: 14px;
  > div {
    &::before,
    &::after {
      display: none;
    }
    input {
      height: 25px;
      &::before,
      &::after {
        display: none;
      }
      &::placeholder {
        line-height: 1.8;
      }
    }
  }

  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #f5f5f5;
    border: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  padding: 0;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: ${(props) => (props.width ? 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.4)' : '')};
  margin-bottom: 20px;
  width: 100%;
  @media (max-width: 1024px) {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  height: 40px !important;
  input {
    font-size: 16px;
    vertical-align: middle;
    line-height: 40px !important;
  }
  img {
    width: 15.7px;
    height: 16px;
    position: absolute;
    top: 10px;
    cursor: pointer;
    opacity: 0.8;
    left: 10px;
    &.small {
      width: 11.8px;
      height: 12px;
      top: 14px;
    }
  }
`;

const BtnDownload = styled(Button)`
  width: 150px;
  font-size: 16px;
  border-color: #979797;
  opacity: 0.9;
  color: #000;
  margin-bottom: 10px;
  margin-top: -10px;
`;

const CSVHeaders = [
  { label: 'REF ID', key: 'refNo' },
  { label: 'TRX DATE', key: 'transactionDate' },
  { label: 'TRX TYPE', key: 'transactionType' },
  { label: 'CLIENT NAME', key: 'fullName' },
  { label: 'FUND MODE', key: 'fundMode' },
  { label: 'TOTAL AMOUNT (RM)', key: 'transactionRequestAmount' },
  { label: 'STATUS', key: 'RequestStatus' },
  { label: 'REJECTION REASON', key: 'RejectionReason' },
  { label: 'ID NO.', key: 'mainHolderlDNo' },
  { label: 'Fund', key: 'fund' },
  { label: 'Status', key: 'status' },
  { label: 'ACCT NO.', key: 'accountNO' },
  { label: 'Units Credited', key: 'unitCredited' },
  { label: 'Units Debited', key: 'unitDebited' },
  { label: 'Units Maintained', key: 'unitMaintain' },
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
  float: right;
`;

class Logs extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      sortBy: 'All',
      expanded: {},
      trxDate: 'All',
      status: 'All',
      currentPage: 1,
      trxStatusFilter: 'All',
      showDatePicker: false,
      selectedDate: '',
      keyword: '',
      skip: 0,
    };

    this.changeFilter = this.changeFilter.bind(this);
    this.paginate = this.paginate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onTrxDateFilterClick = this.onTrxDateFilterClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.download = this.download.bind(this);
  }

  downloaded = false;

  componentWillMount() {
    if (_isEmpty(this.props.lov)) {
      this.props.getLOV();
    }
    this.props.getAllTransactions({ skip: 0 });
  }

  componentDidUpdate() {
    // a hack to auto download as CSVDownload doesn't support custom filename
    const downloadCsvElement = document.getElementById('downloadTxnLogCsv');
    if (!this.downloaded && downloadCsvElement && downloadCsvElement.getAttribute('downloaded') === null) {
      this.downloaded = true;
      downloadCsvElement.setAttribute('downloaded', 'true');
      setTimeout(() => {
        downloadCsvElement.click();
      }, 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: false,
    });
  }

  changeFilter(e, type) {
    this.setState({
      currentPage: 1,
    });
    if (type === 'trxStatusFilter') {
      this.props.getAllTransactions({
        searchInput: this.state.keyword,
        trxStatus: e.target.value,
        sortBy: this.state.sortBy,
        transactionDate: this.state.selectedDate && moment(this.state.selectedDate).toDate(),
      });
      this.setState({
        trxStatusFilter: e.target.value,
      });
    }
    if (type === 'sortBy') {
      this.props.getAllTransactions({
        searchInput: this.state.keyword,
        sortBy: e.target.value,
        trxStatus: this.state.trxStatusFilter,
        transactionDate: this.state.selectedDate && moment(this.state.selectedDate).toDate(),
      });
      this.setState({
        sortBy: e.target.value,
      });
    }

    if (type === 'trxDate') {
      if (e.target.value === 'All') {
        this.setState(
          {
            trxDate: 'All',
            selectedDate: '',
          },
          () => {
            this.props.getAllTransactions({
              searchInput: this.state.keyword,
              sortBy: this.state.sortBy,
              trxStatus: this.state.trxStatusFilter,
              transactionDate: this.state.selectedDate && moment(this.state.selectedDate).toDate(),
            });
          },
        );
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
        TrxDate[1].name = moment(e).format('DD-MM-YYYY');
        this.setState({
          trxDate: 'custom',
          selectedDate: e,
        });

        this.props.getAllTransactions({
          searchInput: this.state.keyword,
          sortBy: this.state.sortBy,
          trxStatus: this.state.trxStatusFilter,
          transactionDate: moment(e).toDate(),
        });
      } else {
        this.setState({
          trxDate: 'All',
          selectedDate: '',
        });
        this.props.getAllTransactions({
          searchInput: this.state.keyword,
          sortBy: this.state.sortBy,
          trxStatus: this.state.trxStatusFilter,
        });
      }
    }
  }

  handleChange(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  handleSearch(data) {
    this.setState(
      {
        keyword: data,
        currentPage: 1, // reset currentPage to 1 on new search
        skip: 0, // reset skip to 0 on new search
      },
      () => {
        this.props.getAllTransactions({
          skip: this.state.skip,
          searchInput: data,
          sortBy: this.state.sortBy,
          trxStatus: this.state.trxStatusFilter,
          transactionDate: this.state.selectedDate ? moment(this.state.selectedDate).toDate() : '',
        });
      },
    );
  }

  onTrxDateFilterClick() {
    TrxDate[1].name = 'Custom Date';
    this.setState({
      trxDate: 'All',
      selectedDate: '',
    });
  }
  paginate(current, pagesize) {
    // current
    const skip = current !== 1 ? (current - 1) * pagesize : 0;
    this.setState({
      currentPage: current,
      skip,
    });
    this.props.getAllTransactions({
      skip,
      trxStatus: this.state.trxStatusFilter,
      sortBy: this.state.sortBy,
      searchInput: this.state.keyword,
      transactionDate: this.state.selectedDate ? moment(this.state.selectedDate).toDate() : '',
    });
  }

  renderTransactionSubComponent(data) {
    /*
    if (data.row.transactionType === 'SW') {
      return (
        <div>
          <div style={{ padding: '20px' }}>
            <TransactionDetails row={data} isSwitchOut={true}/>
          </div>
          <div style={{ padding: '20px' }}>
            <TransactionDetails row={data} isSwitchOut={false}/>
          </div>
        </div>
      )
    } else {
      return (
        <div style={{ padding: '20px' }}>
          <TransactionDetails row={data} />
        </div>
      )
    }
    */
    return (
      <div style={{ padding: '20px' }}>
        <TransactionDetails row={data} />
      </div>
    );
  }

  download() {
    if (this.props.processing) {
      return;
    }
    const filter = {
      sortBy: this.state.sortBy,
      trxStatus: this.state.trxStatusFilter,
    };
    const keyword = this.state.keyword ? this.state.keyword.trim() : null;
    if (keyword) {
      filter.searchInput = keyword;
    }
    if (this.state.selectedDate) {
      filter.transactionDate = moment(this.state.selectedDate).toDate();
    }
    this.props.getAllTransactionsForDownload(filter);
    this.downloaded = false;
  }

  render() {
    const time = moment().format('D MMMM YYYY, h:mm A');
    const { transactions, processing, lov, fundTransactionsForDownload } = this.props;
    if (_isEmpty(transactions)) return <LoadingOverlay show />;
    const {
      Funds: { count, res },
    } = transactions;
    // console.log('Trans', transactions);
    let TrxStatus = [];
    if (!_isEmpty(lov) && !_isEmpty(lov.Dictionary[23])) {
      TrxStatus = lov.Dictionary[23].datadictionary;
      if (TrxStatus[0].codevalue !== 'All') {
        TrxStatus.unshift({
          codevalue: 'All',
          description: 'All',
        });
      }
    }

    let updatedTransLogsData = [];
    if (res.length) {
      updatedTransLogsData = res.map((item) => ({
        ...item,
        bankAcctNumber: item.bankAcctNumber ? `${item.bankAcctNumber}` : '-',
      }));
    }

    return (
      <Container>
        <LoadingOverlay show={processing} />
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
        <RowGridLeft style={{ marginBottom: 10 }}>
          <Grid item>
            <Text color="#000" weight="600" size="18px">
              Transaction Summary
            </Text>
            <Text color="#000" weight="600" size="10px">
              Last Updated {time}
            </Text>
          </Grid>
        </RowGridLeft>
        <RowGridSpaceBetween className="filter">
          <Grid item style={{ marginBottom: '16px' }} lg={9}>
            <RowGridLeft>
              <Grid item>
                <Filter
                  label="Sort By"
                  data={SortBy}
                  name="sortBy"
                  value={this.props.sortBy ? this.props.sortBy : this.state.sortBy}
                  onChange={this.changeFilter}
                />
              </Grid>
              <Grid item>
                <Filter
                  label="Trx Date"
                  data={TrxDate}
                  name="trxDate"
                  value={this.state.trxDate}
                  onChange={this.changeFilter}
                  onClick={this.onTrxDateFilterClick}
                />
              </Grid>
              <Grid item>
                <Filter
                  label="Status"
                  data={TrxStatus}
                  name="trxStatusFilter"
                  value={this.props.trxStatusFilter ? this.props.trxStatusFilter : this.state.trxStatusFilter}
                  onChange={this.changeFilter}
                />
              </Grid>
            </RowGridLeft>
          </Grid>
          <Grid item lg={3} xs={12}>
            <InputWrapper>
              <Input
                placeholder="Search Client Name or Account No"
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    // Do code here
                    ev.preventDefault();
                    this.handleSearch(this.state.keyword);
                  }
                }}
                value={this.state.keyword}
                onChange={this.handleChange}
                width="100%"
              />
              <img
                role="button"
                className={'small'}
                src={Icon}
                alt="Search"
                onClick={() => this.handleSearch(this.state.keyword)}
              />
            </InputWrapper>
          </Grid>
          <Grid item xs={12} direction="row" justify="flex-end" alignItems="flex-end">
            <Grid alignItems="flex-end">
              {isIOS ? (
                <ReactTooltip1
                  id="downloadTxnButton"
                  effect="float"
                  place="left"
                  style={{ cursor: 'pointer' }}
                  globalEventOff={'click'}>
                  <Text size="12px" color="#fff" align="left">
                    Not Available on iOS device
                  </Text>
                </ReactTooltip1>
              ) : null}
              {_isEmpty(fundTransactionsForDownload) ? (
                isIOS ? (
                  <a data-tip data-for="downloadTxnButton">
                    <BtnDownload style={{ float: 'right' }}>Download</BtnDownload>
                  </a>
                ) : (
                  <BtnDownload onClick={this.download} style={{ float: 'right' }} disabled={res.length < 1}>
                    Download
                  </BtnDownload>
                )
              ) : null}
              {!_isEmpty(fundTransactionsForDownload) ? (
                <CSVLinkDownload
                  data={fundTransactionsForDownload}
                  headers={CSVHeaders}
                  filename={`transaction-log-${moment().format('YYYYMMDD')}.csv`}
                  onClick={(event, done) => {
                    setTimeout(() => {
                      this.props.removeAllTransactionsForDownload();
                    }, 1000);
                  }}
                  id="downloadTxnLogCsv">
                  Download
                </CSVLinkDownload>
              ) : null}
            </Grid>
          </Grid>
        </RowGridSpaceBetween>
        <ReactTable
          data={updatedTransLogsData}
          showPagination={false}
          columns={Columns}
          sortable={false}
          defaultPageSize={res.length}
          expanded={this.state.expanded}
          className="-striped -highlight table expanded"
          getTrProps={(state, rowInfo, column, instance, expanded) => ({
            onClick: () => {
              expanded = { ...this.state.expanded };
              expanded[rowInfo.viewIndex] = !this.state.expanded[rowInfo.viewIndex];
              this.setState({ expanded });
            },
          })}
          SubComponent={(row) => this.renderTransactionSubComponent(row)}
        />

        <ColumnGridCenter className="pagination">
          <Pagination current={this.state.currentPage} count={count} onChange={this.paginate} />
        </ColumnGridCenter>
      </Container>
    );
  }
}

Logs.propTypes = {
  transactions: PropTypes.object,
  lov: PropTypes.any,
  processing: PropTypes.bool,
  getAllTransactions: PropTypes.func,
  getAllTransactionsForDownload: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  transactions: makeSelectAllTransactions(),
  processing: makeSelectProcessing(),
  lov: makeSelectLOV(),
  fundTransactionsForDownload: makeSelectAllTransactionsForDownload(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAllTransactions: (payload) => dispatch(getAllTransactions(payload)),
    getAllTransactionsForDownload: (payload) => dispatch(getAllTransactionsForDownload(payload)),
    getLOV: () => dispatch(getLOV()),
    removeAllTransactionsForDownload: () => dispatch(removeAllTransactionsForDownload()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'logs', saga });

export default compose(
  withSaga,
  withConnect,
)(Logs);
