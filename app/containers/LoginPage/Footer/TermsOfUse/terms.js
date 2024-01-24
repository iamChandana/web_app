import FirstTimeLoginContent from 'utils/TermsContent/firstTimeLogin';
import AccountCreation from 'utils/TermsContent/accountCreation';
import Transaction from 'utils/TermsContent/transaction';
import TransactionTitle from 'utils/TermsContent/transactionTitle';
import Redeem from 'utils/TermsContent/redeem';
import RedeemTitle from 'utils/TermsContent/redeemTitle';

const Terms = [
  {
    id: 1,
    label: '1. Terms of Use',
    value: FirstTimeLoginContent,
  },
  {
    id: 2,
    label: '2.  Account Opening',
    value: AccountCreation,
  },
  {
    id: 3,
    label: '3. Transaction',
    value: TransactionTitle + Transaction,
  },
  {
    id: 4,
    label: '4. Redemption',
    value: `${RedeemTitle}${Redeem}`,
  },
];

export default Terms;
