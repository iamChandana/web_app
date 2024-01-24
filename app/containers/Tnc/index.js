/**
 *
 * TnC
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Grid from 'material-ui/Grid';
import TermsOfUse from 'containers/LoginPage/Footer/TermsOfUse';
import Header from 'containers/Faq/Header';
import Logo from 'containers/Faq/Logo';
import BackToLogin from 'containers/Faq/BackToLogin';
import styled from 'styled-components';
import Container from 'containers/Faq/Container';

const Head1 = styled(Grid)`
  font-size: 20px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-top: 46px !important;
`;
const Head2 = styled(Grid)`
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.75;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-top: 22px !important;
`;

export class Tnc extends React.PureComponent {
  render() {
    return (
      <Container>
        <Helmet>
          <title>Terms and Conditions</title>
          <meta name="description" content="Terms and Conditions" />
        </Helmet>
        <Grid container direction="column">
          <Logo />
          <BackToLogin />
          <Header item xs={12}>
            <Grid container direction="column" justify="center" alignItems="center" style={{ marginLeft: '170px' }}>
              <Head1 item xs={12}>
                Terms and Conditions
              </Head1>
              <Head2 item xs={12}></Head2>
            </Grid>
          </Header>
          <Grid item xs={12}>
            <Grid container direction="row">
              <Grid item xs={12} style={{ padding: 20 }}>
                <TermsOfUse singlePage />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Tnc;
