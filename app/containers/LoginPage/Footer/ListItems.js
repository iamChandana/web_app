import TermContent from 'utils/FooterLinkContents/term';
import PrivacyContent from 'utils/FooterLinkContents/privacy';
import InternetRiskContent from 'utils/FooterLinkContents/internetRisk';
import TradePoliciesContent from 'utils/FooterLinkContents/tradePolicies';
import TransactionNoticeContent from 'utils/FooterLinkContents/transactionNotice';

const ListItems = [
  {
    type: 'term',
    text: 'Terms and Conditions',
    title: 'Please read our terms and conditions:',
    content: TermContent,
  },
  {
    type: 'privacy',
    text: 'Privacy Notice',
    title: 'Privacy Notice:',
    content: PrivacyContent,
  },
  {
    type: 'internet',
    text: 'Internet Risk',
    title: 'Internet Risk:',
    content: InternetRiskContent,
  },
  {
    type: 'transaction',
    text: 'Transaction Notice',
    title: 'Transaction Notice:',
    content: TransactionNoticeContent,
  },
  {
    type: 'cross',
    text: 'Cross Trade Policies',
    title: 'Cross Trade Policies:',
    content: TradePoliciesContent,
  },
  {
    type: 'faq',
    text: 'FAQ',
  },
];

export default ListItems;
