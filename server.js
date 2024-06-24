//Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedRecipes = require('./models/seed_recipes');
const methodOverride = require('method-override');

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

//   Seed Data
//   async function insertRecipeData(seedData) {
//     try {
//       const recipes = await Recipe.insertMany(seedData);
//       console.log("added provided vampire data", recipes);
//     } catch (err) {
//       console.error(err)
//       process.exit(1)
//     } 
//   }
  
//   insertRecipeData(seedData)


  //MIDDLEWARE
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'ejs')
  app.use(methodOverride('_method'))
  app.use(express.static('public'));

  
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

  app.get('/recipes/recommendations', (req, res) => {
    res.render('recommendations', { seedRecipes });

   
});
// recommendation
// app.get('/recipes/recommendations', async (req., res) => {
//     try {
//         const seedRecipes = await Recipe.insertMany(seedData)
//         console.log("added provided seed Recipe data", seedRecipes)
//         res.render(seedRecipes)
//     } catch (err) {
//         console.error(err)
//     }
// }
app.get('/recipes/recommendations', async (req, res) => {
    try {
        const seedRecipes = await Seed_data.find()
        res.render('recommendations',{seedRecipes})
    } catch (err) {
        console.error(err);
        res.status(500).send(err); // Send an error response
    }
})

// new
app.get('/recipes/new', (req,res)=>{
    res.render('new.ejs')
})
//Delete
app.delete('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id
        await Recipe.deleteOne({_id: recipeId})
        res.redirect('/recipes')  
    } catch (err){
        res.status(500).send(err)
    }

})
// Update

app.put('/recipes/:id', async (req,res) => {
   req.body.ingredients = req.body.ingredients.filter((ingredient) => ingredient != "")
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log('Updated recipe:', updatedRecipe);

        if (!updatedRecipe) {
            return res.status(404).send('Recipe not found')
        }
        res.redirect('/recipes')
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).send(err)
    }
} )
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

//Edit

app.get('/recipes/:id/edit', async (req,res) => {
    try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
        return res.status(404).send('recipe not found')
    } 
    res.render('edit.ejs', {
        recipe
    })
   } catch (err) {
    res.status(500).send(err)
   }
})

//Show
app.get('/recipes/:id', async (req,res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).send('Invalid recipe id');
        }

     const singleRecipe = await Recipe.findOne({ _id: req.params.id })

     if (!singleRecipe) {
        return res.status(404).send('Recipe not found');
    }

     res.render('show', {singleRecipe})
    } catch (err) {
    console.error(err)
     res.status(500).send('Error fetching recipe')
    }
   })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
