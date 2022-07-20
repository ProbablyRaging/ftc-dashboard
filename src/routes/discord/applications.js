require('dotenv').config();
const router = require('express').Router();
const mongo = require('../../database/mongodb');
const staffApplicationSchema = require('../../schema/logs/staff_applications_schema');
const { isAuthortized } = require('../../strategies/auth_check');
const { dataLog } = require('../../functions/data_log');

// Applications root
router.get('/', isAuthortized, async (req, res) => {
    dataLog(req);
    const results = await staffApplicationSchema.find().limit(9).sort({ '_id': -1 });

    res.render('applications', {
        admincp: false,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        results
    });
});

module.exports = router;