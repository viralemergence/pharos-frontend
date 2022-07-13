import useDataset from 'hooks/useDatset'
import React from 'react'
import { useParams } from 'react-router-dom'

interface ComponentProps {
  props: string
}

const Component = ({ props }: ComponentProps) => {
  // hooks here!

  const { id } = useParams()
  const datset = useDataset(id)

  return <p>JSX HERE!</p>
}

export default Component
