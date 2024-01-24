import React from 'react';
import { Grid } from 'material-ui';
import Modal from 'components/Modal';
import Text from 'components/Text';
import Button from 'components/Button';
import { RowGridCenter } from 'components/GridContainer';
import ErrorIcon from 'images/alert.png';
import CashSchemeIcon from '../assets/cash_scheme_blue.svg';


function redirectToProfile(props) {
    const { customerId } = props;
    const profileUrl = `${window.location.origin}/clients/${customerId}/profile`;
    console.log('profile URL', profileUrl);
    window.location.replace(profileUrl)
}

export default function JointAccountOtpModal(props) {
    const { handleClose } = props;
    return (
        <Modal open title="" modalWidth="572px" zIndex="1500" handleClose={handleClose}>
            <Grid container direction="column" justify="center" alignItems="center" style={{ paddingBottom: '30px' }}>
                <Grid xs={12} style={{ marginBottom: '10px' }}>
                    <img src={ErrorIcon} alt="Warning" width="50px" />
                </Grid>
                <Grid xs={12} >
                    {<RowGridCenter style={{ padding: '0 15px', margin: '20px 0' }}>
                        <Text size="16px" display="inline">
                            <Text weight="bolder" size="16px" display="inline">{props.clientName + " "}</Text> has not updated the OTP/Signature consent for this Joint Account &nbsp;
                            <img src={CashSchemeIcon} alt="Cash Icon" width="16px" />
                            <Text weight="bolder" size="16px" display="inline">{" " + props.accountNumber}</Text>
                        </Text>

                    </RowGridCenter>
                    }
                </Grid>
                <Grid xs={12} style={{ margin: '0px 0 40px 0' }}>
                    <Text>Please update this via Edit Profile.</Text>
                </Grid>
                <Grid xs={12} >
                    <Button primary onClick={() => redirectToProfile(props)}>Go to Client's Profile</Button>
                </Grid>
            </Grid>
        </Modal>
    );
}