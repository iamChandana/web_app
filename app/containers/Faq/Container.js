import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  .menu {
    color: white;
    width: 320px;
    min-height: calc(100vh - 200px);
    background-color: #1d1d26;    
  }
  .back-link {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .search-input {
    width: 200px;
    height: 50px;
    border: 1px solid gray;
  }
`;

export default Container;
