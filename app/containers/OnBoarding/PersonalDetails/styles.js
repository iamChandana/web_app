import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Dropzone from 'react-dropzone';
import Button from 'components/Button';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

export const Container = styled.div`
  width: 305px;
  height: ${(props) => (props.src ? '260px' : '260px')};
  border: ${(props) => (props.src ? 'dashed 1px #cacaca' : `dashed 1px ${Color.C_LIGHT_BLUE}`)};
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.src ? 'flex-start' : 'center')};
  align-items: center;
  margin-bottom: 12px;
`;

export const CloseGrid = styled(Grid)`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 20px;
  cursor: pointer;
`;

export const UploadContainer = styled(Dropzone)`
  width: auto;
  height: auto;
  border: none;
`;

export const StyledButton = styled(Button)`
  margin: 4px;
  justify-content: flex-start;
`;

export const Icon = styled.img`
  margin: 0 15%;
`;

export const ImageName = styled(Text)`
  margin-top: 8px;
`;
/*
export const ImgSrc = styled.img`
  width: 136px;
  height: 88px;
`;
*/
export const ImgSrc = styled.img`
  width: 305px;
  height: ${(props) => (props.src ? '210px' : '210px')};
`;

export const ImgSrcBig = styled.img`
  width: ${(props) => props.imgWidth + 'px'};
  height: ${(props) => props.imgHeight + 'px'};
  margin-bottom: 20px;
`;

export const CaptureButton = styled(Button)`
  margin-top: 10px;
  width: auto;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border-width: 4px;
`;

export const CloseImage = styled.img`
  width: 12px;
  height: 12px;
  margin-bottom: 10px;
`;
