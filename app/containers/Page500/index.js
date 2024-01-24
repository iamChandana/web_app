/**
 *
 * Page500
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import Button from 'components/Button';
import DangerIcon from './danger.svg';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const StyledImage = styled.img`
  width: 150px;
  height: 150px;
  margin: 20px;
`;

const Text = styled.span`
  color: #d8232a;
  font-size: 20px;
  margin: 20px;
`;

export class Page500 extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  tryAgain = () => {
    window.history.back();
  };
  render() {
    return (
      <Container>
        <StyledImage src={DangerIcon} />
        <Text>Server is down. Please try again later.</Text>
        <Button primary onClick={this.tryAgain}>
          Try again?
        </Button>
      </Container>
    );
  }
}

Page500.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(Page500);
