import { useState } from 'react'

import copy from 'copy-to-clipboard'

import wordlist from './lib/wordlist'
import { keyboard, guessgrid } from './lib/grids'
import { createResultString } from './lib/utils'

import './App.sass';

function App() {

  const [ guessState, setGuessState ] = useState([...guessgrid.slice()])

  const [ currentGuess, setCurrentGuess ] = useState({
    row: 0,
    column: 0
  })

  const [ usedLetters, setUsedLetters ] = useState({
    yellowLetters: [],
    greenLetters: [],
    pooLetters: [],
  })

  const [ modalActive, setModalActive ] = useState(null)

  const [ secretWord ]  = useState(wordlist[Math.floor(Math.random() * wordlist.length)])

  const handleKeyboard = key => {
    const _guessState = [...guessState]
    const _currentGuess = {...currentGuess}

    if (key !== "enter" && key !== "<") {
      _guessState[_currentGuess.row][_currentGuess.column].char = key

      if (_currentGuess.column < 3) {
        _currentGuess.column += 1
      } else {
        _currentGuess.column = 3
      }
      setCurrentGuess(_currentGuess)
    }
    
    if (key === "<") {
      _guessState[_currentGuess.row][(_currentGuess.column) -1].char = null
      if (_currentGuess.column === 3) {
        _guessState[_currentGuess.row][3].char = null
        _currentGuess.column = 2
      } else if (_currentGuess.column > 0) {
        _currentGuess.column -= 1
      } else {
       _currentGuess.column = 0
      }
      setCurrentGuess(_currentGuess)
    }

    if (key === "enter" && guessState[currentGuess.row][3].char !== null) {
      attemptGuess()
    }
    
    setGuessState(_guessState)
  }
  
  const handlePlayAgain = () => {
    window.location.reload()
  }

  const handleShare = () => {
    const string = createResultString(guessState, secretWord, currentGuess.row)

    copy(string)

    setModalActive(
      <div className="modal-inner">
        <p>Copied!</p>
        <div 
          className="button"
          onClick={handlePlayAgain}
        >
          Play again?
        </div>
      </div>
    )
     
  }

  const finishModal = () => {
    return (
      <div className="modal-inner">
        <p>{secretWord}</p>
        <div 
          className="button"
          onClick={handlePlayAgain}
        >
          Play again?
        </div>
        <div 
          className="button"
          onClick={handleShare}
        >
          Share
        </div>
      </div>
    )
  }

  const attemptGuess = () => {

    const _guessState = [...guessState]
    const _currentGuess = {...currentGuess}
    const _usedLetters = {...usedLetters}
    const userGuess = guessState[currentGuess.row]

    let winner = []

    userGuess.forEach(({char}, index) => {
      const solutionLetter = secretWord.charAt(index)

      if (solutionLetter === char) {
        _guessState[currentGuess.row][index].color = "#24e017"
        _guessState[currentGuess.row][index].char = '🐢'
        _usedLetters.greenLetters.push(char)
        winner.push(true)
        
      } else if (secretWord.indexOf(char) !== -1) {
        _guessState[currentGuess.row][index].color = "#e9d73a"
        _usedLetters.yellowLetters.push(char)
        winner.push(false)
        
      } else {
        _guessState[currentGuess.row][index].color = "#8e24247f"
        _guessState[currentGuess.row][index].char = '💩'
        _usedLetters.pooLetters.push(char)
        winner.push(false)
      }
      
    })

    setUsedLetters(_usedLetters)
    
    setGuessState(_guessState)

    if (winner.indexOf(false) === -1) {
      setTimeout(() => {
        setModalActive(finishModal(true))
      }, 1500);

    } else if (currentGuess.row + currentGuess.column < 8) {
      _currentGuess.row += 1
      _currentGuess.column = 0
      setCurrentGuess(_currentGuess)

    } else {
      setTimeout(() => {
        setModalActive(finishModal(false))
      }, 1500);

    }
  }

  return (
    <div className="Turdle">
      { modalActive &&
        <div className="modal">
          {modalActive}
        </div>
      }
      <h1>turdle 🐢</h1>
      <div className="guessing-grid">
        { guessState.map((row, rowIndex) => {
          return (
            <div className="row" key={rowIndex}>
              { row.map((letter, index) => {
                const nextUp = currentGuess.column === index && currentGuess.row === rowIndex
                return (
                  <div 
                    className={`guess-tile ${letter.color ? 'guessed' : ''} ${nextUp ? 'next-up' : ''}`}
                    key={index}
                    style={{
                      background: letter.color ? letter.color : '',
                      animationDelay: `${index * 0.15}s`,
                    }}
                  >
                    { letter.char && letter.char }
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="keyboard">
        { keyboard.map((row, index) => {
          return (
            <div className="row" key={index}>
              { row.map(key => {
                const keyClass = (() => {
                  let name = 'key'
                  if (usedLetters.greenLetters.indexOf(key) !== -1) {
                    name += ' green'
                  } else if (usedLetters.yellowLetters.indexOf(key) !== -1) {
                    name += ' yellow'
                  } else if (usedLetters.pooLetters.indexOf(key) !== -1) {
                    name += ' poo'
                  }
                  return name
                })()
                return (
                  <div
                    className={keyClass}
                    key={key}
                    onClick={() => handleKeyboard(key)}
                  >
                      {key}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;