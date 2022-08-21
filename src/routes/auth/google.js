const router = require('express').Router();
const passport = require('passport');
require('../../strategies/google_strategy')(passport);
const googleUser = require('../../schema/misc/google_user');

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

// Sign out
router.post('/signout', async (req, res) => {
    await googleUser.findOneAndUpdate({
        discordId: req?.user.userId
    },{
        expires: '0'
    },{
        upsert: true
    });
    res.send({ "status": "ok" });
});

module.exports = router;