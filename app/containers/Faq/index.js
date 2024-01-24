/**
 *
 * Faq
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import injectSaga from 'utils/injectSaga';
import makeSelectFaq from './selectors';
import saga from './saga';
import Container from './Container';
// import ExpandableQuestions from './ExpandableQuestions';
import Expand1 from './Expand1';
import Expand2 from './Expand2';
import Expand3 from './Expand3';
import MenuList from './MenuList';
import Header from './Header';
import Logo from './Logo';
import BackToLogin from './BackToLogin';

const gettingStarted = [
  {
    id: 1,
    label: 'How do I Login?',
    value:
      "<p>Go to the Login page, enter your User ID and verify your Secure Word / Secure Image. If the Secure Word / Secure Image is correct, enter your password and click 'Login'. If the Secure Word / Secure Image displayed is incorrect, please contact our Customer Care Centre within its operating hours at 03-7718 3100 between 8.45 a.m. and 5.45 p.m., Monday to Thursday and between 8.45 a.m. and 4.45 p.m. on Fridays (except on Selangor and national public holidays).</p>",
  },
  {
    id: 2,
    label: 'What should I do if I have forgotten my User ID?',
    value:
      '<p>You may click on the “Recover my User ID” hyperlink. An email will be sent to your registered email with Principal. Please ensure your email address is valid for you to reset your User ID.</p>',
  },
  {
    id: 3,
    label: 'Why is my online access is locked?',
    value:
      '<p>Your online access will be locked if you’ve attempted to login with an incorrect password and exceeded 3 times. If your online access is locked, please click on the "Reset Password" hyperlink.</p>',
  },
  {
    id: 4,
    label: 'How do I change my password?',
    value:
      '<p>Once you have logged in, click on Change Password link in Consultant Dashboard. You will be required to fill in your current password, new password, and OTP that will be sent to your registered mobile number.</p>',
  },
  {
    id: 5,
    label: 'What should I do if my password is expired?',
    value: `<p>For security reasons, Consultant's password will expire after 60 days. When the password has expired during login, click on the "Reset Password" hyperlink. You have the option to use the same password or to change to a new one.</p>`,
  },
  {
    id: 6,
    label: 'Can I still log in if my password has expired?',
    value: '<p>You may login, but you are required to change or maintain your password immediately upon login.</p>',
  },
  {
    id: 7,
    label: 'Can I change my password using the Change Password option more than once on the same day?',
    value:
      '<p>It is not possible to change the password multiple times in a day. It will take 3 days to change the password for the second time on the count of the date of change password executed first time.</p>',
  },
  {
    id: 8,
    label: 'What is Secure Word and Secure Image?',
    value:
      '<p>Secure Word and Secure Image is a security process to confirm the entered User ID. You may proceed to enter their password if the Secure Word and Secure Image displayed is correct.</p>',
  },
  {
    id: 9,
    label: 'What is the importance of having your Secure Word and Secure Image updated from time to time?',
    value:
      '<p>At Principal, we are serious in keeping your information confidential. The Secure Word and Secure Image is a security layer to avoid phishing attempts into Principal Direct Access. Phishing is an attempt to acquire sensitive information such as user IDs and passwords for malicious reasons by untrustworthy entities. Hence, it is important for you to update the Secure Word and Secure Image from time to time.</p>',
  },
  {
    id: 10,
    label: 'Once I’ve selected my Secure Word and Secure Image in Principal Direct Access, when will it take effect?',
    value: '<p>The new Secure Word and Secure Image will take effect immediately.</p>',
  },
  {
    id: 10,
    label: 'How do I get back to the Dashboard?',
    value: '<p>You can click on the Principal logo.</p>',
  },
  //{
  //  id: 19,
  //  label: 'How much do I need to invest in the Principal`s investment funds?',
  //  value:
  //    '<p>You can start with as little as RM500 in any Fund.</p><br/><p></p>The minimum initial investment for Principal Bond Fund, Principal Strategic Bond Fund, CIMB Islamic Enhanced Sukuk Fund and CIMB Islamic Sukuk Fund is RM2,000 or such amounts as the Manager may from time to time decide. </p></br><p>The minimum initial investment for Principal Enhanced Opportunity Bond Fund is RM5,000 or such amounts as the Manager may from time to time decide.</p><br/><p>The minimum initial investment for Principal Deposit Fund, Principal Money Market Income Fund, CIMB Islamic Money Market Fund and CIMB Islamic Deposit Fund is RM10,000 or such amounts as the Manager may from time to time decide.</p>',
  //},
];

const investments = [
  {
    id: 1,
    label: 'Will the investment amount be deducted from the Client’s bank account on real time basis?',
    value:
      "<p>Yes, the amount will be deducted from the Client's bank account in real time. However, it may take up to three (3) processing days before you can see the details of the transaction in your respective bank portal. The success of the transaction is also dependent on the accuracy of the information provided by the Client. The Bank will notify the Client of any rejected transaction via Failed Transaction module after three (3) processing days.</p>",
  },
  {
    id: 2,
    label: "How long does it take for Principal to process my Client's transactions in Principal Direct Access?",
    value: "<p>Your Client's transaction will be reflected in their Profile within 3 to 5 working days after its completion.</p>",
  },
  {
    id: 3,
    label:
      'If the Client didn’t complete the Risk Profiling Questionnaire, can they still proceed with the transactions in Principal Direct Access?',
    value:
      '<p>Clients are required to complete the Risk Profiling Questionnaire before their Accounts are created and can proceed with the transactions in Principal Direct Access.</p>',
  },
  {
    id: 4,
    label: 'What would the Client obtain from the result of their Risk Assessment?',
    value:
      "<p>The assessment will help establish the Client's Risk Profile. Based on this Risk Profile, the Client will be given fund recommendations for them to proceed.</p>",
  },
  {
    id: 44,
    label: 'Can the Client choose to invest to the funds which are not shown based on his/her Risk Profile?',
    value: '<p>Yes, they can.</p>',
  },
  {
    id: 5,
    label: 'What is Switching?',
    value:
      '<p>The switching facility allows the Client to switch out from their current fund and switch into any of the funds that allow switching of units. The switching is based on the value of your investment in the fund, at the point of transaction.</p>',
  },
  {
    id: 6,
    label: 'What are the funds available for online Switching?',
    value: '<p>Only funds distributed by Principal Asset Management are allowed for switching.</p>',
  },
  {
    id: 7,
    label: 'Can the Client do more than 1 switching transaction?',
    value:
      '<p>Yes, you may select multiple funds and click on "Switch" to initiate multiple switch transaction to the switching list. Each transaction added to the list will be handled separately.</p>',
  },
  {
    id: 8,
    label: 'Does the Client need to indicate number of units for switching?',
    value:
      '<p>Yes. But by the default, it will be auto-populated with the minimum units of the selected fund/s. To switch out all the units from a fund to another, tick on the “Full” indicator. Should the balance of the units in the switched-out fund is less than the Minimum Units Holding allowed, your switching will be rejected.</p>',
  },
  {
    id: 9,
    label: 'Why are Clients required to enter OTP for switching?',
    value:
      '<p>The OTP is to confirm the transaction and to ensure that the Client has read and understood the Terms and Conditions.</p>',
  },
  {
    id: 10,
    label: 'How can the Client check the status of the switching transaction?',
    value:
      "<p>In the Client's Profile, go the Fund that where the Client has switched out, click on the drop-down arrow and on the table, the list of all Fund's transactions is found together with the Status.</p>",
  },
  {
    id: 11,
    label: 'How can I check the status of the switching transaction?',
    value:
      '<p>You may refer to the Logs that shows the status of the all your transactions submitted through Principal Direct Access.</p>',
  },
  {
    id: 12,
    label:
      'What should I do if the Client would like to amend the investment amount or the choice of fund(s) after the OTP confirmation?',
    value: `<p>If the OTP confirmation happened after the Payment Mode has been selected, for Cheque and Bank Draft, after you’ve submitted the transaction, you may call the Branch and request for the transaction to be Rejected. Then 24 hours after the transaction has been Rejected, you may re-subscribe to the same fund. For Online Bank Transfer, if the transaction remains unpaid, the link will expire after 48 hrs. You may re-subscribe to the same fund after that.</p><br/><p>However, if the OTP confirmation happened right after onboarding but before the process of selecting the Payment Mode, the transactions will be removed after 7 days if no Payment Mode has been selected.</p>`,
  },
];

const clientAccount = [
  {
    id: 1,
    label: 'How can I resend the Email Verification notification to my Client?',
    value:
      "<p>To resend the verification email, click on the bell icon beside the Client's Email Address in the header of the Client's Profile.</p>",
  },
  {
    id: 2,
    label: "What should I do if the Client's Risk Score is expired?",
    value:
      '<p>The Client will have to retake the <b>Investor Suitability Assessment Test</b> in PDA. To do so, go to the Client’s Profile and click on the <b>Retake Suitability Assessment Test</b>. </p>',
  },
  {
    id: 3,
    label: 'What should I do if Client needs to update his/her personal details in Principal Direct Access?',
    value:
      '<p>You should update client’s personal details via Customer Information Update form (e-Form) in AssistPro and print-out the e-Form for Client’s signature. Then submit it to Branch.</p>',
  },
  {
    id: 4,
    label:
      'What should I do if I realized that I have input my Client’s information wrongly after onboarding the client in Principal Direct Access?',
    value: 'You may contact our Customer Care Centre at 03-7718 3100.',
  },
  {
    id: 5,
    label:
      'What should I do if the account is unable to proceed due to the uploaded document, such as NRIC, Passport or Visa is blurred?',
    value:
      'You may use the re-upload functionality in Principal Direct Access and inform Customer Care Centre that a new document has been uploaded. Allow 2 to 3 business days for the new document to be verified and for the transactions to be enabled again for the account.',
  },
  {
    id: 6,
    label:
      'How can I know the reason for the account shown with amber color in Principal Direct Access and what should I do next?',
    value: 'You may contact our Customer Care Centre at 03-7718 3100.',
  },
  {
    id: 7,
    label:
      'Under what kind of conditions does the Consultant need to submit CRS form? Tax resident other than Malaysia only need to submit CRS form?',
    value: 'All customers should fill out the CRS section in the Personal details page.',
  },
];

const generalQuestions = [
  {
    id: 1,
    label:
      'Will my enquiries emailed to the Customer Support and Digital Support be attended immediately? Is this a 24 hours service?',
    value:
      'It is not a 24 hours service. Enquiries submitted will be attended by Principal Asset Management’s Customer Care Centre within it operation hours at 03-77237261 between 8:45 a.m. and 5:45 p.m., Mondays to Fridays (except on Kuala Lumpur and national public holidays) to update your contact details. And for Agency Hotline you may contact 03-77237261.',
  },
  // {
  //   id: 2,
  //   label: 'The Client wants to update their email address and their mobile number. What should I do?',
  //   value:
  //     "To update the Client's Email Address, go to the Client's Profile, click on Edit and update the Email Address. An Email Verification will be sent to this new Email Address. For more details, check the user manual provided for Principal Direct Access. To update the Client's mobile number, please ask the Client to contact our Customer Care Centre at 03-7718 3100.",
  // },
  // {
  //   id: 3,
  //   label: 'What is Secure Word?',
  //   value:
  //     'Secure Word is a security process to confirm the entered User ID. You may proceed to enter their password if the secure word displayed is correct.',
  // },
  // {
  //   id: 4,
  //   label: 'What is the importance of having your Secure Word updated from time to time?',
  //   value:
  //     'At Principal, we are serious in keeping your information confidential. The Secure Word is a security layer to avoid phishing attempts into Principal Direct Access. Phishing is an attempt to acquire sensitive information such as user IDs and passwords for malicious reasons by untrustworthy entities. Hence, it is important for you to update the Secure Word from time to time.',
  // },
  // {
  //   id: 5,
  //   label: 'Once I’ve selected my secure word in Principal Direct Access, when will the new Secure Word take effect?',
  //   value: 'The new Secure Word will take effect immediately.',
  // },
  // {
  //   id: 6,
  //   label: 'How do I get back to the Dashboard?',
  //   value: 'User to click on the Principal logo.',
  // },
  // {
  //   id: 6,
  //   label: 'How can I check the status of the switching transaction?',
  //   value: 'You may refer to the Logs that shows the status of the all your transactions submitted using the Portal.',
  // },
  // {
  //   id: 7,
  //   label: 'How do I upload the cheque details if the Client choose to do Save & Continue Later?',
  //   value:
  //     'The Fund which is opted for Save & Continue Later will be enabled with the Subscribe button. Click on the subscribe button to continue the subscription.',
  // },
  // {
  //   id: 8,
  //   label: 'Can I change my password using the Change Password option more than once on the same day?',
  //   value:
  //     'It is not possible to change the password multiple times in a day. It will take 3 days to change the password for the second time on the count of the date of change password executed first time.',
  // },
  // {
  //   id: 9,
  //   label: "How do I present the Client's physical Cheque?",
  //   value:
  //     "You will need to present the Client's physical Cheque in the nearest Principal branch within 24 hours (business hours) from the date of the submission of the transaction in Principal Direct Access.",
  // },
  // {
  //   id: 10,
  //   label: 'What is the transaction cut off time in Principal Direct Access?',
  //   value:
  //     'Transaction cut off time for portal is 4PM daily. Consultants can still perform onboarding and transactions after the cut-off time. These will be processed in the next business day.',
  // },
  // /*{
  //   id: 11,
  //   label: 'When will my successful submitted transaction request (buy order) be processed by Principal?',
  //   value: 'Your buy order will be processed on the same business day should the successful submitted transaction request received before 4pm. If your successful submitted transaction request received after 4pm or on a non-business day, orders will be processed on the next business day.',
  // },*/
  // {
  //   id: 11,
  //   label:
  //     'Under what kind of conditions does the Consultant need to submit CRS form? Tax resident other than Malaysia only need to submit CRS form?',
  //   value: 'All customers should fill out the CRS section in the Personal details page.',
  // },
  // {
  //   id: 12,
  //   label: 'Can the Client submit a third party’s (immediate families) cheque to the portal?',
  //   value: 'No third-party account cheques are allowed. Also it is indicated on the disclaimer in the Cheque upload screen/tab.',
  // },
  // {
  //   id: 13,
  //   label: 'How can I resend the Email Verification notification to my Client?',
  //   value:
  //     "To resend the verification email, click on the bell icon beside the Client's Email Address in the header of the Client's Profile.",
  // },
  // {
  //   id: 14,
  //   label: "What should I do if the Client's account is shown in amber color in Principal Direct Access?",
  //   value: 'You may contact our Customer Care Centre at 03-7718 3100.',
  // },
  // {
  //   id: 15,
  //   label: "What should I do if the Client's Risk Score is expired?",
  //   value: 'You may contact our Customer Care Centre at 03-7718 3100.',
  // },
  // {
  //   id: 16,
  //   label: 'Why is the Online Bank Transfer option is disabled?',
  //   value:
  //     "The Client's email address needs to be verified. To resend the verification email, click on the bell icon beside the Client's Email Address in the header of the Client's Profile.",
  // },
  // {
  //   id: 17,
  //   label: "What information can be updated in the Client's Profile in Principal Direct Access?",
  //   value:
  //     'Personal Details - Title, Marital Status, Email Address, Interests, Permanent and Correspondence Address, Employment Details, Account Details',
  // },
  // {
  //   id: 18,
  //   label:
  //     'What should I do if the client would like to amend the investment amount or the choice of fund(s) after the OTP confirmation?',
  //   value:
  //     'If the OTP confirmation happened after the Payment Mode has been selected, for Cheque and Bank Draft, after you’ve submitted the transaction, you may call the Branch and request for the transaction to be Rejected. Then 24 hours after the transaction has been Rejected, you may re-subscribe to the same fund. For Online Bank Transfer, if the transaction remains unpaid, the link will expire after 48 hrs. You may re-subscribe to the same fund after that. However, if the OTP confirmation happened right after onboarding but before the process of selecting the Payment Mode, the transactions will be purged after 7 days if no Payment Mode has been selected.',
  // },
  // {
  //   id: 19,
  //   label:
  //     "What should I do if I realized that I have written my Client's information wrongly after onboarding the client in Principal Direct Access?",
  //   value: 'You may contact our Customer Care Centre at 03-7718 3100.',
  // },
  // {
  //   id: 20,
  //   label:
  //     'What should I do if the account is unable to proceed due to the uploaded document, such as NRIC, Passport or Visa is blurred?',
  //   value:
  //     'You may use the re-upload functionality in Principal Direct Access and inform Customer Care Centre that a new document has been uploaded. Allow 2 to 3 business days for the new document to be verified and for the transactions to be enabled again for the account.',
  // },
  // {
  //   id: 21,
  //   label:
  //     'How can I know the reason for the account shown with amber color in Principal Direct Access and what should I do next?',
  //   value: 'You may contact our Customer Care Centre at 03-7718 3100.',
  // },
  // {
  //   id: 22,
  //   label:
  //     'Will my enquiries emailed to the Customer Support and Digital Support be attended immediately? Is this a 24 hours service?',
  //   value:
  //     'It is not a 24 hours service. Enquiries submitted will be attended by Principal Asset Management’s Customer Care Centre within its operation hours at 03-7718 3100 between 8.45 a.m. and 5.45 p.m., Monday to Thursday and between 8.45 a.m. and 4.45 p.m. on Fridays (except on Selangor and national public holidays) to update your contact details. And for Agency Hotline you may contact 03-77237261.',
  // },
];

