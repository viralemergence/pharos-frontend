import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  grid-area: alphabet;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 245px;
  padding: 10px;

  background-color: ${({ theme }) => theme.mutedPurple1};
`
const Alphabet = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`

const Button = styled.button`
  background: none;
  border: none;
  background-color: 1px solid rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);

  transition: 150ms;

  &:hover {
    color: ${({ theme }) => theme.mint};
    background-color: ${({ theme }) => theme.white10PercentOpacity};
    border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  }
`

const AllButton = styled(Button)`
  color: ${({ theme }) => theme.mint};
  ${({ theme }) => theme.bigParagraphSemibold};
  padding: 10px;
  text-align: left;
  flex-grow: 0;
  max-width: fit-content;
`
const LetterButton = styled(Button)<{ selected: boolean }>`
  ${({ theme }) => theme.bigParagraphSemibold};
  color: ${({ theme, selected }) => (selected ? theme.mint : theme.white)};
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0);

  &:disabled {
    ${({ theme }) => theme.bigParagraph};
    color: ${({ theme }) => theme.lightGray};
  }
`

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const AlphabetControl = () => {
  return (
    <Container>
      <AllButton>ALL</AllButton>
      <Alphabet>
        {letters.map(letter => (
          <LetterButton key={letter} selected={false}>
            {letter}
          </LetterButton>
        ))}
      </Alphabet>
    </Container>
  )
}

export default AlphabetControl
