import { css } from 'styled-components'

const wideMargins = css`
  margin: 0 120px 120px 120px;

  @media (max-width: 1600px) {
    margin: 0 60px 60px 60px;
  }

  @media (max-width: 1000px) {
    margin: 0 30px 30px 30px;
  }

  @media (max-width: 800px) {
    margin: 0 10px 10px 10px;
  }
`
export default wideMargins
