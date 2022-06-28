# StaticQuery hooks in the AirtableCMSData format

These hooks are a special case of `useStaticQuery()` because they should all conform to the following type definition.

```ts
interface AirtableCMSData {
  nodes: {
    data: {
      Name: string
      Text: string
      Image: {
        localFiles: FileNode[] &
          { childImageSharp: IGatsbyImageDataParent<IGatsbyImageData> }[]
      }
    }
  }[]
}
```

This type should be imported as:

```ts
import { AirtableCMSData } from '@talus-analytics/library.airtable-cms'
```

This means these queries can supply the `data` prop for `airtable-cms` components.

This type definiton [is maintained in the `cms-types` package.](https://bit.dev/talus-analytics/library/airtable/cms-types)
