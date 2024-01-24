import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Field, reduxForm, Form } from 'redux-form';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import Text from 'components/Text';
import Lightertext from 'components/LighterText';
import NumberFormat from 'react-number-format';
import Button from 'components/Button';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import LoadingIndicator from 'components/LoadingIndicator';
import Color from 'utils/StylesHelper/color';
import { ColumnGridLeft, RowGridSpaceBetween } from 'components/GridContainer';
import TableHeader from './TableHeader';
import TransactionFundsForm from 'components/FormUtility/TransactionFunds';
import { isIE, isEdge } from 'react-device-detect';
import { ListOfFunds } from './ListOfFunds';
import KwspFields from '../../containers/OnBoarding/TransferFunds/Transfer/KwspFields';
import PaymentDisclaimerContent from '../../components/TransactionBox/paymentBox';

const Container = styled.div`
  min-height: 88px;
  background-color: #ffffff;
  max-width: 100%;
  padding: 0 40px;
  @media (min-width: 700px) {
    min-width: 720px;
  }
  .header {
    margin-bottom: 21px;
  }
  -ms-overflow-style: -ms-autohiding-scrollbar;
}
`;

const StyledButton = styled(Button)`
  margin-top: 20px !important;
  display: table;
  margin: 0 auto;
`;

const StyledSelect = styled(Select)`
  width: 200px;
  min-height: 40px;
  border-radius: 5px;
  background-color: ${(props) => (props.done ? '#35c12f;' : Color.C_LIGHT_BLUE)};
  margin-left: 16px;
  margin-right: 25px;
  text-align: center;
  > div > div {
    margin-top: 5px;
    color: #fff;
  }
  &::before,
  &::after {
    display: none;
  }
  svg {
    color: #fff;
    display: ${(props) => (props.done ? 'none' : 'block')};
  }
`;

const Filter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 232px;
  .label {
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: right;
    color: ${(props) => (props.done ? '#35c12f' : ' #979797;')};
  }
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

const CheckImg = styled.img`
  position: absolute;
  margin-left: 180px;
`;

const StyleButton = styled(Button)`
  margin-top: 16px;
`;

const ListOfFundsOuterWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  justify-content: space-around;
`;

const ListOfFundsInnerWrapper = styled.div`
  width: 75%;
