import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import OtpBox from 'components/OtpBox';
import { ColumnGridCenter } from 'components/GridContainer';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { isEqual, intersectionWith } from 'lodash';
import Button from 'components/Button';
import Disclaimer from 'containers/ClientDetails/TransactionModal/Disclaimer';
import CWADisclaimer from 'containers/ClientDetails/TransactionModal/CWADisclaimer';
import {
  makeSelectIsExistingClientDetails,
  makeSelectProcessing,
  makeSelectInitMultiAgentMapOtpSuccessData,
  makeSelectInitMultiAgentMapOtpErrorData,
  makeSelectisOTPCalled,
  makeSelectisIsProcessingMultiAgentMap,
  makeSelectMultiAgentMapError,
  makeSelectMultiAgentMapSuccess,
  makeSelectNotFoundPdaError,
} from '../selectors';
import { initMultiAgentMapOtp, clearMultiAgentMapOtpData, multiAgentMap } from '../actions';
import Color from 'utils/StylesHelper/color';
import ReactTooltip from 'react-tooltip';

const StyledButton = styled(Button)`
  margin: 40px 10px;
`;

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #676775 !important;
  padding: 15px !important;
  opacity: 0.85 !important;
  margin-right: 50px !important;
`;

const BoldText = styled.span`
  font-weight: bolder;
