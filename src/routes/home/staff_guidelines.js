require('dotenv').config();
const router = require('express').Router();

// Privacy Policy root
router.get('/', async (req, res) => {
    req.session.returnTo = req.originalUrl;
    res.render('staff_guidelines', {
        home: false,
        user: req?.user
    });
});

module.exports = router;