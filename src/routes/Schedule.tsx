import Navbar from '../components/Navbar';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAxios } from '../hooks/useAxios';

import styled from 'styled-components';

interface HourRowProps {
  hour: string;
}

const HourDiv = styled.div`
  height: 60px;
  font-size: 1.2em;
  border-top: 1px solid white;
`;

function HourRow(props: HourRowProps) {
  return (
    <HourDiv>{props.hour}:00</HourDiv>
  );
}

const ScheduleItemDiv = styled.div`
  background: #127;
  border-radius: 8px;
  position: absolute;
  top: 0px;
  font-size: 0.8em;
  padding: 4px;
  width: 16%;
  cursor: pointer;
`;

interface ScheduleItemProps {
  id: number;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
  participants: number;
  building: string;
  room: string;
  index: number;
}

function ScheduleItem(props: ScheduleItemProps) {
  const navigate = useNavigate();

  let left = 100 / 6;
  if (props.day === 'MONDAY') left = 100 / 6;
  if (props.day === 'TUESDAY') left = 100 / 6 * 2;
  if (props.day === 'WEDNESDAY') left = 100 / 6 * 3;
  if (props.day === 'THURSDAY') left = 100 / 6 * 4;
  if (props.day === 'FRIDAY') left = 100 / 6 * 5;

  const lengthInHours = useMemo(() => {
    const isoStart = `1980-01-01T${props.startTime}`;
    const isoEnd = `1980-01-01T${props.endTime}`;
    const lengthMs = new Date(isoEnd).getTime() - new Date(isoStart).getTime();

    return lengthMs / 1000 / 60 / 60;
  }, [props.startTime, props.endTime]);
  const height = lengthInHours * 60;

  const splitStart = props.startTime.split(':');
  const startMinutes = parseInt(splitStart[0]) * 60 + parseInt(splitStart[1]);
  const top = startMinutes - 7 * 60;

  const handleClick = () => {
    navigate(`${props.index}`);
  };

  return (
    <ScheduleItemDiv style={{ left: `${left}%`, height: `${height}px`, top: `${top}px` }} onClick={handleClick}>
      Zajęcia<br/>
      {props.teacher}<br/>
      {props.startTime} - {props.endTime}
    </ScheduleItemDiv>
  );
}

const ScheduleHeader = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  font-size: 1.5em;
  text-align: center;
`;

function Schedule() {
  const axios = useAxios();
  const { id } = useParams();

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

  const scheduleTitle = status === 'success' ? data.name : 'Wczytywanie danych';
  const hourRows = useMemo(() => {
    const hours = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    return hours.map((hour) => <HourRow key={hour} hour={`${hour}`} />);
  }, []);

  return (
    <>
      <Navbar activePage='schedule' />
      <main className="container mt-4">
        <h1 className='mb-5'>{scheduleTitle}</h1>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
          <ScheduleHeader></ScheduleHeader>
          <ScheduleHeader>Poniedziałek</ScheduleHeader>
          <ScheduleHeader>Wtorek</ScheduleHeader>
          <ScheduleHeader>Środa</ScheduleHeader>
          <ScheduleHeader>Czwartek</ScheduleHeader>
          <ScheduleHeader>Piątek</ScheduleHeader>
        </div>
        <div id='schedule-root' style={{ position: 'relative' }}>
          {hourRows}
          { 
            status === 'success' && 
            data.courses.map((course: ScheduleItemProps, index: number) => <ScheduleItem key={course.id} {...course} index={index} />) 
          }
        </div>
      </main>
    </>
  );
}

export default Schedule;
