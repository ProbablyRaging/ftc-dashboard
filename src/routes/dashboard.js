const router = require('express').Router();



router.get('/', isAuthortized, (req, res) => {
    res.render('dashboard', {
        username: req.user.username,
        userId: req.user.userId
    });
});

function isAuthortized(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;