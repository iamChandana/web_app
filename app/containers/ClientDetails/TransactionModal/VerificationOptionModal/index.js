import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Grid from 'material-ui/Grid';
import { FormControlLabel, FormControl } from 'material-ui/Form';
import { Radio, RadioGroup } from 'material-ui';
import styled from 'styled-components';

import Button from 'components/Button';
import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import Color from 'utils/StylesHelper/color';
import EmailVerificationConfirmationModal from './EmailVerificationConfirmationModal';
import Modal from '../Modal';
import { emailOtpRequest, setSelectedVerificationOption } from '../../actions';
import {
  makeSelectFullName,
  makeSelectEmail,
  makeSelectMobileNo,
  makeSelectSelectedVerificationError,
  makeSelectProcessing,
} from '../../selectors';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  }
`;

class VerificationOptionModal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedVerificationOption: null,
      isEmailVerificationConfirmationModalOpen: false,
    };
    this.handleOpenEmailVerificationConfirmationModal = this.handleOpenEmailVerificationConfirmationModal.bind(this);
    this.handleChangeVerificationOption = this.handleChangeVerificationOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.verificationError === null && this.props.verificationError !== null) {
      this.props.handleClose();
    }
  }

  handleOpenEmailVerificationConfirmationModal() {
    this.setState({
      isEmailVerificationConfirmationModalOpen: true,
    });
  }

  // function to change selectedVerificationOption
  handleChangeVerificationOption(e) {
    this.props.handleSetSelectedVerificationOption(e.target.value);
    this.setState({ selectedVerificationOption: e.target.value });
  }

  // function to handle submission based on the selectedVerificationOption
  handleSubmit() {
    const { handleSubmitViaOtp, handleEmailOtpRequest, trxRequestId, email, trxPayload, isRsp, handleSubmitRsp } = this.props;
    const { selectedVerificationOption } = this.state;

    if (isRsp && handleSubmitRsp) {
      handleSubmitRsp(selectedVerificationOption);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (selectedVerificationOption === 'otp') {
        handleSubmitViaOtp();
      } else {
        // apologies for this, poor planing on project side forces me to do this
        // basically if transaction type is subscribe, trxRequestId is - and we have to use handleSubmitViaOtp function
        // another permutation handling will be done in Saga side of initOtp
        // eslint-disable-next-line no-lonely-if
        if (trxRequestId === '-') {
          handleSubmitViaOtp();
        } else {
          handleEmailOtpRequest({ trxRequestId, email, ...trxPayload });
        }
      }
    }
  }

  render() {
    const { fullName, email, phoneNumber, open, handleClose, processing } = this.props;
    const { selectedVerificationOption, isEmailVerificationConfirmationModalOpen } = this.state;

    return (
      <React.Fragment>
        <Modal id="verification-option-modal" title="Verification" open={open} scroller={false} handleClose={handleClose}>
          <Grid spacing={16} container direction="column" justify="center" alignItems="center">
            <Grid item xs={12}>
              <Text>
                How would <strong>{fullName}</strong> like to verify this transaction?
              </Text>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <LoadingOverlay show={processing} />
                <RadioGroup
                  aria-label="verification-options"
                  value={selectedVerificationOption}
                  onChange={this.handleChangeVerificationOption}>
                  <StyledRadioButton
                    value="email"
                    control={<Radio />}
                    label={`Registered email address via online verification (${email})`}
                  />
                  <StyledRadioButton
                    value="otp"
                    control={<Radio />}
                    label={`Registered mobile number via OTP (${phoneNumber})`}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button primary disabled={selectedVerificationOption === null} onClick={this.handleSubmit}>
                Proceed
              </Button>
            </Grid>
          </Grid>
        </Modal>
        <EmailVerificationConfirmationModal open={isEmailVerificationConfirmationModalOpen} />
      </React.Fragment>
    );
  }
}

VerificationOptionModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmitViaOtp: PropTypes.func,
  handleEmailOtpRequest: PropTypes.func,
  trxRequestId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  trxPayload: PropTypes.object.isRequired,
  isRsp: PropTypes.bool,
  handleSubmitRsp: PropTypes.func,
  verificationError: PropTypes.string,
  handleSetSelectedVerificationOption: PropTypes.func,
  processing: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  fullName: makeSelectFullName(),
  email: makeSelectEmail(),
  phoneNumber: makeSelectMobileNo(),
  verificationError: makeSelectSelectedVerificationError(),
  processing: makeSelectProcessing(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleEmailOtpRequest: (payload) => dispatch(emailOtpRequest(payload)),
    handleSetSelectedVerificationOption: (selectedVerificationOption) =>
      dispatch(setSelectedVerificationOption(selectedVerificationOption)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(VerificationOptionModal);
