// Theme
const switchState = document.getElementById('theme-switch');
const switchTitle = document.getAnimations('theme-switch-title');

// If theme is currently dark mode
if (currentTheme === 'dark') {
    // Change theme button state
    $('#theme-switch').addClass('dark').removeClass('light')
    $('.form-check-input').prop('checked', true);
    $('.theme-switch-title').text('Lights Off')
} else {
    // Change theme button state
    $('#theme-switch').addClass('light').removeClass('dark')
    $('.form-check-input').prop('checked', false);
    $('.theme-switch-title').text('Lights On')
}

function toggleTheme() {
    if (switchState.classList.contains('light')) {
       // Change theme to dark
        body.classList.replace('light', 'dark');
        $('#theme-switch').addClass('dark').removeClass('light')
        $('.theme-switch-title').text('Lights Off')
        localStorage.setItem('currentTheme', 'dark')
        createCharts()
    } else {
        // Change theme to light
        body.classList.replace('dark', 'light');
        $('#theme-switch').addClass('light').removeClass('dark')
        $('.theme-switch-title').text('Lights On')
        localStorage.setItem('currentTheme', 'light')
        createCharts()
    }
}

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

// Dashboard categories collapse
const boxOneBtn = document.getElementById('box-one');
const boxTwoBtn = document.getElementById('box-two');
const boxThreeBtn = document.getElementById('box-three');
const boxFourBtn = document.getElementById('box-four');
const boxFiveBtn = document.getElementById('box-five');

if (boxOneBtn) {
    boxOneBtn.onclick = function () {
        if (boxOneBtn.id === "box-one") {
            $("#separator-one").slideUp(150);
            $("#content-one").slideUp(150);
            $("#dash-collapse-one").addClass('rotated');
            $("#box-one").attr("id", "box-one-hidden");
        } else {
            $("#content-one").slideDown(150);
            $("#separator-one").slideDown(150);
            $("#dash-collapse-one").removeClass('rotated');
            $("#box-one-hidden").attr("id", "box-one");
        }
    }
}
if (boxTwoBtn) {
    boxTwoBtn.onclick = function () {
        if (boxTwoBtn.id === "box-two") {
            $("#separator-two").slideUp(150);
            $("#content-two").slideUp(150);
            $("#dash-collapse-two").addClass('rotated');
            $("#box-two").attr("id", "box-two-hidden");
        } else {
            $("#content-two").slideDown(150);
            $("#separator-two").slideDown(150);
            $("#dash-collapse-two").removeClass('rotated');
            $("#box-two-hidden").attr("id", "box-two");
        }
    }
}
if (boxThreeBtn) {
    boxThreeBtn.onclick = function () {
        if (boxThreeBtn.id === "box-three") {
            $("#separator-three").slideUp(150);
            $("#content-three").slideUp(150);
            $("#dash-collapse-three").addClass('rotated');
            $("#box-three").attr("id", "box-three-hidden");
        } else {
            $("#content-three").slideDown(150);
            $("#separator-three").slideDown(150);
            $("#dash-collapse-three").removeClass('rotated');
            $("#box-three-hidden").attr("id", "box-three");
        }
    }
}
if (boxFourBtn) {
    boxFourBtn.onclick = function () {
        if (boxFourBtn.id === "box-four") {
            $("#separator-four").slideUp(150);
            $("#content-four").slideUp(150);
            $("#dash-collapse-four").addClass('rotated');
            $("#box-four").attr("id", "box-four-hidden");
        } else {
            $("#content-four").slideDown(150);
            $("#separator-four").slideDown(150);
            $("#dash-collapse-four").removeClass('rotated');
            $("#box-four-hidden").attr("id", "box-four");
        }
    }
}
if (boxFiveBtn) {
    boxFiveBtn.onclick = function () {
        if (boxFiveBtn.id === "box-five") {
            $("#separator-five").slideUp(150);
            $("#content-five").slideUp(150);
            $("#dash-collapse-five").addClass('rotated');
            $("#box-five").attr("id", "box-five-hidden");
        } else {
            $("#content-five").slideDown(150);
            $("#separator-five").slideDown(150);
            $("#dash-collapse-five").removeClass('rotated');
            $("#box-five-hidden").attr("id", "box-five");
        }
    }
}