const transactions = [
  {
    id: 1,
    label:
      'What will happen if the Client do not select any Payment Mode right after making a transaction for initial investment?',
    value:
      'The transaction status will remain as Pending. Two Email Notifications will be sent to Consultant as reminders. Subsequently, two SMS notifications will also be sent to the Clients as reminders as well.',
  },
  {
    id: 2,
    label: 'When will be the 1st reminder to be sent out to the Consultant and Client?',
    value:
      'After 24 hours, Consultant receives an Email Notification and Client receives an SMS reminding them that the Transaction is still unpaid.',
  },
  {
    id: 3,
    label: 'When will be the 2nd reminder to be sent out to the Consultant and Client?',
    value:
      'After 3 days, Consultant receives an Email Notification and Client receives an SMS reminding them that the Transaction is still unpaid.',
  },
  {
    id: 4,
    label: 'What will happen if no Payment Mode was selected after the 2nd reminder?',
    value:
      'If the transactions remains Pending with no Payment Mode selected, the transaction will be removed after 7 days. The Fund will no longer have the Not Subscribed tag. Collapsing the fund will show that the transaction removed.',
  },
  {
    id: 5,
    label: 'What should the Consultant do if the transaction has been removed after 7 days?',
    value: 'Client can perform sales by clicking Add Funds and select the same or other funds.',
  },
  {
    id: 6,
    label: 'When will the payment link expire if the client chooses to make the payment with online bank transfer?',
    value: 'The online payment link will expire after 48 hours.',
  },
  {
    id: 7,
    label: 'What should the Consultant do if the payment link has expired after 48 hours?',
    value: 'Client can re-subscribe by clicking Add Funds and select the same or other funds.',
  },
  {
    id: 8,
    label: 'How do I upload the cheque/bank draft details if the Client choose to do Save & Continue Later?',
    value:
      'The Fund which is opted for Save & Continue Later will be enabled with the Subscribe button. Click on the subscribe button to continue the subscription.',
  },
  {
    id: 9,
    label: "How do I present the Client's physical cheque/bank draft?",
    value:
      "You will need to present the Client's physical cheque/bank draft in the nearest Principal branch within 24 hours (business hours) from the date of the submission of the transaction in Principal Direct Access.",
  },
  {
    id: 10,
    label: 'What is the transaction cut off time in Principal Direct Access?',
    value:
      'Transaction cut off time for portal is 4PM daily. Consultants can still perform onboarding and transactions after the cut-off time. These will be processed in the next business day.',
  },
  {
    id: 11,
    label: 'Can the Client submit a third party’s (immediate families) cheque for a transaction in Principal Direct Access?',
    value: 'No third-party account cheques are allowed. Also it is indicated on the disclaimer in the Cheque upload screen/tab.',
  },
  {
    id: 12,
    label:
      'Can the Client transact an investment transaction with Online Bank Transfer with a third party’s (immediate families) account?',
    value: 'No. They need to use a Bank Account under their name. ',
  },
  {
    id: 13,
    label: 'Can the Client submit a cheque from a joint bank account for a transaction in Principal Direct Access?',
    value: 'Yes, if the Client is one of the owners of the joint Bank Account.',
  },
  {
    id: 14,
    label: 'Why is the Online Bank Transfer option disabled?',
    value:
      "The Client's email address needs to be verified. To resend the verification email, click on the bell icon beside the Client's Email Address in the header of the Client's Profile.",
  },
];

