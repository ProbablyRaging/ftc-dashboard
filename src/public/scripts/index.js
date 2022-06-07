// Loading spinner
if (top.location.pathname.split('/')[1] === 'logs' || top.location.pathname.split('/')[1] === 'leaderboards') {
    $(window).on('load', function () {
        setTimeout(() => {
            $('.spinner-div').removeClass('spinner');
            $('.content-body').removeClass('hidden');
        }, 500);
    });
} else {
    $('.spinner-div').removeClass('spinner');
    $('.content-body').removeClass('hidden');
}

// Navbar main show/hide
const navBar = document.getElementById("main-menu-visible");
const btnShowHideNav = document.getElementById("navbar-hide");
const navText = document.getElementsByClassName('nav-text');
const navTitle = document.getElementsByClassName('list-title');
const navLogo = document.getElementById("nav-logo");
const navTextOne = document.getElementById("nav-text-one");
const navTextTwo = document.getElementById("nav-text-two");
const listTitle = document.getElementsByClassName('list-title-div');

btnShowHideNav.onclick = function () {
    if (navBar.id === "main-menu-visible") {
        $(".list-title").hide(100);

        $(".nav-text").hide(100);

        $(".list-title-div").hide(100);

        $("#nav-logo").hide(100);
        $("#nav-text-one").hide(100);
        $("#nav-text-two").hide(100);

        $(".content-body").animate({
            marginLeft: 60
        }, 200);

        $(".nav-list").animate({
            width: 60
        }, 200);

        $("#main-menu-visible").animate({
            width: 60
        }, 200);

        $('#main-menu-visible').attr("id", "main-menu-hidden");
    } else {
        setTimeout(() => {
            $(".list-title").show(100);

            $(".nav-text").show(100);

            $(".list-title-div").show(100);

            $("#nav-logo").show(100);
            $("#nav-text-one").show(100);
            $("#nav-text-two").show(100);
        }, 200);

        $(".content-body").animate({
            marginLeft: 300
        }, 200);

        $(".nav-list").animate({
            width: 300
        }, 200);

        $("#main-menu-hidden").animate({
            width: 300
        }, 200);

        $('#main-menu-hidden').attr("id", "main-menu-visible");
    }
};

// Navbar group show/hide
const btnGroupOne = document.getElementById('group-one-visible');
const btnGroupTwo = document.getElementById('group-two-visible');
const btnGroupThree = document.getElementById('group-three-visible');
const btnGroupFour = document.getElementById('group-four-visible');
const btnGroupFive = document.getElementById('group-five-visible');

if (btnGroupOne) {
    btnGroupOne.onclick = function () {
        if (btnGroupOne.id === "group-one-visible") {
            $(".group-one").slideUp(150);

            $("#collapse-one").addClass('rotated');

            $("#group-one-visible").attr("id", "group-one-hidden");
        } else {
            $(".group-one").slideDown(150);

            $("#collapse-one").removeClass('rotated');

            $("#group-one-hidden").attr("id", "group-one-visible");
        }
    }
}
if (btnGroupTwo) {
    btnGroupTwo.onclick = function () {
        if (btnGroupTwo.id === "group-two-visible") {
            $(".group-two").slideUp(150);

            $("#collapse-two").addClass('rotated');

            $("#group-two-visible").attr("id", "group-two-hidden");
        } else {
            $(".group-two").slideDown(150);

            $("#collapse-two").removeClass('rotated');

            $("#group-two-hidden").attr("id", "group-two-visible");
        }
    }
}
if (btnGroupThree) {
    btnGroupThree.onclick = function () {
        if (btnGroupThree.id === "group-three-visible") {
            $(".group-three").slideUp(150);

            $("#collapse-three").addClass('rotated');

            $("#group-three-visible").attr("id", "group-three-hidden");
        } else {
            $(".group-three").slideDown(150);

            $("#collapse-three").removeClass('rotated');

            $("#group-three-hidden").attr("id", "group-three-visible");
        }
    }
}
if (btnGroupFour) {
    btnGroupFour.onclick = function () {
        if (btnGroupFour.id === "group-four-visible") {
            $(".group-four").slideUp(150);

            $("#collapse-four").addClass('rotated');

            $("#group-four-visible").attr("id", "group-four-hidden");
        } else {
            $(".group-four").slideDown(150);

            $("#collapse-four").removeClass('rotated');

            $("#group-four-hidden").attr("id", "group-four-visible");
        }
    }
}
if (btnGroupFive) {
    btnGroupFive.onclick = function () {
        if (btnGroupFive.id === "group-five-visible") {
            $(".group-five").slideUp(150);

            $("#collapse-five").addClass('rotated');

            $("#group-five-visible").attr("id", "group-five-hidden");
        } else {
            $(".group-five").slideDown(150);

            $("#collapse-five").removeClass('rotated');

            $("#group-five-hidden").attr("id", "group-five-visible");
        }
    }
}

