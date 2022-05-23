const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongo = require('../database/mongodb');
const ruleSchema = require('../schema/rule_schema');

// Settings root
router.get('/', isAuthortized, (req, res) => {
    res.redirect('/dashboard')
});

// Warnings
router.get('/rules', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        const results = await ruleSchema.find();

        res.render('rules', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            results
        });        
    });
});

// Rules
router.post('/rules', isAuthortized, urlencodedParser, async (req, res) => {
    const ruleToUpdate = req.body.rule?.toLowerCase();
    const ruleNewValue = req.body.input;

    if (req.body.rule === undefined) return;

    mongo.then(async mongo => {
        await ruleSchema.findOneAndUpdate({
            rule: ruleToUpdate
        }, {
            value: ruleNewValue
        });
    });

    res.redirect('/settings/rules');
});

// Mutes and timeouts
router.get('/index', isAuthortized, async (req, res) => {
    res.render('index', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
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