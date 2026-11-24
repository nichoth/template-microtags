# ADR-003: Render into light DOM

**Date:** 2026-07-28

## Context

Custom elements can render into a shadow root or into their own light
DOM. Shadow DOM encapsulates styles, but that encapsulation is the
problem as often as it is the feature: consumers cannot restyle the
component with their own CSS, global stylesheets do not reach inside,
and form participation and accessibility relationships across the
boundary need extra work.

## Decision

Components render into light DOM. The render function returns an HTML
string that microtags sets as the host's inner markup. Do not call
`attachShadow`.

Ship styles as a plain stylesheet (`src/index.css`, exported as
`./css`), scoped by the element's own tag name:

```css
example-component {
    background-color: red;
}
```

Authored children are not supported. microtags treats any non-empty host
as finished markup and does not render over it. This means
server-rendered markup is preserved on hydration
([ADR-011](ADR-011-server-rendering.md)), but it also means a consumer
cannot place children inside the tag and expect them to be kept. To pass
children, render on the server with `render(props, { children })`.

## Consequences

Consumers can restyle any part of the component with ordinary CSS, and
no `::part` or custom-property API is needed to expose styling hooks.

Styles are not encapsulated. Selectors must be scoped under the tag name
or they will leak; `stylelint` runs on `src/*.css` in the `preversion`
hook but does not enforce that scoping.

Consumers must import the stylesheet separately from the JS.
