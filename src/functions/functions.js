function convertTimestampToRelativeTime(dateToConvert) {
    const msPerMinute = 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const myDate = new Date();
    const nowDate = myDate.setSeconds(myDate.getSeconds() + 1).toString().slice(0, 10);
    const elapsed = nowDate - dateToConvert.toString().slice(0, 10);
    if (elapsed < msPerMinute) {
        if (Math.round(elapsed / 1000) > 1) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else {
            return Math.round(elapsed / 1000) + ' second ago';
        }
    } else if (elapsed < msPerHour) {
        if (Math.round(elapsed / msPerMinute) > 1) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else {
            return Math.round(elapsed / msPerMinute) + ' minute ago';
        }
    } else if (elapsed < msPerDay) {
        if (Math.round(elapsed / msPerHour) > 1) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else {
            return Math.round(elapsed / msPerHour) + ' hour ago';
        }
    } else if (elapsed < msPerMonth) {
        if (Math.round(elapsed / msPerDay) > 3) {
            return ' >3 days ago';
        } else if (Math.round(elapsed / msPerDay) > 1) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else {
            return Math.round(elapsed / msPerDay) + ' day ago';
        }
    }
}

// Percentage Diff Calc
function perDiff(b, a) {
    if (a - b > 0) {
        return '<i class="fa-solid fa-caret-down metric-down"></i> -' + (100 * Math.abs((a - b) / a)).toString().slice(0, 4) + `% (-${a - b})`;
    } else {
        return '<i class="fa-solid fa-caret-up metric-up"></i> -' + (100 * Math.abs((a - b) / a)).toString().slice(0, 4) + `% (${a - b})`;
    }
}

module.exports = {
    convertTimestampToRelativeTime,
    perDiff
}