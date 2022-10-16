import { goTo, RoutesFn, BasePiece, Pos, up, left, right, leftUp, rightUp, leftBack, rightBack, back } from '../piece'
import { Side }from '../player'

export const oh = (owner: Side): BasePiece => {
  return {
    code: 'oh',
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
    goTo({ cells, from, to: leftBack(from, isPlayer) }),
    goTo({ cells, from, to: rightBack(from, isPlayer) }),
  ].filter((r): r is Pos => r !== null)
}
