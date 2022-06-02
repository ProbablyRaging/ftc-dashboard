function isAuthortized(req, res, next) {
    if (req.user) {
        if (req.user?.isStaff) {
            return next();
        } else {
            return res.redirect('/dashboard/guest');
        }
    } else {
        res.redirect('/');
    }

}

module.exports = {
    isAuthortized
}