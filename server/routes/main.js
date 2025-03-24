const express = require('express');
const router = express.Router();
const articles = require('../modules/articles');


//routes
router.get('',async (req, res) => {

    const local ={
        title: 'The Market Analyst',
        description: 'This is the home page',
        keywords: 'market, analysis, stock, forex, crypto'
    }

    try{
      const data = await articles.find().sort({date: 'desc'}).limit(9).exec();
      res.render('index', {local , data});

    }catch(err){
        console.log(err);
    } 
});

//page to display single article
router.get('/article/:id', async (req, res) => {
  try {
    const local = {
      title: 'The Market Analyst',
      description: 'This is the home page',
      keywords: 'market, analysis, stock, forex, crypto'
    };

    let slug = req.params.id;
    
    // Find a single article by ID or slug
    const data = await articles.findOne({ _id: slug }).exec();

    if (!data) {
      return res.status(404).send("Article not found");
    }

    res.render('article', { local, data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
// multiple page for articles display
router.get('/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 5; // Number of articles per request
    const skip = (page - 1) * limit;

    const data = await articles.find().sort({ date: 'desc' }).skip(skip).limit(limit).exec();

    // Check if it's an AJAX request (JSON response) or a full page render
    if (req.xhr) {
      return res.json(data); // Return JSON response for AJAX calls
    }

    const local = {
      title: 'The Market Analyst',
      description: 'This is the home page',
      keywords: 'market, analysis, stock, forex, crypto'
    };

    res.render('articles', { local, data });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// Search route
router.post("/search", async (req, res) => {
 try{
    const local = {
      title: 'search',
      description: 'This is the home page',
      keywords: 'market, analysis, stock, forex, crypto'
    }; 

    let searchTerm = req.body.searchTerm
    const searchNoSpecialChar =  searchTerm.replace(/[^a-zA-Z0-9]/g, "")

    const data = await articles.find({
     
      $or : [
        {title : {$regex : new  RegExp(searchNoSpecialChar, 'i')}},
        {body : {$regex : new  RegExp(searchNoSpecialChar, 'i')}}
      ]
    })
   res.render('search', {data, local})

 }catch(err){
     console.log("not working 404 error");
 }
});

// router.get('/articles', async (req, res) => {
//   try{

//   local = {
//     title: 'The Market Analyst',
//     description: 'This is the home page',
//     keywords: 'market, analysis, stock, forex, crypto'
//   }

//     const data = await articles.find().sort({date: 'desc'}).limit(100).exec();

//     res.render('articles', {local, data});

//   }catch(err){
//       console.log(err);
//   } 

// });

router.get('/signal', (req, res) => {

    local = {
        title: 'The Market Analyst',
        description: 'This is the home page',
        keywords: 'market, analysis, stock, forex, crypto'
      }
    
    res.render('signal', {local});
});

router.get('/signIn', (req, res) => {

    local = {
        title: 'The Market Analyst',
        description: 'This is the home page',
        keywords: 'market, analysis, stock, forex, crypto'
      }

    res.render('about', {local});
});


module.exports = router; // export router