require('dotenv').config();
const router = require('express').Router();

// Creator Crew info root
router.get('/', async (req, res) => {
    req.session.returnTo = req.originalUrl;
    res.render('ccinfo', {
        home: false,
        user: req?.user
    });
});

module.exports = router;