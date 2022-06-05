const router = require('express').Router();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const ccVideoQueue = require('../schema/creator_crew/video_queue');
const googleUser = require('../schema/google_user');

// Creator crew GET
router.get('/', async (req, res) => {
    if (req.user?.roles.includes('841580486517063681')) {
        // Fetch the users video queue and check if they have an access token
        const userData = await googleUser.findOne({ discordId: req.user.userId });
        const results = await ccVideoQueue.find({ userId: req.user.userId });

        if (userData.accessToken) {
            userHasToken = true;
        } else {
            userHasToken = false
        }

        for (const data of results) {
            const { videoQueue } = data;
            videoCount = videoQueue.length;
        }

        res.render('creatorcrew', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            userExpires: userData.expires,
            results,
            userHasToken,
            videoCount
        });
    } else {
        res.redirect('/');
    }
});

// POST route for removing video ids from a user's queue
router.post('/pull', urlencodedParser, async (req, res) => {
    const reqUserId = req.user.userId;
    const videoId = req.body.videoId;
    await ccVideoQueue.updateOne(
        { userId: reqUserId },
        { $pull: { 'videoQueue': videoId } }
    );
    res.sendStatus(204)
});

// POST route for notifying staff if a user skips/seeks a video
router.post('/notify', urlencodedParser, async (req, res) => {
    // Create webhook
    const headers = { "Content-Type": "application/json", "Authorization": process.env.API_TOKEN };
    const body = { name: `CreatorBot`, avatar: process.env.BOT_IMG_URI };
    let webhook;
    await fetch(`https://discord.com/api/v9/channels/${process.env.STAFF_CHANNEL}/webhooks`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
        webhook = await response.json();
        // Send webhook
        const body = {
            content: `${process.env.AUTH_ROLE_ID}
**Creator Crew - SKIP/SEEK DETECTED**
A skip or seek interaction was detected on a video with the ID \`${req.body.videoId}\` that <@${req.user.userId}> was watching` };
        await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}/${webhook.token}`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
            // Delete webhook
            await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}`, { method: 'DELETE', headers: headers });
        });
    });

    res.sendStatus(204)
});

module.exports = router;