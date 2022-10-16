import { Side, switchSide } from './player'
import { fu, dropRoutes as fuDropRoutes, routes as fuRoutes } from './piece/fu'
import { gin, routes as ginRoutes } from './piece/gin'
import { kin, routes as kinRoutes } from './piece/kin'
import { keima, dropRoutes as keimaDropRoutes, routes as keimaRoutes } from './piece/keima'
import { kyosya, dropRoutes as kyosyaDropRoutes, routes as kyosyaRoutes } from './piece/kyosya'
import { hisya, routes as hisyaRoutes } from './piece/hisya'
import { kaku, routes as kakuRoutes } from './piece/kaku'
import { routes as umaRoutes } from './piece/uma'
import { routes as ryuRoutes } from './piece/ryu'
import { oh, routes as ohRoutes } from './piece/oh'
import { Cells } from './board/board'

export type Pos = [number, number]
export type Route = Pos[]

type BaseCode =
  "kin"        |
  "oh"

type PromoteCode =
  "ryu"        |
  "uma"        |
  "keimaNari"  |
  "ginNari"    |
  "fuNari"     |
  "kyosyaNari"
type PromotableCode =
  "kyosya"     |
  "fu"         |
  "gin"        |
  "hisya"      |
  "kaku"       |
  "keima"

export type BasePiece = {
  owner: Side
  code: BaseCode
}

export type PromotePiece = {
  owner: Side
  code: PromoteCode
  demote: PromotableCode
}

export type PromotablePiece = {
  owner: Side
  code: PromotableCode
  promote: PromoteCode
}

export type Piece = BasePiece | PromotePiece | PromotablePiece
export type RoutesFn = ({ cells, from, isPlayer }: { cells: Cells, from: Pos, isPlayer: boolean }) => Route
export type DropRoutesFn = ({ turn, cells, isPlayer }: { turn: Side, cells: Cells, isPlayer: boolean }) => Route

export const switchOwner = (piece: Piece): Piece => {
  return {
    ...piece,
    owner: switchSide({ current: piece.owner })
  }
}

export const isPromotablePiece = (piece: Piece): piece is PromotablePiece => {
  return !!('promote' in piece)
}

export const isPromotePiece = (piece: Piece): piece is PromotePiece => {
  return !!('demote' in piece)
}

export const promote = (piece: PromotablePiece): PromotePiece => {
  return {
    owner: piece.owner,
    code: piece.promote,
    demote: piece.code
  }
}

export const demote = (piece: PromotePiece): PromotablePiece => {
  return {
    owner: piece.owner,
    code: piece.demote,
    promote: piece.code
  }
}

export const goTo = ({ cells, from, to }: { cells: Cells, from: Pos, to: Pos }): Pos | null => {
  const { piece } = cells[from[0]][from[1]]
  if (!piece) return null

    const row = cells[to[0]]
    if (!row) {
      return null
    }
    const cell = row[to[1]]
    if (!cell) {
      return null
    }

    if (cell.piece) {
      return cell.piece.owner !== piece.owner
        ? to
        : null
    } else {
      return to
    }
}

export const goLineTo = ({ cells, from, to }: { cells: Cells, from: Pos, to: Pos[] }): Pos[] => {
  const { piece } = cells[from[0]][from[1]]
  if (!piece) return []
  const i = to.findIndex(t => {
    const v = cells[t[0]]
    if (!v) {
      return false
    }
    const cell = v[t[1]]
    if (!cell) {
      return true
    }
    return cell.piece
  })
  if (i === -1) {
    return to
  } else {
    const p = to[i]
    if (cells[p[0]][p[1]]?.piece?.owner !== piece.owner) {
      return to.slice(0, i + 1)
    } else {
      return to.slice(0, i)
    }
  }
}

const defaultDropRoutes= ({ cells }: { cells: Cells }): Route => {
  const route: Route = []
  cells.forEach((row, i) => {
    row.forEach((cell, k) => {
      if (!cell.piece) {
        route.push([i, k])
      }
    })
  })
  return route
}

