/**
 *
 * Asynchronously loads the component for CompareFunds
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
