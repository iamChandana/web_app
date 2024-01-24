/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';

const A = styled.a`
  color: red;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: red;
  }
`;

export default A;
