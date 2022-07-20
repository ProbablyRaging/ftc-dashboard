const router = require('express').Router();
const { convertTimestampToRelativeTime } = require('../../views/functions/index');
const fetch = require('node-fetch');
const ccVideoQueue = require('../../schema/creator_crew/video_queue');
const googleUser = require('../../schema/misc/google_user');
const { dataLog } = require('../../functions/data_log');

// Creator crew GET
router.get('/', async (req, res) => {
    if (req.user?.roles.includes(process.env.CC_ROLE) || req.user?.userId === process.env.OWNER_ID) {
        dataLog(req);
        if (req.user?.userId === process.env.OWNER_ID) {
            isOwner = true;
        } else {
            isOwner = false;
        }

        // Result math for pagination
        const total = (await ccVideoQueue.find({ userId: req.user.userId })).length;

        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/creatorcrew');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 10;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        // Fetch the users video queue and check if they have an access token
        const userData = await googleUser.findOne({ discordId: req.user.userId });
        const results = await ccVideoQueue.find({ userId: req.user.userId }).sort({ '_id': 1 }).limit(limit).skip(skip);

        // If user doesn't have a googleUser entry, resirect them to sign in
        if (!userData) {
            res.redirect('/google');
        } else {
            if (userData.accessToken) {
                userHasToken = true;
            } else {
                userHasToken = false;
            }

            let videoArr = [];
            for (const data of results) {
                const { videoId, videoAuthor, timestamp } = data;
                videoArr.push({ id: videoId, author: videoAuthor, timestamp });
            }
            const videoCount = videoArr.length;

            res.render('creatorcrew', {
                admincp: false,
                useStaffNavbar: req.user.isStaff,
                username: `${req.user.username}#${req.user.discriminator}`,
                userId: req.user.userId,
                avatar: req.user.avatar,
                userExpires: userData.expires,
                isOwner,
                convertTimestampToRelativeTime,
                videoArr, userHasToken, videoCount, skip, limit, page, total
            });
        }
    } else {
        res.redirect('/');
    }
});

// POST route for removing video ids from a user's queue
router.post('/remove', async (req, res) => {
    const reqUserId = req.user?.userId;
    const videoId = req.body?.videoId;
    await ccVideoQueue.findOneAndDelete({
        userId: reqUserId,
        videoId: videoId
    });
    res.send({ "status": "ok" });
});

// POST route for notifying staff if a user skips/seeks a video
router.post('/notify', async (req, res) => {
    // Create webhook
    const headers = { "Content-Type": "application/json", "Authorization": process.env.API_TOKEN };
    const body = { name: `CreatorBot`, avatar: process.env.BOT_IMG_URI };
    let webhook;
    await fetch(`https://discord.com/api/v9/channels/924271299004600350/webhooks`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
        webhook = await response.json();
        // Send webhook
        const body = {
            content: `<@438434841617367080>
A skip or seek interaction was detected on a video with the ID \`${req.body.videoId}\` that <@${req.user.userId}> was watching`
        };
        await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}/${webhook.token}`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
            // Delete webhook
            await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}`, { method: 'DELETE', headers: headers });
        });
    });

    res.sendStatus(204)
});

module.exports = router;