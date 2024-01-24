import styled from 'styled-components';

const Lightertext = styled.span`
  font-size: ${(props) => props.size || '14px'};
  font-weight: ${(props) => props.weight || 'lighter'};
  font-style: ${(props) => props.fontStyle || 'normal'};
  line-height: ${(props) => props.lineHeight || 1.43};
  letter-spacing: ${(props) => props.weight || 'normal'};
  text-align: ${(props) => props.align || 'center'};
  color: ${(props) => props.color || '#5f5e5e'};
  opacity: ${(props) => props.opacity || '1'};
  display: ${(props) => props.display || 'block'};
  font-family: ${(props) => (props.font ? props.font : 'FSElliot-Pro')};
  text-decoration: ${(props) => props.decoration || 'none'};
  cursor: ${(props) => props.cursor || 'inline'};
  overflow: ${(props) => props.overflow || 'visible'};
  text-overflow: ${(props) => props.textOverflow || 'initial'};
  ${(props) => (props.whiteSpace ? 'white-space: nowrap;' : null)}
`;
/**
 * Common Text with size only different ::TODO
 * SmallText = 12px
 * Normal Text = 14px
 */

export default Lightertext;
