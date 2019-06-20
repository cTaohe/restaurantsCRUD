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
// setting static page
app.use(express.static('public'))

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
    return res.render('index', {restaurants: restaurants})
  })
})

// search
app.get('/search', (req,res) => {
  Restaurant.find((err, restaurants) => {
    const keyword = req.query.keyword
    const hasStr = (target, str) => target.toLowerCase().includes(str.toLowerCase())
    if (err) return console.error(err)
    const restaurant = restaurants.filter(({name, name_en, category}) => {
      return [name, name_en, category].some(str => hasStr(str, keyword))
    })   
    return res.render('index', {restaurants: restaurant})
  })
})

// 新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// Detail
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('detail', {restaurant: restaurant})
  })
})

// 新增一個餐廳
app.post('/restaurants', (req, res) => {
  const restaurant = Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// 編輯餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('edit', {restaurant: restaurant})
  })
})

// 編輯餐廳
app.post('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    Object.assign(restaurant, req.body)
    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// 刪除餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

// start and listen the server
app.listen(port, () => {
  console.log(`The express is on http://localhost:${port}`)
})