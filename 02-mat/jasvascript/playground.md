### prueba de node js
```javascript

const { createCanvas } = require('canvas')

const width = 1200
const height = 600

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#3ff000'
context.fillRect(0, 0, width, height)
const text = 'Hello, World!'
context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.fillStyle = '#fff'
context.fillText(text, 600, 170)

const buffer = canvas.toBuffer('image/png')
fs.writeFileSync('./image.png', buffer)

```
