import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from 'components/Button';

const StyledButton = styled(Button)`
  margin: 40px 4px;
`;

class RedirectButton extends React.PureComponent {
  constructor() {
    super();

    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    this.props.history.push(`/onboarding/${this.props.link}`);
  }
  render() {
    const { label, primary } = this.props;
    return (
      <StyledButton primary={primary} onClick={this.redirect}>
        {label}
      </StyledButton>
    );
  }
}

RedirectButton.propTypes = {
  link: PropTypes.string,
  history: PropTypes.object,
  label: PropTypes.string,
  primary: PropTypes.bool,
};

export default withRouter(RedirectButton);
