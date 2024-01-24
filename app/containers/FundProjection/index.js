/**
 *
 * FundProjection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import { createStructuredSelector } from 'reselect';
import injectSaga from 'utils/injectSaga';
import Carousel from 'components/Carousel';
import { GridPadded } from 'components/Grid';
import saga from 'containers/FundProjection/saga';
import NavPillTab from 'components/NavPillTab';
import _isEmpty from 'lodash/isEmpty';
import { colors } from 'utils/styles';
import { InvestorKnowledgeUrl } from 'utils/urls';
import LoadingIndicator from 'components/LoadingIndicator';
import _has from 'lodash/has';

import KnowledgeIcon from './images/knowledge-ic.svg';
import Data from './CarouselData';
import InvestmentForm from './InvestmentForm';
import GraphView from './GraphView';
import { updateFundPlan, fundProjDataRequested, getTalkingPoints, getHistoryData } from './actions';
import {
  makeSelectFundDetails,
  makeSelectProjectionData,
  makeSelectTalkingPoints,
  makeSelectFetchingHistoryData,
  makeSelectHistoryData,
} from './selectors';
import { Button } from './Atoms';
import styled from 'styled-components';
import Text from 'components/Text';
import ReactTooltip from 'react-tooltip';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000 !important;
  padding: 10px !important;
  opacity: 0.5 !important;
`;

export class FundProjection extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      refetchEnabled: true,
      selectedTab: 1,
    };

    this.startInvesting = this.startInvesting.bind(this);
    this.handleRefetchProjection = this.handleRefetchProjection.bind(this);
    this.handleProjectionRefetch = this.handleProjectionRefetch.bind(this);
    this.fetchProjection = this.fetchProjection.bind(this);
    this.handleFetchHistoryData = this.handleFetchHistoryData.bind(this);
    this.setTab = this.setTab.bind(this);
  }

  componentDidMount() {
    this.fetchProjection({ onRefetch: false });
    this.props.getTalkingPoints(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProjectionRefetch(nextProps);

    if (this.props.fundDetails.goalYears !== nextProps.fundDetails.goalYears && this.state.selectedTab === 2) {
      this.handleFetchHistoryData(nextProps.fundDetails.goalYears);
    }
  }

  setTab(data) {
    this.setState(
      {
        selectedTab: data,
      },
      () => {
        if (data === 2) {
          this.handleFetchHistoryData();
        }
      },
    );
  }

  handleFetchHistoryData(duration) {
    if (_has(this.props.fundDetails.fullDetails, 'ric') && _has(this.props.fundDetails.fullDetails, 'lipperId')) {
      const { ric, lipperId } = this.props.fundDetails.fullDetails;

      const goalYears = duration || this.props.fundDetails.goalYears;
      this.props.getHistoryData({ ric, lipperId, goalYears });
    }
  }

  handleProjectionRefetch(nextProps) {
    const { projectionData: prevProjectionData } = this.props;
    const { projectionData } = nextProps;
    const { loadingProjectionData: prevLoading } = prevProjectionData;
    const { loadingProjectionData: loading } = projectionData;

    if (prevLoading !== loading) {
      this.setState({ refetchEnabled: true });
    }
  }

  startInvesting() {
    this.props.history.push('/onboarding');
  }

  handleRefetchProjection() {
    if (this.state.selectedTab === 2) return false;
    const { refetchEnabled } = this.state;

    if (refetchEnabled) {
      this.setState({ refetchEnabled: false }, () => {
        setTimeout(() => {
          this.fetchProjection({ onRefetch: true });
        }, 1000);
      });
    }
  }

  fetchProjection({ onRefetch }) {
    const { fundDetails, handleFetchProjData } = this.props;
    handleFetchProjData({ ...fundDetails, onRefetch });
  }

  render() {
    const {
      fundDetails,
      projectionData,
      talkingPoints,
      fetchingHistoryData,
      historyData,
      match: {
        params: { id },
      },
    } = this.props;
    const { selectedTab } = this.state;
    return (
      <React.Fragment>
        <NavPillTab />
        <Grid container wrap>
          <Grid item xs={12}>
            {!_isEmpty(talkingPoints.data) && !talkingPoints.loading ? (
              <GridPadded container alignItems="center" padding="10px" bgcolor={colors.bgGray}>
                <Grid item xs={12} md={9}>
                  <Carousel showNavigation settings={{ height: '100px' }} content={Data(talkingPoints.data)} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button onClick={() => window.open(InvestorKnowledgeUrl, '_blank')}>
                    <img src={KnowledgeIcon} alt="knowledge-ic" width="16" height="16" /> Investor Knowledge
                  </Button>                 
                </Grid>
              </GridPadded>
            ) : (
              <LoadingIndicator />
            )}
          </Grid>
          <GridPadded item lg={5} md={12} xs={12}>
            <InvestmentForm
              fundDetails={fundDetails}
              onPlanChange={this.props.handleUpdatePlan}
              onRefetchProjection={this.handleRefetchProjection}
              loading={projectionData.loadingFundData}
              startInvesting={this.startInvesting}
            />
          </GridPadded>
          <GridPadded item lg={7} md={12} xs={12}>
            <GraphView
              projectionData={projectionData}
              historyData={historyData}
              fundId={id}
              selectedTab={selectedTab}
              setTab={this.setTab}
              fetchingHistoryData={fetchingHistoryData}
            />
          </GridPadded>
        </Grid>
      </React.Fragment>
    );
  }
}

FundProjection.propTypes = {
  history: PropTypes.object.isRequired,
  fundDetails: PropTypes.object.isRequired,
  handleUpdatePlan: PropTypes.func.isRequired,
  handleFetchProjData: PropTypes.func.isRequired,
  projectionData: PropTypes.object.isRequired,
  getTalkingPoints: PropTypes.func,
  match: PropTypes.object,
  talkingPoints: PropTypes.object,
  match: PropTypes.object,
  historyData: PropTypes.object,
  getHistoryData: PropTypes.func,
  fetchingHistoryData: PropTypes.bool,
};

const mapStateToProps = (state, props) => {
  const fundId = props.match.params.id;

  return createStructuredSelector({
    fundDetails: makeSelectFundDetails(fundId),
    projectionData: makeSelectProjectionData(),
    talkingPoints: makeSelectTalkingPoints(),
    fetchingHistoryData: makeSelectFetchingHistoryData(),
    historyData: makeSelectHistoryData(),
  });
};

function mapDispatchToProps(dispatch) {
  return {
    handleUpdatePlan: (payload) => dispatch(updateFundPlan(payload)),
    handleFetchProjData: (payload) => dispatch(fundProjDataRequested(payload)),
    getTalkingPoints: (payload) => dispatch(getTalkingPoints(payload)),
    getHistoryData: (payload) => dispatch(getHistoryData(payload)),
  };
}

const withSaga = injectSaga({ key: 'fundProjection', saga });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withSaga,
  withConnect,
)(FundProjection);
