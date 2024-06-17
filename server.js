const express = require('express');
const app = express();
const Recipe = require('./models/recipes')
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello');
});
//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
//REMEMBER INDUCES
//Index
app.get('/recipes', (req, res) => {
    res.render('index.ejs', {
        allRecipe: recipe,
    })
  })
// new
app.get('/recipes/new', (req,res)=>{
    res.render('new.ejs')
})

//Create
app.post("/recipes", (req, res)=> {
    recipe.push(req.body) 
    res.redirect("/recipes")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
