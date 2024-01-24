import React from 'react';
import styled from 'styled-components';
import { Field, reduxForm, Form } from 'redux-form';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Lightertext from 'components/LighterText';
import NumberFormat from 'react-number-format';
import Button from 'components/Button';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Color from 'utils/StylesHelper/color';
import _isEmpty from 'lodash/isEmpty';
import _startCase from 'lodash/startCase';
import _toLower from 'lodash/toLower';
import LoadingIndicator from 'components/LoadingIndicator';
import TransactionFundsForm from 'components/FormUtility/TransactionFunds';
import { ColumnGridLeft, RowGridSpaceBetween, ColumnGridCenter } from 'components/GridContainer';
import TableHeader from '../Utility/TableHeader';
import CheckIcon from './check-big.svg';
import { isIE, isEdge } from 'react-device-detect';
import KwspFields from './KwspFields';
import { kwspPaymentBoxString } from '../../../../utils/kwspTextConstants';
import PaymentDisclaimerContent from '../../../../components/TransactionBox/paymentBox';

const Container = styled.div`
  min-height: 88px;
  background-color: #ffffff;
  max-width: 100%;
  padding: 1rem 40px;
  box-shadow: 0px 0px 5px #e5e2e2;
  margin-bottom: 2rem;
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
/*
const AddChequeText = styled(Text)`
  margin-top: 40px;
  margin-bottom: 24px;
  cursor: pointer;
`;
*/
const StyledSelect = styled(Select)`
  width: 200px;
  min-height: 40px;
  border-radius: 5px;
  background-color: ${(props) => (props.done ? '#35c12f;' : Color.C_LIGHT_BLUE)};
  margin-left: 16px;
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

const StyleButtonOnlinePayment = styled(Button)`
  margin-top: 16px;
`;

const FORM_FIELDS_LABEL = {
  CQ: 'Cheque',
  BD: 'Bank Draft',
  VA: 'Virtual Account',
};

class FundBox extends React.Component {
  componentWillUnmount() {
    this.resetKwspFields();
  }

  resetKwspFields() {
    this.props.reset();
  }
  componentWillUnmount() {
    this.resetKwspFields();
  }

  resetKwspFields() {
    this.props.reset();
  }
  checkData(data, props) {
    const { value, kwspApplicationNumber, effectiveDate } = props;
    let hasValue = false;
    let amount;
    const initialInvestment = props.initialInvestment ? props.initialInvestment.toFixed(2) : 0;
    let selectedAPaymentMethod = false;

    if (value === '9N') {
      if (kwspApplicationNumber && kwspApplicationNumber.length >= 8 && effectiveDate) {
        hasValue = true;
        return hasValue;
      }
    } else {
      if (
        props.documentsList &&
        props.documentsList.Dictionary &&
        props.documentsList.Dictionary[20].datadictionary.some((o) => o.codevalue === props.selectedFilter)
      ) {
        selectedAPaymentMethod = true;
      }
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
    }
    return selectedAPaymentMethod && hasValue;
  }

