import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';

import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../hooks/useAxios';

interface SinglePlanProps {
  id: number;
  name: string;
};

function SinglePlan(props: SinglePlanProps) {
  return (
    <div className="card mb-2 bg-body-tertiary">
      <div className="card-body d-flex align-items-center">
          <h5 className="card-title">{props.name}</h5>
          <div className="flex-grow-1"></div>
          <Link to={`${props.id}`} className="btn btn-primary">Pokaż plan</Link>
      </div>
    </div>
  );
}

interface Schedule {
  id: number;
  name: string;
}

function ScheduleList() {
  const axios = useAxios();

  const { status, data } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data } = await axios.get('/schedule/all');
      return data;
    },
    staleTime: 60000,
  });

  return (
    <>
      <Navbar activePage='schedule' />
      <main className="container mt-4">
        <h1>Lista planów</h1>
        <br/>
        { status === 'pending' && <p>Wczytywanie danych</p> }
        { 
          status === 'success' && data.map((entry: Schedule) => (
            <SinglePlan key={entry.id} id={entry.id} name={entry.name} />
          ))
        }
    </main>
    </>
  );
}

export default ScheduleList;
