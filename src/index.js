require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const discordStrategy = require('./strategies/discord_strategy');
const mongo = require('./database/mongodb');
const path = require('path');

// Database
mongo.then(() => console.log('Connected to database')).catch(err => console.error(err));

// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const logsRoute = require('./routes/logs');

app.use(session({
    secret: 'some secret',
    cookie: {
        maxAge: 60000 * 60 * 24 * 365
    },
    saveUninitialized: false,
    resave: false,
    name: 'ch.user',
    store: mongoStore.create({ mongoUrl: process.env.DB_PATH })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);
app.use('/logs', logsRoute);

app.get('/', isAuthortized, (req, res) => {
    res.render('home');
});

function isAuthortized(req, res, next) {
    if (req.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});