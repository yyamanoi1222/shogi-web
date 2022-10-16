import { goTo, DropRoutesFn, RoutesFn, PromotablePiece, Pos, Route, patch } from '../piece'
import { Side }from '../player'

export const keima = (owner: Side): PromotablePiece => {
  return {
    code: 'keima',
    owner,
    promote: 'keimaNari'
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  const l = patch(from, [
    -2 * (isPlayer ? 1 : -1),
    -1
  ])

  const r = patch(from, [
    -2 * (isPlayer ? 1 : -1),
    1
  ])

  return [
    goTo({ cells, from, to: l }),
    goTo({ cells, from, to: r })
  ].filter((r): r is Pos => r !== null)
}

export const dropRoutes: DropRoutesFn = ({ turn, cells, isPlayer }) => {
  const route: Route = []

  cells.forEach((row, i) => {
    if (isPlayer && [0, 1].includes(i)) {
      return
    } else if (!isPlayer && [7, 8].includes(i)) {
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
