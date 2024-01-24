import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Divider from 'material-ui/Divider';
import { ColumnGridLeft } from 'components/GridContainer';
import Color from 'utils/StylesHelper/color';
import DLIcon from './dl-icon.svg';
import CloseIcon from './close.svg';

let Container = styled.div`
  position: absolute;
  z-index: 999;
  margin-top: ${(props) =>
    props.isEdgeBrowser ? '-10px' : props.isIEBrowser ? '-23px' : props.type === 'ALLOCATE' ? '35px' : '-33px'};
  margin-right: ${(props) => (props.type === 'ALLOCATE' ? '-200px' : '0px')};
  width: 176px;
  margin-left: ${(props) => (props.type === 'ALLOCATE' ? (props.isIEBrowser ? '-25px' : '150px') : 0)};
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  ${(props) => (props.isEdgeBrowser ? 'left: -100px' : null)};
`;

const CloseImg = styled.img`
  float: right;
  cursor: pointer;
  padding: 4px;
`;

const FullWidthGrid = styled(Grid)`
  width: 100%;
`;
const DLImage = styled.img`
  width: 11.9px;
  height: 11.6px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  padding: 5px;
  cursor: pointer;
`;
function DownloadContent(props) {
  const { data, toggle, download, type, isEdgeBrowser, isIEBrowser, isWholeSaleFunds } = props;
  return (
    <Container type={type} isEdgeBrowser={isEdgeBrowser} isIEBrowser={isIEBrowser}>
      <ColumnGridLeft>
        <FullWidthGrid item>
          <CloseImg src={CloseIcon} onClick={toggle} />
        </FullWidthGrid>
        <FullWidthGrid item>
          <Divider />
        </FullWidthGrid>
        {/* {data.productHighlightSheet && data.productHighlightSheet !== 'N/A' && ( */}
        <FullWidthGrid item>
          <Wrapper onClick={() => download(data.productHighlightSheet)}>
            <DLImage src={DLIcon} />
            <Text color={Color.C_LIGHT_BLUE} decoration="underline" size="12px">
              Product Highlight Sheet
            </Text>
          </Wrapper>
          <Divider />
        </FullWidthGrid>
        {/* )} */}
        {/* {data.fundFactsheet && data.fundFactsheet !== 'N/A' && ( */}
        <FullWidthGrid item>
          <Wrapper onClick={() => download(data.fundFactsheet)}>
            <DLImage src={DLIcon} />
            <Text color={Color.C_LIGHT_BLUE} decoration="underline" size="12px">
              Fund Fact Sheet
            </Text>
          </Wrapper>
          <Divider />
        </FullWidthGrid>
        {/* )} */}
        {/* {data.prospectus && data.prospectus !== 'N/A' && ( */}
        <FullWidthGrid item>
          <Wrapper onClick={() => download(data.prospectus)}>
            <DLImage src={DLIcon} />
            <Text color={Color.C_LIGHT_BLUE} decoration="underline" size="12px">
              {isWholeSaleFunds ? 'Info Memo' : 'Prospectus'}
            </Text>
          </Wrapper>
          <Divider />
        </FullWidthGrid>
        {/* )} */}
      </ColumnGridLeft>
    </Container>
  );
}

DownloadContent.propTypes = {
  data: PropTypes.object,
  toggle: PropTypes.func,
  download: PropTypes.func,
};

export default DownloadContent;
