const router = require('express').Router();
const passport = require('passport');
require('../strategies/google_strategy')(passport);

// Auth root
router.get('/', passport.authenticate('google', { 
    scope: ['profile', 'https://www.googleapis.com/auth/youtube'],
    accessType: 'offline',
    approvalPrompt: 'force' 
}));

// Redirect
router.get('/callback', passport.authenticate('google', { 
    failureRedirect: '/',
    successRedirect: '/creatorcrew',
    session: false
}));

module.exports = router;