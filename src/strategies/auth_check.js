function isAuthortized(req, res, next) {
    if (req.user?.isStaff) {
        return next();
    } else {
        return res.redirect('/dashboard/guest');
    }
}

module.exports = {
    isAuthortized
}