/**
 *
 * Asynchronously loads the component for LogoutSummary
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
