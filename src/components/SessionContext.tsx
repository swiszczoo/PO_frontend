import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { useAxios } from '../hooks/useAxios';

interface SessionContextData {
  sessionId: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  pending: boolean;
}
export type SessionContextType = SessionContextData | undefined;
type ContextType = [SessionContextType, React.Dispatch<React.SetStateAction<SessionContextType>>];

export const SessionContext = createContext<ContextType>([undefined, () => undefined]);

const tokenKey = 'authorization_token';
const sessionDataUrl = `/user/details`;

function makeAxiosOptions(): AxiosRequestConfig<any> {
  return {
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem(tokenKey)}`,
    },
  }
}

function initSessionFromCookie(
  axios: AxiosInstance, 
  setContext: React.Dispatch<React.SetStateAction<SessionContextType>>
): SessionContextType {
  const sessionId = window.localStorage.getItem(tokenKey);
  const emptySession = {
    sessionId: '',
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    pending: false,
  };

  if (!sessionId) {
    return emptySession;
  } else {
    axios.get(sessionDataUrl, makeAxiosOptions()).then((res: AxiosResponse) => {
      setContext({
        sessionId: res.data['id'] ? sessionId : '',
        id: res.data['id'],
        email: res.data['email'],
        firstName: res.data['firstName'],
        lastName: res.data['lastName'],
        pending: false,
      });
      console.log({
        sessionId: res.data['id'] ? sessionId : '',
        id: res.data['id'],
        email: res.data['email'],
        firstName: res.data['firstName'],
        lastName: res.data['lastName'],
        pending: false,
      });
    }).catch(() => setContext(emptySession));

    return {
      ...emptySession,
      sessionId,
      pending: true,
    };
  }
}

function SessionContextLoginTeleport() {
  const [ context, setContext ] = useContext(SessionContext);
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxios();

  useEffect(() => {
    if (!context) {
      setContext(initSessionFromCookie(axios, setContext));
      return;
    }

    if (context!.sessionId === '' && !context!.pending && !location.pathname.startsWith('/login')) {
      navigate('/login', {
        replace: true
      });
    }
  }, [axios, context, location, navigate, setContext]);

  return <></>;
}

function SessionContextProvider(props: React.PropsWithChildren<object>) {
  const state = useState<SessionContextType>(undefined);

  return (
    <SessionContext.Provider value={state}>
      <SessionContextLoginTeleport/>
      { state[0] !== undefined && !state[0].pending && props.children}
      { state[0] !== undefined && state[0].pending && <p>Wczytywanie...</p> }
    </SessionContext.Provider>
  );
}
export default SessionContextProvider;