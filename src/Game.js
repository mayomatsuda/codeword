import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from './Firebase';

const generateInitialColors = () => {
  let colors = Array(20).fill('green').fill('red', 0, 10);
  // Shuffle the colors
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
  return colors;
};

const Game = () => {
  const [colors, setColors] = useState(generateInitialColors());
  const [showColors, setShowColors] = useState(true);
  const [inputText, setInputText] = useState('');
  const [inputNumber, setInputNumber] = useState(0);
  const [guessesRemaining, setGuessesRemaining] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [revealedTiles, setRevealedTiles] = useState(Array(20).fill(false));
  const [tileLabels, setTileLabels] = useState([]);

  const queryParams = new URLSearchParams(window.location.search);
  const isPlayMode = queryParams.get('mode') === 'play';
  const text = queryParams.get('text');
  const number = queryParams.get('number');

  const selectRandomWords = (list, count) => {
    return list.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const handleTileClick = (index) => {
    if (showColors || gameOver) return;

    // Reveal the tile
    const newRevealedTiles = [...revealedTiles];
    newRevealedTiles[index] = true;
    setRevealedTiles(newRevealedTiles);

    // Game logic
    if (colors[index] === 'red') {
        setTimeout(() => {
          setGameOver(true);
          alert('Game Over!');
        }, 500); // Delay of 1000 milliseconds (1 second)
      } else {
        setGuessesRemaining(guessesRemaining - 1);
        if (guessesRemaining - 1 === 0) {
          setTimeout(() => {
            alert('You Win!');
          }, 500);
        }
      }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setInputText(e.target.value.toUpperCase());
  }
  const handleNumberChange = (e) => setInputNumber(e.target.value);

  const generateURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'play');
    url.searchParams.set('text', inputText);
    url.searchParams.set('number', inputNumber);
    url.searchParams.set('colors', colors.join(','));
    return url.href;
  };

  const copyToClipboard = () => {
    const url = generateURL();
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const text = params.get('text');
    const number = params.get('number');
    const colorsFromUrl = params.get('colors');

    if (mode === 'play' && text && number && colorsFromUrl) {
        setInputText(text);
        setInputNumber(number);
        setColors(colorsFromUrl.split(','));
        setShowColors(false);
        setGuessesRemaining(parseInt(number, 10));
    }

    const fetchPost = async () => {
      const docRef = doc(firestore, "words", getCurrentDate());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTileLabels(docSnap.data().words);
      }
    }
    fetchPost();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridGap: '10px',
        justifyContent: 'center',
      }}>
        {colors.map((color, index) => (
        <Tile
          key={index}
          label={tileLabels[index]}
          color={color}
          isFlipped={revealedTiles[index]}
          showColor={!isPlayMode}
          onClick={() => handleTileClick(index)}
        />
        ))}
      </div>
      {!isPlayMode && (
        <div style={formContainerStyle}>
        <div style={inputsContainerStyle}>
          <input type="text" value={inputText} onChange={handleInputChange} placeholder="ENTER HINT" style={inputStyle} />
          <input type="number" value={inputNumber} onChange={handleNumberChange} placeholder="Enter number" style={{...inputStyle, width: '80px'}} />
          <button onClick={copyToClipboard} style={buttonStyle}>SUBMIT</button>
        </div>
        </div>
      )}

      {isPlayMode && text && (
        <div style={{ marginTop: '20px' }}>
          {`'${text}' for ${number}`}
        </div>
      )}
    </div>
  );
};

// Define some basic styles
const formContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inputsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  };
  
  const inputStyle = {
    padding: '10px',
    margin: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };
  
  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  };

export default Game;
