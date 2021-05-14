import React, { Component, useEffect } from 'react';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

//import { loginAuth } from '../../services/firebaseConnection';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import './signin.css';
import logo from '../../assets/logo.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth, handleLoginDataGoogle } =
    useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      signIn(email, password);
    }
  }

  // const handleGoogleLogin = async () => {
  //   let result = await loginAuth();
  //   console.log('--------------------', result);
  //   handleLoginDataGoogle(result.user);
  //   if (result) {
  //   } else {
  //     alert('Error');
  //   }
  // };

  const handleGoogleLogin = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('User signed in');
        console.log(user);
      } else {
        console.log('No User signed');
      }
    });
  }, []);

  // componentDidMount = () => {
  //   firebase.auth().onAuthStateChanged(function (email) {
  //     if (email) {
  //       console.log('User signed in');
  //     } else {
  //       console.log('No User signed');
  //     }
  //   });
  // };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area ">
          <img src={logo} alt="Sistema Logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <button onClick={handleGoogleLogin}>
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
    </div>
  );
}

export default SignIn;
