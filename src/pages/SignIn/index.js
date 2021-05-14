import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import './signin.css';
import logo from '../../assets/logo.png';
import { googleprovider } from '../../services/authMethods';
import socialMediaAuth from '../../services/googleAuth';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      signIn(email, password);
    }
  }

  const handleGoogleLogin = async (provider) => {
    const res = await socialMediaAuth(provider);
    console.log(res);
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area ">
          <img src={logo} alt="Sistema Logo" />
        </div>

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

        <Link to="/register">Criar uma conta</Link>
      </div>
      <button onClick={() => handleGoogleLogin(googleprovider)}>
        <FaGoogle />
        Fazer login com o Google
      </button>
      <button onClick={() => firebase.auth().signOut()}>
        <FaGoogle />
        Sair
      </button>
    </div>
  );
}

export default SignIn;
