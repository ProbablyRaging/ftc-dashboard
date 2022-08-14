require('dotenv').config();
const router = require('express').Router();

// Privacy Policy root
router.get('/', async (req, res) => {
    res.render('staff_guidelines', {
        home: false
    });
});

module.exports = router;