const router = require('express').Router();
const mongo = require('../database/mongodb');
const warnSchema = require('../schema/warn_schema');

router.get('/', isAuthortized, (req, res) => {
    res.redirect('/dashboard')
});

router.get('/warnings', isAuthortized, (req, res) => {
    let resArr = [];

    mongo.then(async mongo => {
        const results = await warnSchema.find()

        results.forEach(result => {
            resArr.push(result)
        });

        resArr.sort(function (a, b) {
            return b.timestamp - a.timestamp;
        });

        res.render('warnings', {
            username: req.user.username,
            userId: req.user.userId,
            resArr
        });
    });
});

function isAuthortized(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;