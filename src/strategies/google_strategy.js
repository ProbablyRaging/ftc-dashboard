const GoogleStrategy = require("passport-google-oauth2").Strategy;
const req = require("express/lib/request");
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
                if (req.user) {
                    let existingUser = await googleUser.find({ discordId: request.user.userId });

                    const currentDate = new Date();
                    const futureDate = currentDate.setHours(currentDate.getHours() + 1)

                    if (existingUser.length > 0) {
                        await googleUser.findOneAndUpdate({
                            discordId: request.user.userId
                        }, {
                            accessToken: accessToken,
                            expires: futureDate
                        });

                        return done(null, existingUser);
                    }

                    const newUser = await googleUser.create({
                        discordId: request.user.userId,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expires: futureDate
                    });
                    await newUser.save();
                    return done(null, newUser);
                } else {
                    return done(null, null)
                }

            } catch (error) {
                return done(error, false)
            }
        }
    ));
}