require('dotenv').config();
const router = require('express').Router();
const { isAuthortized } = require('../strategies/auth_check');

// Dashboard root
router.get('/', isAuthortized, async (req, res) => {
    res.render('dashboard', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar
    });
});

module.exports = router;