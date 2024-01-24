import React from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';
import Chip from 'components/Chip';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';
import _findIndex from 'lodash/findIndex';
import rspStatuses from '../ClientDetails/TransactionModal/rspStatuses';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-right: 10px;
  }
`;

const StyledChip = styled(Chip)`
  height: 24px;
  border-radius: 14px;
`;

const StyledText = styled(Text)`
  max-width: 250px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 922px) {
    max-width: 200px;
  }
`;

function NameAndStatus(props) {
  const { data, portfolio } = props;
  let newData = [];
  if (Array.isArray(data)) {
    newData = [...data];
  } else {
    for (const key in data) {
      newData.push(data[key]);
    }
  }
  // temp
  let accountStatus;
  let chipBackgroundColor;
  switch (newData.AccountStatus) {
    case 'A':
      accountStatus = 'Active';
      chipBackgroundColor = Color.C_GREEN;
      break;
    case 'S':
      accountStatus = 'Suspended';
      chipBackgroundColor = Color.C_RED;
      break;
    default:
      accountStatus = rspStatuses.inProgress;
      chipBackgroundColor = '#f5a623';
  }

  const getColorIndicator = (portfolio, type) => {
    const index = _findIndex(portfolio, ['UTRACCOUNTTYPE', type]);
    const status = portfolio[index] && portfolio[index].AccountStatus ? portfolio[index].AccountStatus : '';
    switch (status) {
      case 'A':
        return Color.C_GREEN;
      case 'S':
        return Color.C_ORANGE;
      default:
        return '#f5a623';
    }
  };

  let isCashAvailable;
  let isKWSPAvailable;

  if (portfolio && portfolio.length) {
    portfolio.forEach((item) => {
      if (item.partnerAccountType === 'CS') {
        isCashAvailable = true;
      }
      if (item.partnerAccountType === 'KW') {
        isKWSPAvailable = true;
      }
    });
  }
  return (
    <Container>
      <StyledText color="#ffffff" size="20px" weight="bold" lineHeight="1.4">
        {newData[0].FullName}
      </StyledText>
      {/* {isCashAvailable && (
        <StyledChip
          name={'CASH'}
          color={
            // getColorIndicator(newData, 'CS')
            '#0091da'
          }
          opacity={1}
        />
      )}
      {isKWSPAvailable && (
        <StyledChip
          name={'KWSP'}
          color={
            // getColorIndicator(newData, 'KW')
            '#0091da'
          }
          opacity={1}
        />
      )} */}
    </Container>
  );
}

NameAndStatus.propTypes = {
  data: Proptypes.object,
};
export default NameAndStatus;
