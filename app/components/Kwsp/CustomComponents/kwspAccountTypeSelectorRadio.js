import React from 'react';
import { reduxForm, reset, Field, change } from 'redux-form';
import styled from 'styled-components';
import Radio from 'material-ui/Radio';
import Grid from 'material-ui/Grid';
import { FormControlLabel } from 'material-ui/Form';

// ********************Style Imports*********************
import Color from 'utils/StylesHelper/color';

// *************** Constants*****************
import { accountTypes } from '../../../containers/OnBoarding/Introduction/AccountLists';
// *************** Components*****************
import EpfMembershipNumber from '../../../components/Kwsp/CustomComponents/EpfMembershipField';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;
const Form = styled.form`
  margin-top: 32px;
`;



class KwspAccountTypeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeAccountType = this.handleChangeAccountType.bind(this);
  }
  handleChangeAccountType(accountType) {
    const { handleChange } = this.props;
    this.props.change('epfMembershipNumber', '');
    handleChange(accountType);
  }
  render() {
    const { kwspAccountType, epfErrorMessage } = this.props;
    return (
      <Form >
        <Grid container direction="column">
          <Grid xs={12} container item direction="row" justify="between" alignItems="between" style={{ paddingBottom: '20px', display: 'flex' }}>
            {accountTypes.map((accountItem) => (accountItem.accountType !== 'CS' &&
              <React.Fragment>
                <Grid item alignItems="center" xs={6} style={{ paddingLeft: '24px' }}>
                  <StyledRadioButton
                    control={<Radio />}
                    label={accountItem.description}
                    onChange={() => this.handleChangeAccountType(accountItem.codevalue)}
                    checked={accountItem.codevalue === kwspAccountType}
                  />
                </Grid>
              </React.Fragment>
            ))
            }
          </Grid>
          <Grid xs={12} contaner item direction="row" justify="between" alignItems="between" style={{ paddingBottom: '40px', display: 'flex' }}>
            <Grid item alignItems="center" xs={6} style={{ paddingLeft: '28px', paddingRight: '28px' }}>
              {(kwspAccountType === 'I' || kwspAccountType === 'C') && <Field component={EpfMembershipNumber} width={'100%'} isEpfVisible epfErrorMessage={epfErrorMessage} />}
            </Grid>
          </Grid>
        </Grid>
      </Form >
    );
  }
}

const KwspAccountTypeSelection = reduxForm({
  form: 'KwspAccountTypeSelector', // a unique identifier for this form
  destroyOnUnmount: false,
  enableReinitialize: true,
  // asyncValidate,
})(KwspAccountTypeSelector);

export default KwspAccountTypeSelection;

