import React from 'react';
import Text from 'components/Text';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import Color from 'utils/StylesHelper/color';
import { ArrowImage } from './styles';
import UpArrow from './images/up-arrow.svg';
import DownArrow from './images/down-arrow.svg';
const Columns = [
  {
    Header: 'REF ID.',
    accessor: 'id',
    width: 150,
    Cell: (cellInfo) => {
      const Icon = cellInfo.isExpanded ? UpArrow : DownArrow;
      return (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '68%' }}>
            <Text color={Color.C_LIGHT_BLUE} decoration="underline" cursor="pointer" align="left" size="12px">
              {cellInfo.row._original.refNo}
            </Text>
          </div>
          <div style={{ flex: '32%', textAlign: 'left' }}>
            <Text cursor="pointer" align="left" size="12px">
              <ArrowImage src={Icon} alt="Up" />
            </Text>
          </div>
        </div>
      );
    },
  },
  {
    Header: 'TRX DATE',
    id: 'trxDate',
    accessor: (d) => moment(d.transactionDate).format('DD-MM-YYYY'),
    width: 120,
  },
  {
    Header: 'TRX TYPE',
    accessor: 'transactionType',
    width: 65,
  },
  {
    Header: 'CLIENT NAME',
    accessor: 'fullName',
  },
  {
    Header: 'FUND MODE',
    accessor: 'fundMode',
  },
  {
    Header: 'TOTAL AMOUNT(RM)',
    accessor: 'transactionRequestAmount',
    Cell: (cellInfo) => (
      <NumberFormat
        value={cellInfo.row.transactionRequestAmount || 0}
        displayType={'text'}
        decimalScale={2}
        fixedDecimalScale
        thousandSeparator
      />
    ),
  },
  {
    Header: 'STATUS',
    accessor: 'RequestStatus',
  },
  {
    Header: 'REJECTION REASON',
    id: 'purposeOfRejection',
    accessor: (data) => {
      const reason = [];
      if (data && data.transactions) {
        data.transactions.map((item) => reason.push(item.purposeOfRejection));
      }
      return reason;
    },
  },
  {
    Header: 'REDEMPTION BANK',
    accessor: 'bankName',
  },
  {
    Header: 'REDEMPTION BANK ACCOUNT NO.',
    accessor: 'bankAcctNumber',
  },
];

export default Columns;
