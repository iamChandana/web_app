import React from 'react';
import styled from 'styled-components';
import { FormControlLabel } from 'material-ui/Form';
import ExpansionPanel, { ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Color from 'utils/StylesHelper/color';
import downIcon from 'containers/Faq/images/down.svg';
import Button from 'components/Button';

const widthOfInputFieldContainer = '1920px';

export const CustomIcon = () => <img src={downIcon} alt="test" />;

export const DisabledRadioButton = styled(FormControlLabel)`
 svg {
   color: ${Color.C_LIGHT_GRAY};
 }
`;
export const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
    opacity: ${(props) => props.disabled ? 0.5 : 1};
  }
`;
export const BolderText = styled.span`
font-weight: bolder !important;
`;

export const StyledDetails = styled(ExpansionPanelDetails)`
  flex-direction: column;
  border-top: 1px solid #ccc;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`;

export const StyledPanel = styled(ExpansionPanel)`
border-radius: 5px;
background-color: #ffffff;
box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.17);
`;

export const ContentItem = styled.div`
padding: 10px 0 10px 0;
width: ${widthOfInputFieldContainer};
`;

export const StyledButton = styled(Button)`
  margin: 20px 0;
  background: ${(props) => props.primary ? Color.C_LIGHT_BLUE : 'none'};
  color: ${(props) => props.primary ? Color.C_WHITE : 'none'};
`;