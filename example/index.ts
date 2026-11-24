import '../src/index.css'
import { Example } from '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', '{{component-name}}')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.insertAdjacentHTML(
    'beforeend',
    '<{{component-name}} example="hello from JS"></{{component-name}}>'
)

const el = document.querySelector('{{component-name}}')
if (el) {
    el.addEventListener(Example.TAG + ':click', () => {
        console.log('click event fired')
    })
}

await Promise.race([
    Promise.allSettled([
        customElements.whenDefined('{{component-name}}')
    ]),
    new Promise(resolve => {
        setTimeout(resolve, 2000)
    })
])

document.documentElement.classList.remove('reduce-fouce')