// Topbar profile dropdown
const profileDropdownMenu = document.getElementById('dropdown-menu');

document.body.addEventListener('click', () => {
    setTimeout(() => {
        if (profileDropdownMenu.className === 'dropdown-menu show') {
            $("#profile-dropdown-chevron").addClass('rotated');
        } else {
            $("#profile-dropdown-chevron").removeClass('rotated');
        }
    }, 10);
});

/**
 * CREATOR CREW
 */
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
            $('.modal-backdrop').fadeIn(300).addClass('show')
            $("#logInModal").fadeIn(800).addClass('show').css({ 'display': 'block' }).attr({ 'aria-modal': 'true', 'role': 'dialog' });

            isUserGoogleAuthed = false;
        } else {
            isUserGoogleAuthed = true;
        }
    } else {
        // If user doesn't have an access token, present them with a sign in modal
        $('body').addClass('modal-open show').css({ 'overflow': 'hidden', 'padding-right': '0px' }).attr({ 'data-bs-overflow': 'hidden', 'data-bs-padding-right': '0px' });
        $('body').append('<div class="modal-backdrop fade"></div>');
        $('.modal-backdrop').fadeIn(300).addClass('show')
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

        // If the player state is 1=PLAYING
        if (event.data === 1) {
            // When initially starting the video, we seek to the beginning
            if (!watchTimeLogs.has(videoId) && !completedVideos.has(videoId)) event.target.seekTo(0.01);

            // Change border and status indicator
            watchStatus.style.color = "#ffb770fe";
            playerBorder.style.borderColor = "#ffb770fe";

            // If the videoId isn't in our map, we add it and start an interval to keep checking the video status
            if (!watchTimeLogs.has(videoId)) {
                watchTimeLogs.set(videoId, currentWatchTime);

                log = setInterval(() => {
                    checkVideoStatus(event, videoId);
                }, 5000);
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

// Periodically check the status of the video
function checkVideoStatus(event, videoId) {
    const currentWatchTime = event.target.getCurrentTime();
    const totalDuration = event.target.getDuration();
    const watchStatus = document.getElementById(`${videoId}-watch-status`);
    const playerBorder = document.getElementById(`${videoId}`);

    // Make sure our map contains the videoId
    if (watchTimeLogs.has(videoId)) {
        // Check if a video has been skipped/seeked
        if (watchTimeLogs.get(videoId) + 6 < currentWatchTime) {
            watchStatus.style.color = "#ff7070fe";
            playerBorder.style.borderColor = "#ff7070fe";
            // Notify staff that a video was skipped
            if (!detectedSkips.has(videoId)) {
                $.post({
                    url: `/creatorcrew/notify`,
                    type: 'POST',
                    headers: { "Content-Type": "application/json" },
                    dataType: 'json',
                    data: JSON.stringify({ "videoId": `${videoId}` })
                });
            }
            // Log if a video was skipped
            detectedSkips.set(videoId)
        }

        // If a video has been skipped
        if (detectedSkips.has(videoId)) {
            watchStatus.style.color = "#ff7070fe";
            playerBorder.style.borderColor = "#ff7070fe";
        }

        // Update our map
        watchTimeLogs.set(videoId, currentWatchTime);

        // If video is completed but not liked
        if (!videoLiked.has(videoId) && (currentWatchTime >= 600 || currentWatchTime + 4 >= totalDuration)) {
            watchStatus.style.color = "#87cbffcc";
            playerBorder.style.borderColor = "#87cbffcc";
        }

        // If the minimum watch time is complete
        if (!detectedSkips.has(videoId) && videoLiked.has(videoId) && (currentWatchTime >= 600 || currentWatchTime + 4 >= totalDuration)) {
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
            watchTimeLogs.delete(videoId);
            completedVideos.set(videoId);
        }
    }
}

// When the like button below a video is clicked
function likeButton(videoId) {
    const videoLikeButton = document.getElementById(`${videoId}-like-button`);

    // Add video to the liked videos map
    videoLiked.set(videoId);

    // Check if the user has logged in via YouTube and has an access token
    if (isUserGoogleAuthed) {
        videoLikeButton.classList.remove('unliked');
        videoLikeButton.classList.add('liked');

        // Send a POST to Google's API rate route
        $.post({
            url: '/api/like-video',
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": videoId, "discordId": '<%= userId %>' })
        });

        const toast = new bootstrap.Toast(successToast);
        toast.show();
    } else {
        const toast = new bootstrap.Toast(toastError);
        toast.show();
    }

    // If a video is liked when it's watch time is already completed
    if (completedVideos.has(videoId)) {
        // Send a POST to remove the video from the user's video list
        $.post({
            url: `/creatorcrew/completed`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "videoId": `${videoId}` })
        });
    }
}

// Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Live Toasts
const toastTrigger = document.getElementById('liveToastBtn');
const toastSuccess = document.getElementById('liveToast');
const toastError = document.getElementById('toastError');

if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastSuccess);
        toast.show();
    });
}

