import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import Color from 'utils/StylesHelper/color';

const StyledPagination = styled(Pagination)`
  margin-top: 16px;
  .rc-pagination-item {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    border: solid 1px #979797;
    outline: none;
    line-height: 39px;
    &:hover,
    &:focus {
      background-color: ${Color.C_LIGHT_BLUE};
      border: ${`solid 1px ${Color.C_LIGHT_BLUE}`};
      a {
        color: #fff;
      }
    }
  }
  .rc-pagination-item-active {
    background-color: ${Color.C_LIGHT_BLUE};
    border: ${`solid 1px ${Color.C_LIGHT_BLUE}`};
  }
  .rc-pagination-prev,
  .rc-pagination-next,
  .rc-pagination-jump-prev,
  .rc-pagination-jump-next {
    line-height: 39px;
    width: 40px;
    height: 40px;
    border-radius: 3px;
    border: solid 1px #979797;
    outline: none;
    &:hover,
    &:focus {
      background-color: ${Color.C_LIGHT_BLUE};
      border: ${`solid 1px ${Color.C_LIGHT_BLUE}`};
      a {
        color: #fff;
      }
    }
  }
  .rc-pagination-jump-prev:hover:after,
  .rc-pagination-jump-next:hover:after {
    color: #fff;
  }
  /* .rc-pagination-item-link {
    ::after {
      color: ${Color.C_LIGHT_BLUE};
    }
  } */
`;

// const itemRender = (current, type, element) => {
//   if (type === 'page') {
//     return <a href={`#${current}`}>{current}</a>;
//   }
//   return element;
// };

// const textItemRender = (current, type, element) => {
//   if (type === 'prev') {
//     return 'First Page';
//   }
//   if (type === 'next') {
//     return 'Last Page';
//   }
//   return element;
// };

function PaginationComponent(props) {
  const { count, onChange, current } = props;
  return <StyledPagination
    total={count}
    current={current}
    onChange={onChange}
    defaultPageSize={12}
    locale={{
      items_per_page: 'items per page',
      jump_to: 'jump to',
      jump_to_confirm: 'jump to confirm',
      page: 'page',
      prev_page: 'prev page',
      next_page: 'next page',
      prev_5: 'prev 5 pages',
      next_5: 'next 5 pages',
      prev_3: 'prev 3 pages',
      next_3: 'next 3 pages',
    }} />;
}

PaginationComponent.propTypes = {
  count: PropTypes.number,
  onChange: PropTypes.func,
  current: PropTypes.number,
};
export default PaginationComponent;
