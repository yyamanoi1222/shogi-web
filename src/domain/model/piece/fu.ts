import { goTo, DropRoutesFn, RoutesFn, PromotablePiece, Pos, Route, up } from '../piece'
import { Side }from '../player'

export const fu = (owner: Side): PromotablePiece => {
  return {
    code: 'fu',
    owner,
    promote: 'fuNari'
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  return [
    goTo({ cells, from, to: up(from, isPlayer) })
  ].filter((r): r is Pos => r !== null)
}

export const dropRoutes: DropRoutesFn = ({ turn, cells, isPlayer }) => {
  const route: Route = []
  const fuLine: number[] = []
  cells.forEach((row, i) => {
    row.forEach((cell, k) => {
      if (cell.piece && cell.piece.owner === turn && cell.piece.code === 'fu') {
        fuLine.push(k)
      }
    })
  })

  cells.forEach((row, i) => {
    if (isPlayer && i === 0) {
      return
    } else if (!isPlayer && i === 8) {
      return
    }

    row.forEach((cell, k) => {
      if (fuLine.includes(k)) {
        return
      }
      if (!cell.piece) {
        route.push([i, k])
      }
    })
  })
  return route
}
