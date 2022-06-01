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

// Fetch users profile data from Discord's API
// const headers = {
//     "Content-Type": "application/json",
//     "Authorization": process.env.API_TOKEN
// }
// const resolve = await fetch(`https://discord.com/api/v9/users/${req.user.userId}`, { method: 'GET', headers: headers });
// const discordUserData = resolve.json();

// Database
mongo.then(() => console.log('Connected to database')).catch(err => console.error(err));

// Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const logsRoute = require('./routes/logs');
const settingsRoute = require('./routes/settings');
const applicationsRoute = require('./routes/applications');
const applyRoute = require('./routes/apply');
const leaderboardsRoute = require('./routes/leaderboards');

// Error Routes
const forbiddenRoute = require('./routes/forbidden');

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

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Middleware
app.use('/auth', authRoute);
app.use('/forbidden', forbiddenRoute);
app.use('/dashboard', dashboardRoute);
app.use('/logs', logsRoute);
app.use('/settings', settingsRoute);
app.use('/applications', applicationsRoute);
app.use('/apply', applyRoute);
app.use('/leaderboards', leaderboardsRoute);

app.get('/', isAuthortized, (req, res) => {
    res.render('home');
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});