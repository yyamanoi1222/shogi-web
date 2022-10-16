import React, { useState, useEffect } from 'react';
import './App.css';
import Game, { StoredGameState } from './components/Game/Game'
import { FirebaseApp } from './firebase'
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { Side } from './domain/model/player'
import { Board } from './domain/model/board/index'
import qs from 'qs'
import Loading from './components/Loading/Loading'
import { v4 as uuidv4 } from 'uuid';

import {
  boardInit,
} from './domain/model/board/index'
import { switchSide, playerInit } from './domain/model/player'

const getParams = () => {
  const search = window.location.search.substring(1);
  return qs.parse(search)
}

const getUuid = (): string => {
  let uuid
  uuid = window.localStorage.getItem('uuid')
  if (!uuid) {
    uuid = uuidv4()
    window.localStorage.setItem('uuid', uuid)
  }
  return uuid
}

function App() {
  const [gameState, setGameState] = useState<StoredGameState | null>(null)

  useEffect(() => {
    const gameId = getParams().game as string
    const uuid = getUuid()
    const db = new FirebaseApp().firestore

    if (gameId) {
      const docRef = doc(db, 'game', gameId)
      getDoc(docRef).then(snap => {
        if (snap.exists()) {
          const data = snap.data()
          const { player } = data

          let initPlayer

          if (player[uuid]) {
            initPlayer = player[uuid]
          } else {
            if (Object.keys(player).length === 1) {
              const anotherSide = switchSide({ current: Object.values(data.player)[0] as Side })
              updateDoc(docRef, {
                player: {
                  ...data.player,
                  [uuid]: anotherSide
                }
              })
              initPlayer = anotherSide
            } else {
              initPlayer = player[uuid]
            }
          }

          setGameState({
            id: gameId,
            initTurn: data.turn as Side,
            initBoard: JSON.parse(data.board) as Board,
            initPlayer,
          })
        }
      })
    } else {
      const initPlayer = playerInit()
      const initGame = {
        turn: 'white',
        board: JSON.stringify(boardInit()),
        player: {
          [uuid]: initPlayer
        },
      }
      addDoc(collection(db, "game"), initGame).then(ref => {
        window.location.href = `?game=${ref.id}`
      })
    }
  }, [])

  return (
    <div className="App">
      {gameState && <Game game={gameState} /> }
      {!gameState && <Loading />}
    </div>
  );
}

export default App;