// Show hide top bar menu for smaller displays
const topbarMenuBtn = document.getElementById('topbar-menu-btn');
const dropdownNav = document.getElementById('dropdown-nav-hidden');

topbarMenuBtn.onclick = function () {
    if (dropdownNav.id === "dropdown-nav-hidden") {
        $('#profile-dropdown-chevron').hide(200);
        $('#dropdown-nav-hidden').slideDown(300);
        $("#dropdown-nav-hidden").attr("id", "dropdown-nav-visible");
        $('#topbar-menu-btn').removeClass('fa-bars');
        $('#topbar-menu-btn').addClass('fa-bars-staggered');
        setTimeout(() => {
            $('.inner-content').css({ height: '100vh' });
            $('.mb-4').css({ position: 'sticky' });
            window.scrollTo(0, 0);
        }, 200);
    } else {
        $('.mb-4').css({ position: 'fixed' });
        $('.inner-content').css({ height: 'unset' });
        $('#dropdown-nav-visible').slideUp(300);
        $("#dropdown-nav-visible").attr("id", "dropdown-nav-hidden");
        $('#topbar-menu-btn').removeClass('fa-bars-staggered');
        $('#topbar-menu-btn').addClass('fa-bars');
        $('#profile-dropdown-chevron').show(200);
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

// Submit staff application
function submitStaffApplication() {
    const username = document.getElementById('username-input').value;
    const age = document.getElementById('age-selector').value;
    const region = document.getElementById('region-input').value;
    const about = document.getElementById('about-input').value;

    $('.submit-btn').prop('disabled', true)

    $.post({
        url: `/apply`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json',
        data: JSON.stringify({
            "username": `${username}`,
            "age": `${age}`,
            "region": `${region}`,
            "about": `${about}`,
        })
    }, (data) => {
        if (data.status === 'ok') {
            // Show success toast
            const toast = new bootstrap.Toast(successToast);
            toast.show();

            // Hide the form and show the success div
            $('.app-form').hide(100);
            $('.app-success').show(100);

            // Reset form values
            document.getElementById('age-selector').value = '';
            document.getElementById('region-input').value = '';
            document.getElementById('about-input').value = '';
        } else if (data.status === 'fail') {
            // Show error toast
            const toast = new bootstrap.Toast(errorToast);
            toast.show();
        } else {
            const toast = new bootstrap.Toast(cautionToast);
            toast.show();
        }
    });

}

const toastTrigger2 = document.getElementById('liveToastBtn');
const toastLiveExample2 = document.getElementById('liveToast');

if (toastTrigger2) {
    toastTrigger2.addEventListener('click', () => {
        const toast2 = new bootstrap.Toast(toastLiveExample2);
        toast2.show();
    });
}

// Delete warnings
function deleteWarning(warnId) {
    // Send a POST to remove the warning from the database
    $.post({
        url: `/logs/warnings/remove`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json',
        data: JSON.stringify({ "warnId": `${warnId}` })
    }, (data) => {
        if (data.status === 'ok') {
            $(`.${warnId}-embed-wrapper`).hide(200)
            const toast = new bootstrap.Toast(removedSuccessToast);
            toast.show();
        }
    });
}

// Delete warnings
function deleteCCVideo(id) {
    // Send a POST to remove the warning from the database
    $.post({
        url: `/admincp/remove`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json',
        data: JSON.stringify({ "id": `${id}` })
    }, (data) => {
        if (data.status === 'ok') {
            $(`#${id}`).hide(200)
            const toast = new bootstrap.Toast(removedSuccessToast);
            toast.show();
        }
    });
}

// Table search for AdminCP
function ccqueueSearch() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("ccqueue-search");
    filter = input.value.toUpperCase();
    table = document.getElementById("ccqueue-table");
    tr = table.getElementsByTagName("tr")
    th = table.getElementsByTagName("th");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        for (var j = 0; j < th.length; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

// User search for AdminCP
function userSearch() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("acp-user-search");
    filter = input.value.toLowerCase();
    tables = document.getElementsByClassName("acp-user-table");
    div = document.getElementById('tgrid')
    for (i = 0; i < tables.length; i++) {
        table = div.getElementsByTagName('table')[i];
        table.style.display = "none";
        if (table.id.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
            table.style.display = "";
        }
    }
}