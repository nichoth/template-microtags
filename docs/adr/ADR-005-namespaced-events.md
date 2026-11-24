# ADR-005: Emit tag-prefixed custom events

**Date:** 2026-07-28

## Context

Components communicate outward by dispatching events. Plain names like
`change` or `close` collide with native events and with other
components' events once several are on the same page, and a listener
cannot tell which component a bare `change` came from.

## Decision

Emit tag-prefixed events, using `ctx.emit` from the setup function and
the element's static `TAG` for the prefix. The name is joined with a
colon:

```ts
.setup(ctx => {
    ctx.host.addEventListener('click', () => {
        ctx.emit(Example.TAG + ':click')
    })
})
```

The event name is typed through `HTMLElementEventMap`:

```ts
declare global {
    interface HTMLElementEventMap {
        'example-component:click':CustomEvent
    }
}
```

Consumers listen on the element:

```ts
el.addEventListener('example-component:click', ev => {
    // ...
})
```

Build the event name from `Example.TAG` rather than hard-coding the
tag string, so the name stays correct after scaffolding.

## Consequences

Event names are unambiguous on a page with many components, and a
listener never has to guess the source.

Consumers must know the tag name to form the event name, which means
importing the class or reading the README. This is documented in the
component's README rather than being discoverable from the markup.

Renaming a component's tag renames every event it emits. That is a
breaking change for consumers even though no event name was edited.

`ctx.emit` dispatches a `CustomEvent` on the host element. There is no
separate `dispatch` or `on`/`off` shorthand -- standard
`addEventListener` and `removeEventListener` are used directly.
