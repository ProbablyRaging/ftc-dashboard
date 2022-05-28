require('dotenv').config();
const router = require('express').Router();
const { isAuthortized } = require('../strategies/auth_check');
const fetch = require('node-fetch');

// Staff dashboard root
router.get('/', isAuthortized, async (req, res) => {
    // Fetch member count
    const resolve = await fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}?with_counts=true`, { headers: { "Authorization": `${process.env.API_TOKEN}` } });
    const data = await resolve.json();

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    res.render('dashboard', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        onlineMembers: numberWithCommas(data.approximate_presence_count),
        totalMembers: numberWithCommas(data.approximate_member_count - data.approximate_presence_count)
    });
});

// User dashboard
router.get('/guest', async (req, res) => {
    if (req.user) {
        // Fetch member count
        const resolve = await fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}?with_counts=true`, { headers: { "Authorization": `${process.env.API_TOKEN}` } });
        const data = await resolve.json();

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        res.render('guest', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            onlineMembers: numberWithCommas(data.approximate_presence_count),
            totalMembers: numberWithCommas(data.approximate_member_count - data.approximate_presence_count)
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;