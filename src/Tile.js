import React, { useEffect, useState, useRef } from 'react';

const Tile = ({ label, color, onClick, isFlipped, showColor }) => {

  const [fontSize, setFontSize] = useState(16); // Initial font size
  const tileRef = useRef(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const tile = tileRef.current;
      if (!tile) return;

      let currentFontSize = 16; // Start with the base font size
      tile.style.fontSize = `${currentFontSize}px`;

      if (tile.scrollWidth + 1 > tile.offsetWidth) {
        currentFontSize = Math.max(currentFontSize - (tile.scrollWidth - tile.offsetWidth + 1), 12);
        tile.style.fontSize = `${currentFontSize}px`;
      }

      if (tile.scrollHeight + 1 > tile.offsetHeight) {
        currentFontSize = Math.max(currentFontSize - (tile.scrollHeight - tile.offsetHeight + 1), 12);
        tile.style.fontSize = `${currentFontSize}px`;
      }

      setFontSize(currentFontSize);
    };

    adjustFontSize();
    // Optionally, add a resize listener to adjust font size on window resize
  }, [label]); // Depend only on 'label'
  
  const textStyle = {
    textTransform: 'uppercase',
    fontSize: `${fontSize}px`,
    wordWrap: 'break-word',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
  };

  const tileStyle = {
    height: '100px',
    width: '100px',
    margin: '10px',
    perspective: '1000px',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tileInnerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    transform: isFlipped ? 'rotateY(180deg)' : ''
  };

  const tileFrontStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: showColor ? (color === 'green' ? '#6dbe25' : color === 'red' ? '#Dc6969' : '#d6d6d6') : '#d6d6d6',
    color: 'black',
    ...textStyle,
  };

  const tileBackStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: color === 'green' ? '#6dbe25' : '#Dc6969',
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotateY(180deg)',
    ...textStyle,
  };

  tileFrontStyle.backgroundColor = showColor ? (color === 'green' ? '#6dbe25' : color === 'red' ? '#Dc6969' : '#d6d6d6') : '#d6d6d6';

  return (
    <div ref={tileRef} style={tileStyle} onClick={onClick}>
      <div style={tileInnerStyle}>
        <div style={tileFrontStyle}>{label}</div>
        <div style={tileBackStyle}></div>
      </div>
    </div>
  );
};

export default Tile;
