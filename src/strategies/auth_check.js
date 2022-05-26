function isAuthortized(req, res, next) {
    if (req.user.isStaff) {
        return next();
    } else {
        return res.redirect('/apply');
    }
}

module.exports = {
    isAuthortized
}