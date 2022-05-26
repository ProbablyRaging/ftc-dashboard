require('dotenv').config();
const router = require('express').Router();

// Applications root
router.get('/', async (req, res) => {
    res.render('forbidden');
});

module.exports = router;