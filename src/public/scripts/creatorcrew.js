const currentlyLoggedVideos = new Map();
const pausedBufferedVideoLog = new Map();
const totalTimePausedBuffered = new Map();
const videosPendingLike = new Map();
const videoLiked = new Map();
const completedVideos = new Map();
const detectedSkips = new Map();
const notifiedUser = new Map();

// For Creator Crew - check if user has an access token and is currently signed in
if (top.location.pathname.split('/')[1] === 'creatorcrew') {
    if (userHasToken === 'true' || isOwner === 'true') {
        const myDate = new Date();
        const nowDate = myDate.setSeconds(myDate.getSeconds() + 1);
        // Check if access token is expired and present a sign in modal if it is
        // if (isOwner != 'true') {
        if (userExpires <= nowDate) {
            $('.cc-videos').hide();
            $('.pagination-wrapper').hide();
            $('body').addClass('modal-open show').css({ 'overflow': 'hidden', 'padding-right': '0px' }).attr({ 'data-bs-overflow': 'hidden', 'data-bs-padding-right': '0px' });
            $('body').append('<div class="modal-backdrop fade"></div>');
            $('.modal-backdrop').fadeIn(300).addClass('show');
            $("#logInModal").fadeIn(800).addClass('show').css({ 'display': 'block' }).attr({ 'aria-modal': 'true', 'role': 'dialog' });
            isUserGoogleAuthed = false;
        } else {
            isUserGoogleAuthed = true;
            $('.btn-google-signout').css('display', 'block');
        }
        // }
    } else {
        // If user doesn't have an access token, present them with a sign in modal
        $('body').addClass('modal-open show').css({ 'overflow': 'hidden', 'padding-right': '0px' }).attr({ 'data-bs-overflow': 'hidden', 'data-bs-padding-right': '0px' });
        $('body').append('<div class="modal-backdrop fade"></div>');
        $('.modal-backdrop').fadeIn(300).addClass('show');
        $("#logInModal").fadeIn(800).addClass('show').css({ 'display': 'block' }).attr({ 'aria-modal': 'true', 'role': 'dialog' });
    }
}

// When the player is ready
function onPlayerReady(event) {
    if (isUserGoogleAuthed) {
        const videoId = event.target.getVideoData()['video_id'];
        const watchStatus = document.getElementById(`${videoId}-watch-status`);
        const playerBorder = document.getElementById(`${videoId}`);
        const setVideoTimer = document.getElementById(`${videoId}-watch-status`);
        // Send a POST to check if user has previously liked the video
        $.post({
            url: `/api/video-status`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": `${videoId}` })
        }, (data) => {
            // If the video was previously liked, set the buttons class to 'liked'
            if (data.status === 'like') {
                const videoLikeButton = document.getElementById(`${videoId}-like-button`);
                videoLikeButton.classList.remove('unliked');
                videoLikeButton.classList.add('liked');
                // Add the video to the map
                videoLiked.set(videoId);
            }
        });
        // Send a POST to check if the video is logged as already completed in the user's queue
        setTimeout(() => {
            $.post({
                url: `/creatorcrew/status`,
                type: 'POST',
                headers: { "Content-Type": "application/json" },
                dataType: 'json',
                data: JSON.stringify({ "videoId": `${videoId}` })
            }, (data) => {
                // If the video was previously liked, set the buttons class to 'liked'
                if (data.status === true) {
                    if (videoLiked.has(videoId)) {
                        watchStatus.style.color = "#70ffbafe";
                        playerBorder.style.borderColor = "#70ffbafe";
                        // Send a POST to remove the video from the user's video list
                        $.post({
                            url: `/creatorcrew/remove`,
                            type: 'POST',
                            headers: { "Content-Type": "application/json" },
                            dataType: 'json',
                            data: JSON.stringify({ "videoId": `${videoId}` })
                        });
                        // Remove the video from our log and mark it as completed
                        completedVideos.set(videoId);
                    } else {
                        watchStatus.style.color = "#87cbffcc";
                        playerBorder.style.borderColor = "#87cbffcc";
                        videosPendingLike.set(videoId);
                    }
                }
            });
        }, 2000);
    }
    const videoId = event.target.getVideoData()['video_id'];
    const videoTitle = event.target.getVideoData().title.slice(0, 40) + '...';
    const setVideoTitle = document.getElementById(`${videoId}-video-title`);
    const setVideoTimer = document.getElementById(`${videoId}-watch-status`);
    setVideoTitle.innerHTML = videoTitle;
    // Interval to display the current watch time and duration
    setInterval(() => {
        const currentWatchTime = event.target.getCurrentTime();
        const totalDuration = event.target.getDuration();
        let currentTimer;
        if (currentWatchTime >= 3600) {
            currentTimer = new Date(currentWatchTime * 1000).toISOString().substr(11, 8);
        } else {
            currentTimer = new Date(currentWatchTime * 1000).toISOString().substr(11, 8).slice(3, 8);
        }
        let totalTimer;
        if (totalDuration >= 3600) {
            totalTimer = new Date(totalDuration * 1000).toISOString().substr(11, 8);
        } else {
            totalTimer = new Date(totalDuration * 1000).toISOString().substr(11, 8).slice(3, 8);
        }
        setVideoTimer.innerHTML = ' ' + currentTimer + ' / ' + totalTimer;
    }, 1000);
    // Set the player volume to 0
    event.target.setVolume(0);
}

