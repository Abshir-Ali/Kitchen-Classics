//Dependencies
const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes')
const seedRecipes = require('../models/seed_recipes');
const mongoose = require('mongoose');



//MiddleWare

//Index
router.get('/', async (req, res) => {
    try {
     const allRecipes = await Recipe.find().sort({createdAt: -1})
     res.render('index', {allRecipes})
    } catch (err) {
     res.status(500).send(err)
    }
   })
 

  //recommendations
  router.get('/recommendations', async (req, res) => {
    res.render('recommendations', { seedRecipes });
});

//recommendations ID
router.post('/submitSeedData', async (req, res) => {
    try {
      const { title, ingredients, instructions, cookTime } = req.body;
      const seedData = {
        title,
        ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
        instructions,
        cookTime
      }
      console.log(seedData)
      await Recipe.create(seedData);
      res.redirect('/recipes');
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
// new
router.get('/new', (req,res)=>{
    res.render('new.ejs')
})

//Delete
router.delete('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id
        await Recipe.deleteOne({_id: recipeId})
        res.redirect('/recipes')  
    } catch (err){
        res.status(500).send(err)
    }
})

// Update
router.put('/:id', async (req,res) => {
    console.log(req.body)
    console.log(req.params)
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
router.post("/", async (req, res)=> {
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
router.get('/:id/edit', async (req,res) => {
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
router.get('/:id', async (req,res) => {
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

   module.exports = router