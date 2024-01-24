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
import { saveRiskProfile4 } from 'containers/OnBoarding/actions';
import { makeSelectRiskProfile4, makeSelectQuestions } from 'containers/OnBoarding/selectors';
import CardOption from './CardOption';

const LastText = styled(Text)`
  margin: 32px 0;
`;
class Question4 extends React.PureComponent {
  constructor() {
    super();

    this.select = this.select.bind(this);

    this.state = {
      selected: '',
    };
  }
  componentWillMount() {
    rejectBackButton();
  }
  select(data) {
    this.props.saveRiskProfile4(data);
    this.props.history.push('/retake/risk-profile/question5');
  }
  render() {
    const { questions, riskProfile4 } = this.props;
    if (questions) {
      const data = questions[3];
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
                <CardOption onClick={this.select} selected={riskProfile4} data={answer} key={answer.id} />
              ))}
            </RowGridCenter>
          </Grid>
          <Grid item xs={12}>
            <LastText>
              <Button primary onClick={() => this.props.history.push('/retake/risk-profile/question3')}>
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

Question4.propTypes = {
  riskProfile4: PropTypes.any,
  history: PropTypes.object,
  saveRiskProfile4: PropTypes.func,
  questions: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  riskProfile4: makeSelectRiskProfile4(),
  questions: makeSelectQuestions(),
});

function mapDispatchToProps(dispatch) {
  return {
    saveRiskProfile4: (payload) => dispatch(saveRiskProfile4(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Question4);
