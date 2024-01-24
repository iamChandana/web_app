import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import _has from 'lodash/has';
import _isEmpty from 'lodash/isEmpty';
import update from 'immutability-helper';
import Text from 'components/Text';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';
import { RowGridCenter, RowGridSpaceBetween, RowGridRight } from 'components/GridContainer';
import {
  setTitle,
  setStep,
  saveFunds,
  saveInitialInvestment,
  getDefaultSalesChargeRequest,
  removeCampaignCode,
} from 'containers/OnBoarding/actions';
import {
  makeSelectSelectedFunds,
  makeSelectInitialInvestment,
  makeSelectFunds,
  makeSelectAccount,
  makekwspCashIntroDetails,
  makeSelectAccountType,
} from 'containers/OnBoarding/selectors';
import { rejectBackButton } from 'utils/helpers';
import AddFundsBtnIcon from './addBtn.svg';
import FundCard from './FundCard';

const Container = styled(RowGridCenter)`
  padding: 0 40px;
  width: 100% !important;
  margin: 0;
  .--offset-right {
    margin-right: 10%;
  }
`;

const SyledButton = styled(Button)`
  width: 160px;
  margin: 0 4px;
`;

const AddFundsBtn = styled(Button)`
  width: 144px;
  img {
    margin-right: 8px;
  }
`;

const FullWidthGrid = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const BoxedInput = styled(NumberFormat)`
  display: block;
  min-width: 200px;
  height: 40px;
  margin-left: 16px;
  border-radius: 5px;
  border: solid 1px #cacaca;
  font-size: 18px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #10151a;
  padding: 8px 12px;
`;

const StyledNumberFormat = styled(NumberFormat)`
  outline: none;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.45;
  letter-spacing: normal;
  color: #1d1d26;
`;

const TextError = styled.span`
  font-size: 12px;
  color: ${Color.C_RED};
`;

const TotalAmtGrid = styled(Grid)`
  position: relative;
`;

const ErrorRoot = styled.div`
  position: absolute;
  left: 1rem;
`;

