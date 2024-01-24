/**
 *
 * Dashboard
 *
 */

import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import { createStructuredSelector } from 'reselect';
import Grid from 'material-ui/Grid';
import moment from 'moment';
import { toast } from 'react-toastify';
import LoadingIndicator from 'components/LoadingIndicator';
import Color from 'utils/StylesHelper/color';
import { reset } from 'containers/OnBoarding/actions';
import { getClients } from 'containers/Clients/actions';
import { makeSelectClients } from 'containers/Clients/selectors';
import { makeSelectGraphData } from '../FundDetails/selectors';
import Button from 'components/Button';
import Modal from 'components/Modal';
import CardButton from 'components/CardButton';
import Text from 'components/Text';
import SearchAutoComplete from 'components/SearchAutoComplete';
import {
  closeOtpModal,
  executeAfterChangePasswordOtpVerifySuccess,
  resetChangePasswordState,
} from 'containers/LoginPage/actions';
import {
  selectShowOtpModal,
  selectIsPasswordChangedSuccess,
  selectError,
  selectMessage,
  selectUserInfo,
} from 'containers/LoginPage/selectors';
import { getBBGData, getGraphData } from './actions';
import { selectDashboard } from './selectors';
import ContentWrapper from './ContentWrapper';
import BloombergGraph from './Graph';
import NewClient from './images/icon_plus_user.png';
import BarChart from './images/icon_graph.png';
import InvestorKnowldege from './images/icon_light_bulb.png';
import StarClub from './images/starclub-logo-01.jpg';
import _isEmpty from 'lodash/isEmpty';
import 'containers/App/style/react-confirm-alert.css';
import { logout } from 'containers/HomePage/actions';
import { InvestorKnowledgeUrl } from 'utils/urls';

const ModalContentWrapper = styled.div`
  min-height: 200px;
`;

