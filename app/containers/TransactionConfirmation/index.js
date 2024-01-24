import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import Header from 'components/Header';
import Text from 'components/Text';
import injectSaga from 'utils/injectSaga';
import VerifyTransaction from './VerifyTransaction';
import RejectTransaction from './RejectTransaction';
import VerifySwitch from './VerifySwitch';
import VerifyRedeem from './VerifyRedeem';
import TokenExpired from './TokenExpired';
import saga from './saga';

const Container = styled.div`
  padding: 48px 24px;

  @media (min-width: 600px) {
    max-width: 600px;
    margin: 0 auto;
  }
`;

export class TransactionConfirmation extends React.PureComponent {
  render() {
    const { location } = this.props;
    const hideWarning = location.pathname.includes('tokenExpired');

    return (
      <React.Fragment>
        <Header hideActionItem />
        <Container>
          <Grid spacing={24} container>
            <Grid item xs={12}>
              <Switch>
                <Route exact path="/customers/verifyTransEmail" component={VerifyTransaction} />
                <Route exact path="/customers/rejectTransEmail" component={RejectTransaction} />
                <Route exact path="/customers/rejectRspEmail" component={() => <RejectTransaction isRsp />} />
                <Route exact path="/customers/verifyRspEmail" component={() => <VerifyTransaction isRsp />} />
                <Route exact path="/customers/verifyTransEmailSw" component={VerifySwitch} />
                <Route exact path="/customers/verifyTransEmailRd" component={VerifyRedeem} />
                <Route exact path="/customers/tokenExpired" component={TokenExpired} />
              </Switch>
            </Grid>
            {!hideWarning ? (
              <Grid item xs={12}>
                <Text align="center">
                  If you did not make this request and believe an unauthorized person has accessed your account, please email us
                  on service@principal.com.my or contact our Customer Care Hotline on +(603) 7718 3000.
                </Text>
              </Grid>
            ) : null}
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

TransactionConfirmation.propTypes = {
  location: PropTypes.object,
};

const withSaga = injectSaga({ key: 'transactionConfirmation', saga });

export default withSaga(TransactionConfirmation);
