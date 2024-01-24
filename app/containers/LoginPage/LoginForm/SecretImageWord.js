/* eslint react/jsx-indent: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import BaseUrl from 'utils/getDomainUrl';

import Text from 'components/Text';

import StyledImage from './StyledImage';
import NextButton from './NextButton';
import TextInput from './TextInput';

const tempImageBaseUrl = `${BaseUrl}/api/gateway/_internal/Agents/getSimg/`;
const StyledText = styled(Text)`
  margin-bottom: 12px;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const Container = styled(Grid)`
  height: 392px;
`;

const GridImage = styled(Grid)`
  margin-bottom: 12px !important;
`;

const GridImageItem = styled(Grid)`
  margin: 4px;
  padding-bottom: 0 !important;
`;
function SecretImageWord(props) {
  const { processing, proceed, userInfo, select, selected, handleInputChange, secretWord } = props;
  return (
    <Container container justify="flex-start">
      <form onSubmit={proceed} autoComplete="off">
        <Grid item xs={12}>
          <StyledText weight="600" size="18px" align="left">
            Set up your Secure Image and Secure Word
          </StyledText>
        </Grid>
        <Grid item xs={12}>
          <Text size="10px" weight="bold" color="#1d1d26" align="left" opacity="0.4">
            SECURE IMAGE
          </Text>
          <GridImage container spacing={24}>
            {userInfo.images
              ? userInfo.images.map((data) => (
                  <GridImageItem item xs={4} key={data.id}>
                    <StyledImage
                      onClick={() => select(data)}
                      className={selected === data.id ? 'selected' : ''}
                      src={tempImageBaseUrl + data.imagename}
                      alt={data.imagename}
                    />
                  </GridImageItem>
                ))
              : ''}
          </GridImage>
          <InputWrapper>
            <TextInput
              label="SECURE WORD"
              value={secretWord}
              handleInputChange={handleInputChange}
              name="secretWord"
              type="text"
            />
          </InputWrapper>
          <NextButton label="Proceed" processing={processing || (selected && secretWord)} />
        </Grid>
      </form>
    </Container>
  );
}

SecretImageWord.propTypes = {
  processing: PropTypes.bool,
  proceed: PropTypes.func,
  select: PropTypes.func,
  userInfo: PropTypes.object,
  selected: PropTypes.number,
  handleInputChange: PropTypes.func,
  secretWord: PropTypes.string,
};

export default SecretImageWord;
