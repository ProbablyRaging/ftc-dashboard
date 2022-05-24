require('dotenv').config();
const router = require('express').Router();

// Dashboard root
router.get('/', isAuthortized, async (req, res) => {
    res.render('dashboard', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar
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