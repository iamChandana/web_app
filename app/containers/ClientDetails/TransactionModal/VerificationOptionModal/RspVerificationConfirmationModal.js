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
import Color from 'utils/StylesHelper/color';
import EmailVerificationConfirmationModal from './EmailVerificationConfirmationModal';
import Modal from '../Modal';
import { makeSelectFullName, makeSelectEmail, makeSelectMobileNo, makeSelectSelectedVerificationError } from '../../selectors';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  }
`;

class RspVerificationConfirmationModal extends React.PureComponent {
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
    this.setState({ selectedVerificationOption: e.target.value });
  }

  // function to handle submission based on the selectedVerificationOption
  handleSubmit() {
    const { handleSubmitRsp } = this.props;
    const { selectedVerificationOption } = this.state;

    handleSubmitRsp(selectedVerificationOption);
  }

  render() {
    const { fullName, email, phoneNumber, open, handleClose } = this.props;
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

RspVerificationConfirmationModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmitRsp: PropTypes.func.isRequired,
  verificationError: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  fullName: makeSelectFullName(),
  email: makeSelectEmail(),
  phoneNumber: makeSelectMobileNo(),
  verificationError: makeSelectSelectedVerificationError(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(RspVerificationConfirmationModal);
