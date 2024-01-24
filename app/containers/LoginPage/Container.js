import styled from 'styled-components';
import BackgroundImage from './images/login_bg_2x.jpg';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  padding: 0 10%;
  background: url(${BackgroundImage});
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  @media (max-width: 720px) {
    padding: 0;
  }
`;

export default Container;
