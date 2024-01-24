import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import Button from 'components/Button';
import Text from 'components/Text';
import Modal from 'components/Modal';
import AlertImg from 'images/alert.png';

const Flex = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const CampaignErrorModal = ({ handleCloseModal, open, campaignErrorMessage }) => (
  <Modal modalImage={AlertImg} open={open} zIndex={9999} hideClose>
    <Grid spacing={24} container>
      <Grid item xs={12}>
        <Text size="18px" weight="bold">
          {campaignErrorMessage}
        </Text>
      </Grid>
      <Grid item xs={12}>
        <Flex>
          <Button primary onClick={handleCloseModal}>
            OK
          </Button>
        </Flex>
      </Grid>
    </Grid>
  </Modal>
);

CampaignErrorModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  campaignErrorMessage: PropTypes.string,
};
