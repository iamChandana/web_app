import { Field } from 'redux-form';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';

export const MirrorGridItem = styled(Grid)`
  display: flex;

  &:nth-child(2n) {
    justify-content: flex-start;
  }
  
  &:nth-child(2n+1) {
    justify-content: flex-end;
  }
`;

export const MirrorGridItemFlexEnd = styled(Grid)`
  display: flex;

    justify-content: flex-start;
  
`;

export const StyledField = styled(Field)` 
  border-bottom: ${(props) => props.borderBottom || '0px'};
  opacity: ${(props) => props ? props.opacity : 1};
  label {
    opacity: 0.4;
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: ${(props) => props.lineHeightLabel || 1.0};
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
  input,
  div {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #1d1d26;
    &::before, &::after{
      background-image: ${(props) => props.borderBottom || 'none'} !important;
      background: ${(props) => props.borderBottom || 'transaparent'} !important;
    }
  }

  .css-d8oujb {
    display: none;
  }
  .css-1rtrksz {
    padding-left: 0 !important;
    flex-wrap: nowrap !important;
  }
  .css-ln5n5c {
    display: none;
  }

  p {
    position: relative;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    color: ${Color.C_LIGHT_BLUE};
  }  
`;
