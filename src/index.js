require('dotenv').config();
const express = require('express');
const app = express();
const minifyCSS = require('express-minify');
const minifyHTML = require('express-minify-html-2');
const port = process.env.PORT;
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const favicon = require('serve-favicon');
const discordStrategy = require('./strategies/discord_strategy');
const { isAuthortized } = require('./strategies/auth_check');
const mongo = require('./database/mongodb');
const fetch = require('node-fetch');
const path = require('path');

// Database
mongo.then(() => console.log('Connected to database')).catch(err => console.error(err));

// Minify CSS HTML
app.use(minifyCSS());
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

// Auth Routes
const authRoute = require('./routes/auth/auth');
const apiRoute = require('./routes/auth/api');
const googleRoute = require('./routes/auth/google');

// Dashboard Routes
const dashboardRoute = require('./routes/dashboard/dashboard');
const ccinfoRoute = require('./routes/dashboard/ccinfo');
const staffGuidelinesRoute = require('./routes/dashboard/staff_guidelines');
const privacyRoute = require('./routes/dashboard/privacy');
const adminCPRoute = require('./routes/dashboard/admincp');

// Discord Routes
const applicationsRoute = require('./routes/discord/applications');
const applyRoute = require('./routes/discord/apply');
const leaderboardsRoute = require('./routes/discord/leaderboards');
const creatorcrewRoute = require('./routes/discord/creatorcrew');

// Error Routes
const errorRoute = require('./routes/dashboard/error');

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
    path.join(__dirname, '/views/dashboard/admincp'),
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
app.use('/staff_guidelines', staffGuidelinesRoute);
app.use('/privacy', privacyRoute);
app.use('/admincp', adminCPRoute);

// Discord Middleware
app.use('/applications', applicationsRoute);
app.use('/apply', applyRoute);
app.use('/leaderboards', leaderboardsRoute);
app.use('/creatorcrew', creatorcrewRoute);

// Error Middleware
app.use('/error', errorRoute);

app.get('/', async (req, res) => {
    if (req.user) {
        res.redirect('/dashboard');
    } else {
        const resolve = await fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}?with_counts=true`, { headers: { "Authorization": `${process.env.API_TOKEN}` } });
        const data = await resolve.json();

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        res.render('home', {
            totalMembers: numberWithCommas(data.approximate_member_count),
            home: true
        });
    }
});

// middleware to catch non-existing routes
app.use( function(req, res, next) {
    req.session.error = 'This page does not exist';
    res.redirect('/error');

});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});