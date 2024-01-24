import React from 'react';
import Modal from 'components/Modal';
import Text from 'components/Text';
import styled from 'styled-components';
import Button from 'components/Button';
import { RowGridSpaceAround } from '../../GridContainer';
import KwspFields from '../../../../app/containers/OnBoarding/TransferFunds/Transfer/KwspFields';

const StyledButton = styled(Button)`
  margin-top: 20px !important;
  display: table;
`;

export default function KwspConfirmationPopUp(props) {
  const title = 'Confirm KWSP 9N Details';
  const { open, toggleKwspConfirmationPopUp, epfMembershipNumber } = props;
  return (
    <Modal title={title} open={open} zIndex={1500} modalWidth="60%" hideClose>
      <Text size="13px" weight="bolder">
        The information entered should match the information written on the KWSP 9N Form.
      </Text>
      <div style={{ padding: '0 14px' }}>
        <KwspFields disableAll epfMembershipNumber={epfMembershipNumber} />
      </div>
      <RowGridSpaceAround>
        <StyledButton onClick={() => toggleKwspConfirmationPopUp(false)}>Back</StyledButton>
        <StyledButton primary onClick={() => toggleKwspConfirmationPopUp(true)}>
          Continue
        </StyledButton>
      </RowGridSpaceAround>
    </Modal>
  );
}
