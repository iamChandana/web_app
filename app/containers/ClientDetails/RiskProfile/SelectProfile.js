import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import Grid from 'material-ui/Grid';

import { RowGridCenter } from 'components/GridContainer';
import { setStep, setTitle, saveRiskScore } from 'containers/OnBoarding/actions';
import { makeSelectRiskProfiles, makeSelectRiskScore } from 'containers/OnBoarding/selectors';
import Button from 'components/Button';
import ConfirmRiskModal from 'components/ConfirmRiskModal';
import { rejectBackButton } from 'utils/helpers';

import Disclaimer from './Disclaimer';
import TypeOption from './TypeOption';

const StyledButton = styled(Button)`
  margin: 40px 4px;
`;

class SelectProfile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      acknowledge: false,
      open: false,
      riskProfileType: props.riskScore.riskProfileType || '',
      modalMessage: '',
    };
    this.select = this.select.bind(this);
    this.setAcknowledge = this.setAcknowledge.bind(this);
    this.saveRiskProfile = this.saveRiskProfile.bind(this);
    this.return = this.return.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.getRiskScore = this.getRiskScore.bind(this);
  }
  componentWillMount() {
    rejectBackButton();
    this.props.setStep(3);
    this.props.setTitle('Please select another risk profile that suits you.');
  }

  setAcknowledge() {
    this.setState((prevState) => ({
      acknowledge: !prevState.acknowledge,
    }));
  }

  select(value) {
    this.setState({
      selected: value,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  getRiskScore(riskProfileType) {
    let riskScore;
    switch (riskProfileType) {
      case 'Conservative':
        riskScore = 1;
        break;
      case 'Moderately Conservative':
        riskScore = 19;
        break;
      case 'Moderate':
        riskScore = 26;
        break;
      case 'Moderately Aggressive"':
        riskScore = 35;
        break;
      case 'Aggressive':
        riskScore = 43;
        break;
      default:
        riskScore = 1;
    }
    return riskScore;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.riskScore.riskProfileType !== nextProps.riskScore.riskProfileType) {
      this.return();
      // this.props.history.push('retake/risk-profile/result');
    }
  }

  handleAccept() {
    this.props.saveRiskScore({ riskProfileType: this.state.selected, riskScore: this.getRiskScore(this.state.selected) });
    // this.props.history.push('retake/risk-profile/result');
  }

  saveRiskProfile() {
    const { riskScore } = this.props;
    console.log(this.state.selected);
    if (riskScore.riskProfileType.toLowerCase() !== this.state.selected.toLowerCase()) {
      //const an = this.state.selected === 'Aggressive' ? 'an' : 'a';
      const modalMessage = `Your risk profile is ${riskScore.riskProfileType} but you have selected as ${this.state.selected} Risk Profile.`;
      this.setState({
        open: true,
        modalMessage,
      });
    } else {
      // this.props.history.push('/onboarding/select-funds');
    }
  }

  return() {
    this.props.history.replace('/retake/risk-profile/result');
  }
  render() {
    const { riskProfiles, riskScore } = this.props;
    const { selected, acknowledge } = this.state;
    const btnDisabled = !!(!selected || !acknowledge);
    return (
      <div>
        <ConfirmRiskModal
          open={this.state.open}
          handleClose={this.handleClose}
          riskProfileType={selected}
          modalMessage={this.state.modalMessage}
          handleAccept={this.handleAccept}
          modalWidth="45%"
        />
        <RowGridCenter style={{ alignItems: 'flex-start' }}>
          {riskProfiles.map((data) => (
            <Grid item xs={6} sm={4} md={4} lg={4}>
              <TypeOption {...data} key={data.id} onClick={this.select} selected={selected} />
            </Grid>
          ))}
        </RowGridCenter>
        <Disclaimer acknowledge={acknowledge} onChange={this.setAcknowledge} />
        <RowGridCenter>
          <StyledButton onClick={this.return}>Return to Risk Profile</StyledButton>
          <StyledButton disabled={btnDisabled} primary onClick={this.saveRiskProfile}>
            Select Risk Profile
          </StyledButton>
        </RowGridCenter>
      </div>
    );
  }
}

SelectProfile.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  riskProfiles: PropTypes.array,
  saveRiskScore: PropTypes.func,
  riskScore: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  riskProfiles: makeSelectRiskProfiles(),
  riskScore: makeSelectRiskScore(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveRiskScore: (payload) => dispatch(saveRiskScore(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectProfile);
