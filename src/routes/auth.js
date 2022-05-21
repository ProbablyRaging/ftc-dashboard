const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/forbidden',
    successRedirect: '/dashboard'
}));

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

module.exports = router;