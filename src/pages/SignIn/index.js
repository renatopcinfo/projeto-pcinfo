import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import './signin.css';
import logo from '../../assets/logo.png';
import { googleprovider } from '../../services/authMethods';
import googleAuth from '../../services/googleAuth';
import { toast } from 'react-toastify';
import SignUp from '../SignUp';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  const { signIn, loadingAuth, storageUser, handleGoogle } =
    useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      signIn(email, password);
    } else {
      toast.error('Informe e-mail e senha!');
    }
  }

  const handleGoogleLogin = async (provider) => {
    //firebase.auth().onAuthStateChanged(setUser);
    //localStorage.setItem('typeLogin', 'Default');

    // const typeLogin = localStorage.getItem('userInfo');
    // console.log('TypeLogin---', typeLogin);
    // if (typeLogin === false || typeLogin !== 'Default') {
    //   firebase.auth().onAuthStateChanged(setUser);
    // }
    handleGoogle();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        //let uid = value.user.uid;
        //console.log('Value', uid);
        //console.log('retorno google login', res.user);
        //toast().success('logado');
        //console.log('resposta google', res);
        //return res.user;
        //procurar se está cadastrado e carregar
        let data = {
          uid: res.user.uid,
          nome: res.user.displayName,
          email: res.user.email,
          avatarUrl: res.user.photoURL ? res.user.photoURL : null,
        };
        await firebase.firestore().collection('users').doc(data.uid).set({
          nome: data.nome,
          avatarUrl: data.avatarUrl,
        });

        // if (!userProfile) {
        //   //insert
        //   SignUp(data);
        // } else {
        //   //update
        // }

        localStorage.removeItem('typeLogin');
        setUser(data);
        storageUser(data);
      })
      .catch((err) => {
        return err;
      });
    //signUp();
    // await firebase.firestore().collection('users').set({
    //   nome: nome,
    //   avatarUrl: null,
    // });
  };

  // async function handleLogout() {
  //   await firebase.auth().signOut();
  // }

  // useEffect(() => {
  //   async function checkLogin() {
  //     await firebase.auth().onAuthStateChanged((user) => {
  //       if (user) {
  //         setUser(true);
  //         setUserLogged({
  //           uid: user.uid,
  //           email: user.email,
  //           type: user.type,
  //         });
  //         //se tem usuario logado entra aqui dentro...
  //       } else {
  //         //nao possui nenhum user logado.
  //         setUser(false);
  //         setUserLogged({});
  //       }
  //     });
  //   }

  //   checkLogin();
  // }, []);

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

      {/* <button onClick={handleLogout}>
        <FaGoogle />
        Sair
      </button> */}
    </div>
  );
}

export default SignIn;