export class Dashboard extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.redirect = this.redirect.bind(this);
    this.redirectToUrl = this.redirectToUrl.bind(this);
    this.clearChangePasswordState = this.clearChangePasswordState.bind(this);
    this.state = {
      marketId: '.KLSE',
      periodId: 1,
      openDialog: false,
      message: '',
      toastId: null,
      expired: 0,
    };
  }

  toastId = null;
  confirmAlertId = null;

  notify = (message, status) => {
    if (!toast.isActive(this.toastId)) {
      if (status === 'error') {
        this.toastId = toast.error(Parser(message), {
          position: toast.POSITION.TOP_RIGHT,
          onClose: () => {
            this.clearChangePasswordState();
          },
        });
      }

      if (status === 'success') {
        this.toastId = toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
          className: {},
          onClose: () => {
            this.clearChangePasswordState();
          },
        });
      }
    }
  };

  clearChangePasswordState() {
    this.props.resetChangePasswordState();
  }

  componentDidUpdate(prevProps) {
    const { graphData } = this.props;
    // console.log('connecting to socket ...', this.props);
    if (prevProps.graphData !== graphData) {
      this.notify(graphData, 'error');
    }
  }

  componentWillMount() {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    this.props.reset(); // reset onboarbing
    // this.props.getClients({allClient: false});
    this.props.getGraphData(this.state);
    // this.props.getBBGData(this.state);

    if (!this.props.location || !this.props.location.search) {
      return;
    }

    if (this.props.showOtpModal) {
      this.props.closeOtpModal();
    }

    const location = this.props.location;

    if (!location || !location.search) {
      return;
    }

    if (location.pathname.indexOf('change-password/otpy') > 0) {
      const urlParams = location.search.split('?');
      const queryParam = urlParams[1].split('=')[1];
      this.props.executeAfterChangePasswordOtpVerifySuccess(queryParam);
      window.history.replaceState(null, 'Dashboard', '/dashboard');
    }

    if (location.pathname.indexOf('change-password/otpn') > 0) {
      toast.error('Failed to change password. Please try again later', {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
        onClose: () => {
          console.log('isPasswordChangedSuccess failed toast onClose');
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname.indexOf('change-password/otpy') > 0) {
      if (!nextProps.isPasswordChangedSuccess && nextProps.error) {
        this.notify(nextProps.error.message, 'error');
        this.clearChangePasswordState();
      }

      if (nextProps.isPasswordChangedSuccess && nextProps.message) {
        // this.notify(nextProps.message, 'success');
        // open confirm dialog
        this.setState({
          openDialog: true,
        });
        this.clearChangePasswordState();
      }
    }
  }

  redirect(url) {
    ReactGA.event({
      category: 'User',
      action: `Redirect to ${url}`,
    });
    this.props.history.replace(url);
  }

  redirectToUrl(url) {
    ReactGA.event({
      category: 'User',
      action: `Redirect to ${url}`,
    });
    window.open(url, '_blank');
  }

  handleGetGraphData = (e) => {
    this.setState(
      {
        periodId: parseInt(e.target.id, 10),
      },
      () => {
        this.props.getGraphData(this.state);
      },
    );
  };

  handleSelect = (e) => {
    this.setState(
      {
        marketId: e.target.value,
      },
      () => {
        // this.props.getBBGData(this.state);
        this.props.getGraphData(this.state);
      },
    );
  };

  handleCloseModal = () => {
    this.setState({
      openDialog: false,
    });
  };

  isSearchNumberBelongsToClientId(searchNum) {
    return this.props.clients.data.filter((client) => client.customerId === Number(searchNum)).length;
  }

  renderGraph() {
    const { dashboard } = this.props;
    if (dashboard.loading) {
      return <LoadingIndicator />;
    }
    return (
      <BloombergGraph
        handler={this.handleGetGraphData}
        selectHandler={this.handleSelect}
        graphData={dashboard.graphData}
        {...this.state}
      />
    );

    /* } else if (!dashboard.loading && dashboard.graphData && dashboard.graphData.timeSeriesList && dashboard.graphData.timeSeriesList.length < 1) {
      return (
        <p style={{padding:'50px'}}>
          <Text>No Graph Data Found</Text>
        </p>
      );
    } else if (!dashboard.loading && dashboard.graphData && dashboard.graphData.timeSeriesList && dashboard.graphData.timeSeriesList.length > 0) {
    } */
  }

  render() {
    // console.log(this.state.openDialog, 'this.state.openDialog');
    // console.log(this.props.isPasswordChangedSuccess, 'this.props.isPasswordChangedSuccess');
    // console.log(this.props.error, 'this.props.error');
    return (
      <React.Fragment>
        <Modal
          width={700}
          height={350}
          open={this.state.openDialog}
          handleClose={this.handleCloseModal}
          title="Change My Password"
        >
          <ModalContentWrapper>
            <Text align="left">Your password has been successfully changed at {moment().format(' h:mm A, D MMMM YYYY')}</Text>
          </ModalContentWrapper>
          <div>
            <Button onClick={this.handleCloseModal} primary width="100%">
              Continue
            </Button>
          </div>
        </Modal>

        <Grid container direction="row" justify="flex-start">
          <Grid item xs={12} lg={6} md={6} style={{ marginBottom: '55px' }}>
            <Grid container direction="column" justify="center" alignItems="center">
              <ContentWrapper item>
                <Text className="--search-below" color={Color.C_GRAY} weight="bold" align="left">
                  Search Client
                </Text>
                {/* <Search width=""/> */}
                <SearchAutoComplete
                  placeholder="Search Existing Client Mobile No. / ID No. / Email Address / UTR Account no."
                  // data={this.props.clients}
                  data={[]}
                  handleSearch={(data) => {
                    // check if data if client id
                    /* if (data && !isNaN(data) && this.isSearchNumberBelongsToClientId(data) > 0) {
                      this.props.history.replace(`/clients/${ data }/funds`);
                    } else {
                      if (data) {
                        this.props.history.replace(`/clients/${data}`);
                      }
                    } */
                    if (data) {
                      this.props.history.replace(`/clients/${data}`);
                    }
                  }}
                  type="dashboard"
                />
              </ContentWrapper>
              <ContentWrapper item xs={12}>
                <Text color="#1d1d26" weight="bold" align="left">
                  My Actions
                </Text>
                <CardButton
                  onClick={this.redirect}
                  title="Register New Client"
                  url="/onboarding/introduction"
                  icon={NewClient}
                  description="Assist a new client in selecting funds, registration and funding."
                />
                <CardButton
                  onClick={this.redirect}
                  url="/funds"
                  title="Start Planning"
                  icon={BarChart}
                  description="Demonstrate a fund's performance and forecast expected return."
                />
                <Grid container direction="row" className="row-grid" spacing={24}>
                  <Grid item xs={6}>
                    <CardButton
                      className="row-grid first"
                      title="Investor Knowledge"
                      icon={InvestorKnowldege}
                      onClick={() => {
                        ReactGA.event({
                          category: 'User',
                          action: `Redirect to ${InvestorKnowledgeUrl}`,
                        });
                        window.open(InvestorKnowledgeUrl);
                      }}
                      isShortCard
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CardButton
                      className="row-grid second"
                      icon={StarClub}
                      onClick={() => this.redirectToUrl('https://www.principal.com.my/en/starclub')}
                      style={{ paddingTop: 15 }}
                    />
                  </Grid>
                </Grid>
              </ContentWrapper>
            </Grid>
          </Grid>

          <Grid container item xs={12} lg={6} md={6} style={{ marginTop: '5px' }}>
            {this.renderGraph()}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  history: PropTypes.object,
  dashboard: PropTypes.object,
  getBBGData: PropTypes.func,
  closeOtpModal: PropTypes.func,
  showOtpModal: PropTypes.bool,
  userInfo: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  dashboard: selectDashboard(),
  showOtpModal: selectShowOtpModal(),
  clients: makeSelectClients(),
  isPasswordChangedSuccess: selectIsPasswordChangedSuccess(),
  error: selectError(),
  message: selectMessage(),
  userInfo: selectUserInfo(),
  graphData: makeSelectGraphData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getBBGData: (payload) => dispatch(getBBGData(payload)),
    executeAfterChangePasswordOtpVerifySuccess: (payload) => dispatch(executeAfterChangePasswordOtpVerifySuccess(payload)),
    closeOtpModal: () => dispatch(closeOtpModal()),
    reset: () => dispatch(reset()),
    getClients: (payload) => dispatch(getClients(payload)),
    resetChangePasswordState: () => dispatch(resetChangePasswordState()),
    getGraphData: (payload) => dispatch(getGraphData(payload)),
    logout: () => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

// const withSaga = injectSaga({ key: 'dashboard', saga });

// export default compose(withSaga, withConnect)(Dashboard);
