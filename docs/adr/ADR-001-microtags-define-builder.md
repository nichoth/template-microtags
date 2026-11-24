# ADR-001: Build on the microtags `define` builder

**Date:** 2026-07-28

## Context

A custom element can extend `HTMLElement` directly, but every component
then re-implements the same things: signal-backed props, typed ref
lookups, and a render function that works on both client and server.
Written by hand, each component drifts from the others.

`microtags` is a dependency of this template (not a dev dependency) and
supplies those features through a builder chain.

## Decision

Components are built with the microtags `define` builder chain:

```ts
import { define } from 'microtags'

export const Example =
    define('example-component')
        .withProps(p => ({
            example: p.string(),
        }))
        .withRefs(r => ({
            display: r.one(),
        }))
        .render(({ props, refs }) => {
            return `<p data-ref="${refs.display}">`
                + `${escapeHtml(props.example ?? '')}</p>`
        }, { client: true })
        .setup(ctx => {
            ctx.effect(() => {
                const val = ctx.props.example()
                if (ctx.refs.display) {
                    ctx.refs.display.textContent = val ?? ''
                }
            })

            ctx.host.addEventListener('click', () => {
                ctx.emit(Example.TAG + ':click')
            })
        }) as unknown as ExampleClass
```

There is no base class to extend. The builder returns a class that
extends `HTMLElement` internally, with signal-backed props
([ADR-004](ADR-004-one-way-attribute-to-prop.md)), typed refs, and a
render function that works on both client and server
([ADR-010](ADR-010-client-render.md),
[ADR-011](ADR-011-server-rendering.md)).

Tag names are kebab-case, per the custom element naming rules.

### TypeScript declaration emit

microtags does not export `Coercer` or `SingleRefDef` from its main
entry point. TypeScript 6 declaration emit (TS2883) requires that every
type in a `.d.ts` come from a public export. The workaround is a
hand-written `ExampleClass` interface that describes the same shape
using only exported types (`StaticRenderFn`, `StaticRenderPartsFn`),
and a cast through `as unknown as ExampleClass`.

## Consequences

Signal-backed props, typed refs, and a shared render function come from
the builder chain and behave the same in every component built from this
template.

The component gains a runtime dependency. This is deliberate: `microtags`
sits in `dependencies`, so consumers install it transitively.

The `render` function is called by microtags when an empty host
connects. A `setup` function runs after render and receives a context
object for effects, refs, and event emission. There is no
`connectedCallback` to override or call `super` on.

Unlike the old `WebComponent` base class, there are no `handleChange_*`
methods. Attribute changes flow into prop signals, and effects that read
those signals re-run automatically
([ADR-004](ADR-004-one-way-attribute-to-prop.md)).
