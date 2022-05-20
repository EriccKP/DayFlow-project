
 import firebase from 'firebase';


 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyB3-TsRTj7jlHLWrjxE2fx-hkzWyZ-Ku3U",
   authDomain: "dayflow-cca63.firebaseapp.com",
   projectId: "dayflow-cca63",
   storageBucket: "dayflow-cca63.appspot.com",
   messagingSenderId: "1053648433467",
   appId: "1:1053648433467:web:bb9b0d003f35da0027071e"
 };

 // Initialize Firebase
 const fire = firebase.initializeApp(firebaseConfig);

export default fire;