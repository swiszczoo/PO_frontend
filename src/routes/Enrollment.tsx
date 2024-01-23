import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

import { useQuery } from '@tanstack/react-query';

import moment from 'moment';

import { useAxios } from '../hooks/useAxios';

interface EnrollmentRoundProps {
  id: number;
  name: string;
  date: number;
  startTime: string;
  endTime: string;
  hasRights: boolean;
}

function EnrollmentRound(props: EnrollmentRoundProps) {
  const isoStart = new Date(`${new Date(props.date).toISOString().substring(0, 11)}${props.startTime}`);
  const isoEnd = new Date(`${new Date(props.date).toISOString().substring(0, 11)}${props.endTime}`);
  const dateFormatted = moment(props.date).format('L');
  const [ current, setCurrent ] = useState(new Date().getTime());

  const beforeStart = current < isoStart.getTime();
  const afterEnd = new Date().getTime() > isoEnd.getTime();
  const roundOpen = !beforeStart && !afterEnd;

  const roundProgress = (current - isoStart.getTime()) / (isoEnd.getTime() - isoStart.getTime()) * 100;

  useEffect(() => {
    if (props.hasRights) {
      const timerId = setInterval(() => setCurrent(new Date().getTime()), 10000);
      return () => clearInterval(timerId);
    }
  }, [props.hasRights]);

  let cardStyle = {};
  if (afterEnd) {
    cardStyle = { style: 'gray' };
  }
  
  return (
    <li className={`list-group-item${roundOpen ? ' active' : ''}`} style={cardStyle}>
      <strong>{ props.name }{ props.hasRights ? ' \u2014 to Twoja tura' : '' }</strong><br/>
      <i className="fa-regular fa-calendar"></i>&nbsp;&nbsp;{dateFormatted}<br/>
      <i className="fa-regular fa-clock"></i>&nbsp;{props.startTime} &ndash; {props.endTime}<br/>
      {
        props.hasRights &&
        <>
          {
            roundOpen &&
            <div className="progress mt-1 mb-2" role="progressbar" aria-label="Warning example" aria-valuenow={roundProgress}
                aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" style={{ width: `${roundProgress}%` }}></div>
            </div>
          }
          <button type="button" disabled={!roundOpen} className="btn btn-secondary mt-2 mb-2" onClick={() => alert('PU: Obsługa zapisów')}>Weź udział w zapisach</button><br/>
          {
            beforeStart && 
            <em>&nbsp;Nie możesz teraz wziąć udziału w zapisach, ponieważ tura zapisowa jest jeszcze zamknięta</em>
          }
          {
            afterEnd && 
            <em>&nbsp;Nie możesz teraz wziąć udziału w zapisach, ponieważ tura zapisowa już się zakończyła</em>
          }
        </>
      }
    </li>
  );
}

interface EnrollmentGroupProps {
  id: number;
  name: string;
  rounds: EnrollmentRoundProps[];
}

function EnrollmentGroup(props: EnrollmentGroupProps) {
  return (
    <div className='card' style={{ marginBottom: 16 }}>
      <div className='card-header'>
        <strong>{props.name}</strong>
      </div>
      <ul className="list-group list-group-flush">
        { props.rounds.sort((a, b) => a.id - b.id).map(x => <EnrollmentRound {...x} key={x.id} />) }
      </ul>
    </div>
  );
}

function Enrollment() {
  const axios = useAxios();
  const { status, data } = useQuery({
    queryKey: ['group'], 
    queryFn: async () => {
      const { data } = await axios.get('/round/all');
      return data;
    }, 
    staleTime: 60000 
  });

  return (
    <>
      <Navbar activePage='enrol' />
      <main className="container mt-4">
        <h1>Moje zapisy na zajęcia</h1>
        <br/>
        { status === 'success' && data.map((entry: EnrollmentGroupProps) => <EnrollmentGroup {...entry} key={entry.id} />) }
        { status === 'pending' && <p>Wczytywanie danych...</p>}
      </main>
    </>
  );
}

export default Enrollment;