`;

class CustomerExist extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      acknowledge: false,
      cwaAcknowledge: false,
      showOtpModal: false,
      isCalled: 0,
    };

    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.next = this.next.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
  }

  processUrlParam() {
    if (!this.props.location || !this.props.location.search) {
      return;
    }
    if (this.props.location.pathname.indexOf('agentAccess/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const agentAccessToken = urlParams[1].split('=')[1];
      this.setState(
        (prevstate) => ({ isCalled: prevstate.isCalled + 1 }),
        () => {
          if (this.state.isCalled === 1) {
            this.props.multiAgentMap({
              agentAccessToken,
            });
            this.setState({ showModalForRetakeRisk: false });
          }
        },
      );
    }

    if (this.props.location.pathname.indexOf('agentAccess/otpn') > 0) {
      this.notify('Otp failed!');
    }
  }

  toastId = null;

  componentWillMount() {
    this.props.clearMultiAgentMapOtpData();
  }

  componentWillUnmount() {
    this.setState({ isCalled: 0 });
    this.props.clearMultiAgentMapOtpData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initMultiAgentMapOtpSuccessData) {
      this.setState({ showOtpModal: true });
    }

    if (nextProps.initMultiAgentMapOtpFailure && this.props.initMultiAgentMapOtpError !== nextProps.initMultiAgentMapOtpError) {
      this.notify(nextProps.initMultiAgentMapOtpError);
    }

    if (!this.props.isOTPCalled) {
      this.processUrlParam();
    }

    if (this.props.multiAgentMapSuccess) {
      const { customerId } = this.props.isExistingClientDetails;
      this.props.history.push(`/clients/${customerId}/funds`);
      toast.success('Access has been successfully completed', {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }

    if (nextProps.multiAgentMapError && this.props.multiAgentMapError !== nextProps.multiAgentMapError) {
      this.notify(nextProps.multiAgentMapError);
    }
  }

  notify = (msg) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  next() {
    this.props.history.push('/dashboard');
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

  handleCloseOtpModal() {
    this.setState({
      showOtpModal: false,
    });
    this.props.clearMultiAgentMapOtpData();
  }

  handleSubmit() {
    this.props.initMultiAgentMapOtp();
  }

  render() {
    const { processing, isProcessingMultiAgentMap, notFoundPdaError } = this.props;
    const isAccepted = this.state.acknowledge && this.state.cwaAcknowledge;

    if (this.props.isExistingClientDetails) {
      const { CSUTRACCOUNTNOS, KWUTRACCOUNTNOS, customerId, accountsWithAgentAccess } = this.props.isExistingClientDetails;
      // if (CSUTRACCOUNTNOS.length === 0) {
      //   this.props.history.push(`/onboarding/introduction/introDetailInput`);
      // }

      // converting all the elements to string.
      const cashAccountClone = CSUTRACCOUNTNOS.map((item) => String(item));
      const kwspAccountClone = KWUTRACCOUNTNOS.map((item) => String(item));
      const agentAccessCashClone = accountsWithAgentAccess.CSUTRACCOUNTNOS.map((item) => String(item));
      const agentAccessKwspClone = accountsWithAgentAccess.KWUTRACCOUNTNOS.map((item) => String(item));

      if (CSUTRACCOUNTNOS.length > 0 || KWUTRACCOUNTNOS.length > 0) {
        const cashAccountSame =
          (cashAccountClone.length === 0 && agentAccessCashClone.length === 0) ||
          intersectionWith(cashAccountClone, agentAccessCashClone, isEqual).length > 0;
        const kwspAccountSame =
          (kwspAccountClone.length === 0 && agentAccessKwspClone.length === 0) ||
          intersectionWith(kwspAccountClone, agentAccessKwspClone, isEqual).length > 0;

        // if agent's handled accounts and customer accounts of all types are the same
        // redirect to client details
        if (cashAccountSame && kwspAccountSame) {
          this.props.history.push(`/clients/${customerId}/funds`);
        }
      }
    }

    return (
      <React.Fragment>
        <LoadingOverlay show={processing || isProcessingMultiAgentMap} />
        {this.props.isExistingClientDetails && (
          <React.Fragment>
            <ColumnGridCenter>
              <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" weight="bold">
                  This Client already has an existing account under
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" style={{ marginTop: 8 }} weight="bold">
                  another Unit Trust Consultant.
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" style={{ marginTop: 16 }}>
                  By proceeding with this onboarding,{' '}
                  <BoldText>
                    {this.props.isExistingClientDetails.fullName}{' '}
                    {this.props.isExistingClientDetails.CSUTRACCOUNTNOS[0] &&
                      `(${this.props.isExistingClientDetails.CSUTRACCOUNTNOS.join(', ')} - Cash)`}{' '}
                    {this.props.isExistingClientDetails.KWUTRACCOUNTNOS.join(', ') &&
                      `(${this.props.isExistingClientDetails.KWUTRACCOUNTNOS[0]} - KWSP)`}{' '}
                    {this.props.isExistingClientDetails.KWUTRACCOUNTNOS[1] &&
                      `(${this.props.isExistingClientDetails.KWUTRACCOUNTNOS[1]} - KWSP EMIS)`}
                  </BoldText>
                  , is authorizing{' '}
                  <BoldText>{this.props.isExistingClientDetails && this.props.isExistingClientDetails.agentName}</BoldText>
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" style={{ marginTop: 8, marginBottom: 20 }}>
                  <BoldText>({this.props.isExistingClientDetails.agentUsername})</BoldText> access to their Customer Profile and
                  Account information as their new Unit Trust Consultant.
                </Text>
              </Grid>
            </ColumnGridCenter>
            <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} />
            <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} />
            <ColumnGridCenter>
              <Grid item xs={12} style={{ display: 'flex' }}>
                <StyledButton onClick={this.next} secondary style={{ marginTop: 50 }}>
                  Back
                </StyledButton>
                <StyledButton primary style={{ marginTop: 50 }} disabled={!isAccepted} onClick={this.handleSubmit}>
                  Next
                </StyledButton>
              </Grid>
            </ColumnGridCenter>

            {/* Calling OTP */}
            <OtpBox
              handleClose={this.handleCloseOtpModal}
              openModal={this.state.showOtpModal}
              url={this.props.initMultiAgentMapOtpSuccessData ? this.props.initMultiAgentMapOtpSuccessData.otpiFrameUrl : null}
              error={this.props.initMultiAgentMapOtpError}
            />
          </React.Fragment>
        )}
        {notFoundPdaError && (
          <React.Fragment>
            <ColumnGridCenter>
              <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" weight="bolder">
                  This Client already has an existing account with Principal but is
                </Text>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" weight="bolder">
                  currently not available in Principal Direct Access (PDA).
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" style={{ marginTop: 10 }}>
                  Please contact our
                  <span style={{ color: Color.C_LIGHT_BLUE, marginLeft: 3, textDecoration: 'underline' }}>
                    <a data-tip data-for="customerCare" style={{ opacity: 0.9 }}>
                      Customer Care{' '}
                    </a>
                  </span>
                  for further details.
                </Text>
                <ReactTooltip1 id="customerCare" effect="solid" place="right">
                  <Text size="14px" weight="bold" color="#fff" align="left">
                    Agency Hotline
                  </Text>
                  <Text size="12px" color="#fff" align="left">
                    03-77237261
                  </Text>
                  <Text size="12px" color="#fff" align="left">
                    Monday to Friday: 8:45 am to 5:45 pm
                  </Text>
                  <Text size="12px" weight="bold" color="#fff" align="left">
                    (except on Kuala Lumpur and national public holidays)
                  </Text>
                </ReactTooltip1>
              </Grid>
              <Grid item xs={12}>
                <StyledButton onClick={this.next} primary style={{ marginTop: 50 }}>
                  Back to Home
                </StyledButton>
              </Grid>
            </ColumnGridCenter>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  processing: makeSelectProcessing(),
  isExistingClientDetails: makeSelectIsExistingClientDetails(),
  initMultiAgentMapOtpSuccessData: makeSelectInitMultiAgentMapOtpSuccessData(),
  initMultiAgentMapOtpError: makeSelectInitMultiAgentMapOtpErrorData(),
  isOTPCalled: makeSelectisOTPCalled(),
  isProcessingMultiAgentMap: makeSelectisIsProcessingMultiAgentMap(),
  multiAgentMapSuccess: makeSelectMultiAgentMapSuccess(),
  multiAgentMapError: makeSelectMultiAgentMapError(),
  notFoundPdaError: makeSelectNotFoundPdaError(),
});

function mapDispatchToProps(dispatch) {
  return {
    initMultiAgentMapOtp: () => dispatch(initMultiAgentMapOtp()),
    clearMultiAgentMapOtpData: () => dispatch(clearMultiAgentMapOtpData()),
    multiAgentMap: (payload) => dispatch(multiAgentMap(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(CustomerExist);
