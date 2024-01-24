/**
 *
 * offices
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';

import CloseIcon from './close.svg';
import ListItem from './ListItem';
import { RegionalOffices } from './RegionalOffices';
import { BranchOffices } from './BranchOffices';

import { Container, Item, Button, Link, InlineTextWrapper, InlineText } from './Atoms';

function Branch(props) {
  const { onClose } = props;

  return (
    <Container>
      <Item>
        <Text color="#ffffff" display="inline" weight="bold">
          Offices
        </Text>
        <Button onClick={onClose}>
          <img src={CloseIcon} alt="close" width="15" height="15" />
        </Button>
      </Item>
      <Item>
        <Text size="12px" color="#fff" align="left">
          For inquiry on our financial products and services, please contact us via the information below:
        </Text>
      </Item>
      <Item>
        <Text size="12px" weight="bold" color="#fff" align="left">
          Home Office
        </Text>
        <Text size="12px" color="#fff" align="left">
          50, 52 & 54 Jalan SS 21/39,
        </Text>
        <Text size="12px" color="#fff" align="left">
          Damansara Utama 47400 Petaling Jaya,
        </Text>
        <Text size="12px" color="#fff" align="left">
          Selangor Darul Ehsan.
        </Text>
        <InlineTextWrapper>
          <InlineText size="12px" color="#fff" align="left" weight="bold">
            (except on Selangor and national public holidays)
          </InlineText>            
          <InlineText size="12px" color="#fff" align="left" weight="bold">
            Agency Hotline:
          </InlineText>
          <InlineText size="12px" color="#fff" align="left">
            03-77237261
          </InlineText>
        </InlineTextWrapper>
        <InlineTextWrapper>
          <InlineText size="12px" color="#fff" align="left" weight="bold">
            Fax:
          </InlineText>
          <InlineText size="12px" color="#fff" align="left">
            03-7726 5088
          </InlineText>
        </InlineTextWrapper>
        <InlineTextWrapper>
          <InlineText size="12px" color="#fff" align="left" weight="bold">
            Email:
          </InlineText>
          <Link href="mailto:service@principal.com.my">service@principal.com.my</Link>
        </InlineTextWrapper>
      </Item>
      <Item>
        <Text size="12px" weight="bold" color="#fff" align="left">
          Regional Offices
        </Text>
        {RegionalOffices.map((item) => <ListItem item={item} />)}
      </Item>
      <Item>
        <Text size="12px" weight="bold" color="#fff" align="left">
          Branch Offices
        </Text>
        {BranchOffices.map((item) => <ListItem item={item} />)}
      </Item>
    </Container>
  );
}

Branch.propTypes = {
  onClose: PropTypes.func,
};

export default Branch;
