import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Card from './index';

storiesOf('Card', module)
  .add('Normal Card', () => (
    <Card>
      <p>Normal Card</p>
    </Card>
  ))
  .add('Normal Card w/ Custom Size', () => (
    <Card minHeight="352px">
      <p>Normal Card With Custom Size</p>
    </Card>
  ))
  .add('Button Card', () => (
    <Card type="button" onClick={action('clicked')}>
      <p>Action Card</p>
    </Card>
  ))
  .add('Button Card w/ Custom Size', () => (
    <Card type="button" minHeight="100px" onClick={action('clicked')}>
      <p>Action Card</p>
    </Card>
  ));
