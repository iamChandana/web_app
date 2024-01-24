import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import Color from 'utils/StylesHelper/color';

const Container = styled(Grid)`
  width: 240px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  margin: 4px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px;
  border: ${(props) => props.highlightedborder};
`;

const Oval = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 5px;
`;

const StyledText = styled(Text)`
  width: 180px;
`;

const PILL_COLOR = ['#bc8a54', '#e08272', '#848187'];

function FundNamePill(props) {
  const { data, index, highlightedfundpill } = props;
  const pillColor = PILL_COLOR[index];
  let highlightedBorderCss = '';

  if (highlightedfundpill) {
    highlightedBorderCss = 'solid #d8232a 1px';
  }

  return (
    <Container highlightedborder={highlightedBorderCss}>
      <Oval color={pillColor} />
      <StyledText size="12px" color={Color.C_GRAY} weight="bold">
        {data.name}
      </StyledText>
    </Container>
  );
}

FundNamePill.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
};
export default FundNamePill;
