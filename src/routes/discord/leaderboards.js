const router = require('express').Router();
const fetch = require('node-fetch');
const mongo = require('../../database/mongodb');
const rankSchema = require('../../schema/leaderboards/rank_schema');
const lastletterSchema = require('../../schema/leaderboards/lastletter_schema');
const llRecordSchema = require('../../schema/leaderboards/letter_record_schema');
const countingSchema = require('../../schema/leaderboards/counting_schema');
const countingCurrentSchema = require('../../schema/leaderboards/counting_current_schema');
const { isAuthortized, isStaff } = require('../../strategies/auth_check');

// Leaderboards root
router.get('/', async (req, res) => {
    res.redirect('/');
});

// Ranks
router.get('/ranks', async (req, res) => {
    if (req.user) {
        const results = await rankSchema.find({ 'rank': { $gte: 1, $lte: 20 } }).sort({ 'rank': 1 });

        // for (const data of results) {
        //     const response = await fetch(`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp`);
        //     console.log(response.status);
        // }

        res.render('ranks', {
            isStaff: isStaff(req),
            admincp: false,
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            results
        });
    } else {
        res.redirect('/');
    }
});

// Messages
router.get('/messages', async (req, res) => {
    if (req.user) {
        const results = await rankSchema.find({ 'rank': { $gte: 1, $lt: 101 } });

        dataArr = [];
        for (const data of results) {
            const { id, username, msgCount, rank, level, avatar, xp } = data;
            if (username) dataArr.push({ id, username, msgCount, rank, level, avatar, xp });
        }

        dataArr.sort(function (a, b) {
            return b.msgCount - a.msgCount;
        });

        res.render('messages', {
            isStaff: isStaff(req),
            admincp: false,
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            dataArr
        });
    } else {
        res.redirect('/');
    }
});

// Last letter
router.get('/lastletter', async (req, res) => {
    if (req.user) {
        const results = await lastletterSchema.find();
        const results2 = await llRecordSchema.find();

        dataArr = [];
        for (const data of results) {
            const { userId, username, avatar, correctCount } = data;
            if (username) dataArr.push({ userId, username, avatar, correctCount });
        }

        let record;
        for (const data2 of results2) {
            const { currentRecord } = data2;

            record = currentRecord;
        }

        dataArr.sort(function (a, b) {
            return b.correctCount - a.correctCount;
        });

        res.render('lastletter', {
            isStaff: isStaff(req),
            admincp: false,
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            dataArr, record
        });
    } else {
        res.redirect('/');
    }
});

// Coutning
router.get('/counting', async (req, res) => {
    if (req.user) {
        const results = await countingSchema.find();
        const results2 = await countingCurrentSchema.find();

        dataArr = [];
        for (const data of results) {
            const { userId, username, avatar, counts } = data;
            if (username) dataArr.push({ userId, username, avatar, counts });
        }

        let record;
        for (const data2 of results2) {
            const { currentRecord } = data2;

            record = currentRecord;
        }

        dataArr.sort(function (a, b) {
            return b.counts - a.counts;
        });

        res.render('counting', {
            isStaff: isStaff(req),
            admincp: false,
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            dataArr, record
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;