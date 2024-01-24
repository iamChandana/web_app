import React from 'react';
import Text from 'components/Text';
import styled from 'styled-components';
import { StyledLink } from 'components/Link';

const StyledText = styled(Text)`
font-size: ${(props) => props.size || '12px'};
font-weight: ${(props) => props.weight || 'bold'};
color: ${(props) => props.color || '#000000'};
text-align: ${(props) => props.textAlign || 'left'};
margin: ${(props) => props.margin || '10px 0'};
line-height: ${(props) => props.lineHeight};
width: ${(props) => props.width || '564px'};
opacity: ${(props) => props.opacity || '1'};
word-spacing: ${(props) => props.wordSpacing || '2.1px'} ;
display: ${(props) => props.display};
`;

export default function SophisticatedDisclaimer(props) {
    const { secondaryHolderNameIfAvailable, clientName } = props;
    return (
        <React.Fragment>
            <StyledText size="10px" lineHeight="1.6" opacity='0.4' padding="12px 0 0 0" margin="0">
                Sophisticated Investor's Declaration:
            </StyledText>
            <StyledText margin="0">
                I/We <StyledText wordSpacing="1px" weight='bolder' margin='0' display="inline">{clientName}{secondaryHolderNameIfAvailable}</StyledText> hereby declare and confirm that I am/we are sophisticated investor(s) and has/have agreed to invest in the wholesale fund(s) offered by Principal Asset Management Berhad (formerly known as CIMB-Principal Asset Management Berhad) ("Principal").
            </StyledText>
            <StyledText >
                I/We acknowledge that Principal accepts the investment into the wholesale fund(s) on the basis of this declaration.
            </StyledText>
            <StyledText width='582px'>
                I/We further confirm that this declaration is accurate as to the matter stated herein and am/are prepared to furnish any documentary evidence to establish the accuracy of this declaration. In any event, I/We agree to indemnify and keep Principal indemnified in respect to any costs, expenses, fines, penalties, or any other losses, which it may suffer or incur in the event this declaration is untrue or incorrect in any way.
            </StyledText>
            <StyledText size="14px" weight='bolder'>
                Notes To Read Before Accepting This Declaration
            </StyledText>
            <StyledText width='591px'>
                You are advised to read and understand the information Memorandum relating to the wholesale fund(s) before investing in the wholesale fund(s).
            </StyledText>
            <StyledText size="14px" weight='bolder'>
                Purpose of This Declaration
            </StyledText>
            <StyledText width='587px' wordSpacing='1.6px'>
                (1) Only a "Sophisticated Investor" may invest in wholesale fund(s). Sophisticated Investor refers to any person who falls within any of the categories of investors set out in Part 1, Schedules 6 and 7 of the Capital Markets and Services Act 2007 (as may be amended, varied, modified, updated and/or superseded from time to time). Please refer to our website, <StyledLink href='https://www.principal.com.my/en/sophisticated-investor-my' target='_blank'>www.principal.com.my</StyledLink> for the definition of sophisticated investor as per Part 1, Schedules 6 and 7 of the Capital Markets and Services Act 2007 (as may be amended, varied, modified, updated and/or <br /> superseded from time to time).
            </StyledText>
            <StyledText width='590px'>
                (2) Please note that this declaration is not the only term relating to investments into wholesale fund(s). Investors are advised to read and understand the information Memorandum relating to wholesale fund(s) for additional terms including but not limited to, minimum initial and subsequent investment amount.
            </StyledText>
        </React.Fragment>
    );
}