import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMJtrr9hYtN_Z1o8Xi0HtQfHnAy38hoX4",
  authDomain: "diagnozys.firebaseapp.com",
  projectId: "diagnozys",
  storageBucket: "diagnozys.appspot.com",
  messagingSenderId: "979955739106",
  appId: "1:979955739106:web:f695939469c32ce09971bb",
  measurementId: "G-714GC5YVQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
