// Whole Sale Warning Modal 

import React from 'react';
import Grid from 'material-ui/Grid';
import Modal from 'components/Modal';
import styled from 'styled-components';
import Text from 'components/Text';
import { StyledLink } from 'components/Link';
import { RowGridCenter } from 'components/GridContainer';
import { StyledButton } from 'styles/style.js';
import Alert from '../../images/alert.png'

const DarkText = styled(Text)`
    color: #000000;
`;

export default function WholeSaleWarningModal(props) {
    const title = 'This fund is available for distribution to Sophisticated Investor(s) only.';
    const { handleClose, handleContinue, zIndex } = props;
    return (
        <Modal open={props.open} modalWidth='800px' title={title} handleClose={handleClose} modalImage={Alert} modalImgAlt="Alert" imageWidth="45px" zIndex={zIndex} paddingBottom='54'>
            <Grid container direction="column" xs={12} justify="center" spacing={24}>
                <Grid item>
                    <DarkText>Only a "Sophisticated Investor" may invest in wholesale fund(s). Sophisticated Investor refers to any person who falls within any of the categories of investors set out in Part 1, Schedules 6 and 7 of the Capital Markets and <br /> Services Act 2007 (as may be amended, varied, modified, updated and/or superseded from time to time).</DarkText>
                </Grid>
                <Grid item >
                    <DarkText>Please refer to our website({<StyledLink href='https://www.principal.com.my/en/sophisticated-investor-my' target="_blank">www.principal.com.my</StyledLink>}) for the definition of sophisticated investor as per Part 1, Schedules 6 and 7 of the Capital Markets and Services Act 2007 (as may be amended, varied, modified, updated and/or superseded from time to time).</DarkText>
                </Grid>
                <Grid item >
                    <RowGridCenter>
                        <StyledButton onClick={handleClose}>Back</StyledButton>
                        <StyledButton primary onClick={handleContinue}>Continue</StyledButton>
                    </RowGridCenter>
                </Grid>
            </Grid>
        </Modal >
    )
}