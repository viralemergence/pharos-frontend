import styled from 'styled-components'
import backgroundImage from '../../assets/projectPageBackground-fs8.png'

const PublicViewBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.lightBlack};
  min-height: 100vh;
  max-height: 300px;

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    right: -10px;
    height: 300px;
    left: -10px;
    filter: blur(5px);

    background-image: linear-gradient(
        rgba(50, 48, 48, 0.39) 0%,
        rgba(50, 48, 48, 0.7) 50%,
        ${({ theme }) => theme.lightBlack} 100%
      ),
      url(${backgroundImage});

    background-size: cover;
  }
`

export default PublicViewBackground
