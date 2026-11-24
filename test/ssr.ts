import { test } from '@substrate-system/tapzero'
import 'microtags/render-support'
import { Example } from '../src/index.js'

test('importing the component module does not throw', t => {
    t.ok(Example, 'Example is defined')
    t.ok(Example.TAG, 'Example.TAG is defined')
})

test('render returns markup with tag and prop value', t => {
    const val = 'hello world'
    const html = Example.render({ example: val })

    t.ok(
        html.includes(Example.TAG),
        'markup contains the tag name'
    )
    t.ok(
        html.includes(val),
        'markup contains the prop value'
    )
})

test('render escapes HTML-special characters', t => {
    const val = '<b>"fish"&\'chips\'</b>'
    const html = Example.render({ example: val })

    t.ok(
        !html.includes(val),
        'raw value should not appear unescaped'
    )
    t.ok(
        html.includes('&lt;'),
        'should escape angle brackets'
    )
    t.ok(
        html.includes('&amp;'),
        'should escape ampersands'
    )
})