const rsp = [
  {
    id: 1,
    label:
      'Can I enroll the lump sum (initial) investment together with the RSP (Regular Savings Plan) in the Principal Direct Access?',
    value:
      'No. The initial investment needs to be disbursed first, meaning if the transaction status is already Completed, only then can the Client enroll the RSP.',
  },
  {
    id: 2,
    label: 'What is the maximum RSP amount for each fund that I can set up for my client in Principal Direct Access?',
    value: 'This will depend on the funds. Currently, it is setup to have a maximum of RM10,000.',
  },
  {
    id: 3,
    label: 'What is the maximum number of funds that I can set up for my client in Principal Direct Access for each RSP setup?',
    value: `<p>The maximum number of funds allowed for each RSP setup is 3 funds. If the Client wants to setup an RSP for more than 3 funds, Consultant will have to do another RSP setup.</p><p>For example, Client wants to setup an RSP for 5 funds. Consultant will need to setup the RSP for the 1<sup>st</sup> 3 funds, then perform another setup for the remaining 2 funds.</p>`,
  },
  {
    id: 4,
    label: 'Can the client cancel an RSP fund through Principal Direct Access which has been setup manually?',
    value: 'No. They need to be cancelled manually as well.',
  },
  {
    id: 5,
    label: 'Can I set up an RSP fund for my existing client through Principal Direct Access?',
    value:
      "Yes, only the Servicing Consultant can do so since only they can view their client's profile in Principal Direct Access. Also, the fund should not have an existing RSP that was setup manually.",
  },
  {
    id: 6,
    label: 'What is the cut-off date for RSP set up?',
    value:
      "If the Client's bank has approved the enrolment on or before the 20th of the month, then the first billing date will be on the same month.",
  },
  {
    id: 7,
    label: 'When is the billing date for RSP recurring payment?',
    value: 'The Principal Direct Access billing date is at 27th day of the month.',
  },
  {
    id: 8,
    label: 'How to cancel an RSP recurring payment?',
    value: 'If the RSP Setup was done in Principal Direct Access, then you can use the Cancel RSP functionality.',
  },
  {
    id: 9,
    label: 'How to update the RSP recurring amount?',
    value:
      "You may use the Edit RSP functionality in Principal Direct Access. Please note that the Client can only update the RSP Amount. If the Client wants to change the Bank they're using for RSP, the RSP needs to be canceled and redo the RSP enrolment using the new Bank.",
  },
  {
    id: 10,
    label: "Why is there an error of 'Duplicate Reference Number' after the Client clicked on the subscription link?",
    value: `<p>Prior to getting the Duplicate reference no. error message, the Client has already clicked on the Enrolment link in the email (Subscribe button), but they did not proceed with the enrolment and dropped the process midway. At that point, iPay88 has already tagged the Reference No. when the Client first clicked on the link. The status of the Reference No. was also tagged as failed by iPay88 when the Client dropped the process. </p><br/><p>So, when the Client clicked on the link again to try and do the transaction again, iPay88 returned Duplicate reference no. since they already tagged it with a failed status. The Consultant will have to redo the RSP setup again.</p>`,
  },
];

