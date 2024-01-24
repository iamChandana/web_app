/**
 *
 * Asynchronously loads the component for NavPillTab
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
