<!-- redeye:start -->
## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout. See `docs/agents/domain.md`.
### microtags component conventions

The component in `src/index.ts` uses the microtags builder chain:
`define(tag).withProps().withRefs().render(fn, { client: true }).setup()`.

microtags does not export `Coercer` or `SingleRefDef` from its main
entry. TypeScript 6 declaration emit (TS2883) requires a hand-written
interface (`ExampleClass`) that uses only exported types
(`StaticRenderFn`, `StaticRenderPartsFn`), cast via
`as unknown as ExampleClass`.

`tsconfig.build.json` needs `rootDir: "./src"` to avoid TS5011.

The test command has a template-mode guard: when `package.json` name
contains `{`, browser tests are skipped (exit 0). After scaffolding,
real tests run. CSS also cannot build in template mode because
`{{component-name}}` is not valid CSS.

The Node SSR suite (`test/ssr.ts`) runs via
`esbuild --platform=node --loader:.css=empty` piped to `node -`.
It must `import 'microtags/render-support'` before calling
`Example.render()`. The SSR suite must not contain `{{...}}` Template
Variables -- derive tag names from `Example.TAG`.

`npm test` runs `test:ssr` then `test:browser`. Both must pass.

Lint errors in `bin/*.js` are pre-existing (generated scaffold code).
Source files must be lint-clean.

### Scaffold verification

`@inquirer/prompts` requires a TTY. To drive the scaffold
non-interactively, use a Node loader hook (`node:module` register)
that intercepts the `@inquirer/prompts` import and returns pre-canned
answers. Copy the repo to a throwaway directory first -- the scaffold
deletes `bin/` and rewrites files in place.

After scaffolding, the generated repo needs a fresh `npm install`
(not reusing `node_modules` from the template, since symlinks break).
The generated repo should have no `bin/`, no scaffold devDependencies,
and lint passes clean (no `bin/*.js` errors).
<!-- redeye:end -->
