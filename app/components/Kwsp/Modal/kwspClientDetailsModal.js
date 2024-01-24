import React from 'react';
import Modal from 'components/Modal';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';

// ***********************Components Imports *********************
import Text from 'components/Text';
import Button from 'components/Button';
import KwspAccountTypeSelector from '../CustomComponents/kwspAccountTypeSelectorRadio';

export default function KwspAccountTypeModal(props) {
    const {
        handleChange,
        open,
        kwspAccountType,
        handleClose,
        processKwspDetails,
        epfErrorMessage,
        isDisabled
    } = props;
    const accountTypeHeading = 'Choose Account Type';
    return (
        <React.Fragment>
            <Modal width={600} height={600} open={open} title={accountTypeHeading} hideClose>
                <Grid container direction="column" justify="center" alignItems="between">
                    <KwspAccountTypeSelector kwspAccountType={kwspAccountType} handleChange={handleChange} epfErrorMessage={epfErrorMessage}/>
                </Grid>
                <Grid container direction="row" justify="around" alignItems="center">
                    <Grid item xs={6} direction="row" alignItems="center" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '5px' }}>
                        <Button onClick={handleClose} width="70%">
                            Back
                        </Button>
                    </Grid>
                    <Grid container item xs={6} direction="row" alignItems="center" style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '5px' }}>
                        <Button disabled={!isDisabled() || epfErrorMessage} onClick={() => processKwspDetails()} primary width="70%">
                            Continue
                        </Button>
                    </Grid>
                </Grid>
            </Modal>
        </React.Fragment >
    );
}