// When the player state changes (i.e. pause, play, etc..)
function onPlayerStateChange(event) {
    // Check if the user is signed in via Google
    if (isUserGoogleAuthed) {
        const videoId = event.target.getVideoData()['video_id'];
        const currentWatchTime = event.target.getCurrentTime();
        const watchStatus = document.getElementById(`${videoId}-watch-status`);
        const playerBorder = document.getElementById(`${videoId}`);
        if (event.data === 1 && !detectedSkips.has(videoId)) {
            // Change border and status indicator
            watchStatus.style.color = "#ffb770fe";
            playerBorder.style.borderColor = "#ffb770fe";
            // If a video is already in our map but isn't completed yet
            if (currentlyLoggedVideos.has(videoId) && !completedVideos.has(videoId)) {
                // If a video was recently paused or buffered, see how long it occurred for and subtract that from our expected time
                let timeSpentPausedBuffered
                if (pausedBufferedVideoLog.has(videoId)) {
                    timeSpentPausedBuffered = new Date().getTime() - pausedBufferedVideoLog.get(videoId);
                    totalTimePausedBuffered.set(videoId, timeSpentPausedBuffered);
                }
                // This gives us the millisecond difference since the video was initially played to when it was played again
                const timeSinceLastPlay = new Date().getTime() - currentlyLoggedVideos.get(videoId);
                const expectedCurrentTime = timeSinceLastPlay / 1000 - timeSpentPausedBuffered / 1000;
                // If the video's current watch time is greater then our expected watch time, we can assume the video was skipped forward
                // If the video has been skipped, we need to adjust the expected time afterwards
                if (!videosPendingLike.has(videoId) && currentWatchTime > expectedCurrentTime + 2) {
                    watchStatus.style.color = "#ff7070fe";
                    playerBorder.style.borderColor = "#ff7070fe";
                    // Notify staff that a video was skipped
                    if (!notifiedUser.get(userId) && !detectedSkips.has(videoId)) {
                        $.post({
                            url: `/creatorcrew/notify`,
                            type: 'POST',
                            headers: { "Content-Type": "application/json" },
                            dataType: 'json',
                            data: JSON.stringify({ "videoId": `${videoId}` })
                        });
                    }
                    // Add the video to our detected skips map so that is isn't logged any further
                    detectedSkips.set(videoId, true);
                    // Add this user to our notified map so we don't spam notification messages
                    notifiedUser.set(userId);
                }
            } else if (!completedVideos.has(videoId)) {
                // Add the video to our map and log the time that it was played
                currentlyLoggedVideos.set(videoId, new Date().getTime())
                // When initially starting the video, we seek to the beginning to compensate for videos that have watch time already
                if (!completedVideos.has(videoId)) {
                    event.target.seekTo(0.01); // This action emits event.data '3' followed by '1'
                }
                // Start interval for checking if video is completed
                // We can use an interval here because we don't need to check this strictly if the window isn't focused
                setInterval(() => {
                    checkVideoStatus(event, videoId);
                }, 5000);
            }
        }
        // If a video that is in our log is paused
        // For seeking, this is only emitted when using the mouse, regardless if you seek forward or backward, or how far you skip
        if (event.data === 2 && currentlyLoggedVideos.has(videoId) && !detectedSkips.has(videoId) && !completedVideos.has(videoId)) {
            // If the video has been paused or buffered previously
            if (pausedBufferedVideoLog.has(videoId)) {
                const totalTimeSpentPausedBuffered = totalTimePausedBuffered.get(videoId);
                pausedBufferedVideoLog.set(videoId, new Date().getTime() - totalTimeSpentPausedBuffered);
            } else {
                pausedBufferedVideoLog.set(videoId, new Date().getTime());
            }
        }
        // If a video that is in our log is buffered
        // This can sometimes be emitted when a video goes from paused to playing if buffering occurs, or from random buffering while playing
        // For seeking, this is always emitted when seeking with both the mouse and keyboard, regardless if you seek forward or backward, or how far you skip
        if (event.data === 3 && currentlyLoggedVideos.has(videoId) && !detectedSkips.has(videoId) && !completedVideos.has(videoId)) {
            // If the video has been paused or buffered previously
            if (pausedBufferedVideoLog.has(videoId)) {
                const totalTimeSpentPausedBuffered = totalTimePausedBuffered.get(videoId);
                pausedBufferedVideoLog.set(videoId, new Date().getTime() - totalTimeSpentPausedBuffered);
            } else {
                pausedBufferedVideoLog.set(videoId, new Date().getTime());
            }
        }
    } else {
        // If the user is not signed in via Google, stop playing the video and issue a toast
        if (event.data === 1) {
            event.target.seekTo(0.01);
            event.target.stopVideo();
            const toast = new bootstrap.Toast(errorToast);
            toast.show();
        }
    }
}

