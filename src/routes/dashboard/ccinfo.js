require('dotenv').config();
const router = require('express').Router();

// Creator Crew info root
router.get('/', async (req, res) => {
    res.render('ccinfo', {
        home: false
    });
});

module.exports = router;