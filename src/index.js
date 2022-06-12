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

// Auth Routes
const authRoute = require('./routes/auth/auth');
const apiRoute = require('./routes/auth/api');
const googleRoute = require('./routes/auth/google');

// Dashboard Routes
const dashboardRoute = require('./routes/dashboard/dashboard');
const ccinfoRoute = require('./routes/dashboard/ccinfo');
const privacyRoute = require('./routes/dashboard/privacy');
const aboutRoute = require('./routes/dashboard/about');

const testRoute = require('./routes/dashboard/test');

// Discord Routes
const logsRoute = require('./routes/discord/logs');
const settingsRoute = require('./routes/discord/settings');
const applicationsRoute = require('./routes/discord/applications');
const applyRoute = require('./routes/discord/apply');
const leaderboardsRoute = require('./routes/discord/leaderboards');
const creatorcrewRoute = require('./routes/discord/creatorcrew');

// Error Routes
const forbiddenRoute = require('./routes/dashboard/forbidden');

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
app.set('views', [
    path.join(__dirname, '/views/dashboard'),
    path.join(__dirname, '/views/discord'),
    path.join(__dirname, '/views/discord/staff')
]);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Auth Middleware
app.use('/auth', authRoute);
app.use('/api', apiRoute);
app.use('/google', googleRoute);

// Dashboard Middleware
app.use('/dashboard', dashboardRoute);
app.use('/ccinfo', ccinfoRoute);
app.use('/privacy', privacyRoute);
app.use('/about', aboutRoute);
app.use('/test', testRoute);

// Discord Middleware
app.use('/logs', logsRoute);
app.use('/settings', settingsRoute);
app.use('/applications', applicationsRoute);
app.use('/apply', applyRoute);
app.use('/leaderboards', leaderboardsRoute);
app.use('/creatorcrew', creatorcrewRoute);

// Error Middleware
app.use('/forbidden', forbiddenRoute);

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