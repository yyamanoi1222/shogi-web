import { RoutesFn, PromotePiece } from '../piece'
import { Side }from '../player'
import { routes as kakuRoutes } from './kaku'
import { routes as ohRoutes } from './oh'

export const uma = (owner: Side): PromotePiece => {
  return {
    code: 'uma',
    owner,
    demote: 'kaku'
  }
}
export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  return [
    ...kakuRoutes({ from, cells, isPlayer }),
    ...ohRoutes({ from, cells, isPlayer })
  ]
}
