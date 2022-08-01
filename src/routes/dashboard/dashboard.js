require('dotenv').config();
const router = require('express').Router();
const { isAuthortized, isStaff } = require('../../strategies/auth_check');
const fetch = require('node-fetch');
const chartData = require('../../schema/logs/chart_data');
const { perDiff } = require('../../functions/functions');

// Staff dashboard root
router.get('/', async (req, res) => {
    if (!req?.user) return res.redirect('/');
    const results = await chartData.find().sort({ '_id': -1 }).limit(14);

    let dateArr = [];
    let joinsArr = [];
    let leavesArr = [];
    let messagesArr = [];
    let bansArr = [];
    let timeoutsArr = [];
    let warningsArr = [];
    let newcommunicatorsArr = [];
    for (const data of results) {
        const { date, joins, leaves, messages, bans, timeouts, warnings, newcommunicators } = data;
        dateArr.push(date);
        joinsArr.push(joins);
        leavesArr.push(leaves);
        messagesArr.push(messages);
        bansArr.push(bans);
        timeoutsArr.push(timeouts);
        warningsArr.push(warnings);
        newcommunicatorsArr.push(newcommunicators);
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
            isStaff: isStaff(req),
            admincp: false,
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            onlineMembers: numberWithCommas(data[0].approximate_presence_count),
            totalMembers: numberWithCommas(data[0].approximate_member_count - data[0].approximate_presence_count),
            role_count: data[2].length,
            perDiff,
            text_channel_count,
            voice_channel_count,
            category_count,
            dateArr, joinsArr, leavesArr, messagesArr, bansArr, timeoutsArr, warningsArr, newcommunicatorsArr
        });
    });
});

module.exports = router;