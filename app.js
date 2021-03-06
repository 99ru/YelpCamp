const express = require("express");
const path = require('path');
const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds'); 


mongoose.connect('mongodb://localhost:27017/yelp-camp',  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
})

const app = express();

app.engine('ejs', ejsMate); // set up ejs engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
  res.render("home");
});

// All campgrounds
app.get('/campgrounds', async (req, res) => { 
  const campgrounds = await Campground.find({}); 
  res.render('campgrounds/index', { campgrounds })
});

// Create new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// POST new campground
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground) // New model
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`) // redirect to id	
})

// Show campground by id 
app.get('/campgrounds/:id', async (req, res,) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
})

// edit page
app.get('/campgrounds/:id/edit', async (req, res,) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
})

// edit campground
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params; 
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}) 
  res.redirect(`/campgrounds/${campground._id}`) 
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params; 
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})





app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
