/**
 *
 * Asynchronously loads the component for FundProjection
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
