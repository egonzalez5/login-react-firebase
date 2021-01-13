import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyB7k4Le_zFKKiHYnyHXjlsp_H1JSQhU_S4",
    authDomain: "crud-react-b98e7.firebaseapp.com",
    projectId: "crud-react-b98e7",
    storageBucket: "crud-react-b98e7.appspot.com",
    messagingSenderId: "565073265004",
    appId: "1:565073265004:web:4fa9edb073b8d8c7e43349"
  };
// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()

export {db, auth}