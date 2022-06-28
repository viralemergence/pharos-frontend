# UI Components Directory

Components in this directory should be controlled entirely by props, they should not use `useContext()`, `useReducer()`, dispatch state changes, or make network requests; they should only use `useState()`, `useEffect()`, and `useLayoutEffect()` to create visual effects (such as animation).

Most components in this directory will consist of a single styled component declaration.

Where more complex components are being created, they should forward all props to the relevant element, if they have to intercept events such as `onClick()` or `onFocus()` for animation purposes, they must also take those functions as props and run them as necessary.

These components should take `className` in props and forward it to the relevant element (whichever makes the most sense) so that they can be used with `styled-components` like `const example = styled(Component)`.

## Forwarding Props Boilerplate:

For an input element:

```tsx
interface ExampleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // custom props you're adding go here
  // React.InputHTMLAttributes gives you childre: React.ReactNode automatically
  backgroundColor: string
  className: string
}

const Example = ({
  backgroundColor,
  children,
  ...props
}: ExampleProps): JSX.Element => (
  <input
    type="checkbox"
    // just an example, this is not how I'd actually
    // do a custom background color! (better to forward style)
    style={{ backgroundColor }}
    // className for styled-components
    {...{ className }}
    // all the props that should be valid for an input element
    {...props}
  />
)
```
