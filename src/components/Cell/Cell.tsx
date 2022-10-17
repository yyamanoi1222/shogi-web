import React from 'react';
import { Cell } from '../../domain/model/board/index'
import { Side } from '../../domain/model/player'
import Styled from 'styled-components'
import CPiece from '../Piece/Piece'

const Container = Styled.div<{ active: boolean; route: boolean; isRotate: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  border: 1px solid ${(props) => props.route ? 'red' : props.active ? 'blue' : 'transparent'};
  background: ${(props) => props.route ? 'rgba(255,0,0,.2)' : props.active ? 'rgba(0,0,255,.2)' : 'transparent'};
  width: 80px;
  height: 80px;
  cursor: pointer;
  transform: rotate(${(props)=> props.isRotate ? '180deg' : '0deg' });
  user-select: none;
  &: hover {
    opacity: .7
  }

  img {
    user-drag: none;
  }
`

const CellComponent: React.FC<{ route: boolean; active: boolean; cell: Cell; player: Side }> = ({ route, active, cell, player }) => {
  console.log('ccell')
  return (
    <Container active={active} route={route} isRotate={cell?.piece?.owner !== player}>
      {cell?.piece && <CPiece height="90%" piece={cell.piece} />}
    </Container>
  )
}
const memoized = React.memo(CellComponent)

export default memoized
