require('dotenv').config();
const router = require('express').Router();

// Applications root
router.get('/', async (req, res) => {
    res.render('error', {
        error: req.session.error
    });
    delete req.session.error
});

module.exports = router;