require('dotenv').config();
const router = require('express').Router();
const { isAuthortized } = require('../../strategies/auth_check');
const fetch = require('node-fetch');
const chartData = require('../../schema/logs/chart_data');

// Staff dashboard root
router.get('/', isAuthortized, async (req, res) => {
    const results = await chartData.find().sort({ '_id': -1 }).limit(7);

    let dateArr = [];
    let joinsArr = [];
    let messagesArr = [];
    let bansArr = [];
    for (const data of results) {
        const { date, joins, messages, bans } = data;
        dateArr.push(date);
        joinsArr.push(joins);
        messagesArr.push(messages);
        bansArr.push(bans);
    }

    // Fetch member and channel counts from Discord's API
    Promise.all([
        fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}?with_counts=true`, { headers: { "Authorization": `${process.env.API_TOKEN}` } }).then(resp => resp.json()),
        fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}/channels`, { headers: { "Authorization": `${process.env.API_TOKEN}` } }).then(resp => resp.json()),
        fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}/roles`, { headers: { "Authorization": `${process.env.API_TOKEN}` } }).then(resp => resp.json()),
    ]).then(data => {
        let text_channel_count = 0;
        let voice_channel_count = 0;
        let category_count = 0;

        for (const res of data[1]) {
            if (res.type === 0) {
                text_channel_count++;
            }
            if (res.type === 2) {
                voice_channel_count++;
            }
            if (res.type === 4) {
                category_count++;
            }
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        res.render('dashboard', {
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            onlineMembers: numberWithCommas(data[0].approximate_presence_count),
            totalMembers: numberWithCommas(data[0].approximate_member_count - data[0].approximate_presence_count),
            role_count: data[2].length,
            text_channel_count,
            voice_channel_count,
            category_count,
            dateArr, joinsArr, messagesArr, bansArr
        });
    });
});

// User dashboard
router.get('/guest', async (req, res) => {
    if (req.user) {
        const results = await chartData.find().sort({ '_id': -1 }).limit(7);

        let dateArr = [];
        let joinsArr = [];
        let messagesArr = [];
        let bansArr = [];
        for (const data of results) {
            const { date, joins, messages, bans } = data;
            dateArr.push(date);
            joinsArr.push(joins);
            messagesArr.push(messages);
            bansArr.push(bans);
        }

        // Fetch member and channel counts from Discord's API
        Promise.all([
            fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}?with_counts=true`, { headers: { "Authorization": `${process.env.API_TOKEN}` } }).then(resp => resp.json()),
            fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}/channels`, { headers: { "Authorization": `${process.env.API_TOKEN}` } }).then(resp => resp.json()),
            fetch(`https://discord.com/api/v9/guilds/${process.env.SERVER_ID}/roles`, { headers: { "Authorization": `${process.env.API_TOKEN}` } }).then(resp => resp.json()),
        ]).then(data => {
            let text_channel_count = 0;
            let voice_channel_count = 0;
            let category_count = 0;

            for (const res of data[1]) {
                if (res.type === 0) {
                    text_channel_count++;
                }
                if (res.type === 2) {
                    voice_channel_count++;
                }
                if (res.type === 4) {
                    category_count++;
                }
            }

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            res.render('guest', {
                username: `${req.user.username}#${req.user.discriminator}`,
                userId: req.user.userId,
                avatar: req.user.avatar,
                onlineMembers: numberWithCommas(data[0].approximate_presence_count),
                totalMembers: numberWithCommas(data[0].approximate_member_count - data[0].approximate_presence_count),
                role_count: data[2].length,
                text_channel_count,
                voice_channel_count,
                category_count,
                dateArr, joinsArr, messagesArr, bansArr
            });
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;