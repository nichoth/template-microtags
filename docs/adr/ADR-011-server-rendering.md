# ADR-011: Server rendering with `Example.render()`

**Date:** 2026-07-28

## Context

A component that only renders in the browser requires JS before the user
sees anything. Server rendering produces the component's markup as an
HTML string, which the browser paints immediately. When the JS loads, the
element's behavior attaches without replacing the markup.

microtags supports this through a static `render` method on the class
returned by `setup()`, but it requires a one-time setup call in Node.

## Decision

Server code imports `microtags/render-support` once, then calls
`Example.render()`:

```ts
import 'microtags/render-support'
import { Example } from 'example-component'

const html = Example.render({ example: 'hello' })
// -> '<example-component example="hello"><p data-ref="display">hello</p></example-component>'
```

`microtags/render-support` stubs `HTMLElement` and other DOM globals
that microtags needs to build the class in Node. It must be imported
before the component module.

The render function is the same one passed to `.render()` in the builder
chain ([ADR-010](ADR-010-client-render.md)). It produces the host's
inner markup, and microtags wraps it in the opening and closing tags with
attributes.

Children can be passed to the render call:

```ts
Example.render({ example: 'hello' }, { children: '<span>extra</span>' })
```

In the browser, microtags treats a non-empty host as finished markup and
does not re-render it ([ADR-003](ADR-003-light-dom.md)). The setup
function still runs, so effects, refs, and event listeners attach to the
existing DOM.

## Consequences

The first paint contains the component's content, with no layout shift
when JS loads.

Server code must import `microtags/render-support` before importing the
component. Forgetting this import causes a `ReferenceError` for
`HTMLElement`.

The render function must escape user-supplied values to prevent XSS.
The template's `escapeHtml` utility handles this, but every new render
function must do the same.

The component module is importable in both browser and Node
environments. It sits in `dependencies`, not `devDependencies`, so
server applications get it transitively.
