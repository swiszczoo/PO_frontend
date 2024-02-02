import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Navbar from '../components/Navbar';
import ReservationReject from '../components/ReservationReject';

import { useAxios } from '../hooks/useAxios';

import moment from 'moment';

interface ApplicationData {
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

interface RoomChangeProps {
  applicationId: string;
  initialBuildingId: number;
  initialRoomId: number;
  onCancel?: () => void;
};

function RoomChange(props: RoomChangeProps) {
  const axios = useAxios();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(props.initialBuildingId);
  const [room, setRoom] = useState(props.initialRoomId);
  const [processing, setProcessing] = useState(false);

  const { status, data } = useQuery({
    queryKey: ['reservationForm'],
    queryFn: async () => {
      const { data } = await axios.get('/application/form');
      return data;
    },
    staleTime: 60000,
  });

  const buildings = useMemo(() => {
    if (!data) return [];
    let buildings = [];
    let buildingIds = new Set();

    for (const bld of (data.buildings as { id: number, building: { id: number; number: string } }[])) {
      if (!buildingIds.has(bld.building.id)) {
        buildings.push(<option value={bld.building.id} key={bld.id}>{bld.building.number}</option>);
        buildingIds.add(bld.building.id);
      }
    }

    return buildings;
  }, [data]);

  const rooms = useMemo(() => {
    if (!data) return [];
    let rooms = [];

    for (const bld of (data.buildings as { id: number, building: { id: number; number: string }, room: { id: number; number: string; } }[])) {
      if (bld.building.id === building) {
        rooms.push(<option value={bld.room.id} key={bld.id}>{bld.room.number}</option>);
      }
    }

    return rooms;
  }, [data, building]);

  const handleChangeBuilding = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBuilding(parseInt(event.target.value));
  };

  const handleChangeRoom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoom(parseInt(event.target.value));
  };

  const handleAcceptClick = () => {
    setProcessing(true);
    axios.put(`/application/amend/${props.applicationId}?buildingId=${building}&roomId=${room}`).then(() => {
      return axios.put(`/application/accept/${props.applicationId}`);
    }).then(() => {
      setProcessing(false);
      client.invalidateQueries({
        queryKey: ['reservation'],
      });
      navigate('/reservation-list/success', { replace: true });
    }).catch((e) => {
      setProcessing(false);
      alert(e);
    });
  };
  

  return (
    <>
      { status === 'pending' && <p>Wczytywanie danych...</p> }
      {
        status === 'success' &&
        <>
          <div className="mb-3">
            <label htmlFor="form-event-building" className="form-label"><strong>Budynek:</strong></label>
            <select className="form-select" id="form-event-room" required value={building} onChange={handleChangeBuilding}>
              { buildings }
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="form-event-room" className="form-label"><strong>Sala:</strong></label>
            <select className="form-select" id="form-event-room" required value={room} onChange={handleChangeRoom}>
              { rooms }
            </select>
          </div>
          <button onClick={handleAcceptClick} className="btn btn-success" disabled={processing}>Akceptuj wniosek</button>
          &nbsp;
          <button onClick={props.onCancel} className="btn btn-danger" disabled={processing}>Anuluj</button>
        </>
      }
    </>
  );
}

function ReservationView() {
  const axios = useAxios();
  const client = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const { status, data } = useQuery({
    queryKey: ['reservation', id],
    queryFn: async () => {
      const { data } = await axios.get(`/application/${id}`);
      return data as ApplicationData;
    },
    staleTime: 60000,
  });

  const [ roomExpanded, setRoomExpanded ] = useState(false);
  const [ rejectOpen, setRejectOpen ] = useState(false);
  const [ processing, setProcessing ] = useState(false);

  const handleRoomChangeClick = () => {
    setRoomExpanded(true);
  };

  const handleRoomChangeCancel = () => {
    setRoomExpanded(false);
  };

  const handleAcceptClick = () => {
    setProcessing(true);
    axios.put(`/application/accept/${id}`).then(() => {
      setProcessing(false);
      client.invalidateQueries({
        queryKey: ['reservation'],
      });
      navigate('/reservation-list/success', { replace: true });
    }).catch((e) => {
      setProcessing(false);
      alert(e);
    });
  };

  const handleRejectClick = () => {
    setRejectOpen(true);
  };

  const handleRejectCancel = () => {
    setRejectOpen(false);
  };

  const handleRejectReturn = () => {
    navigate('..', { relative: 'path' });
  };

  return (
    <>
      <Navbar activePage='reservation-list' />
      <main className="container mt-4">
        <h1>Przeglądanie wniosku</h1>
        <br />
        { status === 'pending' && <p>Wczytywanie danych...</p> }
        { 
          status === 'success' && data.hasConflict && 
          <div className="alert alert-warning" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            Nie można zaakceptować wniosku, ponieważ wybrana sala jest zajęta. Zaproponuj inną salę.
          </div>
        }
        {
          status === 'success' && !rejectOpen &&
          <div className="card mb-2 bg-body-tertiary">
            <div className="card-body">
              <h5 className="card-title mb-3">Wnioskek o rezerwację sali</h5>

              <p className="card-text">
                <i className="fa-solid fa-graduation-cap"></i>&nbsp;<strong>Składający:</strong>&nbsp;
                {data.user.firstName} {data.user.lastName}
              </p>
              <p className="card-text">
                <i className="fa-solid fa-filter"></i>&nbsp;<strong>Kategoria wydarzenia:</strong>&nbsp;
                {data.event.name}
              </p>
              <p className="card-text">
                <i className="fa-regular fa-calendar"></i>&nbsp;&nbsp;<strong>Data:</strong>&nbsp;
                {moment(data.date).format('DD.MM.YYYY')}
              </p>
              <p className="card-text">
                <i className="fa-regular fa-clock"></i>&nbsp;&nbsp;<strong>Czas:</strong>&nbsp;
                {data.startTime} &ndash; {data.endTime}
              </p>
              <p className="card-text">
                <i className="fa-solid fa-person"></i>&nbsp;&nbsp;&nbsp;<strong>Liczba uczestników:</strong>&nbsp;
                ok. {data.participants} uczestników
              </p>
              <p className="card-text">
                <i className="fa-regular fa-building"></i>&nbsp;&nbsp;<strong>Proponowana sala:</strong>&nbsp;
                budynek {data.building.number}, sala {data.room.number}
              </p>
              <p className="card-text mt-2 mb-2">
                <i className="fa-solid fa-pen"></i>&nbsp;<strong>Opis zgłoszenia:</strong><br />
                {data.description}
              </p>

            </div>
            <div className="card-footer pt-3 pb-3">
              {
                !roomExpanded && <>
                  {
                    !data.hasConflict && <>
                      <button onClick={handleAcceptClick} className="btn btn-success" disabled={processing}>Akceptuj wniosek</button>
                      &nbsp;
                    </>
                  }
                  <button onClick={handleRejectClick} className="btn btn-danger" disabled={processing}>Odrzuć</button>
                  &nbsp;
                  <button onClick={handleRoomChangeClick} className="btn btn-warning" disabled={processing}>Zmień proponowaną salę</button>
                </>
              }
              { roomExpanded && <RoomChange applicationId={id!} initialBuildingId={data.building.id} initialRoomId={data.room.id} onCancel={handleRoomChangeCancel} /> }
            </div>
          </div>
        }
        {
          status === 'success' && rejectOpen &&
          <ReservationReject id={data.id} onCancel={handleRejectCancel} onReturnToList={handleRejectReturn} />
        }
      </main>
    </>
  );
}

export default ReservationView;
