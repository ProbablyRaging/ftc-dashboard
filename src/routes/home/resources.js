require('dotenv').config();
const router = require('express').Router();
const resourceSchema = require('../../schema/misc/resources');
const suggestionSchema = require('../../schema/misc/suggestions');
const { isAuthortized, isStaff, isWriter, isEditor } = require('../../strategies/auth_check');
const slugify = require('slugify');
const fetch = require('node-fetch');
const { ImgurClient } = require('imgur');

router.get('/', async (req, res) => {
    req.session.returnTo = req.originalUrl;
    const results = await resourceSchema.find().limit(6).sort({ _id: -1 });
    const results2 = await suggestionSchema.findOne().limit(5).sort({ _id: -1 });
    res.render('resources', {
        home: false,
        isStaff: isStaff(req),
        isEditor: isEditor(req),
        user: req?.user,
        results: results,
        suggestions: results2
    });
});

router.get('/new', isWriter, async (req, res) => {
    res.render('new_resource', {
        home: false,
        isStaff: isStaff(req),
        isEditor: isEditor(req),
        user: req?.user
    });
});

router.get('/:slug', async (req, res) => {
    req.session.returnTo = req.originalUrl;
    const results = await resourceSchema.findOne({ slug: req.params.slug });
    if (results === null) return res.redirect('/resources');
    res.render('resources/view', {
        home: false,
        isStaff: isStaff(req),
        isEditor: isEditor(req),
        user: req?.user,
        post: results
    });
});

router.post('/fetch', async (req, res) => {
    if (req.body.page) {
        const page = req.body.page;
        const results = await resourceSchema.find().skip(8 * page).limit(8).sort({ '_id': -1 });
        res.send({ "results": results, "count": results.length });
    }
    if (req.body.category) {
        const category = req.body.category;
        if (req.body.category === 'all') {
            const results = await resourceSchema.find().limit(8).sort({ '_id': -1 });
            res.send({ "results": results });
        } else {
            const results = await resourceSchema.find({ categories: category }).limit(8).sort({ '_id': -1 });
            res.send({ "results": results });
        }
    }
});

