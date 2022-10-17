import { Board, Cells, copyCells } from './board'
import {
  Route,
  Pos,
  isPromotePiece,
  isPromotablePiece,
  promote,
  demote,
  canMove as pieceCanMove,
  routes as pieceRoutes,
  switchOwner,
} from '../piece'
import { isCheck } from './checkMate'

export const routes = ({ cells, from, isPlayer }: { cells: Cells, isPlayer: boolean, from: Pos }): Route => {
  const cellFrom = cells[from[0]][from[1]]
  const piece = cellFrom.piece
  if (!piece) {
    return []
  }
  const turn = piece.owner
  return pieceRoutes({ from, cells, isPlayer }).filter(route => {
    const newCells = copyCells(cells)
    newCells[from[0]][from[1]] = {
      ...newCells[from[0]][from[1]],
      piece
    }
    newCells[route[0]][route[1]] = {
      ...newCells[route[0]][route[1]],
      piece
    }

    return !isCheck({ turn, cells: newCells, isPlayer })
  })
}

export const canMove = ({ cells, isPlayer, from, to }: { cells: Cells, isPlayer: boolean, from: Pos, to: Pos }): boolean => {
  return pieceCanMove({
    to,
    routes: routes({ from, isPlayer, cells })
  })
}

export const move = ({ isPromote, isPlayer, from ,to, board }: { isPromote?: boolean, board: Board, isPlayer: boolean, from: Pos, to: Pos }): Board | false => {
  const { cells, capturedPiece } = board
  const newCells = copyCells(cells)
  const cellFrom = cells[from[0]][from[1]]
  const piece = cellFrom.piece
  const cellTo = cells[to[0]][to[1]]
  const pieceTo = cellTo.piece

  if (!piece) {
    return false
  }

  if (isPromote && !canPromote({ isPlayer, cells, from, to })) {
    return false
  }

  if (canMove({ isPlayer, from, to, cells })) {
    newCells[from[0]][from[1]] = {
      ...newCells[from[0]][from[1]],
      piece: null
    }
    newCells[to[0]][to[1]] = {
      ...newCells[to[0]][to[1]],
      piece: isPromote && isPromotablePiece(piece) ? promote(piece) : piece
    }

    if (pieceTo) {
      capturedPiece[piece.owner] = [
        ...capturedPiece[piece.owner],
        switchOwner(isPromotePiece(pieceTo) ? demote(pieceTo) : pieceTo)
      ]
    }

    return {
      cells: newCells,
      capturedPiece,
    }
  } else {
    return false
  }
}

const promoteLine = (isPlayer: boolean): number[] => {
  return isPlayer
    ? [0,1,2]
    : [6,7,8]
}

export const canPromote = ({ isPlayer, cells, from, to }: { isPlayer: boolean, cells: Cells, from: Pos, to: Pos }): boolean => {
  const { piece } = cells[from[0]][from[1]]
  if (!piece) {
    return false
  }

  if (!isPromotablePiece(piece)) {
    return false
  }

  if (!canMove({ cells, isPlayer, from, to })) {
    return false
  }

  const l = promoteLine(isPlayer)
  return l.includes(from[0]) || l.includes(to[0])
}
