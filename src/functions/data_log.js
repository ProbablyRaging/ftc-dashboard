const dashboardUsers = require('../schema/misc/discord_user');

async function dataLog(req) {
    if (req?.user) {
        const results = await dashboardUsers.find({ userId: req.user.userId });

        if (results.length > 0) {
            for (const data of results) {
                const { dataLog } = data;

                dataLog.push({ path: req.originalUrl, ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, headers: req.headers, timestamp: new Date().valueOf() })

                await dashboardUsers.findOneAndUpdate({
                    userId: req.user.userId
                }, {
                    dataLog: dataLog
                }, {
                    upsert: true
                })
            }
        }
    }
}

module.exports = {
    dataLog
}