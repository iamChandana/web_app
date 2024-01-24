import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

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
    this.props.history.push(`/retake/${this.props.link}`);
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

export default withRouter(RedirectButton);
