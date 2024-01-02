import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";

// Firebase config from env file
const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
};

// Helper function to select random words from list
const selectRandomWords = (list, count) => {
    return list.sort(() => 0.5 - Math.random()).slice(0, count);
};

// Function to be run manually when new words needed
function generate() {
    fetch('nounlist.txt')
    .then(response => response.text())
    .then(text => {
      const nouns = text.split('\n');

      let currentDate = new Date();
      let endDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
  
      // For each day between now and next year, generate a word list
      while (currentDate <= endDate) {
        let selectedWords = selectRandomWords(nouns, 20);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        let dateString = `${year}-${month}-${day}`;

        const citiesRef = collection(firestore, "words");

        // Set words for day
        setDoc(doc(citiesRef, dateString), {
          words: selectedWords
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    })
    .catch(error => {
        console.error('Error fetching noun list:', error);
    });
}

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);