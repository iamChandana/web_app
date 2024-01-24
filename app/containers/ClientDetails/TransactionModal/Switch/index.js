/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-restricted-syntax */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import _isEmpty from 'lodash/isEmpty';
import Button from 'components/Button';
import Text from 'components/Text';
import FundToSwitch from './FundToSwitch';
import Disclaimer from '../Disclaimer';
import CWADisclaimer from '../CWADisclaimer';
import Modal from '../Modal';
import IconWarning from '../../images/icon-warning.png';
import rspStatuses from '../rspStatuses';
import WholeSaleDisclaimer from '../WholeSaleDisclaimer';
import { findJointAccountHolderNames, getSelectedFundAccountDetails } from '../../utils/getAccountHolderType';
import SwitchVerificationConfirmationModal from '../VerificationOptionModal/SwitchVerificationConfirmationModal';

const StyleButton = styled(Button)`
  margin-top: 16px;
`;

class Switch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      acknowledge: false,
      cwaAcknowledge: false,
      isCancelRspModalOpen: false,
      isSwitchVerificationConfirmationModalOpen: false,
    };

    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleCancellationRspModal = this.toggleCancellationRspModal.bind(this);
    this.handleCancelRSP = this.handleCancelRSP.bind(this);
    this.selectedWholeSaleFund = this.selectedWholeSaleFund.bind(this);
    this.handleWholeSaleClose = this.handleWholeSaleClose.bind(this);
    this.handleWholeSaleContinue = this.handleWholeSaleContinue.bind(this);
    this.handleWholeSaleDisclainer = this.handleWholeSaleDisclainer.bind(this);
    this.handleOpenSwitchVerificationConfirmationModal = this.handleOpenSwitchVerificationConfirmationModal.bind(this);
    this.handleCloseSwitchVerificationConfirmationModal = this.handleCloseSwitchVerificationConfirmationModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      const rspEnrolledFunds = [];
      if (this.props.data) {
        this.props.data.forEach((fund) => {
          if (fund.rspStatus && fund.FullIndicator) {
            rspEnrolledFunds.push({ fundName: fund.fund.name, rspStatus: fund.rspStatus });
          }
        });
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ rspEnrolledFunds });
      }
    }

    if (this.props.open !== prevProps.open && !this.props.open) {
      this.setState({ isSwitchVerificationConfirmationModalOpen: false });
    }
  }

  toggleCancellationRspModal() {
    this.setState((prevState) => ({
      isCancelRspModalOpen: !prevState.isCancelRspModalOpen,
    }));
  }

  closeModal() {
    this.setState(
      {
        newAccount: false,
        acknowledge: false,
        cwaAcknowledge: false,
      },
      () => {
        this.props.handleClose();
      },
    );
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
    if (
      this.state.rspEnrolledFunds &&
      this.state.rspEnrolledFunds.filter(
        (fundItem) => fundItem.rspStatus === rspStatuses.completed || fundItem.rspStatus === rspStatuses.inProgress,
      ).length
    ) {
      this.toggleCancellationRspModal();
    } else {
      this.setState({ acknowledge: false, cwaAcknowledge: false }, () => {
        this.props.handleDisclaimerChange();
      });
      this.handleOpenSwitchVerificationConfirmationModal();
    }
  }

  handleCancelRSP() {
    this.setState({ acknowledge: false, cwaAcknowledge: false, isCancelRspModalOpen: false });

    this.handleOpenSwitchVerificationConfirmationModal();
  }

  filterCompletedRspFunds(rspEnrolledFunds) {
    return rspEnrolledFunds
      .filter((fundItem) => fundItem.rspStatus === rspStatuses.completed || fundItem.rspStatus === rspStatuses.inProgress)
      .map((fundItem) => fundItem.fundName);
  }

  selectedWholeSaleFund(switchToWholeSaleFund, selectedFund) {
    this.setState({
      switchToWholeSaleFund,
      selectedFund,
    });
  }

  handleWholeSaleClose() {
    this.setState({
      switchToWholeSaleFund: false,
    });
  }

  handleWholeSaleContinue(selectedFund, data) {
    this.setState(
      {
        switchToWholeSaleFund: false,
        showWholeSaleDisclaimer: true,
      },
      () => {
        this.props.handleSwitchToChange(data, selectedFund.fundcode, 0, 'fundToSwitchTo', selectedFund);
      },
    );
  }

  handleWholeSaleDisclainer(value) {
    this.setState({
      showWholeSaleDisclaimer: value,
    });
  }

  handleOpenSwitchVerificationConfirmationModal() {
    this.setState({
      isSwitchVerificationConfirmationModalOpen: true,
    });
  }

  handleCloseSwitchVerificationConfirmationModal() {
    this.setState({
      isSwitchVerificationConfirmationModalOpen: false,
    });
  }

  render() {
    const {
      open,
      handleSelectFundChange,
      data,
      submitSwitchFund,
      error,
      handleSwitchToChange,
      arrayCountToSwitch,
      totalSection,
      allFunds,
      errorMessage,
      toggleFullSwitch,
      riskAppetite,
      clientDetails,
    } = this.props;

    let pdaFunds = allFunds.filter((fund) => fund.description !== 'NonPdaFund');
    const isKWSP = data && data[0].accountType === 'KW';
    if (isKWSP) {
      pdaFunds = pdaFunds.filter((fund) => fund.kwspType);
    }
    if (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    let allFieldEntered = true;
    for (const item of data) {
      if (!item.FullIndicator) {
        let totalUnits = 0;
        if (item.switchToInfo) {
          for (const switchTo of item.switchToInfo) {
            const { amountToSwitch, fundToSwitchTo } = switchTo;

            totalUnits += parseFloat(amountToSwitch);
            if (
              amountToSwitch > item.units ||
              amountToSwitch < item.fund.minRedemptionUnits ||
              !fundToSwitchTo ||
              (totalUnits > item.units - item.fund.minHoldingUnits && totalUnits < item.units)
            ) {
              allFieldEntered = false;
              break;
            }
          }
        }
        if (totalUnits > item.units) {
          allFieldEntered = false;
        }
      }

      if (item.switchToInfo) {
        for (const switchTo of item.switchToInfo) {
          const { fundToSwitchTo } = switchTo;

          if (!fundToSwitchTo || fundToSwitchTo === '') {
            allFieldEntered = false;
            break;
          }
        }
      }
      if (!allFieldEntered) {
        break;
      }
    }

    return (
      <Modal
        open={open}
        handleClose={this.handleClose}
        title="Switch"
        subtitle="Submission cutoff time is 4:00 PM. Any successful submission after 4:00 PM or on a non-business day, <div>orders will be processed on the next business day as per next business day NAV.</div>">
        <Grid container direction="column" justify="center" alignItems="center">
          {data.map((item, i) => {
            let filteredError = '';
            const fundCode = item.fund.fundcode;
            if (typeof errorMessage === 'string') {
              filteredError = errorMessage;
            } else if (!_isEmpty(errorMessage) && Array.isArray(errorMessage) && errorMessage.length > 0) {
              for (let j = 0; j < errorMessage.length; j += 1) {
                const currentErrMessageObj = errorMessage[j][fundCode];
                if (currentErrMessageObj) {
                  filteredError = {
                    ...filteredError,
                    [fundCode]: currentErrMessageObj ? currentErrMessageObj[0].FrontEndErrorMessage : '',
                  };
                }
              }
            }
            return (
              <FundToSwitch
                key={item.pid}
                data={item}
                fundsToSelectToSwitch={_isEmpty(pdaFunds) ? [] : pdaFunds}
                handleSelectFundChange={handleSelectFundChange}
                handleSwitchToChange={handleSwitchToChange}
                arrayCountToSwitch={arrayCountToSwitch}
                totalSection={totalSection}
                error={filteredError}
                index={i}
                toggleFullSwitch={toggleFullSwitch}
                riskAppetite={riskAppetite}
                selectedWholeSaleFund={this.selectedWholeSaleFund}
                switchToWholeSaleFund={this.state.switchToWholeSaleFund}
                handleClose={this.handleWholeSaleClose}
                handleContinue={this.handleWholeSaleContinue}
                handleWholeSaleDisclainer={this.handleWholeSaleDisclainer}
              />
            );
          })}
          <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} />
          <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} />
          {this.state.showWholeSaleDisclaimer && (
            <WholeSaleDisclaimer
              secondaryHolderNameIfAvailable={findJointAccountHolderNames(
                getSelectedFundAccountDetails(data[0].partnerAccountNo, clientDetails),
              )}
              acknowledge={this.props.wholeSaleAcknowledge}
              onChange={this.props.handleDisclaimerChange}
              fullName={this.props.fullName}
            />
          )}
          <Grid item xs={12}>
            <Grid container direction="row" justify="center" alignItems="center">
              <StyleButton
                primary
                onClick={this.handleSubmit}
                disabled={
                  !this.state.acknowledge ||
                  !this.state.cwaAcknowledge ||
                  (this.state.showWholeSaleDisclaimer && !this.props.wholeSaleAcknowledge) ||
                  !allFieldEntered
                }>
                Switch
              </StyleButton>
            </Grid>
          </Grid>
        </Grid>
        {this.state.isSwitchVerificationConfirmationModalOpen ? (
          <SwitchVerificationConfirmationModal
            open={this.state.isSwitchVerificationConfirmationModalOpen}
            handleClose={this.handleCloseSwitchVerificationConfirmationModal}
            handleSwitchFund={submitSwitchFund}
          />
        ) : null}

        {/*  Confirmation modal for cancellation of RSP */}
        <Modal width={300} height={600} open={this.state.isCancelRspModalOpen} handleClose={this.toggleCancellationRspModal}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12} style={{ paddingTop: '0px', paddingBottom: '15px' }}>
              <img src={IconWarning} alt="warning" />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '0px', paddingBottom: '20px' }}>
              <Text align="center" size="14px">
                You are about to do a Full Switch on{' '}
                <span style={{ fontWeight: 'bolder' }}>
                  {this.state.rspEnrolledFunds && this.filterCompletedRspFunds(this.state.rspEnrolledFunds).join(', ')}.
                </span>
                Proceeding with the switch will result to the cancellation of the RSP.
              </Text>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '0px', paddingBottom: '20px' }}>
              <Text align="center" size="14px" weight="bolder">
                Would you like to proceed?
              </Text>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
            <Grid item xs={6}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={this.toggleCancellationRspModal} primary width="80%">
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={() => this.handleCancelRSP()} width="80%">
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
      </Modal>
    );
  }
}

Switch.propTypes = {
  data: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDisclaimerChange: PropTypes.func.isRequired,
  handleSwitchToChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleSelectFundChange: PropTypes.func,
  submitSwitchFund: PropTypes.func,
  error: PropTypes.object,
  arrayCountToSwitch: PropTypes.number,
  totalSection: PropTypes.array,
  allFunds: PropTypes.array,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  toggleFullSwitch: PropTypes.func,
  riskAppetite: PropTypes.string,
  clientDetails: PropTypes.object,
  wholeSaleAcknowledge: PropTypes.bool,
  fullName: PropTypes.string,
};

export default Switch;
