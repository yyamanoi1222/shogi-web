import React from 'react';
import { Piece } from '../../domain/model/piece'
import Styled from 'styled-components'
import CPiece from '../Piece/Piece'

const Container = Styled.div<{ active: boolean }>`
  padding: 8px;
  height: 40%;
  background: #E9A220;
  box-sizing: border-box;
  border: 4px solid ${(props) => props.active ? 'black' : 'transparent'};
`
const Row = Styled.div`
  display: flex;
  flex-wrap: wrap;
`

const PieceWrapper = Styled.div<{ active: boolean }>`
  width: 50px;
  height: 50px;
  border: 2px solid ${(props) => props.active ? 'red' : 'transparent'};
`

const Pawn: React.FC<{ selectPawn: null | Piece; onClickPawn: Function, active: boolean, displayPlayer: string; capturedPiece: Piece[] }> = ({ selectPawn, onClickPawn, active, displayPlayer, capturedPiece }) => {
  const selectIndex = selectPawn ? capturedPiece.findIndex(p => p.code === selectPawn.code) : -1
  return (
    <Container active={active}>
      {displayPlayer}

      <Row>
        {
          capturedPiece.map((p, i) => {
            return <PieceWrapper key={`${i}`}active={active && i === selectIndex} onClick={() => onClickPawn(p)}><CPiece height={'101%'} piece={p} /></PieceWrapper>
          })
        }
      </Row>
    </Container>
  )
}

const memoized = React.memo(Pawn)

export default memoized
