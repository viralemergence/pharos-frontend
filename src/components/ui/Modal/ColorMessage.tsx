import styled from 'styled-components'

export enum ColorMessageStatus {
  Good = 'good',
  Danger = 'danger',
  Warning = 'warning',
}

const ColorMessage = styled.div<{ status?: ColorMessageStatus }>`
  ${({ theme }) => theme.smallParagraph};
  padding: 10px;
  border-radius: 5px;
  margin-top: 30px;
  color: ${({ theme }) => theme.black};
  background-color: ${({ theme, status }) => {
    switch (status) {
      case ColorMessageStatus.Good:
        return theme.lightMint
      case ColorMessageStatus.Danger:
        return theme.hoverRed
      case ColorMessageStatus.Warning:
        return theme.hoverOrange
      default:
        return theme.lightMint
    }
  }};
`

export default ColorMessage
