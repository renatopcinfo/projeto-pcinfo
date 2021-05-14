import firebase from './firebaseConnection';

const socialMediaAuth = (provider) => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      return res.user;
    })
    .catch((err) => {
      return err;
    });
};

export default socialMediaAuth;
