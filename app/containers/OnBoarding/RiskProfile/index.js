import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Question1 from './Question1';
import Select from './SelectProfile';
import Question2 from './Question2';
import Question3 from './Question3';
import Question4 from './Question4';
import Question5 from './Question5';
import Result from './Result';

const basePath = '/onboarding/risk-profile';
class RiskProfile extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path={`${basePath}/select`} component={Select} />
        <Route exact path={`${basePath}/question1`} component={Question1} />
        <Route path={`${basePath}/question2`} component={Question2} />
        <Route path={`${basePath}/question3`} component={Question3} />
        <Route path={`${basePath}/question4`} component={Question4} />
        <Route path={`${basePath}/question5`} component={Question5} />
        <Route path={`${basePath}/result`} component={Result} />
        <Redirect from={basePath} to={`${basePath}/question1`} />
      </Switch>
    );
  }
}

export default RiskProfile;
