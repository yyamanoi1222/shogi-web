import { goLineTo, RoutesFn, PromotablePiece, Pos } from '../piece'
import { Side }from '../player'

export const hisya = (owner: Side): PromotablePiece => {
  return {
    code: 'hisya',
    owner,
    promote: 'ryu'
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  const h1 = [...Array(from[1] - 0)].map((_,i) => [from[0], from[1] - 1 - i] as Pos)
  const h2 = [...Array(8 - from[1])].map((_, i) => [from[0], from[1] + 1 + i] as Pos)

  const v1 = [...Array(8 - from[0])].map((_, i) => [from[0] + 1 + i, from[1]] as Pos)
  const v2 = [...Array(from[0] - 0)].map((_, i) => [from[0] - 1 - i, from[1]] as Pos)

  return [
    ...goLineTo({ from, cells, to: h1 }),
    ...goLineTo({ from, cells, to: h2 }),
    ...goLineTo({ from, cells, to: v1 }),
    ...goLineTo({ from, cells, to: v2 })
  ]
}
