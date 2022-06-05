const GoogleStrategy = require("passport-google-oauth2").Strategy;
const googleUser = require("../schema/google_user");

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GAPI_ID,
        clientSecret: process.env.GAPI_SECRET,
        callbackURL: process.env.GAPI_CALLBACK,
        passReqToCallback: true
    },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await googleUser.find({ discordId: request.user.userId });

                if (existingUser.length > 0) {
                    await googleUser.findOneAndUpdate({
                        discordId: request.user.userId
                    }, {
                        accessToken: accessToken,
                        expires: new Date(currentDate.getTime() + 60 * 60000)
                    });

                    return done(null, existingUser);
                }

                const newUser = await googleUser.create({
                    discordId: request.user.userId,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expires: new Date(currentDate.getTime() + 60 * 60000)
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, false)
            }
        }
    ));
}