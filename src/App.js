import React, { useState, useEffect } from "react";
import "./styles.css";

const INITIAL_TIMER = 40;
const MAX_ROUNDS = 5;
const SCORE_INCREMENT = 10;

const ColorGame = () => {
  const [rgbColor, setRgbColor] = useState(generateRandomColor());
  const [options, setOptions] = useState(generateColorOptions(rgbColor));
  const [feedback, setFeedback] = useState("");
  const [feedbackClass, setFeedbackClass] = useState("");
  const [timer, setTimer] = useState(40);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => parseInt(localStorage.getItem("bestScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);

  // Generate a random RGB color
  function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Generate random color options including the correct one
  function generateColorOptions(correctColor) {
    const options = new Set([correctColor]);
    while (options.size < 4) {
      options.add(generateRandomColor());
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
    // const options = [correctColor];
    // while (options.length < 4) {
    //   const randomColor = generateRandomColor();
    //   if (!options.includes(randomColor)) {
    //     options.push(randomColor);
    //   }
    // }
    // return options.sort(() => Math.random() - 0.5); // Shuffle the options
  }

  // Reset for a new round
  const resetRound = () => {
    if (round < 5) {
      const newColor = generateRandomColor();
      setRgbColor(newColor);
      setOptions(generateColorOptions(newColor));
      setTimeout(() => {
        setFeedback("");
        setFeedbackClass("");
      }, 1000);

      setTimer(40);
      setRound((prevRound) => prevRound + 1);
    } else {
      setGameOver(true);
    }
  };

  // Handle user's guess
  const handleGuess = (guess) => {
    if (gameOver) return;

    if (guess === rgbColor) {
      setFeedback("✔ Correct!");
      setFeedbackClass("correct");
      const newScore = score + 10;
      setScore(newScore);
      // setScore((prevScore) => prevScore + 10);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("bestScore", newScore);
      }
      resetRound();
    } else {
      setFeedback("✗ Wrong!");
      setFeedbackClass("wrong");
    }
  };

  // Timer countdown
  useEffect(() => {
    if (gameOver || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer - 0.1;
        return newTimer > 0 ? newTimer : 0;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [timer, gameOver]);

  // Handle timeout
  useEffect(() => {
    if (timer <= 0) {
      setFeedback("✗ Timeout!");
      setFeedbackClass("timeout");
      resetRound();
    }
  }, [timer]);

  return (
    <>
      <header className="header">
        <div className="content">
          <h1 className="header-title">
            <svg className="header-logo" id="kolor-logo" viewBox="0 0 33 33">
              <circle cx="9" cy="9" r="6" fill="#b0dbca"></circle>
              <circle cx="24" cy="9" r="6" fill="#b7e1bc"></circle>
              <circle cx="9" cy="24" r="6" fill="#fbb9a3"></circle>
              <circle cx="24" cy="24" r="6" fill="#f6747f"></circle>
            </svg>{" "}
            KOLOR
          </h1>
          <div id="kolor-feedback" className="feedback">
            <span className={feedbackClass}>{feedback}</span>
          </div>
        </div>
      </header>
      <div className="game-container">
        <div className="stats">
          <div>
            <p>TIME</p>
            <h2>{timer.toFixed(1)}</h2>
            {/* <h2>40.0</h2> */}
          </div>
          <div>
            <p>ROUND</p>
            <h2>{round}/5</h2>
          </div>
          <div>
            <p>SCORE</p>
            <h2>{score}</h2>
          </div>
          <div>
            <p>BEST</p>
            <h2>{bestScore}</h2>
          </div>
        </div>
        {!gameOver ? (
          <>
            <div className="color-box" style={{ backgroundColor: rgbColor }}>
              <h2 className="color-text">What KOLOR is this?</h2>
            </div>
            <div className="options-container">
              {options.map((color) => (
                <button
                  key={color}
                  onClick={() => handleGuess(color)}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  aria-label={`Choose color ${color}`}
                ></button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Game Over! Thanks for playing.</h2>
            <p>
              Your Total Score: <strong>{score}</strong>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ColorGame;
