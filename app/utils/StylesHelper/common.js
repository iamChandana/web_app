import styled from 'styled-components';

export const StyledDiv2ColumnParent = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  padding-bottom: 10px;
  > div {
    flex: 1;
  }
`;

export const StyledDiv2ColumnChildLeft = styled.div`
  text-align: left;
`;

export const StyledDiv2ColumnChildRight = styled.div`
  position: relative;
  height: 50px;
  text-align: right;
  font-size: 10px;
  line-height: 16px;
`;

export const StyledDivRounded = styled.div`
  border-radius: 50%;
  width: 29px;
  height: 29px;
  padding: 5px;
  background: rgb(0, 145, 218);
  text-align: center;
`;

export const StyledDivVerticalLine = styled.div`
  border-left: 1px solid #b9b9be;
  height: 100%;
`;
