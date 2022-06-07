const router = require('express').Router();
const fetch = require('node-fetch');
const googleUser = require('../schema/google_user');

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
        });

        res.sendStatus(204);
    } else {
        res.sendStatus(401);
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
                const data = await response.json();

                if (data?.items) {
                    data?.items.forEach(item => {
                        res.send({ "status": item.rating })
                    });
                } else {
                    res.sendStatus(401);
                }
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;