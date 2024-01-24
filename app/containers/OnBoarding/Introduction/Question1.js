import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';
import { RowGridCenter, ColumnGridCenter } from 'components/GridContainer';
import { FormControlLabel } from 'material-ui/Form';
import Color from 'utils/StylesHelper/color';
import Radio from 'material-ui/Radio';
import Button from 'components/Button';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyledButton = styled(Button)`
  margin: 40px 0;
`;

class Question1 extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isExistingClient: undefined
    }
    this.handleChange = this.handleChange.bind(this);
    this.next = this.next.bind(this);
  }

  componentWillMount() {
  }

  handleChange = (event) => {
    if (event.target.value === 'Y') {
      this.setState({
        isExistingClient: true,
      });
    } else if (event.target.value === 'N') {
      this.setState({
        isExistingClient: false,
      });
    }
  };  

  next () {
    if (this.state.isExistingClient === true) {
      this.props.history.push('/onboarding/introduction/customerExist');
    } else if (this.state.isExistingClient === false) {
      this.props.history.push('/onboarding/introduction/cifVerification');
    }    
  }

  render() {
      return (
        <ColumnGridCenter>
          <Grid item xs={12}>
            <Text size="18px" color="#1d1d26" lineHeight="1.43" font-weight="bold">
              Are you CPAM existing customer?
            </Text>
          </Grid>
          <Grid item xs={12}>
            <RowGridCenter>
              <Grid item>
                <StyledRadioButton 
                  checked={this.state.isExistingClient === true} 
                  value="Y" 
                  control={<Radio />} 
                  label="Yes"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <StyledRadioButton
                  checked={this.state.isExistingClient === false}
                  value="N"
                  control={<Radio />}
                  label="No"
                  onChange={this.handleChange}
                />
              </Grid>
            </RowGridCenter>
          </Grid>
          <Grid item xs={12}>
            <StyledButton onClick={this.next} disabled={this.state.isExistingClient === undefined} primary>
              Continue
            </StyledButton>
          </Grid>          
        </ColumnGridCenter>
      );
  }
}

export default Question1;
