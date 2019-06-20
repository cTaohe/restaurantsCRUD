// include express form node_nodules
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

const Restaurant = require('./models/restaurant.js')

// setting mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})
db.once('open', () => {
  console.log('mongoose connected')
})

// setting handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// 首頁
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    console.log(req.body)
    return res.render('index', {restaurants: restaurants})
  })
})

// detail
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    console.log(req.params.id)
    return res.render('detail', {restaurant: restaurant})
  })
})

// start and listen the server
app.listen(port, () => {
  console.log(`The express is on http://localhost:${port}`)
})