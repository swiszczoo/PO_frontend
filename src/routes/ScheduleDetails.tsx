import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAxios } from '../hooks/useAxios';

const weekdayMapping = {
  MONDAY: 'poniedziałek',
  TUESDAY: 'wtorek',
  WEDNESDAY: 'środa',
  THURSDAY: 'czwartek',
  FRIDAY: 'piątek',
};

function ScheduleDetails() {
  const axios = useAxios();
  const { id, index } = useParams();

  const { status, data } = useQuery({
    queryKey: ['schedules', id],
    queryFn: async () => {
      const { data } = await axios.get('/schedule/all');

      for (const schedule of data) {
        if (`${schedule.id}` === id) {
          return schedule;
        }
      }

      return {
        id: -1,
        name: 'Nie znaleziono',
        courses: [],
      };
    },
    staleTime: 60000,
  });

  const courseData = status === 'success' && data.courses[index!];

  return (
    <>
      <Navbar activePage='schedule' />
      <main className="container mt-4">
        <h1 className='mb-5'>Szczegóły zajęć</h1>
        { status === 'pending' && <p>Wczytywanie danych...</p>}
        { 
          status === 'success' && 
          <div className="card mb-2 bg-body-tertiary">
            <div className="card-body">
                <h5 className="card-title mb-3">Zajęcia</h5>
                
                <p className="card-text">
                    <i className="fa-solid fa-graduation-cap"></i>&nbsp;<strong>Prowadzący:</strong>&nbsp;
                    {courseData.teacher}
                </p>
                <p className="card-text">
                    <i className="fa-regular fa-calendar"></i>&nbsp;&nbsp;<strong>Dzień tygodnia:</strong>&nbsp;
                    {weekdayMapping[courseData.day as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY']}
                </p>
                <p className="card-text">
                    <i className="fa-regular fa-clock"></i>&nbsp;&nbsp;<strong>Czas:</strong>&nbsp;
                    {courseData.startTime} &ndash; {courseData.endTime}
                </p>
                <p className="card-text">
                    <i className="fa-solid fa-person"></i>&nbsp;&nbsp;&nbsp;<strong>Liczba zapisanych:</strong>&nbsp;
                    {courseData.participants} studentów
                </p>
                <p className="card-text">
                    <i className="fa-regular fa-building"></i>&nbsp;&nbsp;<strong>Sala:</strong>&nbsp;
                    {courseData.building}, s. {courseData.room}
                </p>
            </div>
            <div className="card-footer pt-3 pb-3">
                <Link to='..' relative='path' className="btn btn-secondary">Powrót</Link>
            </div>
          </div>
        }
      </main>
    </>
  );
}

export default ScheduleDetails;