/**
 *
 * Asynchronously loads the component for OnBoarding
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
