import React from 'react';
import Modal from 'components/Modal';
import Grid from 'material-ui/Grid';
import { CancelImageGrid, CancelMessageGrid } from './styles';
import Text from 'components/Text';
import Button from 'components/Button';
import IconWarning from '../images/icon-warning.png';

export default function RspNotificationCancelModal(props) {
  const { closeDisableRspNotification, disableRspNotification, fundName, open } = props;

  return (
    <React.Fragment>
      <Modal width={600} height={600} open={open} handleClose={() => closeDisableRspNotification()}>
        <Grid container direction="column" justify="center" alignItems="center">
          <CancelImageGrid item xs={12}>
            <img src={IconWarning} />
          </CancelImageGrid>
          <CancelMessageGrid item xs={12}>
            <Text align="center" size="14px" weight="bolder">
              {` Do you want to remove the RSP Status notification for ${fundName} ?`}
            </Text>
          </CancelMessageGrid>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
          <Grid item xs={6}>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button onClick={() => disableRspNotification()} width="80%">
                Yes
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column" justify="center" alignItems="center">
              <Button
                onClick={() => {
                  closeDisableRspNotification();
                }}
                primary
                width="80%">
                No
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </React.Fragment>
  );
}