// Pagination
function navigateDownPagination() {
    const pageNumber = window.location.href.split('?page=');
    if (pageNumber[1] <= '1') return window.location.href = `${pageNumber[0]}`;
    if (!pageNumber[1]) {
        // window.location.href = `${pageNumber[0]}?page=1`;
        return;
    } else {
        window.location.href = `${pageNumber[0]}?page=${parseInt(pageNumber[1]) - 1}`;
    }
}

function navigateUpPagination() {
    const pageNumber = window.location.href.split('?page=');
    if (!pageNumber[1]) {
        window.location.href = `${pageNumber[0]}?page=2`;
    } else {
        window.location.href = `${pageNumber[0]}?page=${parseInt(pageNumber[1]) + 1}`;
    }
}

// Update rule in database
function updateRuleInDatabase() {
    setTimeout(() => {
        const thisVal = document.getElementById('rule-selector').value;
        if (!thisVal) return;
        const thisText = document.getElementById('rule-selector').options[thisVal].text.split('- ');
        document.getElementById('rule-input').value = thisText[1];
    }, 1000);
}

// Delay submit for toast
if (top.location.pathname.split('/')[1] === 'rules') {
    const getForm = document.getElementById('rule-form');
    getForm.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
        event.preventDefault();
        submitTimer = setTimeout(() => {
            this.submit();
        }, 2000)
    };
}

// Apply toast
if (top.location.pathname.split('/')[1] === 'apply') {
    const staffForm = document.getElementById('staff-form');
    staffForm.addEventListener('submit', handleSubmit);

    function handleSubmit(event) {
        event.preventDefault();
        submitTimer = setTimeout(() => {
            this.submit();
        }, 2000)
    };
}

const toastTrigger2 = document.getElementById('liveToastBtn');
const toastLiveExample2 = document.getElementById('liveToast');

if (toastTrigger2) {
    toastTrigger2.addEventListener('click', () => {
        const toast2 = new bootstrap.Toast(toastLiveExample2);
        toast2.show();
    });
}