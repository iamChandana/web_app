import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';

import Button from 'components/Button';
import Text from 'components/Text';
import _isEmpty from 'lodash/isEmpty';
import Color from 'utils/StylesHelper/color';
import _forEach from 'lodash/forEach';
import FundCard from './FundCard';
import Modal from '../Modal';
import Disclaimer from '../Disclaimer';
import CWADisclaimer from '../CWADisclaimer';
import WholeSaleDisclaimer from '../WholeSaleDisclaimer';
import { getDefaultSalesChargeRequest } from '../../actions';
import { findJointAccountHolderNames, getSelectedFundAccountDetails } from '../../utils/getAccountHolderType';

const StyleButton = styled(Button)`
  margin-top: 16px;
`;
const TotalTopUp = styled(Text)`
  margin-right: 20px;
`;
const TotalAmountGrid = styled(Grid)`
  margin-top: 16px;
`;

const TextError = styled.span`
  font-size: 11px;
  margin-left: 1rem;
  color: ${Color.C_RED};
`;

const FundCardsWrapper = styled.div`
  background-color: #f5f5f5;
  padding: 16px 24px;
`;

class TopUp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      dataToTopUp: [],
      totalTopUp: 0,
      acknowledge: false,
      cwaAcknowledge: false,
      isVerificationOptionModalOpen: false,
    };

    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { getDefaultSalesCharge, data } = this.props;
    getDefaultSalesCharge(data);
  }

  getTotal(data) {
    let total = 0;
    _forEach(data, (item) => {
      if (item.newAmount) {
        total += parseFloat(item.newAmount);
      }
    });
    return total;
  }

  acknowledge() {
    this.setState((prevState) => ({
      acknowledge: !prevState.acknowledge,
    }));
  }

  cwaAcknowledge() {
    this.setState((prevState) => ({
      cwaAcknowledge: !prevState.cwaAcknowledge,
    }));
  }

  handleClose() {
    this.setState({ acknowledge: false, cwaAcknowledge: false });
    this.props.handleClose();
  }

  handleSubmit() {
    this.setState({ acknowledge: false, cwaAcknowledge: false }, () => {
      this.props.handleDisclaimerChange();
    });
    this.props.topUpFund();
  }

  validateNewAmount(data) {
    let newAmountIsValid = true;
    data.map((item) => {
      const newAmount = parseInt(item.newAmount, 10);
      const minAmount = item.units > 0 ? item.fund.minAdditionalInvestmentAmt : item.fund.minInitialInvestmentAmt;
      if (newAmount < minAmount || newAmount > item.fund.maxAdditionalInvestmentAmt) {
        newAmountIsValid = false;
      }
    });
    return newAmountIsValid;
  }
  isSelectedFundWholeSale() {
    const { data } = this.props;
    return data.filter((fundItem) => fundItem.fund.fundSubType === 'W').length > 0;
  }

  render() {
    const { open, data, handleTopUpChange, errorMessage, fullName, clientDetails } = this.props;
    const total = data.length > 0 ? this.getTotal(data) : 0;
    const newAmountIsValid = this.validateNewAmount(data);

    // Total investment validation for KWSP account types
    let minError = false;
    if (data && data[0].accountType === 'KW') {
      if (total < 1000) {
        minError = true;
      } else {
        minError = false;
      }
    }

    return (
      <Modal open={open} handleClose={this.handleClose} title="Top Up" dialogminwidth="750px">
        <Grid container direction="column" justify="center" alignItems="center">
          <FundCardsWrapper>
            <Grid container spacing={24}>
              {data.map((item) => {
                let filteredError;

                if (typeof errorMessage === 'string') {
                  filteredError = errorMessage;
                } else {
                  filteredError =
                    !_isEmpty(errorMessage) && Array.isArray(errorMessage) && errorMessage.length > 0
                      ? errorMessage.filter(
                          (errorItem) =>
                            errorItem.investmentProductId === item.investmentProductId ||
                            errorItem.fundCode === item.fund.fundcode,
                        )
                      : [];
                }
                return (
                  <Grid item key={item.investmentProductId} xs={12}>
                    <FundCard data={item} handleChange={handleTopUpChange} error={filteredError} />
                  </Grid>
                );
              })}
            </Grid>
          </FundCardsWrapper>
          <TotalAmountGrid container direction="row" justify="flex-start" alignItems="center">
            <Grid item xs={6}>
              <TotalTopUp size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="right">
                TOTAL
              </TotalTopUp>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                  <NumberFormat
                    value={total}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                  {minError && <TextError>The minimum total investment for KWSP transactions is RM 1,000.</TextError>}
                </Text>
              </Grid>
            </Grid>
          </TotalAmountGrid>
          <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} type="topup" />
          <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} type="topup" />
          {this.isSelectedFundWholeSale() && (
            <WholeSaleDisclaimer
              secondaryHolderNameIfAvailable={findJointAccountHolderNames(
                getSelectedFundAccountDetails(data[0].partnerAccountNo, clientDetails),
              )}
              acknowledge={this.props.wholeSaleAcknowledge}
              onChange={this.props.handleDisclaimerChange}
              fullName={fullName}
            />
          )}
          <Grid item xs={12}>
            <StyleButton
              primary
              onClick={this.handleSubmit}
              disabled={
                !this.state.acknowledge ||
                !this.state.cwaAcknowledge ||
                (this.isSelectedFundWholeSale() && !this.props.wholeSaleAcknowledge) ||
                total === 0 ||
                !newAmountIsValid ||
                minError
              }>
              Top Up
            </StyleButton>
          </Grid>
        </Grid>
      </Modal>
    );
  }
}

TopUp.propTypes = {
  data: PropTypes.object,
  errorMessage: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleTopUpChange: PropTypes.func,
  topUpFund: PropTypes.object,
  handleDisclaimerChange: PropTypes.func,
  wholeSaleAcknowledge: PropTypes.bool,
  fullName: PropTypes.string,
  clientDetails: PropTypes.object,
  getDefaultSalesCharge: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  getDefaultSalesCharge: (funds) => dispatch(getDefaultSalesChargeRequest(funds)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default withConnect(TopUp);
