require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const favicon = require('serve-favicon');
const discordStrategy = require('./strategies/discord_strategy');
const { isAuthortized } = require('./strategies/auth_check');
const mongo = require('./database/mongodb');
const path = require('path');

// Database
mongo.then(() => console.log('Connected to database')).catch(err => console.error(err));

// Routes
const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api');
const googleRoute = require('./routes/google');
const dashboardRoute = require('./routes/dashboard');
const logsRoute = require('./routes/logs');
const settingsRoute = require('./routes/settings');
const applicationsRoute = require('./routes/applications');
const applyRoute = require('./routes/apply');
const leaderboardsRoute = require('./routes/leaderboards');
const creatorcrewRoute = require('./routes/creatorcrew');
const ccinfoRoute = require('./routes/ccinfo');
const privacyRoute = require('./routes/privacy');
const aboutRoute = require('./routes/about');

// Error Routes
const forbiddenRoute = require('./routes/forbidden');

app.use(session({
    secret: 'some secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    resave: false,
    name: 'ch.user',
    store: mongoStore.create({ mongoUrl: process.env.DB_PATH })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Middleware
app.use('/auth', authRoute);
app.use('/api', apiRoute);
app.use('/google', googleRoute);
app.use('/forbidden', forbiddenRoute);
app.use('/dashboard', dashboardRoute);
app.use('/logs', logsRoute);
app.use('/settings', settingsRoute);
app.use('/applications', applicationsRoute);
app.use('/apply', applyRoute);
app.use('/leaderboards', leaderboardsRoute);
app.use('/creatorcrew', creatorcrewRoute);
app.use('/ccinfo', ccinfoRoute);
app.use('/privacy', privacyRoute);
app.use('/about', aboutRoute);

app.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/dashboard');
    } else {
       res.render('home'); 
    }    
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});