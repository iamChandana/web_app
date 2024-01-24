/**
 *
 * CardButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

const StyledGrid = styled(Grid)`
  width: 100%;
  margin: 20px 0;
  height: 112px;
  border-radius: 5px;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
`;

const ImageWrapper = styled(Grid)`
  display: flex;
  justify-content: center;
`;

function CardButton(props) {
  const { title, description, onClick, url, icon, isShortCard, ...rest } = props;
  return (
    <StyledGrid onClick={() => onClick(url)} {...rest} container direction="row" justify="space-around" alignItems="center">
      {title && (
        <ImageWrapper item xs={isShortCard?5:3}>
          <img src={icon} alt="Icon" />
        </ImageWrapper>
      )}
      {!title && (
        <ImageWrapper item xs={12}>
          <img src={icon} alt="Icon" />
        </ImageWrapper>
      )}
      <Grid item xs={isShortCard?7:9}>
        <Text color={Color.C_LIGHT_BLUE} weight="bold" align="left">
          {title}
        </Text>
        {description && (
          <Text color={Color.C_GRAY} align="left">
            {description}
          </Text>
        )}
      </Grid>
    </StyledGrid>
  );
}

CardButton.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  url: PropTypes.string,
  icon: PropTypes.string,
};

export default CardButton;
