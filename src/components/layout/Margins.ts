import { css } from 'styled-components'

const wideMargins = css`
  margin: 0 120px 120px 120px;

  @media (max-width: 1600px) {
    margin: 0 60px 60px 60px;
  }

  @media (max-width: 800px) {
    margin: 0 20px 20px 20px;
  }
`
export default wideMargins
