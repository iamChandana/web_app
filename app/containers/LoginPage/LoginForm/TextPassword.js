import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import { primaryFont } from 'utils/StylesHelper/font';
import EyeIcon from '../images/eye.svg';
import EyeOpenIcon from '../images/eye-open.svg';

const Input = styled.input`
  height: 40px;
  border-radius: 5px;
  border: solid 1px #cacaca;
  width: 100%;
  padding: 10px 12px;
  padding-right: 30px;
  font-family: ${primaryFont};
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #f5f5f5;
    border: none;
  }
`;

const InputWrapper = styled(Grid)`
  position: relative;
  padding: 0;
  margin: 0;
  img {
    height: 16px;
    width: 19px;
    position: absolute;
    top: 10px;
    cursor: pointer;
    opacity: 0.8;
    right: 10px;
  }
`;

class TextPassword extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      type: 'password',
    };

    this.showHide = this.showHide.bind(this);
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'text' ? 'password' : 'text',
    });
  }

  render() {
    const { label, handleInputChange, value, name, ...rest } = this.props;
    const PasswordIcon = this.state.type === 'text' ? EyeOpenIcon : EyeIcon;
    return (
      <React.Fragment>
        {label && (
          <Grid item xs={12}>
            <Text size="10px" weight="bold" color="#1d1d26" align="left" opacity="0.4">
              {label}
            </Text>
          </Grid>
        )}
        <InputWrapper item xs={12}>
          <Input 
            value={value} 
            name={name} 
            type={this.state.type} 
            onChange={handleInputChange} {...rest} 
            autoComplete="off"
            onKeyDown={(e) => {
              if ( e.key === " " ) {
                e.preventDefault();
              }
            }}
          />
          <img role="button" onClick={this.showHide} src={PasswordIcon} alt="Show/Hide Password" />
        </InputWrapper>
      </React.Fragment>
    );
  }
}

TextPassword.propTypes = {
  value: PropTypes.any,
  handleInputChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  rest: PropTypes.object,
};

export default TextPassword;
