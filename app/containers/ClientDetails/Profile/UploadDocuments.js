import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import ReactTable from 'react-table';
import Text from 'components/Text';
import 'react-table/react-table.css';
import Color from 'utils/StylesHelper/color';
import DocStatus from './Utility/DocStatus';

import { makeSelectClientDetails } from 'containers/ClientDetails/selectors';

const BankTableContainer = styled(Grid)`
  .ReactTable {
    width: 100% !important;
  }
`;
const columns = [
  {
    Header: 'DOCUMENT ID',
    accessor: 'id',
    Cell: (cellInfo) => (
      <Text color="#000" decoration="underline" size="14px" align="left">
        {cellInfo.row.id}
      </Text>
    ),
  },
  {
    Header: 'DOCUMENT TYPE',
    id: 'docType',
    accessor: (d) => {
      if (d.DocType.includes('IC')) {
        return 'NRIC';
      }
      if (d.DocType.includes('Visa')) {
        return 'Visa';
      }      
      return 'Passport';
    },
  },
  {
    Header: 'FILENAME',
    accessor: 'Filename',
  },
  {
    Header: 'STATUS',
    accessor: 'isVerified',
    Cell: (cellInfo) => <DocStatus data={true} />,
    //Cell: (cellInfo) => <DocStatus data={cellInfo.row.isVerified} />,
  },
];

class UploadDocuments extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <BankTableContainer container>
        <ReactTable
          data={data}
          showPagination={false}
          columns={columns}
          expanded={false}
          sortable={false}
          defaultPageSize={data.length}
          className="-striped -highlight table"
        />
      </BankTableContainer>
    );
  }
}

UploadDocuments.propTypes = {
  data: PropTypes.array,
};
const mapStateToProps = createStructuredSelector({
  clientDetails: makeSelectClientDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    addBank: (payload) => dispatch(addBank(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(UploadDocuments);
