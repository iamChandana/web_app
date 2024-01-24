import React from 'react';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import Button from 'components/Button';
import styled from 'styled-components';
import ClientUpdateSuccessIcon from './assets/check.svg';
import { RowGridCenter } from 'components/GridContainer';

const StyledButton = styled(Button)`
  margin: 20px 0;
`;

const StyledLinkButton = styled.a`
  background: transparent;
  color:#0d4de4;
  cursor: pointer;
  border: none;
  display: inline;
  padding: none;
  text-decoration: underline;
`;

export default function AccountCreationSuccessComponent(props) {
    const { continueAccountInvestment, viewClientProfile, accountTypeCreated } = props;
    const accountLabel = accountTypeCreated === 'CS' ? 'CASH' : 'KWSP';
    return (
        <React.Fragment>
            <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20, maxWidth: '720px' }} spacing={24}>
                <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                    <img src={ClientUpdateSuccessIcon} />
                </Grid>
                <Grid item xs={12}>
                    <Text size="16px" weight="bold">
                        {`Your Client's ${accountLabel} account has been created.`}
                    </Text>
                </Grid>
                <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                    {accountTypeCreated === 'CS' && <Text color="#000" size="14px" >
                        Please ensure that the client's email address has been verified in order to make investment payment via Online Bank Transfer.
                    </Text>}
                </Grid>
                <RowGridCenter spacing={24} >
                    <Grid item>
                        <StyledButton primary onClick={() => viewClientProfile()}>
                            View Client Profile
                        </StyledButton>
                    </Grid>
                    <Grid item>
                        <StyledButton primary onClick={() => continueAccountInvestment(accountTypeCreated)}>
                            Continue Investment
                          </StyledButton>
                    </Grid>
                </RowGridCenter>
                <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                    <Text size="14px" color="#0f0f0f" >
                        Didn't get the email verification?
                        <StyledLinkButton onClick={props.openDialogConfirmEmailResend}>
                            Resend
                        </StyledLinkButton>
                    </Text>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
