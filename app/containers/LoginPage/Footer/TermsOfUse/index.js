import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import ExpandablePanel from 'components/ExpandablePanel';
import Terms from './terms';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

const Container = styled(Grid)`
  max-height: 350px;
  overflow-y: scroll;
  margin-bottom: 30px;
`;

const Link = styled.a`
  color: ${Color.C_LIGHT_BLUE};
`;

function TermsOfUse(props) {
  // eslint-disable-next-line
  const terms = Terms.map((term) => (
    <Grid item xs={12} key={term.id}>
      <ExpandablePanel title={term.label} details={term.value} identifier={term.id} />
    </Grid>
  ));
  const baseUrl = 'https://www.principal.com.my/';

  if (props.singlePage) {
    return terms;
  } else {
    //return <Container container>{terms}</Container>;
    return (
      <Container>
        <Grid container>
          <Grid xs={12} style={{ paddingBottom: '10px' }}>
            <Text size="16px">
              <Link href={`${baseUrl}en/terms-of-use-my`} target="_blank">1. Terms of Use</Link>
            </Text>
          </Grid>
          <Grid xs={12} style={{ paddingBottom: '10px' }}>
            <Text size="16px">
              <Link href={`${baseUrl}others/account-opening-terms-conditions`} target="_blank">2. Account Opening</Link>
            </Text>
          </Grid>  
          <Grid xs={12} style={{ paddingBottom: '10px' }}>
            <Text size="16px">
              <Link href={`${baseUrl}others/transaction-terms-conditions`} target="_blank">3. Transaction</Link>
            </Text>
          </Grid> 
          <Grid xs={12} style={{ paddingBottom: '10px' }}>
            <Text size="16px">
              <Link href={`${baseUrl}others/redemption-terms-conditions`} target="_blank">4. Redemption</Link>
            </Text>
          </Grid>                             
        </Grid>
      </Container>);
  }
}

export default TermsOfUse;
