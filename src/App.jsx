import { useState } from 'react'
import './App.css'
import { Square } from './components/Square'
import { resetGameStorage, saveGameToStorage } from './components/storage'
import { WinnerModal } from './components/WinnerModal'
import { TURNS, WINNER_COMBOS } from './constants'

function App () {
  // const [board, setBoard] = useState(Array(9).fill(null))
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  // const [turn, setTurn] = useState(TURNS.X);
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  const [winner, setWinner] = useState(null)

  const updateBoard = index => {
    // No se actualiza si ya hay algo en esa posición
    if (board[index] || winner) return
    // Actualizar el tablero
    const newboard = [...board]
    newboard[index] = turn
    setBoard(newboard)
    // cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar en local storage
    saveGameToStorage(newboard, newTurn)
    // revisar quien ganó
    const newWinner = checkWinnerFrom(newboard)
    if (newWinner) {
      setWinner(newWinner)
    } else if (checkEndGame(newboard)) {
      setWinner(false) // empate
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    // reset local storage
    resetGameStorage()
  }

  const checkWinnerFrom = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    // si nadie gana
    return null
  }

  const checkEndGame = (newBoard) => {
  // revisamos si hay un empate
  // si no hay más espacios vacíos
  // en el tablero
    return newBoard.every((square) => square !== null)
  }

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reiniciar</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