function checkVideoStatus(event, videoId) {
    const currentWatchTime = event.target.getCurrentTime();
    const totalDuration = event.target.getDuration();
    const watchStatus = document.getElementById(`${videoId}-watch-status`);
    const playerBorder = document.getElementById(`${videoId}`);
    // If video is completed but not liked, and no skips were detected
    if (!videosPendingLike.has(videoId) && !detectedSkips.has(videoId) && !videoLiked.has(videoId) && (currentWatchTime >= 600 || currentWatchTime + 4 >= totalDuration)) {
        watchStatus.style.color = "#87cbffcc";
        playerBorder.style.borderColor = "#87cbffcc";
        // Log this video's watch time as completed in the users queue
        $.post({
            url: `/creatorcrew/update`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": `${videoId}` })
        });
        videosPendingLike.set(videoId);
    }
    // If the minimum watch time is complete, the video has been liked and no skips were detected
    if (!detectedSkips.has(videoId) && !completedVideos.has(videoId) && videoLiked.has(videoId) && (currentWatchTime >= 600 || currentWatchTime + 4 >= totalDuration)) {
        watchStatus.style.color = "#70ffbafe";
        playerBorder.style.borderColor = "#70ffbafe";
        // Send a POST to remove the video from the user's video list
        $.post({
            url: `/creatorcrew/remove`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": `${videoId}` })
        });
        // Remove the video from our log and mark it as completed
        currentlyLoggedVideos.delete(videoId);
        completedVideos.set(videoId);
    }
}

