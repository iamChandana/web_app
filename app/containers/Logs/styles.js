import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import DatePicker from 'material-ui-pickers/DatePicker';

export const FullWidthGrid = styled(Grid)`
  width: 100%;
  .table {
    margin-top: 24px;
  }
  &.filter {
    margin-top: 24px;
  }

  &.pagination {
    margin-top: 32px;
  }
`;

export const Container = styled.div`
  padding: 32px 40px;
`;

export const StyledDivider = styled(Divider)`
  width: 100%;
  margin: 5px 0 !important;
`;

export const ArrowImage = styled.img`
  margin-left: 9px;
  width: 9px;
  height: 9px;
`;

export const StyledDatePicker = styled(DatePicker)`
  visibility: hidden;
  height: 0;
`;

export const NoticeWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;
