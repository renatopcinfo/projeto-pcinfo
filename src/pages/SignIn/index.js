import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';

import { AuthContext } from '../../contexts/auth';
import './signin.css';
import logo from '../../assets/logo.png';
import { googleprovider } from '../../services/authMethods';
import { toast } from 'react-toastify';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  const { signIn, loadingAuth, handleGoogleLogin } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      signIn(email, password);
    } else {
      toast.error('Informe e-mail e senha!');
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area ">
          <img src={logo} alt="Sistema Logo" />
        </div>

        {user && (
          <div>
            <strong>Seja bem vindo! (Você está logado!)</strong> <br />
            <span>
              {userLogged.uid} - {userLogged.email}
            </span>
            <br /> <br />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>

          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? 'Carregando...' : 'Acessar'}
          </button>
        </form>

        <button
          className="btn-google"
          onClick={() => handleGoogleLogin(googleprovider)}
        >
          <FaGoogle />
          Fazer login com o Google
        </button>

        <button
          className="btn-password"
          onClick={() =>
            Swal.fire(
              'Favor entrar em contato com o administrador do sistema',
              '(37) 99958-5748 ou renatopcinfo@gmail.com'
            )
          }
        >
          Esqueceu a senha?
        </button>

        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}

export default SignIn;
