const router = require('express').Router();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const googleUser = require('../schema/google_user');

router.post('/', urlencodedParser, async (req, res) => {
  res.sendStatus(405);
});

// Handle POST request for liking YouTube videos
router.post('/like-video', urlencodedParser, async (req, res) => {
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
    res.sendStatus(401)
  }
});

module.exports = router;