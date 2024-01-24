import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';
import Button from 'components/Button';

import LoadingOverlay from 'components/LoadingOverlay';
import { rejectBackButton } from 'utils/helpers';
import Text from 'components/Text';
import { setTitle, setStep, saveRiskProfile5, getRiskScore, resetError } from 'containers/OnBoarding/actions';
import {
  makeSelectRiskProfile5,
  makeSelectQuestions,
  makeSelectError,
  makeSelectRiskScore,
  makeSelectProcessing,
} from 'containers/OnBoarding/selectors';
import { ColumnGridCenter } from 'components/GridContainer';
import CardOption from './CardOption';

const LastText = styled(Text)`
  margin: 32px 0;
`;
class Question5 extends React.PureComponent {
  constructor(props) {
    super(props);

    this.select = this.select.bind(this);
  }
  componentWillMount() {
    rejectBackButton();
    this.props.setStep(3);
    this.props.setTitle('Next, tell us on how would you react towards risk.');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.riskScore !== this.props.riskScore && !_isEmpty(nextProps.riskScore)) {
      this.props.history.push('/onboarding/risk-profile/result');
    }
    if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
      toast(nextProps.error);
      this.props.resetError();
    }
    return null;
  }

  select(id) {
    this.props.saveRiskProfile5(id);
    this.props.getRiskScore();
  }
  render() {
    const { riskProfile5, questions, processing } = this.props;
    const data = questions[4];
    return (
      <ColumnGridCenter>
        <LoadingOverlay show={processing} />
        <Grid>
          <LastText size="18px" color="#1d1d26" lineHeight="1.43">
            {data.question.question}
          </LastText>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={24} justify="center" alignitems="center">
            {data.answers.map((answer) => (
              <CardOption onClick={this.select} selected={riskProfile5} data={answer} key={answer.id} />
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <LastText>
            <Button primary onClick={() => this.props.history.push('/onboarding/risk-profile/question4')}>
              Back
            </Button>
          </LastText>
        </Grid>
      </ColumnGridCenter>
    );
  }
}

Question5.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  riskProfile5: PropTypes.any,
  saveRiskProfile5: PropTypes.func,
  questions: PropTypes.array,
  getRiskScore: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  riskProfile5: makeSelectRiskProfile5(),
  questions: makeSelectQuestions(),
  riskScore: makeSelectRiskScore(),
  error: makeSelectError(),
  processing: makeSelectProcessing(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveRiskProfile5: (payload) => dispatch(saveRiskProfile5(payload)),
    getRiskScore: () => dispatch(getRiskScore()),
    resetError: () => dispatch(resetError()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Question5);
