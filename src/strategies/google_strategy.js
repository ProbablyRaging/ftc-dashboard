const GoogleStrategy = require("passport-google-oauth2").Strategy;
const googleUser = require("../schema/google_user");

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GAPI_ID,
        clientSecret: process.env.GAPI_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true
    },
        async (request, accessToken, refreshToken, profile, done) => {
            console.log(accessToken)
            // try {
            let existingUser = await googleUser.find({ discordId: request.user.userId });

            console.log(existingUser.length)

            if (existingUser.length > 0) {
                console.log('Existing user..')
                await googleUser.findOneAndUpdate({
                    discordId: request.user.userId
                }, {
                    accessToken: accessToken
                });

                return done(null, existingUser);
            }

            console.log(request.user.userId, profile.id, accessToken, refreshToken)

            const newUser = await googleUser.create({
                discordId: request.user.userId,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
            await newUser.save();
            return done(null, newUser);
            // } catch (error) {
            //     return done(error, false)
            // }
        }
    ));
}