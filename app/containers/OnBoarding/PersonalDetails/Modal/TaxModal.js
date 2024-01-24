import React, { Component } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    maxWidth: '720px',
    top: '50%',
    width: '100%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '32px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    maxHeight: '560px',
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
    overflow: 'auto',
  },
};

const StyledText = styled(Text)`
  margin-top: 8px;
  font-size: 14px;
  color: #1d1d26;
  text-align: left;
`;

const StyledSelect = styled(Select)`
  width: 200px;
  min-height: 40px;
  border-radius: 5px;
  background-color: ${(props) => (props.done ? '#35c12f;' : Color.C_LIGHT_BLUE)};
  margin-top: 15px;
  text-align: center;
  > div > div {
    margin-top: 5px;
    color: #fff;
  }
  &::before,
  &::after {
    display: none;
  }
  svg {
    color: #fff;
    display: ${(props) => (props.done ? 'none' : 'block')};
  }
`;

class TaxModal extends Component {
  constructor() {
    super();
    this.state = {
      taxPayment: false,
    };
  }

  onToggleCheckbox(param) {
    param ? this.setState({ taxPayment: true }) : this.setState({ taxPayment: false });
  }

  onChange(e) {
    this.setState({ taxPayment: e.target.value });
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} style={customStyles}>
        <StyledText>Are you paying your tax in other jurisdiction?</StyledText>
        <StyledSelect value={this.state.taxPayment} onChange={(e) => this.onChange(e)}>
          <MenuItem value>{'Yes'}</MenuItem>
          <MenuItem value={false}>{'No'}</MenuItem>
        </StyledSelect>

        <div
          style={{
            display: this.state.taxPayment ? 'block' : 'none',
          }}
        />
      </Modal>
    );
  }
}

export default TaxModal;
