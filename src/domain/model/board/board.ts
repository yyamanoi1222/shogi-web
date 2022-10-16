import { Piece, pieceInit } from '../piece'
import { Side } from '../player'

export type Cells = Cell[][]
export type Cell = {
  piece: Piece | null
}

export type Board = {
  cells: Cells,
  capturedPiece: { [P in Side]: Piece[] }
}

export const copyCells = (cells: Cells): Cells => {
  return JSON.parse(JSON.stringify(cells)) as Cells
}

export const boardInit = (): Board => {
  const pieces = pieceInit('white')
  const cells = pieces.map(row => {
    return row.map(piece => {
      return {
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
