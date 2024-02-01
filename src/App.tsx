import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AxiosContextProvider from './components/AxiosContext';
import Page from './components/Page';
import SessionContextProvider from './components/SessionContext';

import EnrollmentRoute from './routes/Enrollment';
import LoginRoute from './routes/Login';
import MainRoute from './routes/Main';
import NotFoundRoute from './routes/NotFound';
import ReservationFormRoute from './routes/ReservationForm';
import ReservationListRoute from './routes/ReservationList';
import ReservationSuccessRoute from './routes/ReservationSuccess';
import ReservationViewRoute from './routes/ReservationView';
import ScheduleDetailsRoute from './routes/ScheduleDetails';
import ScheduleListRoute from './routes/ScheduleList';
import ScheduleRoute from './routes/Schedule';


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
            <Route path='/schedules/:id' Component={() => <Page name='Wyświetl plan'><ScheduleRoute /></Page>} />
            <Route path='/schedules/:id/:index' Component={() => <Page name='Szczegóły zajęć'><ScheduleDetailsRoute /></Page> } />
            <Route path='/reservations' Component={() => <Page name='Formularz rezerwacji'><ReservationFormRoute /></Page> } />
            <Route path='/reservation-list' Component={() => <Page name='Lista rezerwacji'><ReservationListRoute /></Page>} />
            <Route path='/reservation-list/success' Component={() => <Page name='Zaakceptowano wniosek'><ReservationSuccessRoute /></Page>} />
            <Route path='/reservation-list/:id' Component={() => <Page name='Wyświetl rezerwację'><ReservationViewRoute /></Page>} />
            <Route path='*' Component={() => <Page name='Nie znaleziono'><NotFoundRoute/></Page>} />
          </Routes>
        </AxiosContextProvider>
      </SessionContextProvider>
    </BrowserRouter>
  );
}

export default App;
