require('dotenv').config();
const router = require('express').Router();
const chartData = require('../../schema/logs/chart_data');

// test
router.get('/', async (req, res) => {
    const results = await chartData.find().sort({ '_id': -1 }).limit(7);

    // chartData.create({
    //     date: '14 Jun',
    //     joins: '37',
    // })

    let dateArr = [];
    let joinsArr = [];
    let bansArr = [];
    for (const data of results) {
        const { date, joins, bans } = data;
        dateArr.push(date);
        joinsArr.push(joins);
        bansArr.push(bans);        
    }

    // console.log(dateArr)

    res.render('test', {
        useStaffNavbar: req.user.isStaff,
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
        dateArr, joinsArr, bansArr
    });
});

module.exports = router;