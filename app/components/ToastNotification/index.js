/**
 *
 * ToastNotification
 *
 */

import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function ToastNotification({ toastState }) {
  if (toastState && toastState.type) {
    toast[toastState.type](toastState.message, {
      position: toast.POSITION.TOP_RIGHT,
      className: {},
    });
  }
  return null;
}

ToastNotification.propTypes = {
  toastState: PropTypes.any,
};

function mapStateToProps({ global }) {
  return {
    toastState: global.toast,
  };
}

export default connect(mapStateToProps, null)(ToastNotification);
