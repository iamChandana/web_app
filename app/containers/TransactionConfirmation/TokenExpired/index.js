import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import Text from 'components/Text';

import Alert from './assets/alert.png';

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

export class TokenExpired extends React.PureComponent {
  render() {
    return (
      <Grid spacing={16} container>
        <Grid item xs={12}>
          <Text>Your verification link is no longer valid!</Text>
        </Grid>
        <Grid item xs={12}>
          <ImgWrapper>
            <img src={Alert} alt="token expired" height={48} width={48} />
          </ImgWrapper>
        </Grid>
        <Grid item xs={12}>
          <Text size="18px" weight="bold">
            Your verification link is no longer valid!
          </Text>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Text>Please contact your Agent for another verification link.</Text>
            </Grid>
            <Grid item xs={12}>
              <Text>For initial investments, request for Fund/s to be added again to your Account.</Text>
            </Grid>
            <Grid item xs={12}>
              <Text>For top-up, redemption, switching and RSP transactions, request for a new transaction to be created.</Text>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12}> */}
        {/*   {isRsp ? ( */}
        {/*     <RspSummary data={verifyTransactionApiResponse} /> */}
        {/*   ) : ( */}
        {/*     <TransactionSummary data={verifyTransactionApiResponse} /> */}
        {/*   )} */}
        {/* </Grid> */}
      </Grid>
    );
  }
}

TokenExpired.propTypes = {};

export default TokenExpired;