const existingClientProfile = [
  {
    id: 1,
    label: "Who can view the existing Clients' profiles in Principal Direct Access?",
    value:
      "Only the Consultants who onboarded and/or have transacted with the Client can view the existing Clients' profiles in Principal Direct Access.",
  },
  {
    id: 2,
    label: "Can I view my client's whole investment portfolio in Principal Direct Access?",
    value:
      "Yes, you can view the client's Investment Portfolio in Principal Direct Access which includes both Cash and KWSP accounts. Please take note that only Cash Funds can perform Principal Direct Access transactions. KWSP account and non-PDA funds are in read only mode.",
  },
  {
    id: 3,
    label:
      "What if the client has been onboarded with the Cash account and KWSP account with 2 different Consultants, can both Consultants view the client's portfolio?",
    value:
      "The Consultant who onboarded the Client with Cash will only be able to see the Client's Investment Portfolio for their Cash account. On the other hand, the Consultant who onboarded the Client for KWSP will only see the investment portfolio for the Client's KWSP account. However, if the Client’ Consultant for their KWSP account wants to view their Cash Account, the Consultant may do so by onboarding the Client.",
  },
  {
    id: 4,
    label: "Can I view a Client's profile if the Client has more than 1 Cash account?",
    value: 'Yes, provided that you are the Consultant who onboarded the Client for the accounts.',
  },
  {
    id: 5,
    label: 'If yes, will it be in a consolidated account or separate client profile?',
    value: 'It will be a separate Client profile if the different Cash accounts were onboarded using different NRIC Numbers.',
  },
  {
    id: 6,
    label: "Can I view a Client's profile if they have more than 1 KWSP account?",
    value:
      'Only KWSP accounts that were setup by a Consultant will be shown in Principal Direct Access. Similar to Cash accounts, the different KWSP accounts will have separate Client profiles if the accounts were onboarded using different NRIC numbers.',
  },
  {
    id: 7,
    label: 'What are the available transactions for my existing client in Principal Direct Access?',
    value:
      'Client can perform Sales (Add Funds and Top Up), Redemption, Switching and RSP Setup (for fund with no existing RSPs).',
  },
  {
    id: 8,
    label:
      'What funds can I perform the transactions (Switching, Top Up, Setup RSP, & Redemption) for my Client through Principal Direct Access?',
    value: 'Funds offered in Principal Direct Access are Retails Funds in Malaysian Currency for Cash Accounts.',
  },
  {
    id: 9,
    label: "Can I transact my existing client's fund which was transacted by another Consultant?",
    value:
      "Only the Consultant who onboarded the Client can view the existing Clients' profiles and perform the transactions in Principal Direct Access.",
  },
  // {
  //   id: 10,
  //   label: "Can I transact my existing client's fund which was transacted by another Consultant?",
  //   value:
  //     "Only the Servicing Consultant can view the existing Clients' profiles and perform transactions in Principal Direct Access. The Consultant who setup the Client's account is considered as the Servicing Consultant.",
  // },
  {
    id: 11,
    label: "Can I view my client's PRS account in Principal Direct Access?",
    value:
      "No. You only can view the Client's Investment Portfolio in Principal Direct Access which only includes Cash and KWSP.",
  },
  {
    id: 12,
    label: 'Can I onboard the Client for PRS account through Principal Direct Access?',
    value: 'No.',
  },
  {
    id: 122,
    label: 'Can I onboard the Client who has only PRS account with Principal through Principal Direct Access?',
    value: 'Yes.',
  },
  {
    id: 13,
    label: 'Can I transact my client KWSP account through Principal Direct Access?',
    value: 'Not yet.',
  },
  {
    id: 14,
    label: "Can I onboard Principal's clients through Principal Direct Access who are not under my care?",
    value:
      'Yes. You and Client must accept the T&Cs and go through the OTP process. Please note that if after onboarding you have not submitted a transaction for the Client after onboarding, their profile will not be readily accessible in your MY CLIENTS page. You’ll have to go through the onboarding process again to view their profile again.',
  },
  {
    id: 15,
    label: 'What are the funds available in Principal Direct Access?',
    value: 'Funds offered in Principal Direct Access are Retails Funds in Malaysian Currency for Cash Accounts.',
  },
  {
    id: 16,
    label: 'Can I view the joint account for my clients in Principal Direct Access?',
    value: 'No.',
  },
  {
    id: 17,
    label: 'When will the fund transaction/s be shown in the ledger in Principal Direct Access?',
    value: `<p>If the transactions were created outside Principal Direct Access (i.e manual transactions), the transactions will be reflected in Principal Direct Access after it has been processed completely in the backend system. The process typically takes T+1.</p><p> However, if the transactions were created in Principal Direct Access, the transactions are immediately reflected in Principal Direct Access.</p>`,
  },
  {
    id: 18,
    label: 'Can I print out the ledger from Principal Direct Access?',
    value: 'You can use Download button in the My Ledger section to save and print the fund transaction ledger.',
  },
  {
    id: 19,
    label: 'Why does some of the transactions in the ledger have no Consultant code displayed?',
    value: 'Consultant codes are hidden for the transactions performed by another Consultant.',
  },
  {
    id: 20,
    label:
      'If my Client only has a KWSP account with Principal, can I onboard them for a new Cash account through Principal Direct Access?',
    value: 'Not yet.',
  },
  {
    id: 21,
    label: 'Can I setup the Cash account manually, will this be reflected in Principal Direct Access?',
    value: 'Yes. Only the Servicing Consultant can view the Cash Account in Principal Direct Access.',
  },
  {
    id: 22,
    label:
      'Can I perform transactions (Switching, Top Up, Setup RSP, & Redemption) for this new Cash account, which was manually onboarded, once it is reflected in Principal Direct Access?',
    value: 'Yes.',
  },
  {
    id: 23,
    label:
      'For my Clients who were onboarded manually, what should I do if there is an error message requesting for the Client to update their personal details when I conduct a transaction for them?',
    value: `<p>Review the Client’s Personal Details and take note of all the information that needs updating. Then update the Client’s information in AssistPro and print-out the Customer Information Update form (e-Form) and have it signed by the Client. Then submit it to Branch.</p>
      <p>The following are the list of mandatory fields in PDA that can be updated through the Customer Information Update form (e-Form). The name inside the parenthesis is the field name in the Customer Information Update form (e-Form):</p>
      <ul style="padding-left: 16px">
      <li style="list-style: disc">Full Name (as shown in NRIC or Passport)</li>
      <li style="list-style: disc">Title (Salutation)</li>
      <li style="list-style: disc">Date of Birth</li>
      <li style="list-style: disc">Marital Status</li>
      <li style="list-style: disc">Permanent Address</li>
      <li style="list-style: disc">Correspondence Address (Mailing Address)</li>
      <li style="list-style: disc">Mobile No. (Telephone No. (M))</li>
      <li style="list-style: disc">Email Address</li>
      <li style="list-style: disc">Nationality</li>
      <li style="list-style: disc">Occupation Type (Occupation)</li>
      <li style="list-style: disc">Nature of Business</li>
      <li style="list-style: disc">Employer’s Name</li>
      <li style="list-style: disc">Company Address (Employer’s Address)</li>
      <li style="list-style: disc">Annual Income (Gross Annual Income)</li>
      <li style="list-style: disc">Source of Funds</li>
      <li style="list-style: disc">Purpose of Investment (Purpose of Transaction or Account to be Opened)</li>
      </ul>`,
  },
];

