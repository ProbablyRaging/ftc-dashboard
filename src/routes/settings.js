const router = require('express').Router();
const { isAuthortized } = require('../strategies/auth_check');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongo = require('../database/mongodb');
const ruleSchema = require('../schema/rule_schema');

// Settings root
router.get('/', isAuthortized, (req, res) => {
    res.redirect('/dashboard')
});

// Rules GET
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

// Rules POST
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

module.exports = router;