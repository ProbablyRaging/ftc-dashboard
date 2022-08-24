function isAuthortized(req, res, next) {
    if (req.user) {
        if (req.user?.isStaff) {
            return next();
        } else {
            return res.redirect('/');
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

function isWriter(req, res, next) {
    if (req.user) {
        if (req.user?.isStaff || req?.user?.roles.includes('1012098388361236630')) {
            return next();
        } else {
            return res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
}

function isEditor(req) {
    if (req.user?.isStaff || req?.user?.roles.includes('1012098388361236630')) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isAuthortized,
    isStaff,
    isWriter,
    isEditor
}