import { Piece, Pos, Route } from '../piece'
import { copyCells, Cells, Board } from './board'
import { isCheck } from './checkMate'
import { dropRoutes as pieceDropRoutes, canMove as pieceCanMove } from '../piece'
import { Side } from '../player'

export const dropRoutes = ({ turn, isPlayer, piece, cells }: { isPlayer: boolean, turn: Side, piece: Piece, cells: Cells }): Route => {
  return pieceDropRoutes({ piece, cells, turn, isPlayer }).filter(route => {
    const newCells = copyCells(cells)
    newCells[route[0]][route[1]] = { piece }

    return !isCheck({ turn, cells, isPlayer })
  })
}

export const canDrop = ({ isPlayer, cells, piece, to }: { isPlayer: boolean, cells: Cells, piece: Piece, to: Pos }): boolean => {
  const turn = piece.owner
  return pieceCanMove({
    to,
    routes: dropRoutes({ turn, isPlayer, piece, cells })
  })
}
export const drop = ({ isPlayer, board, piece, to }: { isPlayer: boolean, piece: Piece, board: Board, to: Pos }): Board | false => {
  const { cells, capturedPiece } = board
  if (!canDrop({ isPlayer, cells, piece, to })) {
    return false
  }
  const newCells = copyCells(cells)
  newCells[to[0]][to[1]] = { piece }
  const i = capturedPiece[piece.owner].findIndex(p => p.code === piece.code)
  capturedPiece[piece.owner] = capturedPiece[piece.owner].filter((_, j) => j !== i)

  return {
    cells: newCells,
    capturedPiece
  }
}
