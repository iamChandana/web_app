/**
 *
 * Page404
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

export class Page404 extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return <div>Page Not Found</div>;
  }
}

Page404.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(Page404);
