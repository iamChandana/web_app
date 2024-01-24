/**
 *
 * Asynchronously loads the component for AgentProfile
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
