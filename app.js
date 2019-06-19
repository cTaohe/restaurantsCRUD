// include express form node_nodules
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

// setting handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('veiw engine', 'handlebars')

// handle req and res
app.get('/', (req,res) => {
  console.log('this main page')
})

// start and listen the server
app.listen(port, () => {
  console.log(`The express is on http://localhost:${port}`)
})