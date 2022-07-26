require('dotenv').config();
const router = require('express').Router();
const mongo = require('../../database/mongodb');
const staffApplicationSchema = require('../../schema/logs/staff_applications_schema');
const { isAuthortized, isStaff } = require('../../strategies/auth_check');

// Applications root
router.get('/', async (req, res) => {
    if (!req?.user?.isStaff) return res.redirect('/apply');
    const results = await staffApplicationSchema.find().limit(9).sort({ '_id': -1 });

    res.render('applications', {
        isStaff: isStaff(req),
        admincp: false,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        results
    });
});

module.exports = router;