/**
 *
 * Asynchronously loads the component for OnlinePayment
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
