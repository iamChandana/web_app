import _includes from 'lodash/includes';

export function filterJointAccountsFunds(selectedFunds, customerAccountList) {
    let jointAccountFundList = [];
    selectedFunds.map((fundItem) => {
        customerAccountList.map((accountItem) => {
            if (accountItem.partnerAccountMappingId === fundItem.partnerAccountNo &&
                accountItem.jointAccounts &&
                accountItem.jointAccounts.length) {
                jointAccountFundList.push(fundItem);
            }
        });
    });
    return jointAccountFundList;
}

export function filterJointAccounts(customerAccountList, accountSubType) {
    let individualAccounts;
    if (accountSubType === 'I') {
        individualAccounts = customerAccountList.find((accountItem) => accountItem.UTRACCOUNTTYPE === 'CS' && accountItem.jointAccounts && !accountItem.jointAccounts.length);
    }
    return individualAccounts && individualAccounts.partnerAccountMappingId;
}

export function findOtpSelectedAccounts(otpString, accountNumber) {
    if (otpString && otpString.length > 1) {
        const accountArray = Object.keys(JSON.parse(otpString));
        console.log('ACCOUNT ARRAY', accountArray);
        return !_includes(accountArray, accountNumber);
    } return true;
}