/*
const generalQuestions = [
  {
    id: 1,
    label: 'Are the Funds returns guaranteed?',
    value:
      'No, returns of funds are not guaranteed as they invest in assets (for example, shares and bonds) which fluctuate in value on a daily basis. The price of the Funds investments will rise and fall and consequently cause unit prices to rise and fall. Therefore, we cannot guarantee fund returns.',
  },
  {
    id: 2,
    label: 'Is there any exit fee when an investor withdraws his units?',
    value:
      '<p>No, there is no withdrawal fee charged except for the following funds:</p><br/><p><strong>Principal Strategic Income Bond Fund</strong></p></br><p>A Withdrawal Penalty of up to 3.0% of the NAV per unit is chargeable on any withdrawal made prior to the Maturity Date. All Penalties borne by Unit holders will be retained by the Fund. </p><br/><p><strong>Principal Strategic Income Bond Fund 2</strong></p><br/><p>A Withdrawal Penalty of up to 3.0% of the NAV per unit is chargeable on any withdrawal made prior to the Maturity Date. All Penalties borne by Unit holders will be retained by the Fund.</p><br/><p><strong>Principal Enhanced Opportunity Bond Fund</strong></p><br/><p>A Withdrawal Penalty of up to 3.0% of the NAV per unit is chargeable on any withdrawal made prior to the Maturity Date. All Penalties borne by Unit holders will be retained by the Fund.</p></br><p>Payment will be paid in RM within ten (10) calendar days.</p>',
  },
  {
    id: 3,
    label: 'How is the switching of Funds processed?',
    value:
      "An investor will redeem out of Fund A at redemption/bid price and come in to Fund B at Fund B's Net Asset Value (NAV) rounded UP to the nearest quarter cent.",
  },
  {
    id: 4,
    label: 'What prices do we apply in a switch?',
    value:
      'Take for example, an investor who switches from Fund A to Fund B. The bid/buying price of Fund A will be used to convert the units to a Ringgit value amount. The NAV of Fund B will then be used to convert the value in Ringgit back to units of Fund B.',
  },
  {
    id: 5,
    label: 'What will happen to monies not claimed by investors - distribution or withdrawal?',
    value:
      //'Unclaimed monies - after 12 months, the Trustee will credit to the Consolidated Trust account and lodge it with the Registrar which will be held for a further 12 months to enable owners of the monies to collect',
      `All unclaimed monies are to be recorded in accordance to Unclaimed Monies Act 1965 and lodged to Registrar of Unclaimed Monies by the 31 March of the following year. For the refund of the unclaimed monies, please refer to <span><a target="_blank" href="http://www.anm.gov.my/index.php/en/khidmat/wang-tak-dituntut/bayaran-balik-wang-tak-dituntut">http://www.anm.gov.my/index.php/en/khidmat/wang-tak-dituntut/bayaran-balik-wang-tak-dituntut</a>.</span>`

  },
];
*/
const Head1 = styled(Grid)`
  font-size: 20px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-top: 46px !important;
`;
const Head2 = styled(Grid)`
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.75;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-top: 22px !important;
`;
const MenuTitle = styled(Text)`
  padding: 32px 40px 22px 40px;
`;
const Content = styled.div`
  padding: 32px 36px;
`;
const ContentItem = styled.div`
  padding: 16px 0;
`;

