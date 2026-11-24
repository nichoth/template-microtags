import { test } from '@substrate-system/tapzero'
import { waitFor, qsa } from '@substrate-system/dom'
import { define } from 'microtags'
import 'microtags/render-support'
import { Example } from '../src/index.js'

test('empty host renders from attribute', async t => {
    document.body.insertAdjacentHTML(
        'beforeend',
        '<{{component-name}} example="hello"></{{component-name}}>'
    )

    const el = (await waitFor('{{component-name}}'))!
    t.ok(el, 'should find the element')

    const ref = el.querySelector('[data-ref]')
    t.ok(ref, 'should have a ref element')
    t.equal(
        ref?.textContent,
        'hello',
        'ref text should match the attribute value'
    )
})

test('changing attribute updates ref text', async t => {
    const el = document.querySelector('{{component-name}}')
    t.ok(el, 'element exists from previous test')

    el!.setAttribute('example', 'updated')

    await new Promise(resolve => requestAnimationFrame(resolve))

    const ref = el!.querySelector('[data-ref]')
    t.equal(
        ref?.textContent,
        'updated',
        'ref text should match the new attribute value'
    )
})

test('click fires tag-prefixed event', async t => {
    const el = document.querySelector('{{component-name}}')
    t.ok(el, 'element exists')

    const eventName = Example.TAG + ':click'
    let fired = false

    el!.addEventListener(eventName, () => {
        fired = true
    })

    el!.click()

    await new Promise(resolve => requestAnimationFrame(resolve))

    t.ok(fired, 'should fire ' + eventName + ' event')
})

test('registering the same tag again does not throw', t => {
    // Simulates a second copy of this module, e.g. duplicate
    // versions in a dependency tree. See ADR-002.
    const first = customElements.get(Example.TAG)
    let threw = false
    try {
        define(Example.TAG).setup(() => {})
    } catch {
        threw = true
    }
    t.ok(!threw, 'second registration should not throw')
    t.equal(
        customElements.get(Example.TAG),
        first,
        'the first registration should win'
    )
})

test(
    'server-rendered markup keeps its inner markup',
    async t => {
        const propVal = 'from-server'
        const html = Example.render({ example: propVal })

        const disconnected = document.createElement('div')
        disconnected.innerHTML = html
        const shell =
            disconnected.querySelector(Example.TAG)
        t.ok(shell, 'render produced a host element')
        const expectedInner = shell!.innerHTML

        document.body.insertAdjacentHTML('beforeend', html)

        const tag = Example.TAG
        const els = document.querySelectorAll(tag)
        const el = els[els.length - 1]
        t.ok(el, 'server-rendered element exists')

        await waitFor(tag)

        t.equal(
            el.innerHTML,
            expectedInner,
            'inner markup is not replaced after define'
        )
    }
)

test(
    'hydrated element responds to attributes and clicks',
    async t => {
        const tag = Example.TAG
        const els:NodeListOf<HTMLElement> = qsa(tag)
        const el = els[els.length - 1]
        t.ok(el, 'server-rendered element exists')

        el.setAttribute('example', 'hydrated-val')
        await new Promise(resolve =>
            requestAnimationFrame(resolve)
        )

        const ref = el.querySelector('[data-ref]')
        t.equal(
            ref?.textContent,
            'hydrated-val',
            'attribute change updates the ref'
        )

        const eventName = Example.TAG + ':click'
        let fired = false
        el.addEventListener(eventName, () => {
            fired = true
        })
        el.click()
        await new Promise(resolve =>
            requestAnimationFrame(resolve)
        )
        t.ok(fired, 'click fires ' + eventName)
    }
)
