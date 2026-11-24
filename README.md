# template microtags component

A template for web components built on
[microtags](https://github.com/substrate-system/microtags).

## see also

* [Web Component lifecycle methods](https://gomakethings.com/the-web-component-lifecycle-methods/)
* [How to detect when attributes change on a Web Component](https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/)

## use

1. Use the template button in github. Or clone this then
`rm -rf .git && git init`. Then `npm i && npm init`.

* Use the template system to re-name this module and start the docs:
```sh
node ./bin/cli.js
```

__The CLI prompts for several variables__

* `gh-namespace` -- first path segment on github
* `package-name` -- package name, including any namespace.
  eg, `@alice/package`
* `component-name` -- the name of the web component, as used in HTML,
  eg `cool-example`
* `repo-name` -- repository name, the last segment in github URL,
  eg, `github.com/user/repo-name-here`


2. Edit the source code in `src/index.ts`.

3. __Edit things__
    * check the [build-example](./package.json#L20) command in
      `package.json`. The CLI sets `--base` to `/<repo-name>`, the
      default github pages path. Change it if you deploy somewhere else.

## featuring

* compile the source to both ESM and CJS format, and put compiled files in `dist`.
* ignore `dist` and `*.js` in git, but don't ignore them in npm. That way we
  don't commit any compiled code to git, but it is available to consumers.
* use npm's `prepublishOnly` hook to compile the code before publishing to npm.
* use [exports](./package.json#L31) field in `package.json` to make sure the
  right format is used by consumers.
* `preversion` npm hook -- lint
* `version` npm hook -- generate a TOC for the README, and create and add a
  changelog
* `postversion` npm hook -- `git push --follow-tags && npm publish`
* eslint -- `npm run lint`
* tests run in a real browser via
  [tapout](https://github.com/substrate-system/tapout) -- see
  [`npm test`](./package.json#L14). Assertions come from
  [tapzero](https://github.com/substrate-system/tapzero). The test bundle
  needs `--bundle`, or bare module specifiers will not resolve in the
  browser.
* CI via github actions
* [stylelint](https://stylelint.io/) -- see
  [preversion npm hook](./package.json#L26)

## the component

The component is built with the
[microtags](https://github.com/substrate-system/microtags)
`define` builder chain, which supplies signal-backed props, typed refs,
and server rendering to an HTML string. The conventions are recorded as
[architecture decision records](./docs/adr/INDEX.md); the vocabulary is
in [the glossary](./docs/GLOSSARY.md).

### props

Declare props through the builder's `withProps` call. Attribute changes
flow into the prop signal; prop writes do not go back to the attribute:

```ts
.withProps(p => ({
    example: p.string(),
}))
```

React to prop changes with an effect in `setup`:

```ts
.setup(ctx => {
    ctx.effect(() => {
        const val = ctx.props.example()
        if (ctx.refs.display) {
            ctx.refs.display.textContent = val ?? ''
        }
    })
})
```

See [ADR-004](./docs/adr/ADR-004-one-way-attribute-to-prop.md).

### events

Emit tag-prefixed events with `ctx.emit`, and build the event name from
the static `TAG`:

```ts
ctx.emit(Example.TAG + ':click')
```

```ts
el.addEventListener(Example.TAG + ':click', ev => { /* ... */ })
```

See [ADR-005](./docs/adr/ADR-005-namespaced-events.md).

### rendering

The `render` function produces the host's inner markup from props. It is
kept in the client bundle with `{ client: true }`, so an empty host
renders in the browser and the same function renders on the server.

Attribute changes update the DOM reactively through the effect, not by
re-rendering.

### server rendering

Import `microtags/render-support` once, then call `Example.render()`:

```ts
import 'microtags/render-support'
import { Example } from 'your-package'

const html = Example.render({ example: 'hello' })
// -> <your-tag example="hello"><p data-ref="display">hello</p></your-tag>
```

The resulting markup takes on its behavior in the browser without being
re-rendered. See [ADR-011](./docs/adr/ADR-011-server-rendering.md).

Pass children as a string via the options object:

```ts
const html = Example.render(
    { example: 'hello' },
    { children: '<span>extra content</span>' }
)
```

### FOUCE

A custom element is inert markup until its JS defines it, which shows up
as a flash of undefined custom element. This template handles it in two
layers, described in
[ADR-006](./docs/adr/ADR-006-fouce-mitigation.md).

`src/index.css` hides the element until it is defined. This ships with
the component:

```css
cool-example:not(:defined) {
    display: none;
}
```

The `example/` page demonstrates this: a `reduce-fouce` class
on `<html>`, removed once `customElements.whenDefined` resolves for
every component on the page. Note the `Promise.race` timeout
and a `<noscript>` override. Without them, a component that never defines
leaves the page permanently blank.
