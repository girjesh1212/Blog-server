const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require("dotenv");

// env config
dotenv.config({ path: __dirname + '/config.env' });

// initialize server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//DB config
const db = process.env.mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () {
        console.log(`Connected to MongoDB`);
    }).catch(err => console.error(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/Passport.js')(passport);

app.get('/', (req, res) => {
    return res.json({
        msg: 'List of available routes are: ',
        userRoutes: [
            'GET /user/test',
            'POST /user/register',
            'POST /user/login',
            'GET /user/profile',
        ],

        blogRoutes: [
            'GET /blog/test',
            'POST /blog/create',
            'GET /blog/fetch/:num',
            'GET /blog/fetch/:email/:num',
            'PUT /blog/update',
            'POST /blog/delete',
        ]
    });
});

// Path to routes
const User = require('./api/routes/user');
const Blog = require('./api/routes/blog');

// //Use routes
app.use('/user', User);
app.use('/blog', Blog);


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server running on port " + port);
});