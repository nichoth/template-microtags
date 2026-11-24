# ADR-004: Attributes flow one way into props

**Date:** 2026-07-28

## Context

A component's state can live in JS properties, in HTML attributes, or
both. Attributes are the interface that works from static HTML, from
server-rendered markup, and from the devtools inspector.

In the old `WebComponent` base class, attributes and properties were
kept in sync through reflection: setting a property wrote the attribute
back, and vice versa. microtags takes a different approach.

## Decision

Attributes flow one way into signal-backed props. The builder's
`withProps` declares them:

```ts
.withProps(p => ({
    example: p.string(),
}))
```

When an attribute changes on the element, microtags updates the
corresponding prop signal. Effects that read the signal re-run
automatically -- there is no `handleChange_*` method to write.

Prop writes do **not** go back to the attribute. This is deliberate:
writing the attribute back works against the library's one-way data flow
and risks update loops where `setAttribute` triggers
`attributeChangedCallback`, which updates the prop, which writes the
attribute again.

To set a value from JS, call `setAttribute` on the element. The
attribute change propagates into the prop signal as usual.

## Consequences

The component works from plain HTML and from server-rendered markup
without an adapter.

Frameworks that set properties directly (such as React with JSX
properties) write to the prop signal, which updates the DOM through
effects. The attribute does not change, so `getAttribute` and the
devtools inspector may show a stale value. This is an accepted trade
for avoiding update loops.

There is no dispatch-by-convention mechanism. Adding a prop means
declaring it in `withProps` and reading the signal in an effect or the
render function. A missing effect is visible as an unresponsive UI,
not a silent skip.
