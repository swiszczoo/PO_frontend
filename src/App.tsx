import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AxiosContextProvider from './components/AxiosContext';
import Page from './components/Page';
import SessionContextProvider from './components/SessionContext';

import EnrollmentRoute from './routes/Enrollment';
import LoginRoute from './routes/Login';
import MainRoute from './routes/Main';
import NotFoundRoute from './routes/NotFound';
import ScheduleListRoute from './routes/ScheduleList';


function App() {
  return (
    <BrowserRouter>
      <SessionContextProvider>
        <AxiosContextProvider>
          <Routes>
            <Route path='/' Component={() => <Page name='Ładowanie...'><MainRoute/></Page>} />
            <Route path='/login' Component={() => <Page name='Logowanie'><LoginRoute /></Page>} />
            <Route path='/enrollment' Component={() => <Page name='Zapisy'><EnrollmentRoute /></Page>} />
            <Route path='/schedules' Component={() => <Page name='Lista planów'><ScheduleListRoute /></Page>} />
            <Route path='*' Component={() => <Page name='Nie znaleziono'><NotFoundRoute/></Page>} />
          </Routes>
        </AxiosContextProvider>
      </SessionContextProvider>
    </BrowserRouter>
  );
}

export default App;
