import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { reset as ResetForm } from 'redux-form';
import _findIndex from 'lodash/findIndex';
import update from 'immutability-helper';
import Color from 'utils/StylesHelper/color';
import getSalesCharge from 'utils/getSalesCharge';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter } from 'material-ui/Table';

import LoadingOverlay from 'components/LoadingOverlay';
import Snackbar from 'material-ui/Snackbar';

import Text from 'components/Text';
import Button from 'components/Button';
import { RowGridCenter } from 'components/GridContainer';
import {
  setTitle,
  setStep,
  createOrder,
  reset,
  resetError,
  saveFunds,
  saveInitialInvestment,
  clearImage,
} from 'containers/OnBoarding/actions';
import {
  makeSelectSelectedFunds,
  makeSelectInitialInvestment,
  makeSelectAccount,
  makeSelectOrder,
  makeSelectProcessing,
  makeSelectError,
  makeSelectOrderCreateError,
} from 'containers/OnBoarding/selectors';
import { selectUserInfo } from 'containers/LoginPage/selectors';
import TableHeader from '../Utility/TableHeader';
import TableItem from '../Utility/TableItem';
import { rejectBackButton } from 'utils/helpers';
import CloseIcon from './close.svg';

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  margin-top: -35px;
  @media (max-width: 699px) {
    max-width: 100%;
  }
`;

const TextDetails = styled(Text)`
  max-width: 100%;
  margin: 36px auto 32px;

  @media (min-width: 700px) {
    max-width: 600px;
  }
`;

const SyledButton = styled(Button)`
  width: 200px;
  margin: 0 4px;
`;
/*
const StyledImg = styled.img`
  position: absolute;
  right: 0;
  cursor: pointer;
  height: 20px;
  width: 20px;
  margin-top: 10px;
`;
*/
const StyledImg = styled.img`
  cursor: pointer;
  height: 20px;
  width: 20px;
