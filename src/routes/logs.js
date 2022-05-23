const router = require('express').Router();
const mongo = require('../database/mongodb');
const warnSchema = require('../schema/warn_schema');

// Logs root
router.get('/', isAuthortized, (req, res) => {
    res.redirect('/dashboard')
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
            size = 10;
        }

        const skip = (page - 1) * size; 
        const limit = parseInt(size);

        const results = await warnSchema.find().sort({ '_id': -1 }).limit(limit).skip(skip);

        res.render('warnings', {
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar,
            page: page,
            results
        });
    });
});

// Mutes and timeouts
router.get('/mutes', isAuthortized, async (req, res) => {
    res.render('mutes', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
    });
});

// Bans and unbans
router.get('/bans', isAuthortized, async (req, res) => {
    res.render('bans', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
    });
});

// Blacklisted messages
router.get('/blacklists', isAuthortized, async (req, res) => {
    res.render('blacklists', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
    });
});

// Command usage
router.get('/commands', isAuthortized, async (req, res) => {
    res.render('commands', {
        username: `${req.user.username}#${req.user.discriminator}`,
        userId: req.user.userId,
        avatar: req.user.avatar,
    });
});

function isAuthortized(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;