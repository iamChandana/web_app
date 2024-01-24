import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import moment from 'moment';

import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import { rejectBackButton } from 'utils/helpers';
import CalculateAge from 'utils/calculateAge';
import extractNumbersFromString from 'utils/extractNumbersFromString';
import Modal from 'components/Modal';
import Button from 'components/Button';
import AlertImg from 'images/alert.png';

import { RowGridCenter, ColumnGridCenter } from 'components/GridContainer';
import { setTitle, setStep, saveRiskProfile1 } from 'containers/OnBoarding/actions';
import { makeSelectRiskProfile1, makeSelectQuestions, makeSelectIntroduction } from 'containers/OnBoarding/selectors';
import CardOption from './CardOption';

const LastText = styled(Text)`
  margin: 32px 0;
`;
class Question1 extends React.PureComponent {
  constructor() {
    super();

    this.select = this.select.bind(this);
    this.isValidAge = this.isValidAge.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);

    this.state = {
      selected: '',
      doOpenAgeWarning: false,
      ageRangeSelected: '',
    };
  }
  componentWillMount() {
    rejectBackButton();
    this.props.setStep(3);
    this.props.setTitle('Next, tell us on how would you react towards risk.');
  }

  handleModalClose() {
    this.setState({ doOpenAgeWarning: false });
  }

  isValidAge(data) {
    let isValid = false;
    const { introData } = this.props;
    const selectedAge = CalculateAge(introData.dateOfBirth);
    const ageArr = extractNumbersFromString(data.answer);

    if (selectedAge >= ageArr[0] && selectedAge <= ageArr[1]) {
      isValid = true;
    }
    if ((data.id === 7 && selectedAge >= ageArr[0]) || (data.id === 11 && selectedAge <= ageArr[0])) {
      isValid = true;
    }

    return isValid;
  }

  select(data) {
    if (this.isValidAge(data)) {
      this.props.saveRiskProfile1(data);
      this.props.history.push('/onboarding/risk-profile/question2');
    } else {
      this.setState({ doOpenAgeWarning: true, ageRangeSelected: data.answer });
    }
  }
  render() {
    const { questions, riskProfile1, introData } = this.props;

    if (questions) {
      const [data] = questions;
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
                <CardOption onClick={this.select} selected={riskProfile1} data={answer} key={answer.id} />
              ))}
            </RowGridCenter>
          </Grid>
          <Grid item xs={12}>
            <LastText>
              <Button primary onClick={() => this.props.history.push('/onboarding/introduction/introDetailInput')}>
                Back
              </Button>
            </LastText>
          </Grid>

          {/* Modal code, if age is not valid */}
          <Modal
            modalWidth="572px"
            handleClose={this.handleModalClose}
            open={this.state.doOpenAgeWarning}
            modalImage={AlertImg}
            modalImgAlt="Alert"
            imageWidth="45px">
            <Grid spacing={16} container>
              <Grid item xs={12}>
                <Text size="16px" align="center">
                  Your Birthdate is <b>{moment(introData.dateOfBirth).format('YYYY-MM-DD')}</b> which means your current age is{' '}
                  <br />
                  <b>{CalculateAge(introData.dateOfBirth)}</b> but you have selected the option{' '}
                  <b>{this.state.ageRangeSelected}</b>. <br />
                  Please select the correct option to continue.
                </Text>
              </Grid>
              <Grid item xs={12}>
                <center>
                  <Button primary onClick={this.handleModalClose}>
                    Ok
                  </Button>
                </center>
              </Grid>
            </Grid>
          </Modal>
        </ColumnGridCenter>
      );
    }
    return <LoadingOverlay show />;
  }
}

Question1.propTypes = {
  setTitle: PropTypes.func,
  setStep: PropTypes.func,
  riskProfile1: PropTypes.any,
  history: PropTypes.object,
  saveRiskProfile1: PropTypes.func,
  questions: PropTypes.array,
  introData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  riskProfile1: makeSelectRiskProfile1(),
  questions: makeSelectQuestions(),
  introData: makeSelectIntroduction(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveRiskProfile1: (payload) => dispatch(saveRiskProfile1(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Question1);
