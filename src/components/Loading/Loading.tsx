import React from 'react';
import loadImg from '../../images/loading.gif'
import Styled from 'styled-components'

const Wrapper = Styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Loading: React.FC = () => {
  return (
    <Wrapper>
      <img alt="loading" width='50' height='50' src={loadImg}></img>
    </Wrapper>
  )
}
export default Loading
