require('dotenv').config();
const router = require('express').Router();
const { isAuthortized, isStaff } = require('../../strategies/auth_check');
const fetch = require('node-fetch');
const { perDiff } = require('../../functions/functions');

// Staff dashboard root
router.get('/', async (req, res) => {
    if (!req?.user) return res.redirect('/');

    res.render('dashboard', {
        isStaff: isStaff(req),
        admincp: false,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar
    });
});

module.exports = router;