// When the like button below a video is clicked
function likeButton(videoId) {
    const videoLikeButton = document.getElementById(`${videoId}-like-button`);
    const watchStatus = document.getElementById(`${videoId}-watch-status`);
    const playerBorder = document.getElementById(`${videoId}`);
    // Check if the user has logged in via YouTube and has an access token
    if (isUserGoogleAuthed) {
        // If user hasn't liked the video yet
        if (videoLikeButton.classList.contains('unliked')) {
            // Send a POST to Google's API rate route
            $.post({
                url: '/api/like-video',
                type: 'POST',
                headers: { "Content-Type": "application/json" },
                dataType: 'json',
                data: JSON.stringify({ "videoId": videoId })
            }, (data) => {
                // Check our response to see if the video was successfully liked or not. Failures could mean a user is not liked in, their access token expired, or they did now approve scopes
                if (data.status === 204) {
                    // Add video to the liked videos map
                    videoLiked.set(videoId);
                    $(`#${videoId}-like-button`).animate({
                        opacity: 0.6
                    }, 200);
                    setTimeout(() => {
                        $(`#${videoId}-like-button`).removeClass('unliked')
                        $(`#${videoId}-like-button`).addClass('liked')
                    }, 150);
                    $(`#${videoId}-like-button`).animate({
                        opacity: 1
                    }, 200);
                    // If a video is liked when it's watch time is already completed
                    if (!detectedSkips.has(videoId) && completedVideos.has(videoId)) {
                        watchStatus.style.color = "#70ffbafe";
                        playerBorder.style.borderColor = "#70ffbafe";
                        // Send a POST to remove the video from the user's video list
                        $.post({
                            url: `/creatorcrew/remove`,
                            type: 'POST',
                            headers: { "Content-Type": "application/json" },
                            dataType: 'json',
                            data: JSON.stringify({ "videoId": `${videoId}` })
                        });
                    }
                    // Show success toast
                    const toast = new bootstrap.Toast(successToast);
                    toast.show();
                } else if (data.status === 401) {
                    // Show error toast
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                } else {
                    const toast = new bootstrap.Toast(errorToast);
                    toast.show();
                }
            });
        } else {
            // If the user has already liked this video
            const toast = new bootstrap.Toast(cautionToast);
            toast.show();
        }
    } else {
        const toast = new bootstrap.Toast(errorToast);
        toast.show();
    }
}

function expandContractButton(videoId) {
    const expandVideo = document.getElementById(videoId);

    const expandVideoDiv = document.getElementById('expanded-video');
    const childrenInDivCount = expandVideoDiv.getElementsByTagName('*').length;

    if (!expandVideo.classList.contains('expanded')) {
        if (childrenInDivCount === 0) {
            $(`#${videoId}-video-wrapper`).prependTo($(".expanded-video"))
                .animate({
                    width: 1280,
                    height: 720,
                    maxWidth: '100%'
                }, 200);
            $(`#${videoId}-video-delete`).css({
                top: -690,
            });
            $(`#${videoId}`).toggleClass('expanded');
            $(`#${videoId}-expand-button`).toggleClass("fa-expand fa-compress");
            $('.expanded-video').append('<hr class="content-box-separator ex-sep">');
        }
    } else if (expandVideo.classList.contains('expanded')) {
        $(`#${videoId}-video-wrapper`).prependTo($(".cc-videos"))
            .css({
                width: 'unset',
                height: 'unset',
            });
        $(`#${videoId}-video-delete`).css({
            top: -220,
        });
        $(`#${videoId}`).toggleClass('expanded');
        $(`#${videoId}-expand-button`).toggleClass("fa-compress fa-expand");
        $(`.ex-sep`).remove()
    }
}

function removeVideoFromQueue(videoId) {
    // Send a POST to remove the video from the user's video list
    $.post({
        url: `/creatorcrew/remove`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json',
        data: JSON.stringify({ "videoId": `${videoId}` })
    }, (data) => {
        if (data.status === 'ok') {
            $(`#${videoId}-video-wrapper`).hide(200)
            const toast = new bootstrap.Toast(removedSuccessToast);
            toast.show();
        }
    });
}

function googleSignOut() {
    // Send a POST to sign out of Google
    $.post({
        url: `/google/signout`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json'
    }, (data) => {
        if (data.status === 'ok') {
            location.reload();
        }
    });
}