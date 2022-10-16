import { goTo, RoutesFn, BasePiece, Pos, up, leftUp, rightUp, left, right, back } from '../piece'
import { Side }from '../player'

export const kin = (owner: Side): BasePiece => {
  return {
    code: 'kin',
    owner,
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  return [
    goTo({ cells, from, to: up(from, isPlayer) }),
    goTo({ cells, from, to: leftUp(from, isPlayer) }),
    goTo({ cells, from, to: rightUp(from, isPlayer) }),
    goTo({ cells, from, to: left(from, isPlayer) }),
    goTo({ cells, from, to: right(from, isPlayer) }),
    goTo({ cells, from, to: back(from, isPlayer) }),
  ].filter((r): r is Pos => r !== null)
}
