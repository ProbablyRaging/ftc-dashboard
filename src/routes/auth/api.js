const router = require('express').Router();
const fetch = require('node-fetch');
const googleUser = require('../../schema/misc/google_user');
const warnSchema = require('../../schema/logs/warn_schema');
const banSchema = require('../../schema/logs/ban_unban_schema');
const blacklistSchema = require('../../schema/logs/blacklist_schema');
const commandSchema = require('../../schema/logs/command_usage_schema');
const deleteSchema = require('../../schema/logs/message_delete_schema');
const muteSchema = require('../../schema/logs/mute_timeout_schema');

router.post('/', async (req, res) => {
    res.sendStatus(405);
});

// Handle POST request for liking YouTube videos
router.post('/like-video', async (req, res) => {
    if (req.user && req.body.videoId) {
        // Fetch user's Google Oath access token
        const userData = await googleUser.findOne({ discordId: req.user?.userId });

        // POST request to google API - rate
        await fetch(`https://youtube.googleapis.com/youtube/v3/videos/rate?id=${req.body.videoId}&rating=like&key=${process.env.GAPI_KEY}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userData.accessToken}` }
        }).then(async response => {
            const data = await response;
            if (data.status === 204) {
                res.send({ "status": data.status });
            } else if (data.status === 401) {
                res.send({ "status": data.status });
            } else {
                res.send({ "status": data.status });
            }
        }).catch(err => console.error('CAUGHT ERROR', err));
    } else {
        res.redirect('/google')
    }
});

// POST to check if user has previously liked a video
router.post('/video-status', async (req, res) => {
    if (req.user && req.body.videoId) {
        const videoId = req.body.videoId;

        // Fetch the users access token
        const userData = await googleUser.findOne({ discordId: req.user.userId });
        if (userData.accessToken) {
            // Send POST requent to Google's API to see if the video has been liked
            await fetch(`https://youtube.googleapis.com/youtube/v3/videos/getRating?id=${videoId}&key=${process.env.GAPI_KEY}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userData.accessToken}` }
            }).then(async response => {
                const data = await response?.json();

                if (data?.items) {
                    data?.items.forEach(item => {
                        res.send({ "status": item.rating })
                    });
                } else {
                    res.sendStatus(401);
                }
            }).catch(err => console.error('CAUGHT ERROR', err));
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

// POST to fetch logs for logs tables
router.post('/log-fetch', async (req, res) => {
    if (req?.user && req?.body?.logToFetch) {
        
        if (req?.body?.logToFetch === 'warnSchema') schema = warnSchema;
        if (req?.body?.logToFetch === 'muteSchema') schema = muteSchema;
        if (req?.body?.logToFetch === 'banSchema') schema = banSchema;
        if (req?.body?.logToFetch === 'deleteSchema') schema = deleteSchema;
        if (req?.body?.logToFetch === 'blacklistSchema') schema = blacklistSchema;
        if (req?.body?.logToFetch === 'commandSchema') schema = commandSchema;

        // Fetch the requested log
        const results = await schema.find().sort({ '_id': -1 }).limit(10);

        res.send(results)
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;