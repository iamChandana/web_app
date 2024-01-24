import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import { RowGridSpaceAround } from 'components/GridContainer';
import { BolderText, StyledButton } from '../Utility/formFields';
import CashSchemeIcon from 'containers/ClientDetails/Funds/assets/cash_scheme_blue.svg';

const StyledGrid = styled.div`
width: 500px;
padding : 15px 0px;
`;

const DarkBolderText = styled(BolderText)`
color: #000000;
`;

function AccountIcon() {
    return (<img src={CashSchemeIcon} alt="Account type" width="14px" style={{ marginBottom: '4px' }} />);
}

function AccountNumber(props) {
    const { accountNumber } = props;
    return (<DarkBolderText >{accountNumber}</DarkBolderText>);
}

export default function JointCashAccountModal(props) {
    const { jointAccountNumber, toggleJointAccountPopUp, clientName } = props;
    return (
        <Dialog
            noClose
            open
            content={
                <Grid container justify="center">
                    <StyledGrid>
                        <Grid item justify="center" xs={12}>
                            <React.Fragment>
                                <Text size="16px" align="center">
                                    <DarkBolderText >{clientName}</DarkBolderText> has an existing Joint Cash
                            </Text>
                                <Text size="16px" align="center">Account&nbsp;<AccountIcon />{(jointAccountNumber.length === 1) &&
                                    <AccountNumber accountNumber={jointAccountNumber[0].partnerAccountMappingId} />}</Text>
                                {jointAccountNumber.length > 1 && <ul style={{ display: 'block', marginTop: '5px' }}>
                                    {jointAccountNumber.map((jointAccountItem) =>
                                        <li>
                                            <Text size="16px" align="center">• <AccountIcon /><AccountNumber accountNumber={jointAccountItem.partnerAccountMappingId} />
                                            </Text>
                                        </li>
                                    )}
                                </ul>}
                            </React.Fragment>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: 20 }}>
                            <Text size="13px" align="center">
                                <DarkBolderText>
                                    Would you like to proceed?
                                </DarkBolderText>
                            </Text>
                        </Grid>
                        <Grid container xs={12} style={{ paddingLeft: 20, paddingRight: 20 }} justify="center">
                            <RowGridSpaceAround>
                                <StyledButton onClick={() => toggleJointAccountPopUp(true)}>
                                    Yes
                                </StyledButton>
                                <StyledButton primary onClick={() => toggleJointAccountPopUp(false)}>
                                    No
                                </StyledButton>
                            </RowGridSpaceAround>
                        </Grid>
                    </StyledGrid>
                </Grid>}
        />);
}