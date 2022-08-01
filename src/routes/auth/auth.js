const router = require('express').Router();
const passport = require('passport');

// Auth root
router.get('/', passport.authenticate('discord'));

// Redirect
router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/error',
    successRedirect: '/dashboard',
}));

// Logout
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;