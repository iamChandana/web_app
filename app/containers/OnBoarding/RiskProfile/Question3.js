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
import { setTitle, setStep, saveRiskProfile3 } from 'containers/OnBoarding/actions';
import { makeSelectRiskProfile3, makeSelectQuestions } from 'containers/OnBoarding/selectors';
import CardOption from './CardOption';

const LastText = styled(Text)`
  margin: 32px 0;
`;
class Question3 extends React.PureComponent {
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
    this.props.saveRiskProfile3(data);
    this.props.history.push('/onboarding/risk-profile/question4');
  }
  render() {
    const { questions, riskProfile3 } = this.props;
    if (questions) {
      const data = questions[2];
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
                <CardOption onClick={this.select} selected={riskProfile3} data={answer} key={answer.id} />
              ))}
            </RowGridCenter>
          </Grid>
          <Grid item xs={12}>
            <LastText>
              <Button primary onClick={() => this.props.history.push('/onboarding/risk-profile/question2')}>
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

Question3.propTypes = {
  setTitle: PropTypes.func,
  setStep: PropTypes.func,
  riskProfile3: PropTypes.any,
  history: PropTypes.object,
  saveRiskProfile3: PropTypes.func,
  questions: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  riskProfile3: makeSelectRiskProfile3(),
  questions: makeSelectQuestions(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveRiskProfile3: (payload) => dispatch(saveRiskProfile3(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Question3);
