//Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedData = require('./models/seed_recipes.js')
const Recipe = require('./models/recipes')
const PORT = process.env.PORT || 3000;

//Configuration
const mongoURI = `mongodb://localhost:27017/recipes`

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

  // Seed Data
  async function insertRecipeData(seedData) {
    try {
      const recipes = await Recipe.insertMany(seedData);
      console.log("added provided vampire data", recipes);
    } catch (err) {
      console.error(err)
      process.exit(1)
    } 
  }
  
  insertRecipeData(seedData)


  //MIDDLEWARE
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'ejs')
  
  
  //REMEMBER INDUCES

  //test
  app.get('/', (req, res) => {
      res.send('Hello');
  });
//Index
app.get('/recipes', async (req, res) => {
   try {
    const allRecipes = await Recipe.find()
    res.render('index', {allRecipes})
   } catch (err) {
    res.status(500).send(err)
   }
  })
// new
app.get('/recipes/new', (req,res)=>{
    res.render('new.ejs')
})

//Create
app.post("/recipes", async (req, res)=> {
    try {
        req.body.ingredients = req.body.ingredients.split(',').map(ingredient => ingredient.trim());
        await Recipe.create(req.body)
        res.redirect('/recipes')
    } catch (err) {
        console.error("Error creating recipe:", err); 
        res.status(500).send(err)
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
