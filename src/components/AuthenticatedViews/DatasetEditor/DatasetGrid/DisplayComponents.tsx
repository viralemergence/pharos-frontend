import styled from 'styled-components'

export const CellContainer = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;

  &:hover > button {
    display: block;
  }
`

export const ExpandButton = styled.button`
  display: none;
  background: none;
  border: none;
  margin-top: 6px;
  margin-bottom: 6px;
  border-radius: 3px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.125);
  }
`
