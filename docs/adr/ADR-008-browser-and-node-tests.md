# ADR-008: Run tests in a real browser and in Node

**Date:** 2026-07-28

## Context

Custom elements depend on the browser's custom element registry, upgrade
timing, and lifecycle callbacks. A DOM emulation layer such as jsdom
approximates these, and the approximation is thin exactly where web
components are interesting: upgrade order, `:defined` matching, and when
`connectedCallback` fires relative to parsing.

A test suite that passes under emulation but not in a browser is worse
than no suite.

Separately, the component's render function can produce markup in Node
for server rendering ([ADR-011](ADR-011-server-rendering.md)), and that
path needs its own tests in an environment without a DOM.

## Decision

### Browser suite

Tests run in a real browser. `npm run test:browser` bundles
`test/index.ts` with `esbuild --bundle` and pipes it to `tapout`, which
runs it in a browser and reports TAP.

`--bundle` is required, not incidental. Without it `esbuild` only
transpiles, leaving bare specifiers like `@substrate-system/tapzero` in
the output, and the browser refuses to resolve them.

Assertions use `@substrate-system/tapzero`. Timing-dependent lookups use
`waitFor` from `@substrate-system/dom` rather than a fixed delay,
because element upgrade is asynchronous:

```ts
const el = await waitFor('example-component')
```

Tests import from `src`, not `dist`, so the suite runs without a build.

### Node suite

`npm run test:ssr` bundles `test/ssr.ts` with
`esbuild --platform=node --loader:.css=empty` and pipes it to `node -`.
The CSS loader is set to `empty` because Node has no stylesheet support
and the component imports its CSS.

The Node suite imports `microtags/render-support` before calling
`Example.render()`, which stubs `HTMLElement` and other DOM globals that
microtags needs to build the class.

The suite tests that importing the module does not throw, that
`render()` returns markup containing the tag and prop value, and that
HTML-special characters are escaped.

### Running both

`npm test` runs `test:ssr` then `test:browser`. Both must pass.

The template-mode guard skips `test:browser` when the package name
still contains `{` (the template has not been scaffolded), because
`{{component-name}}` is not a valid custom element tag name.

## Consequences

Lifecycle behavior is tested against the real browser implementation,
including the upgrade timing that emulation gets wrong.

Server rendering is tested in an actual Node environment, not under a
browser-side polyfill.

Browser tests need a browser present, which makes CI heavier than a
Node-only runner. The Node suite runs anywhere.

`waitFor` is required rather than merely preferred. Querying immediately
after inserting markup races element upgrade, and the resulting failure
is intermittent.
