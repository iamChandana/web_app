import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import { rejectBackButton } from 'utils/helpers';
import Button from 'components/Button';

import { RowGridCenter, ColumnGridCenter } from 'components/GridContainer';
import { setTitle, setStep, saveRiskProfile2 } from 'containers/OnBoarding/actions';
import { makeSelectRiskProfile2, makeSelectQuestions } from 'containers/OnBoarding/selectors';
import CardOption from './CardOption';

const LastText = styled(Text)`
  margin: 32px 0;
`;
class Question2 extends React.PureComponent {
  constructor() {
    super();

    this.select = this.select.bind(this);

    this.state = {
      selected: '',
    };
  }
  componentWillMount() {
    rejectBackButton();
    this.props.setStep(3);
    this.props.setTitle('Next, tell us on how would you react towards risk.');
  }
  select(data) {
    this.props.saveRiskProfile2(data);
    this.props.history.push('/onboarding/risk-profile/question3');
  }
  render() {
    const { questions, riskProfile2 } = this.props;
    if (questions) {
      const data = questions[1];
      return (
        <ColumnGridCenter>
          <Grid>
            <LastText size="18px" color="#1d1d26" lineHeight="1.43">
              {data.question.question}
            </LastText>
          </Grid>
          <Grid item xs={12}>
            <RowGridCenter>
              {data.answers.map((answer) => (
                <CardOption onClick={this.select} selected={riskProfile2} data={answer} key={answer.id} />
              ))}
            </RowGridCenter>
          </Grid>
          <Grid item xs={12}>
            <LastText>
              <Button primary onClick={() => this.props.history.push('/onboarding/risk-profile/question1')}>
                Back
              </Button>
            </LastText>
          </Grid>
        </ColumnGridCenter>
      );
    }
    return <LoadingOverlay show />;
  }
}

Question2.propTypes = {
  setTitle: PropTypes.func,
  setStep: PropTypes.func,
  riskProfile2: PropTypes.any,
  history: PropTypes.object,
  saveRiskProfile2: PropTypes.func,
  questions: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  riskProfile2: makeSelectRiskProfile2(),
  questions: makeSelectQuestions(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveRiskProfile2: (payload) => dispatch(saveRiskProfile2(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Question2);
