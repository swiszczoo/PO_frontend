import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Navbar from '../components/Navbar';
import ReservationReject from '../components/ReservationReject';

import { useAxios } from '../hooks/useAxios';

import moment from 'moment';

interface PendingApplicationProps {
  applicationStatus: { id: number, name: string };
  building: { id: number; number: string };
  date: number;
  description: string;
  endTime: string;
  event: { id: number; name: string };
  hasConflict: boolean;
  id: number;
  participants: number;
  room: { id: number; number: string };
  startTime: string;
  user: { firstName: string; lastName: string };
};

function PendingApplication(props: PendingApplicationProps & { onReject: (id: number) => void }) {
  const date = useMemo(() => moment(props.date).format('DD.MM.YYYY'), [props.date]);

  const handleRejectClick = () => {
    props.onReject(props.id);
  };

  return (
    <div className="card mb-2 bg-body-tertiary">
      <div className="card-body">
        <h5 className="card-title">{props.user.firstName} {props.user.lastName}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">
          <i className="fa-regular fa-calendar"></i>&nbsp;{date}&nbsp;&nbsp;
          <i className="fa-regular fa-clock"></i>&nbsp;{props.startTime}-{props.endTime}&nbsp;&nbsp;
          <i className="fa-solid fa-person"></i>&nbsp;ok. {props.participants} uczestników&nbsp;&nbsp;
          <i className="fa-regular fa-building"></i>&nbsp;{props.building.number}, s.{props.room.number}&nbsp;&nbsp;
        </h6>
        <p className="card-text">
          <strong>Rodzaj wydarzenia:</strong>&nbsp;{props.event.name}<br />
          {props.description}
        </p>
        <Link to={`${props.id}`} relative='path' className="btn btn-primary">Przejrzyj wniosek</Link>
        &nbsp;
        <button onClick={handleRejectClick} className="btn btn-danger">Odrzuć</button>
      </div>
    </div>
  );
}

function ReservationList() {
  const axios = useAxios();
  const client = useQueryClient();

  const { status, data } = useQuery({
    queryKey: ['reservation'],
    queryFn: async () => {
      const { data } = await axios.get('/application/all');
      return data;
    },
    staleTime: 60000,
  });

  const pendingApplications = useMemo(() => {
    if (!data) return [];
    return data.filter((obj: PendingApplicationProps) => obj.applicationStatus.name === 'PENDING');
  }, [data]);

  const [ rejectId, setRejectId ] = useState<number | undefined>(undefined);

  const handleRejectFinished = () => {
    setRejectId(undefined);
    client.invalidateQueries({
      queryKey: ['reservation']
    });
  }

  return (
    <>
      <Navbar activePage='reservation-list' />
      <main className="container mt-4">
        <h1>Lista wniosków o rezerwację sali</h1>
        <br />
        { status === 'pending' && <p>Wczytywanie danych...</p> }
        { 
          status === 'success' && pendingApplications.length === 0 &&
          <div className="alert alert-info" role="alert">
            <i className="fa-regular fa-face-smile"></i>
            Wszystkie wnioski zostały już rozpatrzone!
          </div>
        }
        { 
          status === 'success' && rejectId === undefined &&
          pendingApplications.map((obj: PendingApplicationProps) => <PendingApplication key={obj.id} {...obj} onReject={setRejectId} /> )
        }
        {
          status === 'success' && rejectId !== undefined &&
          <ReservationReject id={rejectId} onCancel={setRejectId.bind(null, undefined)} onReturnToList={handleRejectFinished}/>
        }
      </main>
    </>
  );
}

export default ReservationList;
