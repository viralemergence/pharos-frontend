import { PublishedResearcher } from 'hooks/researchers/fetchPublishedResearchers'
import { PublishedResearchersFilters } from 'hooks/researchers/usePublishedResearchers'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  grid-area: alphabet;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 245px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.mutedPurple1};

  @media (max-width: 700px) {
    display: none;
  }
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

  transition: 200ms;

  &:hover {
    color: ${({ theme }) => theme.mint};
    background-color: ${({ theme }) => theme.white10PercentOpacity};
    border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  }
`

const AllButton = styled(Button)<{ selected: boolean }>`
  color: ${({ theme, selected }) => (selected ? theme.mint : theme.white)};
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
  text-transform: uppercase;
  font-weight: 800;

  ${({ theme, selected }) =>
    selected &&
    `background-color: ${theme.white10PercentOpacity};
      border: 1px solid ${theme.white10PercentOpacity};`};

  &:disabled {
    ${({ theme }) => theme.bigParagraph};
    color: ${({ theme }) => theme.medDarkGray};
    text-transform: uppercase;

    &:hover {
      color: ${({ theme }) => theme.medGray};
      background-color: rgba(0, 0, 0, 0);
      border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
    }
  }
`

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

interface AlphabetControlProps {
  researchers: PublishedResearcher[]
  filters: PublishedResearchersFilters
  setFilters: React.Dispatch<React.SetStateAction<PublishedResearchersFilters>>
}

const AlphabetControl = ({
  researchers,
  setFilters,
  filters,
}: AlphabetControlProps) => {
  const handleLetterClick = (letter: string) => {
    setFilters(prev => ({
      ...prev,
      searchString: '',
      startsWithLetter: letter,
    }))
  }

  return (
    <Container>
      <AllButton
        selected={filters.startsWithLetter === undefined}
        onClick={() =>
          setFilters(prev => ({ ...prev, startsWithLetter: undefined }))
        }
      >
        ALL
      </AllButton>
      <Alphabet>
        {letters.map(letter => (
          <LetterButton
            key={letter}
            onClick={() => handleLetterClick(letter)}
            selected={filters.startsWithLetter === letter}
            disabled={
              !researchers.some(researcher =>
                researcher.name.toLowerCase().startsWith(letter)
              )
            }
          >
            {letter}
          </LetterButton>
        ))}
      </Alphabet>
    </Container>
  )
}

export default AlphabetControl
