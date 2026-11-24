# Architecture Decision Records

Conventions for components built from this template. Most of these
follow [microtags](https://github.com/nicholasgasior/microtags);
that README is the upstream source, these records say which of its
options this template picked and why.

| # | Decision | Date |
|---|----------|------|
| [ADR-001](ADR-001-microtags-define-builder.md) | Build on the microtags `define` builder | 2026-07-28 |
| [ADR-002](ADR-002-idempotent-registration.md) | Register elements idempotently | 2026-07-28 |
| [ADR-003](ADR-003-light-dom.md) | Render into light DOM | 2026-07-28 |
| [ADR-004](ADR-004-one-way-attribute-to-prop.md) | Attributes flow one way into props | 2026-07-28 |
| [ADR-005](ADR-005-namespaced-events.md) | Emit tag-prefixed custom events | 2026-07-28 |
| [ADR-006](ADR-006-fouce-mitigation.md) | Mitigate FOUCE in two layers | 2026-07-28 |
| [ADR-007](ADR-007-dual-format-distribution.md) | Ship ESM and CJS, keep compiled output out of git | 2026-07-28 |
| [ADR-008](ADR-008-browser-and-node-tests.md) | Run tests in a real browser and in Node | 2026-07-28 |
| [ADR-009](ADR-009-self-deleting-scaffold.md) | Scaffold once with a self-deleting CLI | 2026-07-28 |
| [ADR-010](ADR-010-client-render.md) | Keep the render function in the client bundle | 2026-07-28 |
| [ADR-011](ADR-011-server-rendering.md) | Server rendering with `Example.render()` | 2026-07-28 |

These describe `microtags` `^0.1.4`. That version is required, not
incidental: 0.1.4 is the first version whose `setup()` skips
`customElements.define` when the tag is already registered
([ADR-002](ADR-002-idempotent-registration.md)). Note that a `^` range
on a `0.x` version allows patch-level updates only, so moving to a new
minor is always a deliberate edit.

See also [the glossary](../GLOSSARY.md).
