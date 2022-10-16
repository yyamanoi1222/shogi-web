import React, { useCallback, useContext } from 'react';
import Styled from 'styled-components'
import { GameContext } from '../Game/Game'
import BoardBody from './BoardBody'
import Pawn from './Pawn'

const Container = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;;
  flex-flow: column;
  margin-top: 40px;
`
const Row = Styled.div`
  display: flex;
`

const Pawns = Styled.div`
  padding: 16px;
  width: 300px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`

const BoardComponent: React.FC = () => {
  const game = useContext(GameContext)

  if (!game) {
    throw new Error()
  }

  const { board, onClickCell, onClickPawn, routes, selectState, player, turn } = game;
  const memoizedOnClickCell = useCallback(onClickCell, [onClickCell, selectState, routes, board.cells, turn])

  const opponent = player === 'white' ? 'black' : 'white'
  const displayOpponent = opponent === 'black' ? '後手' : '先手'
  const displayPlayer = player === 'white' ? '先手' : '後手'

  return (
    <Container>
      <Row>
        <BoardBody cells={board.cells} routes={routes} onClickCell={memoizedOnClickCell} from={selectState.from} player={player} />
        <Pawns>
          <Pawn selectPawn={selectState.pawn} onClickPawn={onClickPawn} active={turn===opponent} displayPlayer={displayOpponent} capturedPiece={board.capturedPiece[opponent]}></Pawn>
          <Pawn selectPawn={selectState.pawn} onClickPawn={onClickPawn} active={turn===player} displayPlayer={displayPlayer} capturedPiece={board.capturedPiece[player]}></Pawn>
        </Pawns>
      </Row>
    </Container>
  )
}

export default BoardComponent
