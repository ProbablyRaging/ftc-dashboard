const router = require('express').Router();
const { isAuthortized } = require('../../strategies/auth_check');
const mongo = require('../../database/mongodb');
const ruleSchema = require('../../schema/misc/rule_schema');
const { dataLog } = require('../../functions/data_log');

// Settings root
router.get('/', isAuthortized, (req, res) => {
    res.redirect('/dashboard')
});

// Rules GET
router.get('/rules', isAuthortized, async (req, res) => {
    dataLog(req);
    const results = await ruleSchema.find();

    res.render('rules', {
        admincp: false,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        results
    });
});

// Rules POST
router.post('/rules', isAuthortized, async (req, res) => {
    dataLog(req);
    const ruleToUpdate = req.body.rule?.toLowerCase();
    const ruleNewValue = req.body.input;

    if (req.body.rule === undefined) return;

    await ruleSchema.findOneAndUpdate({
        rule: ruleToUpdate
    }, {
        value: ruleNewValue
    });

    res.redirect('/settings/rules');
});

module.exports = router;