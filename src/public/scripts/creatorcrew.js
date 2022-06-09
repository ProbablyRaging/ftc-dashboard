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
    if (userHasToken === 'true') {
        const myDate = new Date();
        const nowDate = myDate.setSeconds(myDate.getSeconds() + 1);
        // Check if access token is expired and present a sign in modal if it is
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
        }
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
        const videoId = event.target.i.id;
        // Send a POST to check if user has previously liked the video
        $.post({
            url: `/api/video-status`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": `${videoId}` })
        }, function (data) {
            // If the video was previously liked, set the buttons class to 'liked'
            if (data.status === 'like') {
                const videoLikeButton = document.getElementById(`${videoId}-like-button`);
                videoLikeButton.classList.add('liked');
                // Add the video to the map
                videoLiked.set(videoId);
            }
        });
    }
    const videoId = event.target.i.id;
    const videoTitle = event.target.getVideoData().title.slice(0, 40) + '...';
    const setVideoTitle = document.getElementById(`${videoId}-video-title`);
    setVideoTitle.innerHTML = videoTitle;
    // Set the player volume to 0
    event.target.setVolume(0);
}

// When the player state changes (i.e. pause, play, etc..)
function onPlayerStateChange(event) {
    // Check if the user is signed in via Google
    if (isUserGoogleAuthed) {
        const videoId = event.target.i.id;
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
            const toast = new bootstrap.Toast(toastError);
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
    if (!detectedSkips.has(videoId) && !videoLiked.has(videoId) && (currentWatchTime >= 600 || currentWatchTime + 4 >= totalDuration)) {
        watchStatus.style.color = "#87cbffcc";
        playerBorder.style.borderColor = "#87cbffcc";
        videosPendingLike.set(videoId);
    }
    // If the minimum watch time is complete, the video has been liked and no skips were detected
    if (!detectedSkips.has(videoId) && !completedVideos.has(videoId) && videoLiked.has(videoId) && (currentWatchTime >= 600 || currentWatchTime + 4 >= totalDuration)) {
        watchStatus.style.color = "#70ffbafe";
        playerBorder.style.borderColor = "#70ffbafe";
        // Send a POST to remove the video from the user's video list
        $.post({
            url: `/creatorcrew/completed`,
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
        // Add video to the liked videos map
        videoLiked.set(videoId);
        videoLikeButton.classList.remove('unliked');
        videoLikeButton.classList.add('liked');
        // Send a POST to Google's API rate route
        $.post({
            url: '/api/like-video',
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": videoId })
        });
        const toast = new bootstrap.Toast(successToast);
        toast.show();
        // If a video is liked when it's watch time is already completed
        if (!detectedSkips.has(videoId) && completedVideos.has(videoId)) {
            watchStatus.style.color = "#70ffbafe";
            playerBorder.style.borderColor = "#70ffbafe";
            // Send a POST to remove the video from the user's video list
            $.post({
                url: `/creatorcrew/completed`,
                type: 'POST',
                headers: { "Content-Type": "application/json" },
                dataType: 'json',
                data: JSON.stringify({ "videoId": `${videoId}` })
            });
        }
    } else {
        const toast = new bootstrap.Toast(toastError);
        toast.show();
    }
}