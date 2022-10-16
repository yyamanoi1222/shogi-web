import { goLineTo, DropRoutesFn, RoutesFn, PromotablePiece, Pos, Route } from '../piece'
import { Side }from '../player'

export const kyosya = (owner: Side): PromotablePiece => {
  return {
    code: 'kyosya',
    owner,
    promote: 'kyosyaNari'
  }
}
export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  const v = [...Array(from[0] - (isPlayer ? 0 : -8))].map((_, i) => [from[0] + ((i + 1) * (isPlayer ? -1 : 1)), from[1]] as Pos)

  return [
    ...goLineTo({ cells, from, to: v }),
  ]
}

export const dropRoutes: DropRoutesFn = ({ turn, cells, isPlayer }) => {
  const route: Route = []

  cells.forEach((row, i) => {
    if (isPlayer && i === 0) {
      return
    } else if (!isPlayer && i === 8) {
      return
    }
    row.forEach((cell, k) => {
      if (!cell.piece) {
        route.push([i, k])
      }
    })
  })
  return route
}
