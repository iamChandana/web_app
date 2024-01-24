import _findIndex from 'lodash/findIndex';
import _isNull from 'lodash/isNull';

const getJointAccountText = (account) => account.jointAccounts && account.jointAccounts.length > 0 ? 'J' : 'I';

export function getAccountType(account) {
  let UTRACCOUNTTYPE = account.UTRACCOUNTTYPE === 'CS' ? 'CASH' : 'KWSP';

  if (account.UTRACCOUNTTYPE === 'CS') {
    UTRACCOUNTTYPE = `${UTRACCOUNTTYPE} (${getJointAccountText(account)})`;
  } else if (account.UTRACCOUNTTYPE === 'KW' && account.isEmis) {
    UTRACCOUNTTYPE = `${UTRACCOUNTTYPE} (eMIS)`;
  }
  return UTRACCOUNTTYPE;
}

export function getAccountHolderType(account) {
  let UTRACCOUNTTYPE = '';
  if (account.UTRACCOUNTTYPE === 'CS') { UTRACCOUNTTYPE = `(${getJointAccountText(account)})`; }
  return UTRACCOUNTTYPE;
}

export function getNetAssetValues(account) {
  let UTRACCOUNTTYPE = '';
  if (account.UTRACCOUNTTYPE === 'KW') {
    UTRACCOUNTTYPE = `${'KWSP ' + `${account.isEmis ? '(eMIS)' : ''}` + '('}${account.partnerAccountMappingId})`;
  } else {
    UTRACCOUNTTYPE = 'CASH' + '(' + `${account.jointAccounts && account.jointAccounts.length ? 'J' : 'I'} ` + ` - ${account.partnerAccountMappingId} ` + ')';
  }
  return { accountType: UTRACCOUNTTYPE, netAssetValues: account.totalNetAssetValue || 0 };
}

export function getAccountNumbers(accountList) {
  const jointAccounts = accountList.filter((accountItem) => accountItem.jointAccounts && accountItem.jointAccounts.length > 0);
  return jointAccounts;
}

export function findSelectedFundIndex(fundsArray, selectedFund) {
  return _findIndex(fundsArray, ['id', selectedFund.id]);
}

export function findJointAccountHolderNames(account) {
  let jointHolderNames = '';
  if (account.jointAccounts && account.jointAccounts.length) {
    account.jointAccounts.forEach((jointAccountItem, index) => {
      if (index === (account.jointAccounts.length - 2)) {
        jointHolderNames = `${jointHolderNames}, ${jointAccountItem.name}`;
      } else {
        jointHolderNames = `${jointHolderNames} & ${jointAccountItem.name}`;
      }
    });
    return jointHolderNames;
  }
}

export function getSelectedFundAccountDetails(selectedFundAccountNumber, clientDetails) {
  const accountIndex = _findIndex(clientDetails.account, ['partnerAccountMappingId', selectedFundAccountNumber]);
  return clientDetails.account[accountIndex];
}

export function getJointAccountFieldName(jointAccountNumbers) {
  let jointAccountFieldNamesArray = [];
  jointAccountNumbers.forEach((accountItem) => {
    jointAccountFieldNamesArray.push(`${accountItem.partnerAccountMappingId}_mainHolder`);
    jointAccountFieldNamesArray.push(`${accountItem.partnerAccountMappingId}_mainSecondaryHolder`);
    return;
  });
  return jointAccountFieldNamesArray;
}

function checkIfNull(accountItem) {
  return _isNull(accountItem) ? null : false;
}

export function formatJointAccountHolderArray(props) {
  const { jointAccountOtpSelection, account } = props;
  let jointAccountHolderArray = [];

  if (jointAccountOtpSelection && jointAccountOtpSelection.length > 1) {
    let jointAccountObject = JSON.parse(jointAccountOtpSelection);
    Object.keys(jointAccountObject).forEach((accountItem) => {
      jointAccountHolderArray.push({
        accountNumber: accountItem,
        mainHolder: jointAccountObject[accountItem] === 'M' ? 'M' : checkIfNull(jointAccountObject[accountItem]),
        mainSecondaryHolder: jointAccountObject[accountItem] === 'O' ? 'O' : checkIfNull(jointAccountObject[accountItem]),
      });
    });
  } else {
    const jointAccountList = getAccountNumbers(account);
    jointAccountList.map((accountItem) => {
      jointAccountHolderArray.push({
        accountNumber: accountItem.partnerAccountMappingId,
        mainHolder: null,
        mainSecondaryHolder: null,
      });
    });
  }

  return jointAccountHolderArray;
}

export function getToolTipWidth(account) {
  if (account.AccountStatus === 'S') {
    return '260px';
  } else if (account.UTRACCOUNTTYPE === 'KW' && account.isEmis) {
    return '220px';
  }
  return '190px';
}