export const dropRoutes = ({ piece, turn, cells, isPlayer }: { piece: Piece, turn: Side, cells: Cells, isPlayer: boolean }): Route => {
  const code = piece.code

  switch (code) {
    case 'fu':
      return fuDropRoutes({ turn, cells, isPlayer })
    case 'keima':
      return keimaDropRoutes({ turn, cells, isPlayer })
    case 'kyosya':
      return kyosyaDropRoutes({ turn, cells, isPlayer })
    default:
      return defaultDropRoutes({ cells })
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  const { piece } = cells[from[0]][from[1]]

  if (!piece) {
    return []
  }
  const code = piece.code

  switch (code) {
    case 'fu':
      return fuRoutes({ from, cells, isPlayer })
    case 'gin':
      return ginRoutes({ from, cells, isPlayer })
    case 'kin':
      return kinRoutes({ from, cells, isPlayer })
    case 'keima':
      return keimaRoutes({ from, cells, isPlayer })
    case 'kyosya':
      return kyosyaRoutes({ from, cells, isPlayer })
    case 'hisya':
      return hisyaRoutes({ from, cells, isPlayer })
    case 'kaku':
      return kakuRoutes({ from, cells, isPlayer })
    case 'oh':
      return ohRoutes({ from, cells, isPlayer })
    case 'uma':
      return umaRoutes({ from, cells, isPlayer })
    case 'ryu':
      return ryuRoutes({ from, cells, isPlayer })
    case 'ginNari':
    case 'fuNari':
    case 'keimaNari':
    case 'kyosyaNari':
      return kinRoutes({ from, cells, isPlayer })
    default: {
      const invalidCode: never = code
      throw new Error(`invalid ${invalidCode}`)
    }
  }
}

export const canMove = ({ routes, to }: { routes: Route, to: Pos }): boolean => {
  return !!routes.find(ro => ro[0] === to[0] && ro[1] === to[1])
}

export const pieceInit = (owner: Side): Array<Array<Piece|null>> => {
  const opponent = switchSide({ current: owner })
  return [
    [kyosya(opponent), keima(opponent), gin(opponent),     kin(opponent), oh(opponent), kin(opponent), gin(opponent), keima(opponent), kyosya(opponent)],
    [null,             hisya(opponent), null,              null,          null,         null,          null,          kaku(opponent),  null            ],
    [fu(opponent),     fu(opponent),    fu(opponent),      fu(opponent),  fu(opponent), fu(opponent),  fu(opponent),  fu(opponent),    fu(opponent)    ],
    [null,             null,            null,              null,          null,         null,          null,          null,            null            ],
    [null,             null,            null,              null,          null,         null,          null,          null,            null            ],
    [null,             null,            null,              null,          null,         null,          null,          null,            null            ],
    [fu(owner),        fu(owner),       fu(owner),         fu(owner),     fu(owner),    fu(owner),     fu(owner),     fu(owner),       fu(owner)       ],
    [null,             kaku(owner),     null,              null,          null,          null,         null,          hisya(owner),    null            ],
    [kyosya(owner),    keima(owner),    gin(owner),        kin(owner),    oh(owner),     kin(owner),   gin(owner),    keima(owner),    kyosya(owner)   ],
  ]
}

type PatchFn = (from: Pos, isPlayer: boolean) => Pos
export const patch: (from: Pos, dist: Pos) => Pos = (from: Pos, dist: Pos) => [from[0] + dist[0], from[1] + dist[1]]
export const up: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [-1, 0] : [1, 0])
export const back: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [1, 0] : [-1, 0])
export const left: PatchFn = (from, isPlayer) => patch(from,isPlayer ? [0, -1] : [0, 1])
export const right: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [0, 1] : [0, -1])
export const leftUp: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [-1, -1] : [1, 1])
export const rightUp: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [-1, 1] : [1, -1])
export const leftBack: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [1, -1] : [-1, 1])
export const rightBack: PatchFn = (from, isPlayer) => patch(from, isPlayer ? [1, 1] : [-1, -1])
