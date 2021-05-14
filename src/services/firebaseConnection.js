import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: 'AIzaSyDwqGTwP2H9XX4gosOsiPVMrYVsNeVGvD0',
  authDomain: 'sistema-df140.firebaseapp.com',
  projectId: 'sistema-df140',
  storageBucket: 'sistema-df140.appspot.com',
  messagingSenderId: '14977229227',
  appId: '1:14977229227:web:30278fc575a99b478a32ee',
  measurementId: 'G-WT5VKSSZR9',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// export const loginAuth = {
//   googleLogin: async () => {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     let result = await firebase.auth().signInWithPopup(provider);
//     return result;
//   },
// };

export default firebase;
