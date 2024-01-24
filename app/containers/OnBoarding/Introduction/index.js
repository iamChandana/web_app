import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Question1 from './Question1';
import CifVerification from './CifVerification';
import IntroDetailInput from './IntroDetailInput';
import CustomerExist from './CustomerExist';

const basePath = '/onboarding/introduction';

class Introduction extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path={`${basePath}/introDetailInput`} component={IntroDetailInput} />
        <Route path={`${basePath}/customerExist`} component={CustomerExist} />
        <Route path={`${basePath}/cifVerification`} component={CifVerification} />
        <Route exact path={`${basePath}/question1`} component={Question1} />
        <Redirect from={basePath} to={`${basePath}/cifVerification`} />
      </Switch>
    );
  }
}

export default Introduction;