`;

const StyledNumberFormat = styled(NumberFormat)`
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: #1d1d26;
`;

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nextAction: '',
      hasError: false,
      funds: props.funds || [],
      initialInvestment: props.initialInvestment || 0,
    };

    this.next = this.next.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.removeFund = this.removeFund.bind(this);
    this.addFunds = this.addFunds.bind(this);
  }
  componentWillMount() {
    rejectBackButton();
    this.props.setStep(7);
    this.props.setTitle("Great! Let's start funding your investment.");
    this.props.clearImage();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.orderCreated !== nextProps.orderCreated && !_isEmpty(nextProps.orderCreated)) {
      if (this.state.nextAction === 'save') {
        this.props.reset();
        this.props.formReset(); // clear redux form
        this.props.history.push('/');
      } else {
        this.props.history.push('/onboarding/transfer-funds/transfer');
      }
    }
    if (this.props.error !== nextProps.error) {
      toast(nextProps.error);
      this.props.resetError();
    }

    if (!this.props.orderCreateError && nextProps.orderCreateError && typeof nextProps.orderCreateError === 'string') {
      toast(nextProps.orderCreateError);
    }
  }

  addFunds() {
    this.props.history.push('/onboarding/select-funds');
  }
  saveAndContinue() {
    this.createOrder();
    this.setState({
      nextAction: 'save',
    });
  }
  createOrder() {
    const { funds, userInfo, account } = this.props;
    const payload = {
      customerId: account.profile.id,
      accountId: account.Account.partnerAccountMappingId,
      productBreakdown: [],
    };

    this.props.funds.map((data) => {
      payload.productBreakdown.push({
        investmentProductId: data.id,
        investmentPartnerProductId: data.fundcode,
        productType: 'Fund',
        value: data.initialInvestment,
        unitType: 'value',
        units: '',
        defaultRateId: data.defaultRateId,
        defaultRate: data.defaultSalesCharge,
        campaignCode: data.campaignCode || null,
        campaignCodeId: data.campaignCodeId || null,
        lowerSalesCharge: data.campaignSalesCharge || null,
        campaignCodeSalesCharge: data.campaignCodeSalesCharge || null,
      });
    });
    this.props.createOrder(payload);
  }
  next() {
    this.createOrder();
    this.setState({
      nextAction: 'continue',
    });
  }

  removeFund(data) {
    if (this.state.funds.length < 1) {
      this.setState({
        initialInvestment: 0,
      });
    } else {
      const dataIndex = _findIndex(this.state.funds, { id: data.id });
      const newData = update(this.state.funds, { $splice: [[dataIndex, 1]] });
      this.setState(
        {
          funds: newData,
        },
        () => {
          this.props.saveFunds(this.state.funds);
          this.setState(
            {
              initialInvestment: this.state.funds.reduce((total, obj) => Number(obj.initialInvestment) + Number(total), 0),
            },
            () => {
              this.props.saveInitialInvestment(this.state.initialInvestment);
            },
          );
        },
      );
    }
  }
  renderErrorMessage(error) {
    if (_isEmpty(error[0])) {
      return null;
    }
    return error[0].ErrorMessage.map((message) => (
      <TableItem>
        <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
          {message.ErrorDesc}
        </Text>
      </TableItem>
    ));
  }
  render() {
    const { processing, orderCreateError } = this.props;
    const { funds, initialInvestment } = this.state;
    return (
      <Container>
        <LoadingOverlay show={processing} />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.state.hasError}
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Something is wrong. Please try again.</span>}
        />
        {/* <Grid item xs={12}>
          <Text color="#1d1d26" lineHeight="1.38" weight="bold" size="16px">
            {account.Account.virtualAccountNo
              ? account.Account.virtualAccountNo.slice(
                  account.Account.virtualAccountNo.length - 6,
                  account.Account.virtualAccountNo.length,
                )
              : ''}{' '}
            (CIMB Bank)
          </Text>
        </Grid> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableHeader>FUND NAME</TableHeader>
              </TableCell>
              <TableCell>
                <TableHeader>INITIAL INVESTMENT</TableHeader>
              </TableCell>
              <TableCell>
                <TableHeader>SALES CHARGE</TableHeader>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funds.map((n) => {
              const filteredError =
                !_isEmpty(orderCreateError) && Array.isArray(orderCreateError) && orderCreateError.length > 0
                  ? orderCreateError.filter(
                      (errorItem) => errorItem.investmentProductId === n.id && !_isEmpty(errorItem.ErrorMessage),
                    )
                  : [];
              return (
                <TableRow key={n.id}>
                  <TableCell>
                    <TableItem>
                      {n.fundcode} {n.name}
                    </TableItem>
                    {this.renderErrorMessage(filteredError)}
                  </TableCell>
                  <TableCell>
                    <StyledNumberFormat
                      decimalSeparator={'.'}
                      decimalScale={2}
                      fixedDecimalScale
                      value={n.initialInvestment}
                      displayType={'text'}
                      thousandSeparator
                      prefix={'RM '}
                    />
                  </TableCell>
                  <TableCell>
                    <Grid container justify="center" align="center" alignItems="center">
                      <Grid item xs={11} align="left" style={{ paddingRight: 5 }}>
                        <StyledNumberFormat
                          value={getSalesCharge(n.campaignCodeSalesCharge, n.defaultSalesCharge)}
                          displayType={'text'}
                          thousandSeparator
                          suffix="%"
                        />
                      </Grid>
                      <Grid item xs={1} align="left" style={{ paddingLeft: 5 }}>
                        {!_isEmpty(filteredError) && filteredError[0].investmentProductId === n.id && (
                          <StyledImg src={CloseIcon} onClick={() => this.removeFund(n)} />
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                <Text color="#1d1d26" size="12px" opacity="0.4" lineHeight="1.6" align="right">
                  Total Initial Invesment
                </Text>
              </TableCell>
              <TableCell>
                <StyledNumberFormat
                  decimalSeparator={'.'}
                  decimalScale={2}
                  fixedDecimalScale
                  value={initialInvestment}
                  displayType={'text'}
                  thousandSeparator
                  prefix={'RM '}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <React.Fragment>
          <Text display="block" align="left" style={{ marginBottom: 15 }}>
            Please present Cheque payments at Principal branch counters within 1 working day as no cash transaction is allowed.
          </Text>
          <Text display="block" size="15px" align="left" weight="900">
            Submission cutoff time is 4:00pm:
          </Text>
          <Text display="block" align="left" style={{ marginBottom: 15 }}>
            Any successful transaction and cheque submission after 4:00 PM or on a non-business day, orders will be processed on
            the next business day as per next business day NAV.
          </Text>
          <Text display="block" size="15px" align="left" weight="900">
            Cheque and Bank Draft Payment:
          </Text>
          <Text display="block" align="left" style={{ marginBottom: 15 }}>
            Please present them at Principal branch counters within 1 working day as no cash transaction is allowed. Submission
            cutoff time is 4:00 PM.
          </Text>
          <Text display="block" size="15px" align="left" weight="900">
            Online Bank Transfer Payment:
          </Text>
          <Text display="block" align="left">
            Please ensure that the client's email address has been verified to use the Online Bank Transfer payment method.
          </Text>

          <Text display="block" align="left">
            The daily transaction limit for Online Bank Transfer is RM 300,000.
          </Text>
          <Text display="block" align="left">
            Reminder: For Online Bank Transfer, 3rd Party payments are not accepted by Principal. Principal shall have the right
            to reject and/or cancel any transaction, in respect of which payment is made using 3rd Party accounts, without further
            notice.
          </Text>
        </React.Fragment>

        <TextDetails lineHeight="1.43" size="15px" style={{ marginTop: 15 }}>
          If you would like to start investing now, please select continue. Otherwise select Save & Continue later.
        </TextDetails>

        <RowGridCenter style={{ marginTop: 25, marginBottom: 25 }}>
          <SyledButton primary onClick={this.saveAndContinue}>
            Save & Continue Later
          </SyledButton>
          <SyledButton primary onClick={this.next} disabled={_isEmpty(this.state.funds)}>
            Continue
          </SyledButton>
          {!_isEmpty(orderCreateError) && (
            <SyledButton primary onClick={this.addFunds}>
              Add Funds
            </SyledButton>
          )}
        </RowGridCenter>
      </Container>
    );
  }
}

Details.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  initialInvestment: PropTypes.number,
  orderCreateError: PropTypes.object,
  saveFunds: PropTypes.func,
  saveInitialInvestment: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  funds: makeSelectSelectedFunds(),
  initialInvestment: makeSelectInitialInvestment(),
  userInfo: selectUserInfo(),
  account: makeSelectAccount(),
  orderCreated: makeSelectOrder(),
  processing: makeSelectProcessing(),
  error: makeSelectError(),
  orderCreateError: makeSelectOrderCreateError(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    createOrder: (payload) => dispatch(createOrder(payload)),
    reset: () => dispatch(reset()),
    resetError: () => dispatch(resetError()),
    formReset: () => dispatch(ResetForm()),
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    saveInitialInvestment: (payload) => dispatch(saveInitialInvestment(payload)),
    getCustomerDetails: (payload) => dispatch(getCustomerDetails(payload)),
    clearImage: () => dispatch(clearImage()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Details);
