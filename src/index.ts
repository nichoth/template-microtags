import {
    define,
    type StaticRenderFn,
    type StaticRenderPartsFn,
} from 'microtags'

const _esc:Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}

function escapeHtml (s:string):string {
    return s.replace(/[&<>"']/g, c => _esc[c])
}

interface ExampleClass {
    new ():HTMLElement
    readonly TAG:string
    readonly refs:{ readonly display:string }
    readonly props:readonly string[]
    readonly render:StaticRenderFn<{
        example:{ (raw:string | null):string }
    }>
    readonly renderParts:StaticRenderPartsFn<{
        example:{ (raw:string | null):string }
    }>
}

export const Example:ExampleClass =
    define('{{component-name}}')
        .withProps(p => ({
            example: p.string(),
        }))
        .withRefs(r => ({
            display: r.one(),
        }))
        .render(({ props, refs }) => {
            const val = props.example ?? ''
            return `<p data-ref="${refs.display}">`
                + `${escapeHtml(val)}</p>`
        }, { client: true })
        .setup(ctx => {
            ctx.effect(() => {
                const val = ctx.props.example()
                if (ctx.refs.display) {
                    ctx.refs.display.textContent =
                        val ?? ''
                }
            })

            ctx.host.addEventListener('click', () => {
                ctx.emit(Example.TAG + ':click')
            })
        }) as unknown as ExampleClass

declare global {
    interface HTMLElementTagNameMap {
        '{{component-name}}':InstanceType<
            typeof Example
        >
    }

    interface HTMLElementEventMap {
        '{{component-name}}:click':CustomEvent
    }
}
