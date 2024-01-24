import _findIndex from 'lodash/findIndex';

export default function SortByAccountType(productbreakdown, accounts) {
    let sortedArray = [];
    const jointAccountFunds = productbreakdown.filter((fundItem) => {
        const accountNumberIndex = _findIndex(accounts, ["partnerAccountMappingId", fundItem.partnerAccountNo]);
        return accounts[accountNumberIndex].UTRACCOUNTTYPE === 'CS' && accounts[accountNumberIndex].jointAccounts && accounts[accountNumberIndex].jointAccounts.length;
    });

    const individualAccountFunds = productbreakdown.filter((fundItem) => {
        const accountNumberIndex = _findIndex(accounts, ["partnerAccountMappingId", fundItem.partnerAccountNo]);
        return accounts[accountNumberIndex].UTRACCOUNTTYPE === 'CS' && accounts[accountNumberIndex].jointAccounts && !accounts[accountNumberIndex].jointAccounts.length;
    });

    const kwspAccountFunds = productbreakdown.filter((fundItem) => {
        const accountNumberIndex = _findIndex(accounts, ["partnerAccountMappingId", fundItem.partnerAccountNo]);
        return accounts[accountNumberIndex].UTRACCOUNTTYPE === 'KW';
    });

    sortedArray = [...individualAccountFunds, ...jointAccountFunds, ...kwspAccountFunds];
    return sortedArray;
}