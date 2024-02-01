import { useState } from 'react';
import { useAxios } from '../hooks/useAxios';

import { useQueryClient } from '@tanstack/react-query';

interface ReservationRejectProps {
  id: number;
  onCancel?: () => void;
  onReturnToList?: () => void;
}

function ReservationReject(props: ReservationRejectProps) {
  const axios = useAxios();
  const client = useQueryClient();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleRejectClick = () => {
    setProcessing(true);
    axios.put(`/application/reject/${props.id}`).then(() => {
      setProcessing(false);
      setCompleted(true);
      client.invalidateQueries({
        queryKey: ['reservation'],
      });
    }).catch((e) => {
      setProcessing(false);
      alert(e);
    });
  };

  if (!completed) {
    return (
      <>
        <p><strong>Czy na pewno chcesz odrzucić wniosek?</strong></p>
        <button className="btn btn-success btn-lg" onClick={handleRejectClick} disabled={processing}>TAK</button>
        &nbsp;
        <button className="btn btn-danger btn-lg" onClick={props.onCancel} disabled={processing}>NIE</button>
      </>
    );
  } else {
    return (
      <>
        <div className="alert alert-success" role="alert">
          <i className="fa-solid fa-check"></i>
          Odrzucono wniosek. Składający zostanie o tym powiadomiony mailowo.
        </div>
        <button className="btn btn-primary" onClick={props.onReturnToList}>Powrót do listy</button>
      </>
    );
  }
}

export default ReservationReject;
