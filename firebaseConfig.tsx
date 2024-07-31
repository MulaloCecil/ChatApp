// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDlLdo6xZpC1vb4GgFzEUdiq8cfssw8jQ8",
  authDomain: "hydro-alert-ff86b.firebaseapp.com",
  databaseURL: "https://hydro-alert-ff86b-default-rtdb.firebaseio.com",
  projectId: "hydro-alert-ff86b",
  storageBucket: "hydro-alert-ff86b.appspot.com",
  messagingSenderId: "707957406381",
  appId: "1:707957406381:web:40e81e2e1c878df8ede424"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database };