import firebase from './firebaseConnection';

const googleAuth = (provider) => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      console.log(res);
      return res.user;
    })
    .catch((err) => {
      return err;
    });
};

export default googleAuth;
