import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function ReservationSuccess() {
  return (
    <>
      <Navbar activePage='reservation-list' />
      <main className="container mt-4">
        <h1>Przeglądanie wniosku</h1>
        <br/>
        <div className="alert alert-success" role="alert">
            <i className="fa-solid fa-check"></i>
            Pomyślnie zatwierdzono wniosek. Składający zostanie o tym powiadomiony mailowo.
        </div>
        <Link to='..' className="btn btn-primary" relative='path'>Powrót do listy</Link>
      </main>
    </>
  );
}

export default ReservationSuccess;
