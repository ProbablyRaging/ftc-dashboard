require('dotenv').config();
const router = require('express').Router();
const mongo = require('../../database/mongodb');
const staffApplicationSchema = require('../../schema/logs/staff_applications_schema');
const { isAuthortized } = require('../../strategies/auth_check');

// Applications root
router.get('/', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        const results = await staffApplicationSchema.find().limit(9);

        res.render('applications', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            results
        });
    });
});

module.exports = router;