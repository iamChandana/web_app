/**
 *
 * Analytics
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ReactGA from 'react-ga';
import injectSaga from 'utils/injectSaga';
import { getGaId } from './actions';
import makeSelectAnalytics from './selectors';
import saga from './saga';

export class Analytics extends React.PureComponent {
  componentDidMount() {
    this.props.handleGetGaId();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.analytics.gaId !== this.props.analytics.gaId) {
      ReactGA.initialize(this.props.analytics.gaId);
      ReactGA.pageview(this.props.location.pathname);
    }
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    return null;
  }
}

Analytics.propTypes = {
  analytics: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleGetGaId: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  analytics: makeSelectAnalytics(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetGaId: () => dispatch(getGaId()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'analytics', saga });

export default compose(
  withSaga,
  withConnect,
  withRouter,
)(Analytics);
