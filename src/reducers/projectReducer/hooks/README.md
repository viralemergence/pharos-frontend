# Action creator hooks

This is where side effects that need to happen based on user input belong and
how they stay in sync with the pure functions dispatched to the reducer.

These hooks loosely follow the same "action creator" pattern
[from redux](https://read.reduxbook.com/markdown/part1/04-action-creators.html)
but using hooks so they can trigger all side effects and wrap hooks easily.

Simple example of the pattern:

_useDoActionFunction.ts_

```ts
const useDoActionFunction = () => {
  // call other hooks here such as
  // getting user, project, or router info

  // get reducer dispatcher
  const projectDispatch = useProjectDispatch()

  // handle general side effects here

  // this is the action creator
  // where the args are the input for the action
  const doActionFunction = ({ arg }: { arg: type }) => {
    // handle side effects here specific
    // to the action creator arguments

    // ex. API calls, create date stamps

    // dispatch to the reducer
    projectDispatch({
      type: ProjectActions.CreateDataset,
      payload: {
        ...datasetSaveData,
        ...datasetClientData,
      },
    })
  }

  return doActionFunction
}

export default useDoActionFunction
```

This is then used in a componenet:

```ts
const SomeComponent = () => {
  const doActionFunction = useDoActionFunction()

  return <button onClick={() => doActionFunction({ arg })}>Click here</button>
}
```
