import styled from 'styled-components'
import backgroundImage from '../../assets/projectPageBackground-fs8.png'

const PublicViewBackground = styled.div`
  position: absolute;
  top: 80px;
  right: 0;
  left: 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  background-position: 0% 0%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: calc(100vh - 80px);
  min-height: calc(100svh - 80px);

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    right: -10px;
    height: 300px;
    left: -10px;
    filter: blur(2px);

    background: linear-gradient(
        180deg,
        rgba(14, 18, 40, 0.6) 0%,
        rgba(14, 18, 40, 0.9) 37.5%,
        #0e1228 65.63%,
        ${({ theme }) => theme.publicPagePurpleBackground} 100%
      ),
      url(${backgroundImage});

    background-size: cover;
  }
`

export default PublicViewBackground
