import React from 'react';
import styled from 'styled-components';
import ReactTable from 'react-table';

export const StyledReactTable = styled(ReactTable)`
  .rt-thead {
    height: 40px;
    object-fit: contain;
    background-color: #f5f5f5;
    .rt-tr {
      text-align: left !important;
    }
    .rt-th {
      border-color: none;
      &:first-of-type {
        display: none;
      }
    }
  }
  .rt-body {
    .rt-td {
      border-color: one;
    }
  }
  .rt-expandable {
    display: none;
  }
`;

function Table(props) {
  const { data, columns, expanded, expandedHandler } = props;
  return <StyledReactTable data={data} showPagination={false} columns={columns} sortable={false} defaultPageSize={data.length} />;
}
