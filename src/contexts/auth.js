import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem('userInfo');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  //user login
  async function signIn(email, password) {
    setLoadingAuth(true);

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const userProfile = await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .get();

        let data = {
          uid: uid,
          nome: userProfile.data().nome,
          avatarUrl: userProfile.data().avatarUrl,
          email: value.user.email,
          type: userProfile.data().type ? userProfile.data().type : null,
        };

        setUser(data);
        localStorage.setItem('typeLogin', 'Default');
        storageUser(data);
        setLoadingAuth(false);
        toast.success('Bem vindo de volta!');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Usuário ou senha inválidos.');
        setLoadingAuth(false);
      });
  }

  // Google login
  const handleGoogleLogin = async (provider) => {
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (res) => {
        let data = {
          uid: res.user.uid,
          nome: res.user.displayName,
          email: res.user.email,
          avatarUrl: res.user.photoURL ? res.user.photoURL : null,
        };

        const existId = firebase.firestore();
        let uid = res.user.uid;
        existId
          .collection('users')
          .doc(uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              let dataExist = {
                uid: uid,
                nome: snapshot.data().nome,
                avatarUrl: snapshot.data().avatarUrl,
                email: res.user.email,
              };

              localStorage.removeItem('typeLogin');
              setUser(dataExist);
              storageUser(dataExist);
              toast.success('Bem vindo de volta!');
            } else {
              firebase.firestore().collection('users').doc(data.uid).set({
                nome: data.nome,
                avatarUrl: data.avatarUrl,
              });
              localStorage.removeItem('typeLogin');
              setUser(data);
              storageUser(data);
            }
          });
      })
      .catch((err) => {
        console.log('Ops, algo deu errado!', err);
        return err;
      });
  };

  //create user
  async function signUp(email, password, nome) {
    setLoadingAuth(true);

    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .set({
            nome: nome,
            avatarUrl: null,
          })
          .then(() => {
            let data = {
              uid: uid,
              nome: nome,
              email: value.user.email,
              avatarUrl: null,
            };

            setUser(data);
            storageUser(data);
            localStorage.setItem('typeLogin', 'Default');
            setLoadingAuth(false);
            toast.success('Bem vindo a plataforma!');
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'auth/weak-password') {
          toast.error('Senha deve conter no mínimo 6 caracteres!');
        } else if (error.code === 'auth/email-already-in-use') {
          toast.error('Esse email já existe!');
        }
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  //logout
  async function signOut() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('typeLogin');
    await firebase.auth().signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signUp,
        signOut,
        signIn,
        loadingAuth,
        setUser,
        storageUser,
        handleGoogleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
