import React from 'react';
import styled from 'styled-components';
import Text from 'components/Text';
import moment from 'moment';

const StyledText = styled(Text)`
  margin-top: 23px;
  margin-right: 40px;
  font-style: italic;
`;
function LastUpdated(props) {
  const { data } = props;
  if (!data.modifiedAt) return null;
  const time = moment(data.modifiedAt).format('D MMMM YYYY, h:mm A');
  return (
    <StyledText size="10px" color="#fff" weight="600" opacity="0.75">
      Last Updated {time}
    </StyledText>
  );
}

export default LastUpdated;
