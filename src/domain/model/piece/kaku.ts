import { goLineTo, RoutesFn, PromotablePiece, Pos } from '../piece'
import { Side }from '../player'

export const  kaku = (owner: Side): PromotablePiece => {
  return {
    code: 'kaku',
    owner,
    promote: 'uma'
  }
}

export const routes: RoutesFn = ({ from, cells, isPlayer }) => {
  const lu: Pos[] = []
  for (let i = 1; i < cells.length; i++) {
    if (from[0] === 0 || from[1] === 0) {
      break
    }
    lu.push([
      from[0] - i,
      from[1] - i,
    ])
    if (from[0] - i === 0 || from[1] - i === 0) {
      break
    }
  }

  const ru: Pos[] = []
  for (let i = 1; i < cells.length; i++) {
    if (from[0] === 0 || from[1] === 8) {
      break
    }
    ru.push([
      from[0] - i,
      from[1] + i,
    ])
    if (from[0] - i === 0 || from[1] + i === 8) {
      break
    }
  }

  const ld: Pos[] = []
  for (let i = 1; i < cells.length; i++) {
    if (from[0] === 8 || from[1] === 0) {
      break
    }
    ld.push([
      from[0] + i,
      from[1] - i,
    ])
    if (from[0] + i === 8 || from[1] - i === 0) {
      break
    }
  }

  const rd: Pos[] = []
  for (let i = 1; i < cells.length; i++) {
    if (from[0] === 8 || from[1] === 8) {
      break
    }
    rd.push([
      from[0] + i,
      from[1] + i,
    ])
    if (from[0] + i === 8 || from[1] + i === 8) {
      break
    }
  }

  return [
    ...goLineTo({ cells, from, to: lu }),
    ...goLineTo({ cells, from, to: ru }),
    ...goLineTo({ cells, from, to: ld }),
    ...goLineTo({ cells, from, to: rd }),
  ]
}
