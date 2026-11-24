# Glossary

The vocabulary specific to this template. Standard web-component terms
(`connectedCallback`, `observedAttributes`, Shadow DOM, ESM/CJS) are not
defined here -- see
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

## Template

Words used while turning this repo into a new component repo.

**Scaffold** -- The one-shot `node ./bin/cli.js` run that prompts for the
four template variables, substitutes them across the tracked source, and
then deletes `bin/` along with its own dev dependencies from
`package.json`. It cannot be run twice.

**Template Variable** -- A Handlebars placeholder such as
`{{component-name}}` that Scaffold replaces. Substitution covers
`example/`, `src/`, `test/index.ts`, `package.json`, and
`README.example.md`.

**`package-name`** -- The npm package name, including any namespace.
Example: `@alice/cool-component`.

**`component-name`** -- The custom element name as written in HTML, and
the key registered in `HTMLElementTagNameMap`. Example: `cool-component`.

**`gh-namespace`** -- The GitHub user or org, the first path segment of
the repository URL. Example: `alice`.

**`repo-name`** -- The GitHub repository name, the last path segment of
the repository URL. Example: `cool-component`.

**Example README** -- `README.example.md`, the README for the *generated*
component. Scaffold renders it over `README.md` and removes the original,
so the template's own README does not survive scaffolding.

## Component

Words used while writing the component itself.

**`Example`** -- The class returned by the microtags builder chain's
`setup()` call, exported from `src/index.ts`. It is not a hand-written
class -- the builder produces it. Scaffold does not rename it, since the
class name is not a template variable. Rename it by hand after
scaffolding.

**Setup** -- The `setup(ctx => { ... })` step of the builder chain, where
effects, event listeners, and ref-dependent logic are registered. The
setup function receives a context object (`ctx`) with access to
`ctx.props`, `ctx.refs`, `ctx.host`, `ctx.effect`, and `ctx.emit`.

**Ref** -- A typed reference to a DOM element inside the component,
declared with `withRefs` and selected by the `data-ref` attribute. The
render function places `data-ref="<name>"` on elements that the setup
function needs to read or update. Refs resolve after the first render.

**Client render** -- The render function passed to `.render(fn, { client: true })`,
which produces the host's inner markup from props. `{ client: true }`
keeps the function in the client bundle so an empty host renders in the
browser. See [ADR-010](adr/ADR-010-client-render.md).

**Server render** -- `Example.render(props, options)`, a static method on
the class returned by `setup()`. It returns the full host markup as an
HTML string, suitable for embedding in a server response. Requires
`import 'microtags/render-support'` before first use in Node. See
[ADR-011](adr/ADR-011-server-rendering.md).
