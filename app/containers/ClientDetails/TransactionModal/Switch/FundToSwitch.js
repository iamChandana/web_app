/* eslint-disable no-else-return */
import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui/Menu';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import NumberFormat from 'react-number-format';
import { isEmpty } from 'lodash';
import CustomSelect from './Select';

import Checkbox from 'components/Checkbox';
import Dialog from 'components/Dialog';
import CashSchemeIcon from 'containers/ClientDetails/Funds/assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from 'containers/ClientDetails/Funds/assets/KWSP_scheme_blue.svg';
import WholeSaleWarningModal from 'components/WholeSaleWarningModal';
import Color from 'utils/StylesHelper/color';
import DownloadDropdown from 'components/DownloadDropdown';
import { makeSelectKwspIslamicORConventionalFlag } from '../../selectors';
import MMFundWarningModal from './MMFundWarningModal';
import RightArrowIcon from './right-arrow.svg';
import Alert from './Alert';
import rspStatuses from '../rspStatuses';

import {
  AssetClassLabel,
  FundToSwitchContainer,
  FundToSwitchInnerContainer,
  StyledNumberFormat,
  StyledSelect,
  Img,
  Wrapper,
  DownloadWrapper,
} from './Atoms';

class FundsToSwitch extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      numOfSelector: 1,
      open: false,
      riskProfileType: '',
      selectedFund: null,
      disclaimerOpen: false,
    };

    this.toggleAlert = this.toggleAlert.bind(this);
    this.toggleDisclaimer = this.toggleDisclaimer.bind(this);
    this.select = this.select.bind(this);
    this.confirmSelectFund = this.confirmSelectFund.bind(this);
    this.toggleWholeSaleModal = this.toggleWholeSaleModal.bind(this);
    this.checkSelectedAccountType = this.checkSelectedAccountType.bind(this);
    this.toggleMMFundModal = this.toggleMMFundModal.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.getSelectedFundStatus = this.getSelectedFundStatus.bind(this);
  }

  getSelectedFund(selectedId) {
    let selectedFund;
    this.props.fundsToSelectToSwitch.forEach((item) => {
      if (item.fundcode === selectedId) {
        selectedFund = item;
      }
    });

    return selectedFund;
  }

  getSelectedFundStatus(data) {
    const { riskAppetite } = this.props;
    const selectedFund = data || this.state.selectedFund;
    const isMMFund = selectedFund.assetclass.toLowerCase() === 'money market';
    const switchToWholeSaleFund = selectedFund.fundSubType === 'W';
    const hasDifferentRiskType = selectedFund.riskProfileType.toLowerCase() !== riskAppetite.toLowerCase();

    return { isMMFund, switchToWholeSaleFund, hasDifferentRiskType };
  }

  toggleAlert() {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  toggleDisclaimer() {
    this.setState((prevState) => ({
      disclaimerOpen: !prevState.disclaimerOpen,
    }));
  }

  toggleMMFundModal() {
    this.setState((prevState) => ({
      MMFundModalOpen: !prevState.MMFundModalOpen,
    }));
  }

  handleSubmitModal() {
    this.toggleMMFundModal();
    const { hasDifferentRiskType, switchToWholeSaleFund } = this.getSelectedFundStatus();
    if (switchToWholeSaleFund) {
      this.props.selectedWholeSaleFund(switchToWholeSaleFund, this.state.selectedFund);
      return;
    } else {
      this.props.handleWholeSaleDisclainer(false);
    }
    if (!switchToWholeSaleFund && hasDifferentRiskType) {
      this.setState({
        open: true,
        riskProfileType: this.state.selectedFund.riskProfileType,
      });
    } else this.confirmSelectFund();
  }

  select(model) {
    const { fundsToSelectToSwitch, data } = this.props;
    const selectedFund = fundsToSelectToSwitch.filter((d) => d.fundcode === model);
    const { isMMFund, switchToWholeSaleFund, hasDifferentRiskType } = this.getSelectedFundStatus(selectedFund[0]);
    const hasKwspMMFund = isMMFund && data.accountType === 'KW';

    if (hasKwspMMFund) {
      this.setState({
        MMFundModalOpen: true,
      });
    }
    if (!hasKwspMMFund && switchToWholeSaleFund) {
      this.props.selectedWholeSaleFund(switchToWholeSaleFund, selectedFund);
    } else {
      this.props.handleWholeSaleDisclainer(false);
    }
    if (!hasKwspMMFund && hasDifferentRiskType) {
      this.setState({
        open: true,
        riskProfileType: selectedFund.riskProfileType,
        selectedFund: selectedFund[0],
      });
    }
    this.setState(
      {
        selectedFund: selectedFund[0],
        riskProfileType: selectedFund[0].riskProfileType,
      },
      () => {
        if (!switchToWholeSaleFund && !isMMFund && !hasDifferentRiskType) {
          this.confirmSelectFund();
        }
      },
    );
  }

  confirmSelectFund() {
    const { data, handleSwitchToChange } = this.props;
    const { selectedFund } = this.state;
    if (this.state.open) {
      this.setState({
        open: false,
      });
    }
    handleSwitchToChange(data, selectedFund.fundcode, 0, 'fundToSwitchTo', selectedFund);
  }

  /* eslint-disable react/jsx-closing-bracket-location, no-shadow */
  get content() {
    const { data, handleSwitchToChange, toggleFullSwitch, fundsToSelectToSwitch, error } = this.props;

    return data.switchToInfo.map((d, i) => {
      let errorObj;
      if (typeof error === 'string') {
        errorObj = error;
      } else {
        errorObj = Object.keys(error).length > 0 ? error : '';
      }
      let isDisabled = false;
      const disabledStyle = {
        opacity: '0.7',
        cursor: 'not-allowed',
      };
      if (
        data.rspStatus === rspStatuses.pending ||
        data.rspStatus === rspStatuses.inProgress ||
        data.rspStatus === rspStatuses.editPending ||
        data.rspStatus === rspStatuses.editInProgress
      ) {
        isDisabled = true;
      }

      const getOptions = () => {
        const options = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const item of fundsToSelectToSwitch) {
          if (!isEmpty(item)) {
            if (item.id !== data.investmentProductId && this.checkSelectedAccountType(data.accountType, item, data.fund)) {
              options.push({
                value: item.fundcode,
                label: `${item.fundcode} ${item.name}`,
              });
            }
          }
        }

        const sortedOptions = options.sort((a, b) => a.value - b.value);

        return sortedOptions;
      };

      return (
        <FundToSwitchInnerContainer key={`switch-${i + 1}`} container spacing={8}>
          <Grid item>
            <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
              AVAIL. UNITS
            </Text>
            <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" style={{ paddingLeft: '2px' }}>
              <NumberFormat
                value={data.availableRedeemSwitchUnits}
                displayType={'text'}
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </Grid>
          <Grid item style={{ width: '220px' }}>
            <Wrapper>
              <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                NO. OF UNITS TO SWITCH OUT
              </Text>
              <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                <StyledNumberFormat
                  allowNegative={false}
                  value={d.amountToSwitch}
                  thousandSeparator
                  suffix={'  units'}
                  onValueChange={(values) => {
                    const { value } = values;
                    handleSwitchToChange(data, value, i, 'amountToSwitch');
                  }}
                  fixedDecimalScale
                  decimalScale={2}
                  disabled={data.FullIndicator}
                  autoComplete="off"
                />
              </Text>
              {d.errorMessage && (
                <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                  {d.errorMessage}
                </Text>
              )}
              {errorObj && this.renderErrorMessage(errorObj)}
            </Wrapper>
            <Text size="10px" weight="bold" lineHeight="1.25" align="left">
              <Checkbox
                checked={data.FullIndicator}
                value
                onChange={() => toggleFullSwitch(data, i, 'amountToSwitch')}
                disabled={isDisabled}
                style={isDisabled ? disabledStyle : {}}
              />{' '}
              Full Switch
            </Text>
            {data.FullIndicator && (
              <Text style={{ paddingLeft: '14px' }} color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                Disclaimer: Total units switch may differ with estimated value subject to change in daily market price
              </Text>
            )}
          </Grid>
          <Grid item style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <Img src={RightArrowIcon} alt="Right Arrow" />
          </Grid>
          <Grid item style={{ width: '400px' }}>
            <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
              I WANT TO SWITCH TO
            </Text>
            {/* <StyledSelect
              value={d.fundToSwitchTo}
              onChange={(e) => {
                this.select(e.target.value, i);
                // const selectedFund = this.getSelectedFund(e.target.value);
                // handleSwitchToChange(data, e.target.value, i, 'fundToSwitchTo', selectedFund);
              }}>
              {fundsToSelectToSwitch.map((d, index) =>
                this.renderMenu(d, index, data.investmentProductId, data.accountType, data.fund),
              )}
            </StyledSelect> */}

            <CustomSelect options={getOptions()} onChange={(value) => this.select(value, i)} />
          </Grid>
          <Grid item>
            <DownloadWrapper>
              <DownloadDropdown data={data.fund} allFunds={fundsToSelectToSwitch} switchFundInfo={d.fundToSwitchTo} />
            </DownloadWrapper>
          </Grid>
        </FundToSwitchInnerContainer>
      );
    });
  }
  /* eslint-enable */
  checkSelectedAccountType(accountType, item) {
    // since user only has 1 KW account, we retrieve the flag directly from account selector
    const { kwspIslamicORConventionalFlag } = this.props;

    if (accountType === 'CS') {
      return true;
    } else if (accountType === 'KW' && (item.kwStatus === 'S' || item.kwStatus === 'C')) {
      return false;
    } else if (
      accountType === 'KW' &&
      kwspIslamicORConventionalFlag === 'C' &&
      (item.kwspType === 'C' || item.kwspType === 'I')
    ) {
      return true;
    } else if (accountType === 'KW' && kwspIslamicORConventionalFlag === 'I' && item.kwspType === 'I') {
      return true;
    }

    return false;
  }

  toggleWholeSaleModal(closeModal) {
    const { data } = this.props;
    if (closeModal) {
      this.props.handleClose();
      const { hasDifferentRiskType } = this.getSelectedFundStatus();
      if (hasDifferentRiskType) {
        this.setState({
          open: true,
          riskProfileType: this.state.selectedFund.riskProfileType,
        });
      } else this.props.handleContinue(this.state.selectedFund, data);
    } else {
      this.props.handleClose();
    }
  }

  renderErrorMessage(error) {
    const { data } = this.props;
    const fundCode = data.fund.fundcode;
    const errorMessage = typeof error === 'string' ? error : error[fundCode];

    return (
      <Text color={Color.C_RED} size="11px" lineHeight="1.35" align="left">
        {errorMessage}
      </Text>
    );
  }

  renderMenu(item, i, investmentProductId, accountType, fund) {
    if (!isEmpty(item)) {
      if (item.id !== investmentProductId && this.checkSelectedAccountType(accountType, item, fund)) {
        return (
          <MenuItem key={`menu-${i + 1}`} value={item.fundcode}>
            <AssetClassLabel>{item.assetclass}</AssetClassLabel>
            {item.fundcode} &nbsp; {item.name}
          </MenuItem>
        );
      }
    }

    return null;
  }

  render() {
    const { riskProfileType, open, MMFundModalOpen } = this.state;
    const { index, data, riskAppetite } = this.props;
    const value = index % 2 === 0 ? 'even' : 'odd';
    return (
      <FundToSwitchContainer order={value} container>
        {this.props.switchToWholeSaleFund && (
          <WholeSaleWarningModal
            open
            zIndex={'1500'}
            handleClose={() => this.toggleWholeSaleModal(false)}
            handleContinue={() => this.toggleWholeSaleModal(true)}
          />
        )}
        <Dialog
          open={open}
          closeHandler={this.toggleAlert}
          maxWidth="sm"
          content={
            <Alert
              riskAppetite={riskAppetite}
              riskProfileType={
                riskProfileType && riskProfileType.toUpperCase() === 'NA' ? 'Money Market' : riskProfileType || '-'
              }
              submit={this.confirmSelectFund}
              back={this.toggleAlert}
              disclaimerOpen={this.state.disclaimerOpen}
              disclaimerHandler={this.toggleDisclaimer}
            />
          }
        />
        <Grid item xs={12}>
          <Text size="10px" color={Color.C_GRAY} opacity="0.4" align="left">
            SWITCHING OUT FROM
          </Text>
          <Text size="14px" color={Color.C_GRAY} weight="bold" align="left">
            {data.fund.fundcode} &nbsp; {data.fund.name}
            <div style={{ display: 'inline', marginLeft: 10 }}>
              <span style={{ fontWeight: 'bolder', fontSize: '14px', verticalAlign: 'unset' }}>
                <img src={data.accountType === 'CS' ? CashSchemeIcon : KWSPSchemeIcon} alt="Account type" width="17px" />{' '}
                {`${data.partnerAccountNo}`}
              </span>
            </div>
          </Text>
        </Grid>
        <Grid item xs={12}>
          {this.content}
        </Grid>

        {/* Popup warning if the selected fund is Money Market */}
        {MMFundModalOpen && (
          <MMFundWarningModal
            open
            zIndex={'1500'}
            handleClose={() => this.toggleMMFundModal()}
            handleContinue={() => this.handleSubmitModal()}
          />
        )}
      </FundToSwitchContainer>
    );
  }
}

FundsToSwitch.propTypes = {
  data: PropTypes.object,
  handleSwitchToChange: PropTypes.func,
  toggleFullSwitch: PropTypes.func,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fundsToSelectToSwitch: PropTypes.array,
  error: PropTypes.any,
  riskAppetite: PropTypes.string,
  kwspIslamicORConventionalFlag: PropTypes.string,
  selectedWholeSaleFund: PropTypes.func,
  handleWholeSaleDisclainer: PropTypes.func,
  handleContinue: PropTypes.func,
  handleClose: PropTypes.func,
  switchToWholeSaleFund: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  kwspIslamicORConventionalFlag: makeSelectKwspIslamicORConventionalFlag(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(FundsToSwitch);
