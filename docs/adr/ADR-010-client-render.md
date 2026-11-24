# ADR-010: Keep the render function in the client bundle

**Date:** 2026-07-28

## Context

microtags separates the render function from the setup function. By
default, the render function is stripped from the client bundle by the
microtags esbuild/vite plugin, because server-rendered markup is already
in the HTML and re-rendering wastes bytes.

But this template supports a common pattern: an empty custom element tag
in the HTML that renders itself when it connects in the browser. Without
the render function in the client bundle, an empty host stays empty.

## Decision

Pass `{ client: true }` to the builder's `.render()` call:

```ts
.render(({ props, refs }) => {
    return `<p data-ref="${refs.display}">`
        + `${escapeHtml(props.example ?? '')}</p>`
}, { client: true })
```

This keeps the render function in the client bundle so that an empty
host renders in the browser when the element connects.

The microtags esbuild/vite plugin is not used. Because the render link
is kept on purpose, the plugin's tree-shaking would work against the
intent.

There is no separate "stripped" client build. A single build serves
both the empty-host-renders-in-browser case and the
server-rendered-markup-hydrates case.

## Consequences

An empty `<example-component example="hello"></example-component>` in
the HTML renders its inner markup in the browser without server
rendering. This is the simplest way to use the component and does not
require a server.

The client bundle includes the render function's code, which adds a
small amount of bytes that a stripped build would avoid. For this
template's render function (a single string concatenation with escaping),
the cost is negligible.

Server-rendered markup is not re-rendered, because microtags treats a
non-empty host as finished markup
([ADR-003](ADR-003-light-dom.md)). The render function is present but
unused in that case.