`;

const FORM_FIELDS_LABEL = {
  CQ: 'Cheque',
  BD: 'Bank Draft',
  VA: 'Virtual Account',
};

class PaymentContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  checkData(data, total, paymentMode, kwspApplicationNumber, effectiveDate) {
    let hasValue = false;
    if (paymentMode === '9N') {
      if (kwspApplicationNumber && kwspApplicationNumber.length >= 8 && effectiveDate) {
        hasValue = true;
        return hasValue;
      }
    }

    let amount;
    const initialInvestment = total.toFixed(2);
    data.map((item) => {
      amount = item.ChequeOrDDAmount ? parseFloat(item.ChequeOrDDAmount) : 0;
      const fixedAmount = amount.toFixed(2);
      if (
        item.BankName &&
        item.ChequeOrDDAmount &&
        item.ChequeOrDDNumber &&
        !_isEmpty(item.docs) &&
        parseFloat(fixedAmount) === parseFloat(initialInvestment)
      ) {
        hasValue = true;
      }
    });
    return hasValue;
  }

  componentWillUnmount() {
    this.resetKwspFields();
  }

  resetKwspFields() {
    this.props.reset();
  }

  render() {
    const {
      value,
      onChange,
      onChangeChequeAmount,
      data,
      onInputChange,
      onSubmit,
      updateDocs,
      done,
      transactions,
      customer,
      lov,
      errorMessage,
      account,
      kwspCashIntroDetails,
      onChangeKwspApplicationNumber,
      onChangeKwspApplicationDate,
      kwspApplicationNumber,
      effectiveDate,
      showListOfFunds,
      selectedFunds,
    } = this.props;
    const { createKwspAccountParams } = kwspCashIntroDetails;
    const formValues = {
      epfMembershipNumber: createKwspAccountParams ? createKwspAccountParams.epfMembershipNumber : null,
    };
    const total = (!_isEmpty(transactions) && transactions.transactionRequestAmount) || 0;
    const AddText = FORM_FIELDS_LABEL[value];
    const dataHasValue = this.checkData(data, total, value, kwspApplicationNumber, effectiveDate);
    if (_isEmpty(lov) || _isEmpty(customer)) return <LoadingIndicator />;
    if (!_isEmpty(transactions)) {
      const arrPaymentMethods = [...lov.Dictionary[20].datadictionary];
      if (customer && customer.UTRACCOUNTTYPE === 'KW') {
        arrPaymentMethods.forEach((paymentItem) => {
          if (paymentItem.codevalue !== '9N') {
            paymentItem.disable = true;
          } else {
            paymentItem.disable = false;
          }
        });
      } else if (account && !account.isEmailVerified) {
        arrPaymentMethods.forEach((paymentItem) => {
          if (paymentItem.codevalue === 'IB' || paymentItem.codevalue === '9N') {
            paymentItem.disable = true;
          } else {
            paymentItem.disable = false;
          }
        });
      } else {
        arrPaymentMethods.forEach((paymentItem) => {
          if (paymentItem.codevalue === '9N') {
            paymentItem.disable = true;
          } else {
            paymentItem.disable = false;
          }
        });
      }
      return (
        <Form onSubmit={(e) => e.preventDefault()}>
          <Container>
            <Grid container style={{ marginTop: 5, marginBottom: 15 }}>
              <Grid item xs={12}>
                <Text size="16px" weight="bolder">
                  Please select a payment method.
                </Text>
              </Grid>
            </Grid>
            <RowGridSpaceBetween>
              <Grid item>
                <ColumnGridLeft>
                  <Grid item>
                    <TableHeader>INITIAL INVESTMENT</TableHeader>
                  </Grid>
                  <Grid item>
                    <StyledNumberFormat
                      value={total || '-'}
                      decimalSeparator={'.'}
                      decimalScale={2}
                      fixedDecimalScale
                      displayType={'text'}
                      thousandSeparator
                      prefix={'RM '}
                    />
                  </Grid>
                </ColumnGridLeft>
              </Grid>
              <Grid item>
                <ColumnGridLeft>
                  <Grid item>
                    <TableHeader>REFERENCE ID</TableHeader>
                  </Grid>
                  <Grid item>
                    <Text weight="bold" align="left">
                      {transactions.refNo || '-'}
                    </Text>
                  </Grid>
                </ColumnGridLeft>
              </Grid>
              <Grid item>
                <ColumnGridLeft>
                  <Grid item>
                    <TableHeader>STATUS</TableHeader>
                  </Grid>
                  <Grid item>
                    <Text weight="bold">{transactions.RequestStatus || '-'}</Text>
                  </Grid>
                </ColumnGridLeft>
              </Grid>
              <Grid item>
                <Filter>
                  <StyledSelect done={done} value={value} onChange={(e) => onChange(e, name)}>
                    <MenuItem value="Select" disabled>
                      Payment Method
                    </MenuItem>
                    {arrPaymentMethods.map((option) => (
                      <MenuItem key={option.id} value={option.codevalue} disabled={option.disable}>
                        {option.description}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </Filter>
              </Grid>
            </RowGridSpaceBetween>
            {showListOfFunds ? (
              <ListOfFundsOuterWrapper>
                <ListOfFundsInnerWrapper>
                  <ListOfFunds funds={selectedFunds} />
                </ListOfFundsInnerWrapper>
              </ListOfFundsOuterWrapper>
            ) : null}
            <PaymentDisclaimerContent done={done} value={value} />
            {!done && value && value !== 'Select' && value !== 'IB' && (
              <React.Fragment>
                {value === '9N' ? (
                  <Field
                    component={KwspFields}
                    initialValues={formValues}
                    epfMembershipNumber={customer.EPFMembershipNumber}
                    onChangeKwspApplicationNumber={(element, index) => onChangeKwspApplicationNumber(element)}
                    onChangeKwspApplicationDate={(dateValue) => onChangeKwspApplicationDate(dateValue)}
                    disabled
                  />
                ) : (
                  data.map((item, i) => (
                    <TransactionFundsForm
                      type={AddText}
                      key={i}
                      index={i}
                      data={item}
                      onChange={onInputChange}
                      onChangeChequeAmount={onChangeChequeAmount}
                      updateDocs={updateDocs}
                      transactionRequest={transactions}
                      errorMessage={errorMessage}
                      paymentCodeValue={value}
                    />
                  ))
                )}
                <div style={{ width: '100%' }}>
                  {isEdge || isIE ? (
                    <StyledButton primary onClick={onSubmit} disabled={!dataHasValue} paddingTop="10px">
                      Submit
                    </StyledButton>
                  ) : (
                    <StyledButton primary onClick={onSubmit} disabled={!dataHasValue}>
                      Submit
                    </StyledButton>
                  )}
                </div>
              </React.Fragment>
            )}
            {!done && value && value !== 'Select' && value === 'IB' && (
              <Grid container justify="center" style={{ marginTop: '25px' }}>
                <Grid item xs={12}>
                  <Lightertext size="14px" display="block">
                    The client’s registered email address is as follows. Payment link and confirmation details will be sent to
                    this email. Client can choose to update email address by contacting Principal Customer Care via Agency Hotline
                    or chat via WhatsApp. The new email address will be reflected in PDA the next day.
                  </Lightertext>
                  <Text size="14px" display="block" style={{ marginTop: '5px' }}>
                    Please be informed that the daily transaction limit for Online Bank Transfer is RM 300,000.
                  </Text>
                  <Text size="14px" display="block">
                    Reminder: For Online Bank Transfer, 3rd Party payments are not accepted by Principal. Principal shall have the
                    right to reject and/or cancel any transaction, in respect of which payment is made using 3rd Party accounts,
                    without further notice.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: '15px' }}>
                  <Text size="10px" color={Color.C_LIGHT_GRAY}>
                    REGISTERED EMAIL ADDRESS
                  </Text>
                  <Text size="15px" weight="bold">
                    {customer.AccEmail}
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="center" style={{ marginTop: '5px' }}>
                    <StyleButton primary onClick={onSubmit}>
                      Proceed
                    </StyleButton>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Container>
        </Form>
      );
    }
  }
}

PaymentContainer.propTypes = {
  showListOfFunds: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  kwspFields: state.form.KWSPFields,
});

const PaymentBox = reduxForm({
  form: 'PaymentBox', // a unique identifier for this form
  destroyOnUnmount: true,
})(PaymentContainer);

export default connect(mapStateToProps)(PaymentBox);
