import React from 'react';
import Styled from 'styled-components'
import { Cells }from '../../domain/model/board/index'
import { Route, Pos }from '../../domain/model/piece'
import CCell from '../Cell/Cell'
import Ban from '../../images/ban.png'
import { Side } from '../../domain/model/player'

const Container = Styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column;
  background-image: url(${Ban});
  background-size: cover;
  background-repeat: no-repeat;
`

const Row = Styled.div`
  display: flex;

  &:first-child {
    padding-top: 42px;
  }
  &:last-child {
    padding-bottom: 42px;
  }
  padding: 0 42px;
`

const BoardBody: React.FC<{ onClickCell: Function, routes: Route, player: Side, cells: Cells, from: Pos | null }> = ({ onClickCell, routes, player, cells, from }) => {
  const isRouteCell = (pos: Pos): boolean => {
    return !!routes.find(r => r[0] === pos[0] && r[1] === pos[1] )
  }

  return (
    <Container>
      {
        cells.map((row, i) => {
          return (
            <Row key={`${i}`}>
              {
                row.map((cell, k) => {
                  return <CCell key={`${i}-${k}`} player={player} active={!!from && JSON.stringify(from) === JSON.stringify([i, k])} route={isRouteCell([i, k])} onClick={() => onClickCell([i, k])} cell={cell} />
                })
                }
            </Row>
          )
        })
      }
    </Container>
  )
}

const memoized = React.memo(BoardBody)

export default memoized
