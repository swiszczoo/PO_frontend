import { Navigate } from 'react-router-dom';

import { useSession } from '../hooks/useSession';

function Main() {
  const session = useSession();

  if (session.isLoggedIn()) {
    return <Navigate to='/enrollment' replace={true} />
  } else {
    return <></>;
  }
}

export default Main;
