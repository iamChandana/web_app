import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Details from './Details/Loadable';
import Transfer from './Transfer/Loadable';

const basePath = '/onboarding/transfer-funds/';
class TransferFunds extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route exact path={`${basePath}details`} component={Details} />
        <Route path={`${basePath}transfer`} component={Transfer} />
        <Redirect from={basePath} to={`${basePath}details`} />
      </Switch>
    );
  }
}

export default TransferFunds;
