import styled from 'styled-components';
import Button from 'components/Button';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Select from 'components/Select';
import Modal from '../Modal';

export const StyleButton = styled(Button)`
  margin-top: 16px;
`;

export const ModalForCancelRspPopUp = styled(Modal)`
  width: 610px !important;
`;

export const TotalTopUp = styled(Text)`
  margin-right: 20px;
`;
export const TotalAmountGrid = styled(Grid)`
  margin-top: 16px;
`;

export const NoPadGrid = styled(Grid)`
  padding: 0 !important;
`;

export const PurposeGrid = styled(Grid)`
  padding: 12px 0;
`;
export const Container = styled(Grid)`
  width: 100%;
  padding: 16px 24px;
  background-color: ${(props) => (props.value === 'odd' ? '#f5f5f5' : '#fafafa')};
`;

export const DividerGrid = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledSelect = styled(Select)`
  margin: 0;
`;

export const StyledField = styled(TextField)`
  width: 85%;

  > div {
    &::before,
    &::after {
      background-color: #cacaca;
    }
  }

  label {
    opacity: 0.4;
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
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
`;

export const DisabledStyledField = styled(StyledField)`
> div {
  border-bottom: 1px solid rgba(0,0,0,0.4);
  &:: before{
    background-image: none !important;
  }
}
`;
