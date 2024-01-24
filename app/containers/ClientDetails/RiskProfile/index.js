import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Question1 from './Question1';
import Select from './SelectProfile';
import Question2 from './Question2';
import Result from './Result';
import IntroDetailInput from './IntroDetailInput';
import Question3 from './Question3';
import Question4 from './Question4';
import Question5 from './Question5';

const basePath = '/retake/risk-profile';
class RiskProfile extends React.PureComponent {
  render() {
    return (
      <div style={{ marginTop: '50px' }}>
        <Switch>
          <Route path={`${basePath}/select`} component={Select} />
          <Route exact path={`${basePath}/question1`} component={Question1} />
          <Route exact path={`${basePath}/question2`} component={Question2} />
          <Route exact path={`${basePath}/question3`} component={Question3} />
          <Route exact path={`${basePath}/question4`} component={Question4} />
          <Route exact path={`${basePath}/question5`} component={Question5} />
          <Route exact path={`${basePath}/intro`} component={IntroDetailInput} />
          <Route path={`${basePath}/result`} component={Result} />
          <Redirect from={basePath} to={`${basePath}/intro`} />
        </Switch>
      </div>
    );
  }
}

export default RiskProfile;
