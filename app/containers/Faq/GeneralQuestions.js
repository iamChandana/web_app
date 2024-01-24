import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import ExpandableQuestions from './ExpandableQuestions';

const data = [
  {
    label: 'How much do I need to invest in the Principal`s investment funds?',
    value: 'Lorem ipsum',
  },
  {
    label: 'Can I switch between funds?',
    value: 'Lorem ipsum',
  },
  {
    label: 'Why does the unit price fall after a distribution?',
    value:
      "Income earned by Fund during the financial year is accrued in its unit's price until the end of the distribution period. When an income distribution is declared, any interest income and realized capital profits",
  },
  {
    label: 'If an investor chooses to reinvest their distributions, at what unit price and date will it be executed at?',
    value: 'lorem',
  },
];

function GeneralQuestions(props) {
  return (
    <React.Fragment>
      <h3>Questions</h3>
      {data.map((faq, index) => (
        <Grid className="faq" item xs={12} md={10} lg={11} key={index}>
          <ExpandableQuestions title={faq.label} details={faq.value} />
        </Grid>
      ))}
    </React.Fragment>
  );
}

export default GeneralQuestions;
