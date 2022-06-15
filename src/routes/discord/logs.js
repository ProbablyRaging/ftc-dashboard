const router = require('express').Router();
const mongo = require('../../database/mongodb');
const { isAuthortized } = require('../../strategies/auth_check');
const warnSchema = require('../../schema/logs/warn_schema');
const muteTimeoutSchema = require('../../schema/logs/mute_timeout_schema');
const banUnbanSchema = require('../../schema/logs/ban_unban_schema');
const blacklistSchema = require('../../schema/logs/blacklist_schema');
const commandUsageSchema = require('../../schema/logs/command_usage_schema');
const messageDeleteScheme = require('../../schema/logs/message_delete_schema');

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
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

router.post('/warnings/remove', async (req, res) => {
    const warnId = req.body?.warnId;
    await warnSchema.findOneAndDelete({
        warnId: warnId
    });
    res.send({ "status": "ok" });        
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
            useStaffNavbar: req.user.isStaff,
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
            useStaffNavbar: req.user.isStaff,
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
            useStaffNavbar: req.user.isStaff,
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
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

// Command usage
router.get('/message-deletes', isAuthortized, async (req, res) => {
    mongo.then(async mongo => {
        let { page, size } = req.query;

        if (page <= 0) return res.redirect('/logs/message-deletes');

        if (!page) {
            page = 1;
        }
        if (!size) {
            size = 5;
        }

        const skip = (page - 1) * size;
        const limit = parseInt(size);

        const results = await messageDeleteScheme.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        // Result math for pagination
        const total = (await messageDeleteScheme.find()).length;

        res.render('message-deletes', {
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results, skip, limit, page, total
        });
    });
});

module.exports = router;