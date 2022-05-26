const router = require('express').Router();
const mongo = require('../database/mongodb');
const { isAuthortized } = require('../strategies/auth_check');
const warnSchema = require('../schema/warn_schema');
const muteTimeoutSchema = require('../schema/mute_timeout_schema');
const banUnbanSchema = require('../schema/ban_unban_schema');
const blacklistSchema = require('../schema/blacklist_schema');
const commandUsageSchema = require('../schema/command_usage_schema');

// Logs root
router.get('/', isAuthortized, (req, res) => {
    res.redirect('/dashboard');
});

// Warnings
router.get('/warnings', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/logs/warnings');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 5;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        const results = await warnSchema.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        // Result math for pagination
        const total = (await warnSchema.find()).length;

        res.render('warnings', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

// Mutes and timeouts
router.get('/mutes', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/logs/mutes');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 5;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        const results = await muteTimeoutSchema.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        // Result math for pagination
        const total = (await muteTimeoutSchema.find()).length;

        res.render('mutes', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

// Bans and unbans
router.get('/bans', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/logs/bans');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 5;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        const results = await banUnbanSchema.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        // Result math for pagination
        const total = (await banUnbanSchema.find()).length;

        res.render('bans', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

// Blacklisted messages
router.get('/blacklists', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/logs/blacklists');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 5;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        const results = await blacklistSchema.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        // Result math for pagination
        const total = (await blacklistSchema.find()).length;

        res.render('blacklists', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

// Command usage
router.get('/commands', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/logs/commands');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 5;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        const results = await commandUsageSchema.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        // Result math for pagination
        const total = (await commandUsageSchema.find()).length;

        res.render('commands', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

module.exports = router;