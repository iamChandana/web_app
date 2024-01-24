import React from 'react';
import PropTypes from 'prop-types';
import { RowGridCenter } from 'components/GridContainer';
import ReactSelectField from 'components/FormUtility/FormFields/ReactSelectField';
import { MirrorGridItem, StyledField } from '../Components';
import EpfMembershipNumber from '../../../components/Kwsp/CustomComponents/EpfMembershipField';

export default class AccountType extends React.Component {
  handleChange = (accountType) => {
    let isEpfVisible;
    let islamicORConventionalFlag;
    let accountCategory;

    accountCategory = this.props.accountTypes.filter((accountItem) => accountItem.codevalue === accountType)[0].accountType;
    islamicORConventionalFlag = this.props.accountTypes.filter((accountItem) => accountItem.codevalue === accountType)[0].islamicORConventionalFlag;
    isEpfVisible = this.props.accountTypes.filter((accountItem) => accountItem.codevalue === accountType)[0].accountType !== 'CS';

    this.props.setAccountType(accountType, isEpfVisible, islamicORConventionalFlag, accountCategory);
  }

  render() {
    const { accountTypes, isEpfVisible, epfErrorMessage } = this.props;

    return (
      <div style={{ marginTop: '20px' }}>
        <RowGridCenter spacing={24}>
          <MirrorGridItem item xs={6}>
            <StyledField
              data={accountTypes}
              label="ACCOUNT TYPE"
              name="accountType"
              component={ReactSelectField}
              placeholder="Select id type"
              handleChange={(accountType) => this.handleChange(accountType)}
            />
          </MirrorGridItem>

          <MirrorGridItem item xs={6}>
            <EpfMembershipNumber isEpfVisible={isEpfVisible} epfErrorMessage={epfErrorMessage} />
          </MirrorGridItem>
        </RowGridCenter>
      </div>
    );
  }
}

AccountType.propTypes = {
  epfErrorMessage: PropTypes.bool,
};
