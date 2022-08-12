const router = require('express').Router();
const fetch = require('node-fetch');
const googleUser = require('../../schema/misc/google_user');
const staffApplicationSchema = require('../../schema/logs/staff_applications_schema');

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

// POST for adding and removing votes from staff applications
router.post('/app-vote', async (req, res) => {
    if (req?.user && req?.body.appId) {
        // Fetch the requested log
        const results = await staffApplicationSchema.find({ _id: req.body.appId });

        let addYes;
        let addNo;

        if (!results) {
            res.sendStatus(401);
        } else {
            for (const data of results) {
                const { hasVotedYes, hasVotedNo } = data;
                let voteYesArr = hasVotedYes;
                let voteNoArr = hasVotedNo;

                if (req.body.vote === 'yes') {
                    // Check if user has already voted yes or not, if they have, we treat this as if they want to remove their vote
                    if (!voteYesArr.includes(req.user.username)) {
                        // Add the user to the yes array
                        voteYesArr.push(req.user.username);
                        // Update the database
                        await staffApplicationSchema.updateOne({
                            _id: req.body.appId
                        }, {
                            hasVotedYes: voteYesArr
                        }, {
                            upsert: true
                        }).catch(err => console.error('Error applying yes vote', err));
                        // Update final vote
                        addYes = true;
                    } else {
                        // Remove the user from the yes array
                        const index = voteYesArr.indexOf(req.user.username);
                        if (index > -1) {
                            voteYesArr.splice(index, 1);
                        }
                        // Update the database
                        await staffApplicationSchema.updateOne({
                            _id: req.body.appId
                        }, {
                            hasVotedYes: voteYesArr
                        }, {
                            upsert: true
                        }).catch(err => console.error('Error applying yes vote', err));
                        // Update final vote
                        addYes = false;
                    }
                    // If user has already voted no, remove their no vote
                    if (voteNoArr.includes(req.user.username)) {
                        // Remove the user from the yes array
                        const index = voteNoArr.indexOf(req.user.username);
                        if (index > -1) {
                            voteNoArr.splice(index, 1);
                        }
                        // Update the database
                        await staffApplicationSchema.updateOne({
                            _id: req.body.appId
                        }, {
                            hasVotedNo: voteNoArr
                        }, {
                            upsert: true
                        }).catch(err => console.error('Error applying no vote', err));
                        // Update final vote
                        addNo = false;
                    }
                } else if (req.body.vote === 'no') {
                    if (!voteNoArr.includes(req.user.username)) {
                        // Add the user to the no array
                        voteNoArr.push(req.user.username);
                        // Update the database
                        await staffApplicationSchema.updateOne({
                            _id: req.body.appId
                        }, {
                            hasVotedNo: voteNoArr
                        }, {
                            upsert: true
                        }).catch(err => console.error('Error applying no vote', err));
                        // Update final vote
                        addNo = true;
                    } else {
                        // Remove the user from the no array
                        const index = voteNoArr.indexOf(req.user.username);
                        if (index > -1) {
                            voteNoArr.splice(index, 1);
                        }
                        // Update the database
                        await staffApplicationSchema.updateOne({
                            _id: req.body.appId
                        }, {
                            hasVotedNo: voteNoArr
                        }, {
                            upsert: true
                        }).catch(err => console.error('Error applying no vote', err));
                        // Update final vote
                        addNo = false;
                    }
                    // If user has already voted yes, remove their yes vote
                    if (voteYesArr.includes(req.user.username)) {
                        // Remove the user from the yes array
                        const index = voteYesArr.indexOf(req.user.username);
                        if (index > -1) {
                            voteYesArr.splice(index, 1);
                        }
                        // Update the database
                        await staffApplicationSchema.updateOne({
                            _id: req.body.appId
                        }, {
                            hasVotedYes: voteYesArr
                        }, {
                            upsert: true
                        }).catch(err => console.error('Error applying no vote', err));
                        // Update final vote
                        addYes = false;
                    }
                }
            }
            res.send({ "status": "ok", addYes, addNo });
        }
    } else {
        res.sendStatus(401);
    }
});

// POST route for notifying staff if a user skips/seeks a video
router.post('/join-notify', async (req, res) => {
    // Create webhook
    const headers = { "Content-Type": "application/json", "Authorization": process.env.API_TOKEN };
    const body = { name: `4DC`, avatar: process.env.BOT_IMG_URI };
    let webhook;
    await fetch(`https://discord.com/api/v9/channels/924271299004600350/webhooks`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
        webhook = await response.json();
        // Send webhook
        const body = {
            content: `<@438434841617367080>
A user joined the server via the landing page`
        };
        await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}/${webhook.token}`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
            // Delete webhook
            await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}`, { method: 'DELETE', headers: headers });
        });
    });

    res.sendStatus(204);
});

module.exports = router;