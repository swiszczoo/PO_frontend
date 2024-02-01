import Navbar from '../components/Navbar';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAxios } from '../hooks/useAxios';

import moment from 'moment';

function ReservationForm() {
  const axios = useAxios();

  const { status, data } = useQuery({
    queryKey: ['reservationForm'],
    queryFn: async () => {
      const { data } = await axios.get('/application/form');
      return data;
    },
    staleTime: 60000,
  });

  const [type, setType] = useState(1);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [start, setStart] = useState(moment().format('HH:mm'));
  const [end, setEnd] = useState(moment().format('HH:mm'));
  const [participants, setParticipants] = useState(10);
  const [building, setBuilding] = useState(1);
  const [room, setRoom] = useState(0);
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(parseInt(event.target.value));
  };

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleChangeStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStart(event.target.value);
  };

  const handleChangeEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(event.target.value);
  };

  const handleChangeParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParticipants(parseInt(event.target.value));
  };

  const handleChangeBuilding = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBuilding(parseInt(event.target.value));
  };

  const handleChangeRoom = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoom(parseInt(event.target.value));
  };

  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    const startTime = new Date(`${date}T${start}:00.000`);
    const endTime = new Date(`${date}T${end}:00.000`);

    if (endTime <= startTime) {
      alert('Koniec wydarzenia przed początkiem');
      e.preventDefault();
      return;
    }

    if (Number.isNaN(participants)) {
      alert('Wprowadź listę uczestników');
      e.preventDefault();
      return;
    }

    setProcessing(true);
    axios.post('/application/save', {
      eventId: type,
      date: startTime,
      startTime: `${start}:00`,
      endTime: `${end}:00`,
      participants,
      buildingId: building,
      roomId: room,
      description
    }).then(() => {
      setSubmitted(true);
      setProcessing(false);
    }).catch(e => {
      console.error(e);
      alert(e);
      setProcessing(false);
    });

    e.preventDefault();
  };

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

  return (
    <>
      <Navbar activePage='reservation' />
      <main className="container mt-4">
        <h1>Formularz rezerwacji sali</h1>
        {status === 'pending' && <p>Wczytywanie danych...</p>}
        {status === 'success' && !submitted &&
          <>
            <p>
              Uzupełnij poniższy formularz, aby dokonać rezerwacji sali na wydarzenie specjalne.
              Wniosek zostanie rozpatrzony przez pracownika dziekanatu.
            </p>
            <form onSubmit={handleSubmitClick}>
              <div className="mb-3">
                <label htmlFor="form-event-type" className="form-label"><strong>Kategoria wydarzenia:</strong></label>
                <select className="form-select" id="form-event-type" required value={type} onChange={handleChangeType}>
                  {
                    data.events.map((event: { id: number, name: string }) => <option value={event.id} key={event.id}>{event.name}</option>)
                  }
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="form-event-date" className="form-label"><strong>Data wydarzenia:</strong></label>
                <input type="date" className="form-control" required id="form-event-date" value={date} onChange={handleChangeDate} />
              </div>
              <div className="d-flex">
                <div className="mb-3 col-6 pe-2">
                  <label htmlFor="form-event-from" className="form-label"><strong>Godzina rozpoczęcia:</strong></label>
                  <input type="time" className="form-control" required id="form-event-from" value={start} onChange={handleChangeStart} />
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="form-event-to" className="form-label"><strong>Godzina zakończenia:</strong></label>
                  <input type="time" className="form-control" required id="form-event-to" value={end} onChange={handleChangeEnd} />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="form-event-people" className="form-label"><strong>Liczba uczestników (szacunkowa):</strong></label>
                <input type="number" className="form-control" required id="form-event-people" min="1" value={participants} onChange={handleChangeParticipants} />
              </div>
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
              <div className="mb-4">
                <label htmlFor="form-event-description" className="form-label"><strong>Dodatkowy opis:</strong></label>
                <textarea className="form-control" id="description" rows={3} value={description} onChange={handleChangeDescription} />
                <div className="form-text">Zwięzły i konkretny opis ułatwi rozpatrzenie zgłoszenia.</div>
              </div>
              <div>
                <button type='submit' className="btn btn-primary" onClick={handleSubmitClick} disabled={processing}>Wyślij zgłoszenie</button>
                &nbsp;
                <Link to='..' relative='path' className="btn btn-secondary">Anuluj</Link>
              </div>
            </form>
          </>
        }
        {
          status === 'success' && submitted &&
          <div className="alert alert-success" role="alert">
            <i className="fa-solid fa-check"></i>
            Zgłoszenie zostało wysłane pomyślnie! O wyniku rozpatrzenia powiadomimy Cię mailowo.
          </div>
        }
      </main>
    </>
  );
}

export default ReservationForm;
