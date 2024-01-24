import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import CloseIcon from 'components/FundCard/close.svg';

const SuccessNotification = styled.div`
  padding: 10px !important;
  background-color: #abebc6;
  position: relative;
`;

const WarningNotification = styled.div`
  padding: 10px !important;
  background-color: #fda98d;
  position: relative;
`;

const ErrorNotification = styled.div`
  padding: 10px !important;
  background-color: #fda98d;
  position: relative;
`;

const DefaultNotification = styled.div`
  padding: 10px !important;
  background-color: #fdecd3;
  position: relative;
`;

const PendindNotification = styled.div`
  padding: 10px !important;
  background: rgba(245, 166, 35, 0.2);
  position: relative;
`;

const CloseBtn = styled.button`
position: absolute;
right: 10px;
top: 50%;
cursor: pointer;
transalate: tra;
transform: translateY(-50%);
`;

function StyledExpansionPanelDetailsGreen(props) {
    return (
        <SuccessNotification>
            <Grid container justify="between" alignItems="center" >
                <Grid xs={10}>{props.children}</Grid>
                {props.showClose && (<Grid xs={2}>
                    <CloseBtn onClick={props.handleClose}>
                        <img src={CloseIcon} alt="Close" />
                    </CloseBtn>
                </Grid>)}
            </Grid>
        </SuccessNotification>
    );
}

function StyledExpansionPanelDetailsForCancelledRSP(props) {
    return (
        <ErrorNotification>
            <Grid container justify="between" alignItems="center" >
                <Grid xs={10}>{props.children}</Grid>
                {props.showClose && (<Grid xs={2}>
                    <CloseBtn onClick={props.handleClose}>
                        <img src={CloseIcon} alt="Close" />
                    </CloseBtn>
                </Grid>)}
            </Grid>
        </ErrorNotification>
    );
}

function StyledExpansionPanelDetailsForRejectedRSP(props) {
    return (
        <WarningNotification>
            <Grid container justify="between" alignItems="center" >
                <Grid xs={10}>{props.children}</Grid>
                {props.showClose && (<Grid xs={2}>
                    <CloseBtn onClick={props.handleClose}>
                        <img src={CloseIcon} alt="Close" />
                    </CloseBtn>
                </Grid>)}
            </Grid>
        </WarningNotification>
    );
}

function StyledExpansionPanelDetailsP(props) {
    return (
        <DefaultNotification>
            <Grid container justify="between" alignItems="center" >
                <Grid xs={10}>{props.children}</Grid>
                {props.showClose && (<Grid xs={2}>
                    <CloseBtn onClick={props.handleClose}>
                        <img src={CloseIcon} alt="Close" />
                    </CloseBtn>
                </Grid>)}
            </Grid>
        </DefaultNotification>
    );
}

function StyledExpansionPanelDetailsWarning(props) {
    return (
        <PendindNotification>
            <Grid container justify="between" alignItems="center" >
                <Grid xs={10}>{props.children}</Grid>
                {props.showClose && (<Grid xs={2}>
                    <CloseBtn onClick={props.handleClose}>
                        <img src={CloseIcon} alt="Close" />
                    </CloseBtn>
                </Grid>)}
            </Grid>
        </PendindNotification>
    );
}


export {
    StyledExpansionPanelDetailsForCancelledRSP,
    StyledExpansionPanelDetailsForRejectedRSP,
    StyledExpansionPanelDetailsGreen,
    StyledExpansionPanelDetailsP,
    StyledExpansionPanelDetailsWarning,
};
