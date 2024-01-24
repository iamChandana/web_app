import React from 'react';
import PropTypes from 'prop-types';
import FundDetails from 'containers/FundDetails/Loadable';

function FundPerformance({ data }) {
  return (
    <div>
      <FundDetails fundCode={data.investmentProductId} />
    </div>
  );
}

FundPerformance.propTypes = {
  data: PropTypes.object,
};

export default FundPerformance;
