import React, { useEffect, createContext, useState } from 'react';
import CBoard from '../../components/Board/Board'
import { Piece, Pos, Route } from '../../domain/model/piece'
import {
  Board,
  isCheckMate,
  canSelect,
  canPromote,
  move,
  dropRoutes,
  drop,
  exactBoard,
  routes as genRoutes,
} from '../../domain/model/board/index'
import { Side, switchSide } from '../../domain/model/player'
import { FirebaseApp } from '../../firebase'
import { onSnapshot, doc, updateDoc } from 'firebase/firestore';

export const GameContext = createContext<GameContextValue | null>(null);

type GameContextValue = Callbacks & { board: Board, turn: Side, player: Side, selectState: SelectState, routes: Route }

export type StoredGameState = {
  id: string,
  initTurn: Side,
  initBoard: Board,
  initPlayer: Side
}

type SelectState = {
  from: Pos | null,
  pawn: Piece | null
}

type Callbacks = {
  onClickCell: (pos: Pos) => void
  onClickPawn: (piece: Piece) => void
}

const Game: React.FC<{ game: StoredGameState }> = ({ game }) => {
  const [player] = useState<Side>(game.initPlayer)

  const [board, setBoard] = useState<Board>(exactBoard({ player, board: game.initBoard }))
  const [turn, setTurn] = useState<Side>(game.initTurn)
  const [selectState, setSelectState] = useState<SelectState>({ from: null, pawn: null })
  const [routes, setRoutes] = useState<Route>([])

  useEffect(() => {
    const db = new FirebaseApp().firestore
    const docRef = doc(db, 'game', game.id)
    const unsub = onSnapshot(docRef, snapshot => {
      const data = snapshot.data()
      if (data) {
        const board = JSON.parse(data.board)
        setTurn(data.turn as Side)
        setBoard(exactBoard({ player, board }))
      }
    })
    return () => unsub()
  }, [game.id, player])


  const isPlayer = player === turn
  const { cells } = board

  if (isCheckMate({ isPlayer, turn, board })) {
    alert('チェックメイトです')
  }

  const onClickPawn = (piece: Piece) => {
    if (piece.owner !== turn) {
      return
    }

    if (selectState.pawn) {
      resetSelect()
      return
    }

    setSelectState({
      from: null,
      pawn: piece
    })
    setRoutes(dropRoutes({ turn, isPlayer, cells, piece }))
  }

  const resetSelect = () => {
    setSelectState({
      from: null,
      pawn: null
    })
    setRoutes([])
  }
  const doNextTurn = ({ board }: { board: Board }) => {
    const nextTurn = switchSide({ current: turn })
    setSelectState({
      from: null,
      pawn: null
    })
    setRoutes([])
    setBoard(board)
    setTurn(nextTurn)
    syncGameState({ board, turn: nextTurn, player })
  }

  const syncGameState = ({ turn, board, player }: { turn: Side, player: Side, board: Board }) => {
    const db = new FirebaseApp().firestore
    const docRef = doc(db, 'game', game.id)
    updateDoc(docRef, {
      turn,
      board: JSON.stringify(exactBoard({ player, board })),
    })
  }

  const onClickCell = (pos: Pos) => {
    console.debug(pos)

    if (selectState.from) {
      console.debug(`move ${selectState.from} to ${pos}`)

      let isPromote = false
      if (canPromote({ isPlayer, cells, from: selectState.from, to: pos })) {
        isPromote = window.confirm('成りますか?');
      }

      const newBoard = move({ isPromote, board, isPlayer, from: selectState.from, to: pos })
      resetSelect()
      if (newBoard) {
        doNextTurn({ board: newBoard })
        return
      }
    }

    if (canSelect({ isPlayer, from: pos, cells, turn })) {
      setSelectState({
        from: pos,
        pawn: null
      })

      setRoutes(genRoutes({ cells, from: pos, isPlayer }))
    }

    if (selectState.pawn) {
      const newBoard = drop({ isPlayer, board, piece: selectState.pawn, to: pos })
      if (newBoard) {
        doNextTurn({ board: newBoard })
      } else {
        resetSelect()
      }
    }
  }

  return (
    <GameContext.Provider value={ { selectState, player, turn, board, onClickCell, onClickPawn, routes } }>
      <CBoard />
    </GameContext.Provider>
  )
}

export default Game
