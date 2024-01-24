import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledCheckbox from 'components/Checkbox';
import styled from 'styled-components';

const TextDetails = styled.span`
  font-size: ${(props) => (props.fontSize ? props.fontSize : '10px')};
  text-align: left;
`;

class CheckboxField extends Component {
  render() {
    const { value, input, label, onClick, disabled, fontSize, meta: classes, ...rest } = this.props;
    return (
      <React.Fragment>
        <div>
          <StyledCheckbox
            style={{
              width: '20px',
              marginRight: '5px',
              opacity: disabled ? 0.3 : 1
            }}
            disabled={disabled}
            checked={value === true}
            value={value}
            onClick={onClick}
            {...rest}
            {...input} />
          <TextDetails fontSize={fontSize}>{label}</TextDetails>
        </div>
      </React.Fragment>
    );
  }
}

CheckboxField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
  value: PropTypes.any,
  label: PropTypes.string,
  onClick: PropTypes.func,
  meta: PropTypes.object,
};

export default CheckboxField;
