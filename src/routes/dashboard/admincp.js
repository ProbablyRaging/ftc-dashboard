require('dotenv').config();
const router = require('express').Router();
const { convertTimestampToRelativeTime } = require('../../functions/functions');
const ccVideoQueue = require('../../schema/creator_crew/video_queue');
const { isAuthortized, isStaff } = require('../../strategies/auth_check');

// AdminCP root
router.get('/', isAuthortized, async (req, res) => {
    const results = await ccVideoQueue.find();

    res.render('admincp', {
        isStaff: isStaff(req),
        admincp: true,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        convertTimestampToRelativeTime,
        results
    });
});

router.post('/remove', async (req, res) => {
    const id = req.body?.id;
    await ccVideoQueue.findOneAndDelete({
        _id: id
    });
    res.send({ "status": "ok" });
});

module.exports = router;