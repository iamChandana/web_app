import _uniq from 'lodash/uniq';
import _includes from 'lodash/includes';

export function checkExistingAccountTypes(maxTypesOfAccounts, existingUserAccounts, accountType) {
  const accountTypes = _uniq(existingUserAccounts.map((accountItem) => accountItem.UTRACCOUNTTYPE));
  const NRICAccountList = existingUserAccounts.filter((accountItem) => accountItem.identificationType === 'NRIC');
  if (accountType === 'KW' && !_includes(accountTypes, accountType)) {
    return NRICAccountList.length > 0;
  }
  return accountTypes.length !== maxTypesOfAccounts.length && !_includes(accountTypes, accountType);
}

export function filterSuspendedAccountArray(accountArray, accountType) {
  return accountArray.filter(
    (accountItem) =>
      accountItem.UTRACCOUNTTYPE === accountType && accountItem.AccountStatus === 'S' && accountItem.totalNetAssetValue === 0,
  );
}

export function checkEmisKWSPAccount(account) {
  const kwspAccountArray = account.filter((accountItem) => accountItem.UTRACCOUNTTYPE === 'KW');
  const kwspSuspendedArray = filterSuspendedAccountArray(kwspAccountArray, 'KW');
  const kwspActiveArray = kwspAccountArray.filter((accountItem) => accountItem.AccountStatus === 'A' && !accountItem.isEmis);
  const emisKwspArray = kwspAccountArray.filter((accountItem) => accountItem.isEmis);
  return (
    kwspActiveArray.length === 0 &&
    account[0].identificationType === 'NRIC' &&
    (kwspSuspendedArray.length === kwspAccountArray.length || emisKwspArray.length === kwspAccountArray.length)
  );
}

export function checkIfAllAccountsAreSuspended(accounts) {
  const nonEmiskwspAccounts = accounts.filter((item) => item.UTRACCOUNTTYPE === 'KW' && !item.isEmis);
  const isAllAccountsAreSuspended = nonEmiskwspAccounts.every((item) => item.AccountStatus === 'S' && !item.totalNetAssetValue);
  return accounts[0].identificationType === 'NRIC' && isAllAccountsAreSuspended;
}
