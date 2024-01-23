import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAxios } from '../hooks/useAxios';
import { useSession } from '../hooks/useSession';

function Login() {
  const axios = useAxios();
  const session = useSession();
  const navigate = useNavigate();

  const [ login, setLogin ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ processing, setProcessing ] = useState(false);
  const [ error, setError ] = useState('');

  const handleLoginClick = () => {
    setProcessing(true);
    setError('');

    axios.post('/api/v1/auth/authenticate', {
      email: login,
      password,
    }).then((res) => {
      window.localStorage.setItem(session.tokenKey, res.data['token']);
      session.invalidateSession();
    }).catch((err) => {
      console.error(err);

      setProcessing(false);
      setError('Nieprawidłowe dane logowania');
    });
  };

  useEffect(() => {
    if (session.isLoggedIn()) {
      navigate('/', {
        replace: true
      });
    }
  }, [session, navigate]);

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  return (
    <main className="container">
      <div className="row">
        <div style={{ marginTop: 32 }}>
          <h1>Logowanie do systemu</h1>
          <form style={{ marginTop: 32 }}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Adres e-mail</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Wprowadź e-mail" value={login} onChange={handleLoginChange}/>
            </div>
            <br/>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Hasło</label>
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Wprowadź hasło" value={password} onChange={handlePasswordChange}/>
            </div>
            <br/>
            <p style={{ color: 'red' }}>{error}</p>
            <br/>
            <button onClick={handleLoginClick} type="submit" className="btn btn-primary" disabled={processing}>{ processing ? 'Logowanie...' : 'Zaloguj' }</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
