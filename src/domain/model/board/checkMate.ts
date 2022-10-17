import { Side, switchSide } from '../player'
import { Pos, canMove, routes as pieceRoutes } from '../piece'
import { Board, Cells } from './board'
import { routes } from './move'
import { dropRoutes } from './drop'

const findOh = ({ turn, cells }: { turn: Side, cells: Cells }): Pos => {
  for (let i = 0; i < cells.length; i++) {
    for (let k = 0; k < cells[i].length; k++) {
      const cell = cells[i][k]
      if (cell.piece && cell.piece.owner === turn && cell.piece.code === 'oh') {
        return [i, k];
      }
    }
  }
  return [0, 0]
}

export const avoidCheckDropChanges = ({ isPlayer, board, turn }: { isPlayer: boolean, board: Board, turn: Side }): Pos[] => {
  const dropablePos: Pos[] = []
  board.capturedPiece[turn].forEach(piece => {
    dropablePos.concat(dropRoutes({ piece, isPlayer, turn, cells: board.cells }))
  })
  return dropablePos
}

export const avoidCheckPosChanges = ({ isPlayer, turn, cells }: { isPlayer: boolean, turn: Side, cells: Cells }): Array<{ from: Pos, to: Pos }> => {
  const ownerPiecePos: Pos[] = []
  cells.forEach((row, i) => {
    row.forEach((cell, k) => {
      if (cell.piece && cell.piece.owner === turn ) {
        ownerPiecePos.push([i, k])
      }
    })
  })

  const changes: Array<{ from: Pos, to: Pos }> = []
  ownerPiecePos.forEach(pos => {
    const { piece } = cells[pos[0]][pos[1]]
    if (!piece) {
      return
    }

    routes({ cells, from: pos, isPlayer }).forEach(route => {
      changes.push({ from: pos, to: route })
    })
  })
  return changes
}

export const isCheckMate = ({ isPlayer, turn, board }: { isPlayer: boolean, turn: Side, board: Board }): boolean => {
  const { cells } = board

  if (!isCheck({ isPlayer, cells, turn })) {
    return false
  }

  return !avoidCheckPosChanges({ isPlayer, turn, cells }).length
    && !avoidCheckDropChanges({ isPlayer, board, turn }).length
}

export const isCheck = ({ isPlayer, turn, cells }: { isPlayer: boolean, turn: Side, cells: Cells }): boolean => {
  const opponent = switchSide({ current: turn })
  const ohPos = findOh({ turn, cells })

  for (let i = 0; i < cells.length; i++) {
    for (let k = 0; k < cells[i].length; k++) {
      const cell = cells[i][k]
      if (cell.piece &&
          cell.piece.owner === opponent &&
          canMove({ to: ohPos, routes: pieceRoutes({ cells, isPlayer: !isPlayer, from: [i, k] }) })
         ) {
        return true
      }
    }
  }
  return false
}

export const canSelect = ({ isPlayer, turn, from, cells }: { isPlayer: boolean, turn: Side, from: Pos, cells: Cells }): boolean => {
  /*
  if (!isPlayer) {
    return false
  }
  */

  const { piece } = cells[from[0]][from[1]]
  if (!piece) {
    return false
  }

  if (piece.owner !== turn) {
    return false
  }

  const changes = avoidCheckPosChanges({ isPlayer, turn, cells })
  return !!changes.find(change => change.from[0] === from[0] && change.from[1] === from[1])
}
