# ADR-002: Register elements idempotently

**Date:** 2026-07-28

## Context

`customElements.define()` throws if a tag name is already registered.
A component that self-registers at import time will crash the page when
it gets imported twice, which happens easily with mixed ESM/CJS
resolution, duplicate versions in a dependency tree, or hot reload.

A published component cannot control how many times it is imported.

## Decision

The `setup()` call at the end of the builder chain registers the element
as a side effect. Since microtags 0.1.4, `setup()` checks whether the
tag is already registered and skips `customElements.define` when it is.
No wrapper utility or manual guard is needed.

Registration happens as a side effect of importing the module, at the
bottom of `src/index.ts`.

## Consequences

Importing a component twice is safe.

The first registration wins silently. If two different implementations
claim the same tag name, the second is dropped with no error, which is
harder to debug than a throw. This is an accepted trade for import
safety.

Because registration is an import side effect, consumers get the element
by importing the module for effect, and `src/index.ts` cannot be treated
as side-effect-free by a bundler.
