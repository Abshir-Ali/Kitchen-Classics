//Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const recipesController = require('./controllers/routes')
require('dotenv').config()
const PORT = process.env.PORT || 3000;

//Configuration
const mongoURI = process.env.MONGOURI

// Connect to Mongo
async function connectToMongo() {
    try {
      await mongoose.connect(mongoURI);
      console.log('The connection with mongodb is established');
    } catch (err) {
      console.error('Connection error:', err.message);
    }
  }
  connectToMongo()

  //MIDDLEWARE
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'ejs')
  app.use(methodOverride('_method'))
  app.use(express.static('public'));
  app.use('/recipes', recipesController)

  
  //REMEMBER INDUCES

  //test
  app.get('/', (req, res) => {
      res.send('Hello');
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
