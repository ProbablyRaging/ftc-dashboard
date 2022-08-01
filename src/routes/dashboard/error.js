require('dotenv').config();
const router = require('express').Router();

// Applications root
router.get('/', async (req, res) => {
    console.log(req.session.error)
    res.render('error', {
        error: req.session.error
    });
    delete req.session.error
});

module.exports = router;