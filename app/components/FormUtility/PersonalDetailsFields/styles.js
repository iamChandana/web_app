import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { Field } from 'redux-form';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';

export const GrayContainer = styled.div`
  background-color: #f5f5f5;
  width: 100%;
  text-align: center;
`;

export const ButtonContainer = styled(Grid)`
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const StyledButton = styled(Button)`
  margin: 40px 0;
`;

export const StyledButton2 = styled(Button)`
  margin: 40px 12px;
`;

export const Form = styled.form`
  margin-top: 32px;
`;

export const NameGrid = styled(Grid)`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const GridHere = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export const StyledField = styled(Field)`
  border-bottom: ${(props) => props.borderBottom || '0px'};
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
  }
  input{
    border-bottom: ${(props) => props.borderBottom || '0px'};
    &::before{
      background-image: ${(props) => props.disabled && 'none'} !important;
      background: ${(props) => props.disabled ? 'transaparent' : 'none'} !important;
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

export const DisabledStyledField = styled(StyledField)`
> div {
  border-bottom: ${(props) => props.borderBottomField};
  &:: before{
    background-image: none !important;
    background: ${(props) => props.disabled ? 'transaparent' : 'none'} !important;
  }
}
`;


export const HiddenField = styled(Field)`
  visibility: hidden;
`;
