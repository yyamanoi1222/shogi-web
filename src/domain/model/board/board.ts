import { Piece, pieceInit } from '../piece'
import { Side } from '../player'

export type Cells = Cell[][]
export type Cell = {
  id: number
  piece: Piece | null
}

export type Board = {
  cells: Cells,
  capturedPiece: { [P in Side]: Piece[] }
}

export const copyCells = (cells: Cells): Cells => {
  return cells.map((row) => {
    return [...row]
  })
}

export const boardInit = (): Board => {
  const pieces = pieceInit('white')
  const cells = pieces.map((row, i) => {
    return row.map((piece, k) => {
      return {
        id: (i * 9) + k,
        piece
      }
    })
  })
  return {
    cells,
    capturedPiece: {
      white: [],
      black: [],
    }
  }
}

export const exactBoard = ({ player, board }: { player: Side, board: Board }): Board => {
  if (player === 'white') {
    return board
  }
  const newCells = copyCells(board.cells)
  newCells.reverse()
  newCells.forEach(row => row.reverse())
  return {
    ...board,
    cells: newCells
  }
}

export const restoreBoard = ({ currentBoard, storedBoard }: { currentBoard: Board, storedBoard: Board }): Board => {
  const { cells: currentCells } = currentBoard
  const { cells: storedCells } = storedBoard

  const flatCells = storedCells.reduce((acc, row) => { row.forEach(cell => acc[cell.id] = cell); return acc }, {} as Record<number, Cell>)
  const patched = currentCells.map(row => {
    return row.map(cell => {
      return JSON.stringify(Object.entries(cell).sort()) === JSON.stringify(Object.entries(flatCells[cell.id]).sort()) ? cell : flatCells[cell.id]
    })
  })

  return {
    cells: patched,
    capturedPiece: storedBoard.capturedPiece
  }
}