router.post('/post', isWriter, async (req, res) => {
    let body = req.body.body;
    // Get out body HTML and find all img src
    const regex = /<img.*?src=['"](.*?)['"]/;
    const split = body.split(/<img.*?src=['"]/);
    // If we find at least one match
    if (split?.length > 1) {
        let foundURI = [];
        split.forEach(int => {
            // Make sure it's a case64 uri and add to our array
            if (int.startsWith('data:image/')) {
                const uri = int.split('"')[0]
                foundURI.push(uri)
            }
        });
        // If we have at least one uri in our array
        if (foundURI.length > 0) {
            let totalComplete = 0;
            foundURI.forEach(async uri => {
                // Upload all uris to imgur
                const imgur = new ImgurClient({ clientId: process.env.IMGUR_ID, clientSecret: process.env.IMGUR_SECRET });
                const split = uri.split(/data:image\/.*?;base64,/)[1]
                const imgurRes = await imgur.upload({
                    image: new Buffer.from(split, 'base64')
                }).catch(err => console.error(`There was a problem uploading an image to imgur: `, err));
                // Make sure we get a success response for each upload
                if (imgurRes.status === 200) {
                    // Replace all uris in our body HTML with the new imgur link
                    body = body.replace(uri, imgurRes.data.link);
                    // Once all uris are converted, we can save to the database
                    totalComplete++;
                    if (totalComplete === foundURI.length) saveToDatabase(body);
                } else {
                    // Fallback incase we can't upload to imgur, images will be saved to database as base64
                    saveToDatabase(body);
                }
            });
        } else {
            // If image sources are found but none contain a uri
            saveToDatabase(body);
        }
    } else {
        // If no images are found
        saveToDatabase(body);
    }

    async function saveToDatabase(body) {
        let error = false;
        // Use the first image in our body as the post banner, if no exist, use the default banner image
        if (regex.exec(body) !== null) {
            image = regex.exec(body)[1];
        } else {
            image = '/images/default_res_banner.png'
        }
        post = await resourceSchema.create({
            title: req.body.title,
            body: body,
            snippet: req.body.snippet,
            categories: req.body.categories,
            author: req.user.username,
            userId: req.user.userId,
            avatar: req.user.avatar,
            image: image,
            published: false
        }).catch(err => {
            console.log(err);
            error = true;
            return res.send({ "status": "error" })
        });
        if (!error) res.send({ "status": "ok", "slug": `${post.slug}` });
    }
});

router.post('/edit', isWriter, async (req, res) => {
    let body = req.body.body;
    // Get out body HTML and find all img src
    const regex = /<img.*?src=['"](.*?)['"]/;
    const split = body.split(/<img.*?src=['"]/);
    // If we find at least one match
    if (split?.length > 1) {
        let foundURI = [];
        split.forEach(int => {
            // Make sure it's a case64 uri and add to our array
            if (int.startsWith('data:image/')) {
                const uri = int.split('"')[0]
                foundURI.push(uri)
            }
        });
        // If we have at least one uri in our array
        if (foundURI.length > 0) {
            let totalComplete = 0;
            foundURI.forEach(async uri => {
                // Upload all uris to imgur
                const imgur = new ImgurClient({ clientId: process.env.IMGUR_ID, clientSecret: process.env.IMGUR_SECRET });
                const split = uri.split(/data:image\/.*?;base64,/)[1]
                const imgurRes = await imgur.upload({
                    image: new Buffer.from(split, 'base64')
                }).catch(err => console.error(`There was a problem uploading an image to imgur: `, err));
                // Make sure we get a success response for each upload
                if (imgurRes.status === 200) {
                    // Replace all uris in our body HTML with the new imgur link
                    body = body.replace(uri, imgurRes.data.link);
                    // Once all uris are converted, we can save to the database
                    totalComplete++;
                    if (totalComplete === foundURI.length) editDatabaseEntry(body);
                } else {
                    // Fallback incase we can't upload to imgur, images will be saved to database as base64
                    editDatabaseEntry(body);
                }
            });
        } else {
            // If image sources are found but none contain a uri
            editDatabaseEntry(body);
        }
    } else {
        // If no images are found
        editDatabaseEntry(body);
    }

    async function editDatabaseEntry(body) {
        let error = false;
        // Use the first image in our body as the post banner, if no exist, use the default banner image
        if (regex.exec(body) !== null) {
            image = regex.exec(body)[1];
        } else {
            image = '/images/default_res_banner.png'
        }
        console.log(req.body.categories);
        await resourceSchema.findOneAndUpdate({
            _id: req.body.id
        }, {
            title: req.body.title,
            body: body,
            categories: req.body.categories,
            image: image,
            snippet: req.body.snippet,
            edited: Date.now(),
            slug: slugify(req.body.title, { lower: true, strict: true })
        }, {
            upsert: true
        }).catch(err => {
            console.log(err);
            error = true;
            return res.send({ "status": "error" })
        });
        if (!error) res.send({ "status": "ok", "slug": `${slugify(req.body.title, { lower: true, strict: true })}` });
    }
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
    await fetch(`https://discord.com/api/v9/channels/1012065026451963915/webhooks`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
        webhook = await response.json();
        // Send webhook
        const body = {
            content: `[${req.body.title}](${req.body.url})`
        };
        await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}/${webhook.token}`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
            // Delete webhook
            await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}`, { method: 'DELETE', headers: headers });
        });
    });
});

router.post('/comment', async (req, res) => {
    if (req.body.id) {
        try {
            const results = await resourceSchema.find({ _id: req.body.id });
            for (const data of results) {
                let comments = data.comments;
                comments.push({ username: req?.user?.username || 'Unknown', userId: req?.user?.userId || '', avatar: req?.user?.avatar || '', comment: req.body.comment, timestamp: Date.now() });
                await resourceSchema.updateOne({
                    _id: req.body.id
                }, {
                    comments: comments
                }, {
                    upsert: true
                });
            }
        } catch (err) {
            console.log(err);
            res.send({ "status": "error" });
        } finally {
            res.send({ "status": "ok" });
        }
    } else {
        try {
            const results = await suggestionSchema.find();
            for (const data of results) {
                let suggestions = data.suggestions;
                suggestions.push({ username: req?.user?.username || 'Unknown', userId: req?.user?.userId || '', avatar: req?.user?.avatar || '', suggestion: req.body.suggestion, timestamp: Date.now() });
                console.log(data._id);
                await suggestionSchema.updateOne({
                    _id: data._id
                }, {
                    suggestions: suggestions
                }, {
                    upsert: true
                });
            }
        } catch (err) {
            console.log(err);
            res.send({ "status": "error" });
        } finally {
            res.send({ "status": "ok" });
        }
    }
});

module.exports = router;