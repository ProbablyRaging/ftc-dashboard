require('dotenv').config();
const router = require('express').Router();
const { convertTimestampToRelativeTime } = require('../../views/functions/index');
const ccVideoQueue = require('../../schema/creator_crew/video_queue');
const dashboardUsers = require('../../schema/misc/discord_user');
const { isAuthortized } = require('../../strategies/auth_check');

// AdminCP root
router.get('/', isAuthortized, async (req, res) => {
    const results = await ccVideoQueue.find();

    res.render('admincp', {
        admincp: true,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        convertTimestampToRelativeTime,
        results
    });
});

router.get('/users', isAuthortized, async (req, res) => {
    const results = await dashboardUsers.find();

    res.render('users', {
        admincp: true,
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        results
    });
});

router.get('/queues', isAuthortized, async (req, res) => {
    const results = await ccVideoQueue.find()

    res.render('queues', {
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