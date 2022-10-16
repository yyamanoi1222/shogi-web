import { RoutesFn, PromotePiece } from '../piece'
import { Side }from '../player'
import { routes as hisyaRoutes } from './hisya'
import { routes as ohRoutes } from './oh'

export const ryu = (owner: Side): PromotePiece => {
  return {
    code: 'ryu',
    owner,
    demote: 'hisya'
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  return [
    ...hisyaRoutes({ from, cells, isPlayer }),
    ...ohRoutes({ from, cells, isPlayer })
  ]
}
