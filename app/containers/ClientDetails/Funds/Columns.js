import moment from 'moment';
import _has from 'lodash/has';
import React from 'react';
import NumberFormat from 'react-number-format';

const Columns = [
  {
    Header: 'TRX DATE',
    id: 'trxDate',
    accessor: (d) => moment(d.transactionDate).format('DD-MM-YYYY'),
  },
  {
    Header: 'CONFIRM DATE',
    id: 'confirmDate',
    accessor: (d) => (d.confirmationDate ? moment(d.confirmationDate).format('DD-MM-YYYY') : '-'),
  },
  {
    Header: 'TRX TYPE',
    accessor: 'trxType',
  },
  {
    Header: 'ACCT TYPE',
    id: 'accType',
    accessor: (d) => (_has(d, 'portfolio') ? (d.portfolio.partnerAccountType ? d.portfolio.partnerAccountType : '-') : '-'),
  },
  {
    Header: 'REF ID',
    accessor: 'refNo',
  },
  {
    Header: 'TRX NO',
    id: 'trxNo',
    accessor: (d) => (d.partnerTransactionNo ? d.partnerTransactionNo : '-'),
  },
  {
    Header: 'STATUS',
    id: 'status',
    accessor: (d) => (d.transactionStatus ? d.transactionStatus : '-'),
  },
  {
    Header: 'GROSS AMOUNT (RM)',
    id: 'TransactionRequestAmount',
    accessor: (d) => (
      <NumberFormat
        value={d.grossAmount || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'CHARGES(%)',
    id: 'chargePercent',
    accessor: (d) => (
      <NumberFormat
        value={d.chargeSRT || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={4}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'CHARGES(RM)',
    id: 'chargeAmount',
    accessor: (d) => (
      <NumberFormat
        value={d.charges || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'NET AMOUNT(RM)',
    id: 'transactionAmount',
    accessor: (d) => (
      <NumberFormat
        value={d.netAmount || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'UNIT PRICE(RM)',
    id: 'unitPrice',
    accessor: (d) => (
      <NumberFormat
        value={d.unitPrice || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={4}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'UNITS CREDITED/(DEBITED)',
    id: 'transactionUnits',
    accessor: (d) => (
      <NumberFormat
        value={d.transactionUnits || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'BALANCE OF UNITS',
    id: 'balanceUnits',
    accessor: (d) => (
      <NumberFormat
        value={d.balanceUnitHolding || '-'}
        displayType={'text'}
        thousandSeparator
        prefix={''}
        decimalScale={2}
        fixedDecimalScale
      />
    ),
  },
  {
    Header: 'REJECTION REASON',
    id: 'purposeOfRejection',
    accessor: (data) => {
      if (data.purposeOfRejection) {
        return data.purposeOfRejection;
      }
    },
  },
  {
    Header: 'REDEMPTION BANK',
    id: 'redBankName',
    accessor: (d) => (d.bankName && d.transactionType === 'RD' ? d.bankName : '-'),
  },
  {
    Header: 'REDEMPTION BANK ACCOUNT NO.',
    id: 'redBankAccNo',
    accessor: (d) => (d.bankAcctNumber && d.transactionType === 'RD' ? d.bankAcctNumber : '-'),
  },
  // {
  //   Header: 'AGENT CODE',
  //   id: 'agentId',
  //   accessor: (d) => d.agentCode?d.agentCode : '-',
  // },
  {
    Header: 'FUND NAME',
    id: 'fundName',
    accessor: (d) => {
      const fundDetails = d.transactionType === 'SW' || d.transactionType === 'RD' ? d.switchfund : d.fund;
      return (fundDetails && fundDetails.name) || '-';
    },
  },
  {
    Header: 'FUND CODE',
    id: 'fundCode',
    accessor: (d) => {
      const fundDetails = d.transactionType === 'SW' || d.transactionType === 'RD' ? d.switchfund : d.fund;
      return (fundDetails && fundDetails.fundcode) || '-';
    },
  },
];

export default Columns;
