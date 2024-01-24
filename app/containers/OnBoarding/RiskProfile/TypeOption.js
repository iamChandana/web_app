import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import BaseUrl from 'utils/getDomainUrl';
import Parser from 'html-react-parser';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

const Card = styled(Grid)`
  height: 210px;
  @media (max-width: 1024px) {
    height: 250px;
  }
  @media (max-width: 768px) {
    height: 270px;
  }
  text-align: center;
  padding: 20px 14px 24px;
  border-radius: 8px;
  margin: 8px !important;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &.selected {
    box-shadow: ${`0 4px 12px 0 ${Color.C_LIGHT_BLUE}`};
  }
  &:hover,
  &.selected {
    background-color: #90909a;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
    span {
      color: #fff;
    }
  }
`;

const LastText = styled.div`
  color: #1d1d26;
  font-size: 14px;
  line-height: 1.46;
  margin-top: 16px;
`;

function TypeOption(props) {
  const { riskProfileType, iconURL, description, onClick, selected } = props;
  const selectedClass = selected === riskProfileType ? 'selected' : '';
  const src = `${BaseUrl}${iconURL}`;
  return (
    <Card
      className={selectedClass}
      onClick={() => onClick(riskProfileType)}
    >
      <img src={src} alt={riskProfileType} />
      <Text color="#1d1d26" size="18px" weight="600">
        {riskProfileType}
      </Text>
      <LastText>
        {Parser(description)}
      </LastText>
    </Card>
  );
}

TypeOption.propTypes = {
  riskProfileType: PropTypes.string,
  description: PropTypes.string,
  iconURL: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.string,
};

export default TypeOption;
