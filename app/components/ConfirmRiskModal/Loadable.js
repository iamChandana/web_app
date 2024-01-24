/**
 *
 * Asynchronously loads the component for ConfirmRiskModal
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
