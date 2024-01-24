/**
 *
 * CustomerCare
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';

import SpeechBubble from './speech-bubble.svg';
import CloseIcon from './close.svg';

import { Container, Item, Button, Link, LinkTextGroup } from './Atoms';

function CustomerCare(props) {
  const { onClose } = props;

  return (
    <Container>
      <Item>
        <img src={SpeechBubble} alt="Help" />
        <Text color="#ffffff" display="inline">
          Need Help?
        </Text>
        <Button onClick={onClose}>
          <img src={CloseIcon} alt="close" width="20" height="20" />
        </Button>
      </Item>
      <Item>
        <Text size="12px" color="#fff" align="left">
          For inquiry on our financial products and services, please contact us via the information below:
        </Text>
      </Item>
      <Item>
        <Text size="12px" weight="bold" color="#fff" align="left">
          Agency Hotline
        </Text>
        <Text size="12px" color="#fff" align="left">
          03-77237261
        </Text>
        <Text size="12px" color="#fff" align="left">
          Monday to Friday: 8:45 am to 5:45 pm
        </Text>
        <Text size="12px" weight="bold" color="#fff" align="left">
          (except on Kuala Lumpur and national public holidays)
        </Text>
      </Item>
      <Item>
        <Text size={'12px'} weight={'bold'} color={'#fff'} align={'left'}>
          Chat with us via WhatsApp
        </Text>
        <LinkTextGroup>
          <Text size={'12px'} weight={'bold'} color={'#fff'} align={'left'} >
            Click
          </Text>
          <Link href={'https://api.whatsapp.com/send?phone=60162996171'} target={'_blank'} rel={'noopener noreferrer'}>here</Link>
        </LinkTextGroup>
      </Item>
      <Item>
        <Text size="12px" color="#fff" align="left" weight="bold">
          Email
        </Text>
        <Link href="mailto:service@principal.com.my">service@principal.com.my</Link>
      </Item>
    </Container>
  );
}

CustomerCare.propTypes = {
  onClose: PropTypes.func,
};

export default CustomerCare;
