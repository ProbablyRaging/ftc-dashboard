const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongo = require('../database/mongodb');
const testVideoList = require('../schema/test_video_id');
const googleUser = require('../schema/google_user');

// Creator crew GET
router.get('/', async (req, res) => {
    if (req.user?.roles.includes('841580486517063681')) {
        mongo.then(async mongo => {
            const results = await testVideoList.find({ userId: req.user.userId });
            const userData = await googleUser.findOne({ discordId: req.user.userId });

            if (userData.accessToken) {
                userHasToken = true;
            } else {
                userHasToken = false
            }

            for (const data of results) {
                const { videoIds } = data;
                videoCount = videoIds.length;
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
        });
    } else {
        res.redirect('/');
    }
});

router.post('/', urlencodedParser, async (req, res) => {
    console.log(req.body)

    // const reqUserId = req.user.userId;
    // const videoId = req.body.videoId;

    // console.log(reqUserId, videoId)

    // mongo.then(async mongo => {
    //     await testVideoList.updateOne(
    //         { userId: reqUserId },
    //         { $pull: { 'videoIds': videoId } }
    //     );
    // });

    // res.sendStatus(200)
    res.send(`${process.env.GAPI_KEY}`)
});

module.exports = router;