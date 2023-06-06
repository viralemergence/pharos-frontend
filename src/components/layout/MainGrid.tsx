import styled from 'styled-components'

const MainGrid = styled.div`
  position: fixed;
  display: grid;
  grid-template-columns: 350px 1fr;
  width: 100vw;
  height: calc(100vh - 87px);
`

export default MainGrid
