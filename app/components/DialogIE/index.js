import React from 'react';
import PropTypes from 'prop-types';
import MaterialDialog from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Parser from 'html-react-parser';
import Close from './images/close.svg';
import { GridItem, Button, Container } from './Atoms';
import styled from 'styled-components';

const StyledGrid = styled(Grid)`
   min-width: 800px;
   min-height: 250px;
`;

function Dialog(props) {
  const { open, dialogTitle, title, content, closeHandler, scroller, maxWidth, subtitle, textNoBold, textSize } = props;
  let subTitleDisplay = '';
  if (subtitle) {
    subTitleDisplay = Parser(subtitle);
  }
  return (
    <MaterialDialog open={open} maxWidth={maxWidth?maxWidth:'lg'} scroll="paper">
      <StyledGrid container>
        <GridItem secondary={dialogTitle} item xs={12}>
          {dialogTitle && <Text display="inline-block">{dialogTitle}</Text>}
          <Button onClick={closeHandler}>
            <img src={Close} alt="close-ic" />
          </Button>
        </GridItem>
        {title && (
          <GridItem item xs={12}>
            <Text size={textSize?textSize:"19px"} weight={textNoBold?"normal":"bold"}>
              {title}
            </Text>
            <Text size="14px" fontStyle="italic">
              {subTitleDisplay}
            </Text>            
          </GridItem>
        )}
        <GridItem item xs={12}>
          {scroller ? <Container>{content}</Container> : content}
        </GridItem>
      </StyledGrid>
    </MaterialDialog>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool,
  dialogTitle: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  closeHandler: PropTypes.func,
  scroller: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  maxWidth: PropTypes.string,
};

Dialog.defaultProps = {
  maxWidth: 'md',
};

export default Dialog;
