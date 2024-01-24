import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Color from 'utils/StylesHelper/color';
import Radio from 'material-ui/Radio';

import { makeSelectClientDetails } from 'containers/ClientDetails/selectors';
import { addBank } from 'containers/ClientDetails/actions';
import Button from 'components/Button';
import AddBank from './Utility/AddBank';
import AddBtnIcon from '../images/addBtn.svg';

const AddImage = styled.img`
  margin: 0 8px;
`;
const ButtonContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    margin: 24px 0 32px;
  }
`;

const StyledRadioButton = styled(Radio)`
  height: 0 !important;
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;
const BankTableContainer = styled(Grid)`
  .ReactTable {
    width: 100% !important;
  }
`;
const columns = [
  {
    Header: 'ACCOUNT NAME',
    accessor: 'bankAcctName',
  },
  {
    Header: 'BANK NAME',
    accessor: 'bankName',
  },
  {
    Header: 'ACCOUNT NUMBER',
    accessor: 'bankAcctNumber',
  },
  {
    Header: 'BANK CODE',
    accessor: 'bankCode',
  },
  /*{
    Header: 'BRANCH CODE',
    accessor: 'branchCode',
  },
  {
    Header: 'IBAN',
    accessor: 'iban',
  },
  {
    Header: 'SWIFT CODE',
    accessor: 'swift_bic_code',
  },
  {
    Header: 'SOURCE',
    accessor: 'source',
  },*/
  {
    Header: 'DEFAULT',
    accessor: 'default',
    Cell: (row) => <StyledRadioButton checked={row.original.default} />,
  },
];

class BankAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  handleSubmit(data) {
    const {
      clientDetails: { account },
    } = this.props;
    const { bankAcctNumber, bankCode, branchCode, bankName, source, bankAcctName, iban, swift_bic_code } = data;
    const payload = {
      bank: {
        bankAcctNumber,
        bankCode,
        branchCode,
        bankName,
        source,
        bankAcctName,
        iban,
        swift_bic_code,
      },
      customerId: account.customerId,
    };
    this.props.addBank(payload);
  }
  render() {
    const { data, edit } = this.props;
    return (
      <BankTableContainer container>
        <AddBank open={this.state.open} handleClose={this.toggleModal} submit={this.handleSubmit} />
        <ReactTable
          data={data}
          showPagination={false}
          columns={columns}
          expanded={false}
          sortable={false}
          defaultPageSize={data.length}
          className="-striped -highlight table"
        />
        <ButtonContainer item xs={12}>
          <Button onClick={this.toggleModal} disabled={edit}>
            <AddImage src={AddBtnIcon} />
            Add Bank Account
          </Button>
        </ButtonContainer>
      </BankTableContainer>
    );
  }
}

BankAccount.propTypes = {
  addBank: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  clientDetails: makeSelectClientDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    addBank: (payload) => dispatch(addBank(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BankAccount);
