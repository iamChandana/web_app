import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import RiskButtonInfo from 'components/RiskButtonInfo';
import ChangeAccount from './ChangeAccount';
import Grid from 'material-ui/Grid';
import CloseIcon from './close-white.svg';

const Container = styled.div`
  width: 100%;
  height: 72px;
  background-color: #1d1d26;
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 40px;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 24px;
`;

const CloseImg = styled.img`
  margin-left: 5px;
  cursor: pointer;
`;
function AddNewFundsHeader(props) {
  const { customer, cancel, riskProfiles, handleToggleAccountSelectionModal } = props;
  return (
    <Container>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <Grid container direction="row" justify="center" alignItems="center">
            <Text color="#fff" size="16px" weight="600">
              Adding Funds to
            </Text>
            <UserImage src="http://via.placeholder.com/40x40" />
            <Text
              color="#fff"
              size="16px"
              weight="600"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace
              style={{ maxWidth: '250px' }}>
              {customer.info.fullName}
            </Text>
            {customer.info.riskAppetite && <RiskButtonInfo data={customer} riskProfiles={riskProfiles} />}
            <ChangeAccount handleToggleAccountSelectionModal={handleToggleAccountSelectionModal} />
          </Grid>
        </Grid>
        <Grid item>
          <Text
            color="#fff"
            size="12px"
            weight="600"
            lineHeight="1.67"
            decoration="underline"
            cursor="pointer"
            role="button"
            onClick={cancel}>
            Cancel
            <CloseImg src={CloseIcon} alt="Cancel" />
          </Text>
        </Grid>
      </Grid>
    </Container>
  );
}

AddNewFundsHeader.propTypes = {
  customer: PropTypes.object,
  cancel: PropTypes.func,
};

export default AddNewFundsHeader;