export class Faq extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      clearable: true,
      selectedMenuItem: 0,
    };

    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  handleMenuItemClick(index) {
    this.setState({ selectedMenuItem: index });
  }

  content() {
    if (this.state.selectedMenuItem === 0) {
      return (
        <React.Fragment>
          {gettingStarted.map((faq) => (
            <ContentItem key={Math.random()}>
              <Expand1 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    if (this.state.selectedMenuItem === 1) {
      return (
        <React.Fragment>
          {clientAccount.map((faq) => (
            <ContentItem key={Math.random()}>
              <Expand1 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    if (this.state.selectedMenuItem === 2) {
      return (
        <React.Fragment>
          {investments.map((faq) => (
            <ContentItem item xs={12} md={10} lg={11} key={Math.random()}>
              <Expand2 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    if (this.state.selectedMenuItem === 3) {
      return (
        <React.Fragment>
          {transactions.map((faq) => (
            <ContentItem item xs={12} md={10} lg={11} key={Math.random()}>
              <Expand3 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    if (this.state.selectedMenuItem === 4) {
      return (
        <React.Fragment>
          {rsp.map((faq) => (
            <ContentItem item xs={12} md={10} lg={11} key={Math.random()}>
              <Expand3 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    if (this.state.selectedMenuItem === 5) {
      return (
        <React.Fragment>
          {existingClientProfile.map((faq) => (
            <ContentItem item xs={12} md={10} lg={11} key={Math.random()}>
              <Expand3 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    if (this.state.selectedMenuItem === 6) {
      return (
        <React.Fragment>
          {generalQuestions.map((faq) => (
            <ContentItem item xs={12} md={10} lg={11} key={Math.random()}>
              <Expand3 title={faq.label} details={faq.value} identifier={faq.id} />
            </ContentItem>
          ))}
        </React.Fragment>
      );
    }
    return null;
  }
  render() {
    return (
      <Container>
        <Helmet>
          <title>FAQ</title>
          <meta name="description" content="Description of Faq" />
        </Helmet>
        <Grid container direction="column">
          <Logo />
          <BackToLogin />
          <Header item xs={12}>
            <Grid container justify="center" style={{ marginLeft: '170px' }}>
              <Head1 item xs={12}>
                Frequently Asked Questions
              </Head1>
              <Head2 item xs={12}>
                Hello, what are you looking for?
              </Head2>
              {/* <Grid item xs={12}>
                <Select
                  className="search-input"
                  ref={(ref) => {
                    this.select = ref;
                  }}
                  onBlurResetsInput={false}
                  onSelectResetsInput={false}
                  autoFocus
                  options={data}
                  simpleValue
                  clearable
                  name="selected-state"
                  value={this.state.selectValue}
                  onChange={this.updateValue}
                />
              </Grid> */}
            </Grid>
          </Header>
          <Grid item xs={12}>
            <Grid container direction="row">
              <Grid item xs={4} className="menu">
                <MenuTitle color="#fff" size="18px" weight="600" align="left">
                  Topics
                </MenuTitle>
                <MenuList onClick={this.handleMenuItemClick} selected={this.state.selectedMenuItem} />
              </Grid>
              <Grid item xs={8}>
                <Content>
                  <h3>Questions</h3>
                  {this.content()}
                </Content>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Faq.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  faq: makeSelectFaq(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'faq', saga });

export default compose(withSaga, withConnect)(Faq);
