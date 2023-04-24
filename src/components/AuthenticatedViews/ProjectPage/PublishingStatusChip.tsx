import {
  DatasetReleaseStatus,
  ProjectPublishStatus,
} from 'reducers/stateReducer/types'
import styled from 'styled-components'

export const DatasetReleaseStatusChip = styled.span<{
  status: DatasetReleaseStatus | undefined
}>`
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 13px;
  padding: 2px 10px;
  width: fit-content;
  ${({ theme, status }) => {
    switch (status) {
      case DatasetReleaseStatus.Unreleased:
        return `background-color: rgba(0,0,0,0); color: ${theme.black}; border-color: ${theme.black};`
      case DatasetReleaseStatus.Released:
        return `background-color: rgba(0,0,0,0); color: ${theme.link}; border-color: ${theme.link};`
      case DatasetReleaseStatus.Published:
        return `background-color: ${theme.link}; color: ${theme.white}; border-color: ${theme.link};`
      case DatasetReleaseStatus.Publishing:
        return `background-color: rgba(0,0,0,0); color: ${theme.orange}; border-color: ${theme.orange};`
      default:
        return `background-color: rgba(0,0,0,0); color: ${theme.black}; border-color: ${theme.black};`
    }
  }};
`

export const ProjectPublishStatusChip = styled.span<{
  status: ProjectPublishStatus | undefined
}>`
  border: 1px solid ${({ theme }) => theme.black};
  border-radius: 13px;
  padding: 2px 10px;
  width: fit-content;
  ${({ theme, status }) => {
    switch (status) {
      case ProjectPublishStatus.Unpublished:
        return `background-color: rgba(0,0,0,0); color: ${theme.black}; border-color: ${theme.black};`
      case ProjectPublishStatus.Published:
        return `background-color: ${theme.link}; color: ${theme.white}; border-color: ${theme.link};`
      case ProjectPublishStatus.Publishing:
        return `background-color: rgba(0,0,0,0); color: ${theme.orange}; border-color: ${theme.orange};`
      default:
        return `background-color: rgba(0,0,0,0); color: ${theme.black}; border-color: ${theme.black};`
    }
  }};
`
