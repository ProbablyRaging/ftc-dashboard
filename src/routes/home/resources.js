require('dotenv').config();
const router = require('express').Router();
const resourceSchema = require('../../schema/misc/resources');
const { isAuthortized, isStaff } = require('../../strategies/auth_check');
const slugify = require('slugify');
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    const results = await resourceSchema.find().limit(6).sort({ '_id': -1 });
    res.render('resources', {
        home: false,
        isStaff: isStaff(req),
        user: req?.user,
        results: results
    });
});

router.get('/new', isAuthortized, async (req, res) => {
    res.render('new_resource', {
        home: false,
        isStaff: isStaff(req),
        user: req?.user
    });
});

router.get('/:slug', async (req, res) => {
    const results = await resourceSchema.findOne({ slug: req.params.slug });
    if (results === null) return res.redirect('/resources');
    res.render('resources/view', {
        home: false,
        isStaff: isStaff(req),
        user: req?.user,
        post: results
    });
});

router.post('/post', isAuthortized, async (req, res) => {
    const body = req.body.body;
    const regex = /<img.*?src=['"](.*?)['"]/;
    if (regex.exec(body) !== null) {
        image = regex.exec(body)[1];
    } else {
        image = '/images/default_res_banner.png'
    }
    post = await resourceSchema.create({
        title: req.body.title,
        body: req.body.body,
        author: req.user.username,
        userId: req.user.userId,
        avatar: req.user.avatar,
        image: image
    }).catch(err => {
        console.log(err);
        return res.send({ "status": "error" })
    });
    res.send({ "status": "ok", "slug": `${post.slug}` });
});

router.post('/edit', isAuthortized, async (req, res) => {
    if (!req.body.body.includes('<img')) {
        image = '/images/default_res_banner.png'
    }
    await resourceSchema.findOneAndUpdate({
        _id: req.body.id
    }, {
        title: req.body.title,
        body: req.body.body,
        image: image,
        slug: slugify(req.body.title, { lower: true, strict: true })
    }, {
        upsert: true
    }).catch(err => {
        console.log(err);
        return res.send({ "status": "error" })
    });
    res.send({ "status": "ok", "slug": `${slugify(req.body.title, { lower: true, strict: true })}` });
});

router.post('/delete', isAuthortized, async (req, res) => {
    try {
        await resourceSchema.deleteOne({ _id: req.body.id });
    } catch (err) {
        res.send({ "status": "error" });
    } finally {
        res.send({ "status": "ok" });
    }
});

router.post('/publish', isAuthortized, async (req, res) => {
    try {
        await resourceSchema.updateOne({
            _id: req.body.id
        }, {
            published: true
        }, {
            upsert: true
        });
    } catch (err) {
        res.send({ "status": "error" });
    } finally {
        res.send({ "status": "ok" });
    }
    // Create webhook
    const headers = { "Content-Type": "application/json", "Authorization": process.env.API_TOKEN };
    const body = { name: `4DC`, avatar: process.env.BOT_IMG_URI };
    let webhook;
    await fetch(`https://discord.com/api/v9/channels/924271299004600350/webhooks`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
        webhook = await response.json();
        // Send webhook
        const body = {
            content: `${req.body.url}`
        };
        await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}/${webhook.token}`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
            // Delete webhook
            await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}`, { method: 'DELETE', headers: headers });
        });
    });
});

module.exports = router;