import { goTo, RoutesFn, PromotablePiece, Pos, up, leftUp, rightUp, leftBack, rightBack,} from '../piece'
import { Side }from '../player'

export const gin = (owner: Side): PromotablePiece => {
  return {
    code: 'gin',
    owner,
    promote: 'ginNari'
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  return [
    goTo({ cells, from, to: up(from, isPlayer) }),
    goTo({ cells, from, to: leftUp(from, isPlayer) }),
    goTo({ cells, from, to: rightUp(from, isPlayer) }),
    goTo({ cells, from, to: leftBack(from, isPlayer) }),
    goTo({ cells, from, to: rightBack(from, isPlayer) })
  ].filter((r): r is Pos => r !== null)
}
