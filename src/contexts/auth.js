import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allChamados, setAllChamados] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem('SistemaUser');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    loadStorage();
    loadAllChamados();
  }, []);

  //carregando all chamados
  // useEffect(() => {

  //   return () => {};
  // }, []);

  async function loadAllChamados() {
    await firebase
      .firestore()
      .collection('chamados')
      .orderBy('created', 'desc')
      .get()
      .then((snapshot) => {
        updateStateAll(snapshot);
      })
      .catch((err) => {
        console.log('Deu algum erro: ', err);
      });

    setLoading(false);
  }

  //format data chamados
  async function updateStateAll(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });
      setAllChamados((allChamados) => [...allChamados, ...lista]);
    } else {
      setEmpty(true);
    }
  }

  //google login
  useEffect(() => {
    const type = localStorage.getItem('type');
    if (!type || type !== 'Default') {
      firebase.auth().onAuthStateChanged(setUser);
    }

    setLoading(false);
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
        localStorage.setItem('type', 'Default');
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
            localStorage.setItem('type', 'Default');
            setLoadingAuth(false);
            toast.success('Bem vindo a plataforma!');
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'auth/weak-password') {
          toast.info('Senha deve conter no mínimo 6 caracteres!');
        } else if (error.code === 'auth/email-already-in-use') {
          toast.info('Esse email já existe!');
        }
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem('SistemaUser', JSON.stringify(data));
    //localStorage.setItem('type', 'Default');
  }

  //logout
  async function signOut() {
    localStorage.removeItem('SistemaUser');
    localStorage.removeItem('type');
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
        allChamados,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
