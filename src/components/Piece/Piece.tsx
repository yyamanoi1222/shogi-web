import React from 'react';
import { Piece } from '../../domain/model/piece'
import IconFu from '../../images/piece/fu.png'
import IconFuNari from '../../images/piece/fuNari.png'
import IconGin from '../../images/piece/gin.png'
import IconGinNari from '../../images/piece/ginNari.png'
import IconHisya from '../../images/piece/hisya.png'
import IconKaku from '../../images/piece/kaku.png'
import IconKeima from '../../images/piece/keima.png'
import IconKeimaNari from '../../images/piece/keimaNari.png'
import IconKin from '../../images/piece/kin.png'
import IconKyosya from '../../images/piece/kyosya.png'
import IconKyosyaNari from '../../images/piece/kyosyaNari.png'
import IconOh from '../../images/piece/oh.png'
import IconRyu from '../../images/piece/ryu.png'
import IconUma from '../../images/piece/uma.png'

const iconMap: Record<string, string> = {
  fu: IconFu,
  fuNari: IconFuNari,
  gin: IconGin,
  ginNari: IconGinNari,
  hisya: IconHisya,
  kaku: IconKaku,
  keima: IconKeima,
  keimaNari: IconKeimaNari,
  kin: IconKin,
  kyosya: IconKyosya,
  kyosyaNari: IconKyosyaNari,
  oh: IconOh,
  ryu: IconRyu,
  uma: IconUma,
}

const CPiece: React.FC<{ height?: string; piece: Piece }> = ({ height, piece }) => {
 return <img alt={piece.code} height={height ? height : 'auto'} src={iconMap[piece.code]} />
}

const memoized = React.memo(CPiece)

export default memoized
