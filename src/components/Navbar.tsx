import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import pwrSrc from '../assets/pwr.png';

import { useSession } from '../hooks/useSession';

function ClockText() {
  const [ clockText, setClockText ] = useState('');

  useEffect(() => {
    const updateFunc = () => {
      const date = new Date();
      setClockText(`${('' + date.getHours()).padStart(2, '0')}:${('' + date.getMinutes()).padStart(2, '0')}:${('' + date.getSeconds()).padStart(2, '0')}`);
    };

    const timerId = setInterval(updateFunc, 1000);
    updateFunc();

    return () => clearInterval(timerId);
  }, []);

  return <>{clockText}</>;
}

interface NavbarProps {
  activePage: 'enrol' | 'reservation' | 'reservation-list' | 'schedule';
};

function Navbar(props: NavbarProps) {
  const session = useSession();

  const handleLogOutClick = () => {
    window.localStorage.removeItem(session.tokenKey);
    session.invalidateSession();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link to='/' className="navbar-brand">
                <img src={pwrSrc} alt="Logo" width="24" height="24" className="d-inline-block align-text-top" />
                Politechnika Wrocławska
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex w-100">
                    <li className="nav-item">
                        <Link to='/enrollment' className={`nav-link${props.activePage === 'enrol' ? ' active' : ''}`}>Zapisy</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/reservations' className={`nav-link${props.activePage === 'reservation' ? ' active' : ''}`}>Rezerwacje sal</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/reservation-list' className={`nav-link${props.activePage === 'reservation-list' ? ' active' : ''}`}>Lista wniosków</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/schedule' className={`nav-link${props.activePage === 'schedule' ? ' active' : ''}`}>Lista planów</Link>
                    </li>
                    <li className="flex-grow-1"></li>
                    <li className="nav-item">
                        <a className="nav-link" href="#"><i className="fa-regular fa-clock"></i>&nbsp;<span
                                id="timer"><ClockText /></span></a>
                    </li>
                    <li className="nav-item dropstart">
                        <a className="d-flex align-items-center nav-link dropdown-toggle" href="#" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <div style={{ width: 24, height:24, background:'#888', marginLeft:8 }}
                                className="rounded-circle me-2"></div>
                            {session.firstName!} {session.lastName!}
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Mój profil</a></li>
                            <li><a className="dropdown-item" href="#">Ustawienia systemu</a></li>
                            <li><a className="dropdown-item" href="#">Zmiana hasła</a></li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>
                            <li><a onClick={handleLogOutClick} className="dropdown-item" href="#">Wyloguj się</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