  render() {
    const {
      initialInvestment,
      value,
      onChange,
      onChangeChequeAmount,
      data,
      orderCreated,
      onInputChange,
      onSubmit,
      updateDocs,
      done,
      succeeded,
      status,
      documentsList,
      errorMessage,
      email,
      account,
      kwspCashIntroDetails: { createKwspAccountParams },
      onChangeKwspApplicationNumber,
      onChangeKwspApplicationDate,
    } = this.props;
    const formValues = {
      epfMembershipNumber: createKwspAccountParams.epfMembershipNumber,
    };
    const AddText = FORM_FIELDS_LABEL[value];
    const requestStatus = status
      ? _startCase(_toLower(status))
      : _startCase(_toLower(orderCreated ? orderCreated.transactionRequest.RequestStatus : null));
    const refId = orderCreated ? orderCreated.transactionRequest.refNo : null;
    const dataHasValue = this.checkData(data, this.props);
    if (_isEmpty(documentsList)) return <LoadingIndicator />;
    // Hard Coded
    const arrPaymentMethods = [...documentsList.Dictionary[20].datadictionary];
    for (const obj of arrPaymentMethods) {
      obj.disable = null;
    }
    if (createKwspAccountParams.AccountType === 'KW') {
      arrPaymentMethods.forEach((paymentItem) => {
        if (paymentItem.codevalue !== '9N') {
          paymentItem.disable = true;
        } else {
          paymentItem.disable = false;
        }
      });
    } else if (!account.isEmailVerified || !account.AccEmail || account.AccEmail === '') {
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
          <Grid container justify="center" style={{ marginTop: 5, marginBottom: 15 }}>
            <Grid item xs={12}>
              <Text size="16px" weight="900">
                Please select a payment method.
              </Text>
            </Grid>
          </Grid>
          <ColumnGridLeft>
            <RowGridSpaceBetween>
              <Grid item>
                <ColumnGridLeft>
                  <Grid item>
                    <TableHeader>INITIAL INVESTMENT</TableHeader>
                  </Grid>
                  <Grid item>
                    <StyledNumberFormat
                      value={initialInvestment || '-'}
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
                      {refId || '-'}
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
                    <Text weight="bold">{requestStatus || '-'}</Text>
                  </Grid>
                </ColumnGridLeft>
              </Grid>
              <Grid item alignContent="flex-end" alignItems="flex-end">
                <Filter>
                  <StyledSelect done={done} value={value} onChange={(e) => onChange(e, name)} disabled={done}>
                    <MenuItem value="Select" disabled>
                      Payment Method
                    </MenuItem>
                    {arrPaymentMethods.map((option) => (
                      <MenuItem key={option.id} value={option.codevalue} disabled={option.disable}>
                        {option.description}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                  {done && <CheckImg src={CheckIcon} />}
                </Filter>
              </Grid>
            </RowGridSpaceBetween>

            <PaymentDisclaimerContent done={done} value={value} />

            {!done && !succeeded && value && (value === 'CQ' || value === 'BD' || value === '9N') && (
              <Grid container justify="center" style={{ marginTop: 25, marginBottom: -15 }}>
                <Grid item xs={12}>
                  {value === '9N' ? (
                    <Text lineHeight="1.57" align="left" style={{ width: '650px', marginBottom: 15 }}>
                      {kwspPaymentBoxString}
                    </Text>
                  ) : (
                    <Text align="left" lineHeight="1.57" style={{ width: '650px', marginBottom: 15 }}>
                      Please present Cheque or Bank Draft payments at Principal branch counters within 1 working day as no cash
                      transaction is allowed.
                    </Text>
                  )}

                  {value === '9N' ? (
                    <Text align="left" lineHeight="1.57" style={{ width: '650px' }}>
                      The KWSP transactions will be processed based on the NAV at the next valuation point after the payment
                      settlement/confirmation. If the transactions' payment settlement/confirmation notices are received on/by
                      4:00 PM on a Business Day, it will be processed using the NAV per unit for the said Business Day. But if the
                      payment settlement/confirmation notices are received after 4:00 PM on a Business Day, then it will be
                      processed using the NAV per unit for the next Business Day.
                    </Text>
                  ) : (
                    <Text align="left" lineHeight="1.57" style={{ width: '650px' }}>
                      Submission cutoff time is 4:00 PM. Any successful transaction and Cheque or Bank Draft submission after 4:00
                      PM or on a non-business day, orders will be processed on the next business day NAV.
                    </Text>
                  )}
                </Grid>
              </Grid>
            )}

            {!done && !succeeded && value && value !== 'Select' && value !== 'IB' && (
              <ColumnGridCenter>
                {value === '9N' ? (
                  <Field
                    component={KwspFields}
                    initialValues={formValues}
                    epfMembershipNumber={createKwspAccountParams.epfMembershipNumber}
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
                      transactionRequest={orderCreated}
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
              </ColumnGridCenter>
            )}
            {!done && !succeeded && value && value === 'IB' && (
              <Grid container justify="center" style={{ marginTop: '25px' }}>
                <Grid item xs={12}>
                  <Lightertext size="14px" display="block">
                    The client’s registered email address is as follows. Payment link and confirmation details will be sent to
                    this email. Client can choose to update email address by contacting Principal Customer Care via Agency Hotline
                    or chat via WhatsApp. The new email address will be reflected in PDA the next day.
                  </Lightertext>
                  <Text size="14px" display="block" style={{ marginTop: '10px' }}>
                    Please be informed that the daily transaction limit for Online Bank Transfer is RM 300,000.
                  </Text>
                  <Text size="14px" display="block" style={{ margin: '0 17px' }}>
                    Reminder: For Online Bank Transfer, 3rd Party payments are not accepted by Principal. Principal shall have the
                    right to reject and/or cancel any Transaction, in respect of which payment is made using 3rd Party accounts,
                    without further notice.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: '15px' }}>
                  <Text size="10px" color={Color.C_LIGHT_GRAY}>
                    REGISTERED EMAIL ADDRESS
                  </Text>
                  <Text size="14px" weight="bold">
                    {email}
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="center" style={{ marginTop: '5px', marginBottom: '25px' }}>
                    <StyleButtonOnlinePayment primary onClick={onSubmit}>
                      Proceed
                    </StyleButtonOnlinePayment>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </ColumnGridLeft>
        </Container>
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  kwspFields: state.form.KWSPFields,
});

const PaymentBox = reduxForm({
  form: 'PaymentBox', // a unique identifier for this form
  destroyOnUnmount: true,
})(FundBox);

export default connect(mapStateToProps)(PaymentBox);
