function isAuthortized(req, res, next) {
    if (req.user) {
        if (req.user?.isStaff) {
            return next();
        } else {
            return res.redirect('/dashboard');
        }
    } else {
        res.redirect('/');
    }
}

function isStaff(req) {
    if (req?.user?.isStaff) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isAuthortized,
    isStaff
}