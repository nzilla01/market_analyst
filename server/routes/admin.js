const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modules/user'); 
const Articles = require('../modules/articles'); 
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { title } = require('process');

const adminLayout = '../views/layouts/admin';
const jwtsecret = process.env.JWT_SECRET;  

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    } 
    
    try {
        const decoded = jwt.verify(token, jwtsecret);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized: Invalid token");
    }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Image Upload Route for Quill Editor
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ location: '/uploads/' + req.file.filename }); // Send image URL
});

// Admin Dashboard
router.get('/admin', async (req, res) => {
    const local = {
        title: 'Admin Panel',
        description: 'Admin Dashboard',
        keywords: 'market, analysis, stock, forex, crypto'
    };

    try {
        const data = await Articles.find().sort({ date: 'desc' }).limit(9).exec();
        res.render('admin/index', { local, layout: adminLayout, data });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading admin page");
    }
});

// Admin Login
router.post('/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.send("<script>alert('User not found!'); window.history.back();</script>");
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.send("<script>alert('Invalid password!'); window.history.back();</script>");
        }

        const token = jwt.sign({ id: foundUser._id }, jwtsecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send("<script>alert('Something went wrong! Try again later.'); window.history.back();</script>");
    }
});

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("<script>alert('Email already exists!'); window.history.back();</script>");
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the user
        await User.create({ email, password: hashPassword });

        // Send success alert and redirect
        res.send("<script>alert('Registration successful!'); window.location.href='/login';</script>");
        
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).send("<script>alert('Something went wrong! Try again later.'); window.history.back();</script>");
    }
});

// Admin Dashboard Get Route
router.get('/dashboard', authMiddleware, async (req, res) => {
    const local = {
        title: 'Dashboard',
        description: 'Admin Dashboard',
        keywords: 'market, analysis, stock, forex, crypto'
    };

    try {
        const data = await Articles.find().sort({ date: 'desc' }).limit(20).exec();
        res.render('admin/dashboard', { local, data, layout: adminLayout });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading dashboard");
    }
});

// Admin Create Post Page
router.get('/add_post', authMiddleware, async (req, res) => {
    const local = {
        title: 'Create Post',
        description: 'Create a new post',
        keywords: 'market, analysis, stock, forex, crypto'
    };

    res.render('admin/add_post', { local, layout: adminLayout });
});

// Admin Create Post
router.post('/add_post', authMiddleware, async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Debugging

        const newArticle = new Articles({
            title: req.body.title,
            author: req.body.author,
            body: req.body.body
        });

        await newArticle.save();

        res.redirect('/dashboard');
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).send("<script>alert('Error creating post! Try again later.'); window.history.back();</script>");
    }
});

router.get('/edit_post/:id', authMiddleware, async (req, res)=>{
    try{
        const locals={
            title:'edit post',
            description: 'Create a new post',
            keywords: 'market, analysis, stock, forex, crypto'
        }
       const data=  await Articles.findOne({_id: req.params.id})

       res.render('admin/edit_post', {data, layout : adminLayout, locals})



        }catch(error){
            console.log(error)
    }
})



router.put('/edit_post/:id', authMiddleware, async (req, res) => {
    try {
        await Articles.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit_post/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating post");
    }
});

router.delete('/delete-post/:id', authMiddleware, async(req, res) => {
    try {
        await Articles.deleteOne({_id: req.params.id });
        res.redirect('/dashboard');
    } catch(error) {
        console.log(error);
        res.status(500).send("Error deleting post");
    }
});


module.exports = router;
