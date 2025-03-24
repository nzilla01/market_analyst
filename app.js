require('dotenv').config();
const express = require('express'); // require express
const connectDB = require('./server/config/db'); // require db
const cookieParser = require('cookie-parser'); 
const mongoStore = require('connect-mongo');
const session = require('express-session');
const expresslayout = require('express-ejs-layouts'); // require express-ejs-layouts
const app = express(); // create an express app
const methodOverride = require('method-override');

//template engine 
app.use(expresslayout);// use express layout
app.set('layout', './layouts/main'); // set layout
app.set('view engine', 'ejs'); // set view engine
app.use(express.static('public')); // set static folder
app.use(cookieParser());
app.use(methodOverride('_method'));

// Increase request size limit
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));


app.use(session({
    secret : 'keyborad cat',
    resave: false, 
    saveUninitialized: true, 
    store: mongoStore.create({mongoUrl: process.env.MONGO_URI}),
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));
 
connectDB(); // connect to database
// Increase request size limit
app.use(express.urlencoded({ extended: true }))
app.use(express.json()); // body parser
const port =3000|| process.env.PORT; // port number

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin')); // use index route

app.use('/uploads', express.static('public/uploads'));

app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}`);
    });


// where to hash manually created password
// const bcrypt = require('bcrypt');

// const password = "AdminPassword123"; // Replace with desired admin password
// const saltRounds = 10;

// bcrypt.hash(password, saltRounds, (err, hash) => {
//     if (err) throw err;
//     console.log("Hashed Password:", hash);
// });
