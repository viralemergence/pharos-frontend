import styled from 'styled-components'

const SearchBar = styled.input`
  background-color: ${({ theme }) => theme.mutedPurple1};
  border: 1px solid ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.smallParagraphSemibold}
  border-radius: 5px;
  width: 350px;
  padding: 8px 15px 8px 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='25' viewBox='0 0 24 25' fill='none'%3E%3Cg clip-path='url(%23clip0_4805_2011)'%3E%3Cpath d='M15.5 14.5H14.71L14.43 14.23C15.41 13.09 16 11.61 16 10C16 6.41 13.09 3.5 9.5 3.5C5.91 3.5 3 6.41 3 10C3 13.59 5.91 16.5 9.5 16.5C11.11 16.5 12.59 15.91 13.73 14.93L14 15.21V16L19 20.99L20.49 19.5L15.5 14.5ZM9.5 14.5C7.01 14.5 5 12.49 5 10C5 7.51 7.01 5.5 9.5 5.5C11.99 5.5 14 7.51 14 10C14 12.49 11.99 14.5 9.5 14.5Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_4805_2011'%3E%3Crect width='24' height='24' fill='white' transform='translate(0 0.5)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 10px center;

  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_4681_17220)'%3E%3Cpath d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_4681_17220'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: center;
  }
`

export default SearchBar
