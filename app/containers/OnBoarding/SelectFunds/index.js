import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import FundList from './FundList/Loadable';
import AllocateFunds from './AllocateFunds/Loadable';

const basePath = '/onboarding/select-funds/';
class SelectFunds extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route exact path={`${basePath}list`} component={FundList} />
        <Route path={`${basePath}allocate`} component={AllocateFunds} />
        <Redirect from={basePath} to={`${basePath}list`} />
      </Switch>
    );
  }
}

export default SelectFunds;
