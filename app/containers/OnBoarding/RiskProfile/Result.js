import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import styled from 'styled-components';
import LoadingOverlay from 'components/LoadingOverlay';
import _find from 'lodash/find';
import BaseUrl from 'utils/getDomainUrl';

import Text from 'components/Text';
import Button from 'components/Button';
import { RowGridCenter, ColumnGridCenter } from 'components/GridContainer';
import { setTitle, setStep, setRiskProfileType } from 'containers/OnBoarding/actions';
import { rejectBackButton } from 'utils/helpers';
import {
  makeSelectRiskScore,
  makeSelectProcessing,
  makeSelectRiskProfiles,
  makeSelectIntroduction,
} from 'containers/OnBoarding/selectors';
import RedirectButton from '../Button';

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MiddleText = styled(Text)`
  margin-top: 32px;
  max-width: 502px;
`;

class Result extends React.PureComponent {
  constructor() {
    super();

    this.accept = this.accept.bind(this);
  }
  componentWillMount() {
    rejectBackButton();
    this.props.setStep(3);
    const name = this.props.introduction.fullName.split(' ')[0];
    this.props.setTitle(`Congratulations, ${name}! Here is your risk profile.`);
  }

  accept() {
    this.props.setRiskProfileType(this.props.riskScore.riskProfileType);
    this.props.history.push('/onboarding/select-funds');
  }
  render() {
    const { riskScore, processing, riskProfiles } = this.props;
    if (riskScore && !processing) {
      const riskDetails = _find(riskProfiles, { riskProfileType: riskScore.riskProfileType });
      const src = `${BaseUrl}${riskDetails.iconURL}`;
      return (
        <ResultContainer>
          <img src={src} alt="Type" />
          <Text size="18px" color="#1d1d26" weight="600">
            {riskScore.riskProfileType}
          </Text>
          <MiddleText color="#1d1d26" lineHeight="1.43">
            {Parser(riskDetails.description)}
          </MiddleText>
          <RowGridCenter spacing={24}>
            <RedirectButton label="Select Another Risk Profile" link="risk-profile/select" />
            <Button primary onClick={this.accept}>
              Accept Risk Profile
            </Button>
          </RowGridCenter>
        </ResultContainer>
      );
    }
    return <LoadingOverlay show />;
  }
}
Result.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  riskScore: PropTypes.object,
  processing: PropTypes.bool,
  riskProfiles: PropTypes.array,
  introduction: PropTypes.object,
  setRiskProfileType: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  riskScore: makeSelectRiskScore(),
  processing: makeSelectProcessing(),
  riskProfiles: makeSelectRiskProfiles(),
  introduction: makeSelectIntroduction(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    setRiskProfileType: (payload) => dispatch(setRiskProfileType(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Result);
