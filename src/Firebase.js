import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
};

const selectRandomWords = (list, count) => {
    return list.sort(() => 0.5 - Math.random()).slice(0, count);
};

function generate() {
    fetch('nounlist.txt')
    .then(response => response.text())
    .then(text => {
      const nouns = text.split('\n');

      let currentDate = new Date(2024, 0, 6);
      let endDate = new Date(2024, 11, 31);
  
      while (currentDate <= endDate) {
        let selectedWords = selectRandomWords(nouns, 20);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        let dateString = `${year}-${month}-${day}`;

        const citiesRef = collection(firestore, "words");

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