class AllocateFunds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFunds: props.selectedFunds,
      totalInitialInvestment: props.initialInvestment ? props.initialInvestment : 0,
      error: false,
      originalTotal: 0,
    };
    // this.closeFund = this.closeFund.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.setInitialInvestment = this.setInitialInvestment.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentWillMount() {
    rejectBackButton();
    this.calculateInitialInvestment();
    this.props.setStep(4);
    this.props.setTitle('Please tell us how much you want to invest.');
  }
  componentDidMount() {
    if (this.props.accountType) this.props.getDefaultSalesCharge(this.props.accountType);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('here');
    console.log('prevState: ', prevState.selectedFunds, 'this.props: ', this.props.selectedFunds);

    if (prevProps.selectedFunds !== this.props.selectedFunds) {
      console.log('different');
      this.setState(
        {
          selectedFunds: this.props.selectedFunds,
        },
        () => {
          console.log('updated');
        },
      );
    }
  }

  onClose(data) {
    if (this.state.selectedFunds.length < 1) {
      this.setState({
        totalInitialInvestment: 0,
      });
    } else {
      const dataIndex = _findIndex(this.state.selectedFunds, { id: data.id });

      const newData = update(this.state.selectedFunds, { $splice: [[dataIndex, 1]] });

      this.setState(
        {
          selectedFunds: newData,
        },
        () => {
          this.props.saveFunds(this.state.selectedFunds);
          this.setState({
            totalInitialInvestment: this.state.selectedFunds.reduce(
              (total, obj) => (obj.initialInvestment ? Number(obj.initialInvestment) : 0) + Number(total),
              0,
            ),
          });
        },
      );
    }
  }

  setInitialInvestment(value) {
    if (parseFloat(value) < this.state.originalTotal) {
      this.setState(
        {
          error: true,
        },
        () => {
          this.setState({
            totalInitialInvestment: this.state.originalTotal,
            error: false,
          });
        },
      );
    } else {
      this.setState({
        totalInitialInvestment: value,
        error: false,
      });
    }
  }

  calculateInitialInvestment() {
    let totalInitialInvestment = 0;
    this.state.selectedFunds.map((fund) => {
      totalInitialInvestment += fund.initialInvestment ? parseFloat(fund.initialInvestment) : 0;
    });
    this.setState({
      totalInitialInvestment,
      originalTotal: totalInitialInvestment,
    });
  }

  next() {
    this.state.selectedFunds.map((data) => {
      if (data.initialInvestment < data.minInitialInvestmentAmt) {
        data.initialInvestment = data.minInitialInvestmentAmt;
      }
      update(data, { initialInvestment: { $set: data.initialInvestment } });
    });
    this.props.saveFunds(this.state.selectedFunds);
    this.props.saveInitialInvestment(this.state.totalInitialInvestment);
    if (!_isEmpty(this.props.account) && _has(this.props.account, 'Account') && this.props.account.Account.virtualAccountNo) {
      this.props.history.replace('/onboarding/transfer-funds');
    } else {
      this.props.history.push('/onboarding/personal-details');
    }
  }

  back() {
    this.props.history.replace('onboarding/select-funds/list');
  }

  addFunds() {
    this.props.history.push('/onboarding/select-funds');
  }

  sliderChange(data, value, min, max) {
    if (!value) {
      const selected = _find(this.state.selectedFunds, { id: data.id });
      const newArray = [...this.state.selectedFunds];
      const updatedData = newArray.map((fund) => {
        if (fund.id === selected.id) {
          fund.initialInvestment = null;
        }
        return fund;
      });
      this.setState(
        {
          selectedFunds: updatedData,
        },
        () => {
          let updatedTotalInitialInvestment = 0;
          this.state.selectedFunds.map((fund) => {
            updatedTotalInitialInvestment += fund.initialInvestment ? parseFloat(fund.initialInvestment) : 0;
          });
          this.setState({
            totalInitialInvestment: updatedTotalInitialInvestment,
          });
          this.props.saveFunds(this.state.selectedFunds);
        },
      );
      return;
    }
    if (value < min) {
      this.setState({
        error: true,
      });
    } else {
      this.setState({
        error: false,
      });
    }
    if (value > max) {
      value = max;
    }
    const selected = _find(this.state.selectedFunds, { id: data.id });
    const newArray = [...this.state.selectedFunds];
    const updatedData = newArray.map((fund) => {
      if (fund.id === selected.id) {
        fund.initialInvestment = value;
      }
      return fund;
    });
    this.setState(
      {
        selectedFunds: updatedData,
      },
      () => {
        let updatedTotalInitialInvestment = 0;
        this.state.selectedFunds.map((fund) => {
          updatedTotalInitialInvestment += fund.initialInvestment ? parseFloat(fund.initialInvestment) : 0;
        });
        this.setState({
          totalInitialInvestment: updatedTotalInitialInvestment,
        });
        this.props.saveFunds(this.state.selectedFunds);
      },
    );
  }

  validateFundAndGetTotal() {
    let valid = true;
    let total = 0;
    this.props.selectedFunds.map((item) => {
      total += parseFloat(item.initialInvestment);
      if (parseFloat(item.initialInvestment) < item.minInitialInvestmentAmt) {
        valid = false;
      }
    });

    return { valid, total };
  }
  render() {
    const { selectedFunds, totalInitialInvestment } = this.state;
    const {
      kwspCashIntroDetails: { createKwspAccountParams },
      handleRemoveCampaignCode,
      accountType,
    } = this.props;

    // Total investment validation for KWSP account types
    let minError = false;
    if (createKwspAccountParams && createKwspAccountParams.AccountType === 'KW') {
      if (totalInitialInvestment < 1000) {
        minError = true;
      } else {
        minError = false;
      }
    }

    const { valid, total } = this.validateFundAndGetTotal();

    return (
      <Container spacing={24}>
        <Grid item xs={12}>
          <Text size="12px" weight="bold" color={Color.C_LIGHT_BLUE} lineHeight="1.67">
            TOTAL INITIAL INVESTMENT
          </Text>
        </Grid>
        <FullWidthGrid item xs={12}>
          <StyledNumberFormat
            thousandSeparator
            allowNegative={false}
            value={this.state.totalInitialInvestment ? this.state.totalInitialInvestment : ''}
            placeholder="RM..."
            displayType={'text'}
            prefix={'RM '}
            decimalScale={2}
            fixedDecimalScale
          />
          {/* {this.state.error && <TextError>Must not be less than to the total initial invesment amount</TextError>} */}
        </FullWidthGrid>
        <Grid item xs={12}>
          <RowGridSpaceBetween>
            <Grid item>
              <Text size="18px" weight="600" color="#000" align="left">
                Allocate Funds
              </Text>
            </Grid>
            <Grid item>
              <AddFundsBtn onClick={this.addFunds}>
                <img src={AddFundsBtnIcon} alt="Add Funds" />
                Add Funds
              </AddFundsBtn>
            </Grid>
          </RowGridSpaceBetween>
        </Grid>
        {selectedFunds.map((data) => (
          <Grid item xs={12} key={data.id}>
            <FundCard
              data={data}
              onClose={this.onClose}
              onSliderChange={this.sliderChange}
              selectedFunds={selectedFunds}
              allFunds={this.props.allFunds.Funds.res}
              handleRemoveCampaignCode={() => {
                handleRemoveCampaignCode(data.fundcode);
              }}
              accountType={accountType}
            />
          </Grid>
        ))}
        <Grid item xs={12} className="--offset-right">
          <RowGridRight>
            <Grid>
              <Text color="#1d1d26">Total Initial Investment</Text>
            </Grid>
            <TotalAmtGrid>
              <BoxedInput
                value={totalInitialInvestment || ''}
                fixedDecimalScale
                decimalScale={2}
                displayType={'text'}
                thousandSeparator
                prefix={'RM '}
              />
              {minError && (
                <ErrorRoot>
                  <TextError>The minimum total investment for KWSP transactions is RM 1,000.</TextError>
                </ErrorRoot>
              )}
            </TotalAmtGrid>
          </RowGridRight>
        </Grid>
        <Grid item xs={12}>
          <RowGridCenter>
            <SyledButton onClick={this.back}>Back</SyledButton>
            <SyledButton
              primary
              onClick={this.next}
              disabled={this.state.error || !valid || !total || totalInitialInvestment < total || minError}>
              Next
            </SyledButton>
          </RowGridCenter>
        </Grid>
      </Container>
    );
  }
}

AllocateFunds.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  selectedFunds: PropTypes.array,
  saveFunds: PropTypes.func,
  saveInitialInvestment: PropTypes.func,
  initialInvestment: PropTypes.number,
  allFunds: PropTypes.object,
  account: PropTypes.object,
  getDefaultSalesCharge: PropTypes.func.isRequired,
  accountType: PropTypes.string.isRequired,
  handleRemoveCampaignCode: PropTypes.func.isRequired,
};

AllocateFunds.defaultProps = {
  funds: {},
};

AllocateFunds.propTypes = {
  kwspCashIntroDetails: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  selectedFunds: makeSelectSelectedFunds(),
  initialInvestment: makeSelectInitialInvestment(),
  allFunds: makeSelectFunds(),
  account: makeSelectAccount(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
  accountType: makeSelectAccountType(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveFunds: (payload) => dispatch(saveFunds(payload)),
    saveInitialInvestment: (payload) => dispatch(saveInitialInvestment(payload)),
    getDefaultSalesCharge: (accountType) => dispatch(getDefaultSalesChargeRequest(accountType)),
    handleRemoveCampaignCode: (fundCode) => dispatch(removeCampaignCode(fundCode)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AllocateFunds);
