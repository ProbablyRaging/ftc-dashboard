require('dotenv').config();
const router = require('express').Router();
const mongo = require('../../database/mongodb');
const staffApplicationSchema = require('../../schema/logs/staff_applications_schema');
const fetch = require('node-fetch');
const { isAuthortized, isStaff } = require('../../strategies/auth_check');

// TODO: Check if user is in the server
//       If user isn't staff, redirect them to apply
//       Maybe apply has a login button?

// Apply root GET
router.get('/', async (req, res) => {
    if (req.user) {
        res.render('apply', {
            isStaff: isStaff(req),
            admincp: false,
            useStaffNavbar: req.user.isStaff,
            username: `${req.user.username}#${req.user.discriminator}`,
            userId: req.user.userId,
            avatar: req.user.avatar
        });
    } else {
        res.redirect('/');
    }
});

// Apply root POST
router.post('/', async (req, res) => {
    if (req.body && req.body.username && req.body.age && req.body.region && req.body.about) {
        // Create webhook
        const headers = { "Content-Type": "application/json", "Authorization": process.env.API_TOKEN };
        const body = { name: `4DC`, avatar: process.env.BOT_IMG_URI };
        let webhook;
        await fetch(`https://discord.com/api/v9/channels/${process.env.STAFF_CHANNEL}/webhooks`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
            webhook = await response.json();
            // Send webhook
            const body = {
                content: `<@&${process.env.AUTH_ROLE_ID}>
There is a new staff application, [click here](<https://www.forthecontent.xyz/applications>) to view it` };
            await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}/${webhook.token}`, { method: 'POST', body: JSON.stringify(body), headers: headers }).then(async response => {
                // Delete webhook
                await fetch(`https://discord.com/api/v9/webhooks/${webhook.id}`, { method: 'DELETE', headers: headers });
            });
        });

        // Log application to database
        await staffApplicationSchema.create({
            userId: req.user.userId,
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: req.user.avatar,
            age: req.body.age,
            region: req.body.region,
            about: req.body.about,
            duration: req.body.duration,
            q1: req.body.q1,
            q2: req.body.q2,
            q3: req.body.q3,
            q4: req.body.q4,
            q5: req.body.q5,
            q6: req.body.q6,
            q7: req.body.q7,
            q8: req.body.q8,
            q9: req.body.q9,
            q10: req.body.q10,
            q11: req.body.q11,
            q12: req.body.q12,
            q13: req.body.q13,
            timestamp: new Date().valueOf()
        });
        res.send({ "status": "ok" });
    } else {
        res.send({ "status": "fail" });
    }
});

module.exports = router;