import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import './signin.css';
import logo from '../../assets/logo.png';
import { googleprovider } from '../../services/authMethods';
import googleAuth from '../../services/googleAuth';
import { toast } from 'react-toastify';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  const { signIn, loadingAuth, signed } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      signIn(email, password);
    }
  }

  const handleGoogleLogin = async (provider) => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        console.log(res);
        toast().success('logado');
        return res.user;
      })
      .catch((err) => {
        return err;
      });
  };

  async function handleLogout() {
    await firebase.auth().signOut();
  }

  useEffect(() => {
    async function checkLogin() {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email,
          });
          //se tem usuario logado entra aqui dentro...
        } else {
          //nao possui nenhum user logado.
          setUser(false);
          setUserLogged({});
        }
      });
    }

    checkLogin();
  }, []);

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
          <button onClick={() => handleGoogleLogin(googleprovider)}>
            <FaGoogle />
            Fazer login com o Google
          </button>

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

        <Link to="/register">Criar uma conta</Link>
      </div>

      <button onClick={handleLogout}>
        <FaGoogle />
        Sair
      </button>
    </div>
  );
}

export default SignIn;
