import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

export const FullWidthGrid = styled(Grid)`
  width: 100%;
`;

export function RowGridCenter(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="row" justify="center" alignItems="center" {...rest}>
      {children}
    </Grid>
  );
}

export function RowGridLeft(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="row" justify="flex-start" alignItems="flex-start" {...rest}>
      {children}
    </Grid>
  );
}

export function RowGridRight(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="row" justify="flex-end" alignItems="flex-end" {...rest}>
      {children}
    </Grid>
  );
}

export function RowGridSpaceBetween(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="row" justify="space-between" alignItems="center" {...rest}>
      {children}
    </Grid>
  );
}

export function RowGridSpaceAround(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="row" justify="space-around" alignItems="center" {...rest}>
      {children}
    </Grid>
  );
}
export function ColumnGridCenter(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="column" justify="center" alignItems="center" {...rest}>
      {children}
    </Grid>
  );
}

export function ColumnGridLeft(props) {
  const { children, ...rest } = props;
  return (
    <Grid container direction="column" justify="flex-start" alignItems="flex-start" {...rest}>
      {children}
    </Grid>
  );
}

export default {
  RowGridCenter,
  RowGridLeft,
  RowGridSpaceBetween,
  RowGridSpaceAround,
  RowGridRight,
  ColumnGridCenter,
  ColumnGridLeft,
};
