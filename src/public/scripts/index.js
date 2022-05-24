// Navbar Animation
const navBar = document.getElementById("main-menu-visible");
const btnShowHideNav = document.getElementById("navbar-hide");
const navText = document.getElementsByClassName('nav-text');
const navTitle = document.getElementsByClassName('list-title');
const navLogo = document.getElementById("nav-logo");
const navTextOne = document.getElementById("nav-text-one");
const navTextTwo = document.getElementById("nav-text-two");
const listTitle = document.getElementsByClassName('list-title-div');
const btnCollapse = document.getElementsByClassName('fa-angle-down');

btnShowHideNav.onclick = function () {
    if (navBar.id === "main-menu-visible") {
        for (var i = 0; i < navTitle.length; i++) {
            navTitle[i].style.display = "none";
        };

        for (var i = 0; i < navText.length; i++) {
            navText[i].style.display = "none";
        };

        for (var i = 0; i < listTitle.length; i++) {
            listTitle[i].style.display = "none";
        };

        for (var i = 0; i < btnCollapse.length; i++) {
            btnCollapse[i].style.display = "none";
        };

        navLogo.style.display = "none";
        navTextOne.style.display = "none";
        navTextTwo.style.display = "none";

        $(".content-body").animate({
            marginLeft: 60
        }, 200);

        $("#main-menu-visible").animate({
            width: 60
        }, 200);

        $('#main-menu-visible').attr("id", "main-menu-hidden");
    } else {

        setTimeout(() => {
            for (var i = 0; i < navTitle.length; i++) {
                navTitle[i].style.display = "block";
            };

            for (var i = 0; i < navText.length; i++) {
                navText[i].style.display = "table-cell";
            };

            for (var i = 0; i < listTitle.length; i++) {
                listTitle[i].style.display = "flex";
            };

            for (var i = 0; i < btnCollapse.length; i++) {
                btnCollapse[i].style.display = "table-cell";
            };

            navLogo.style.display = "block";
            navTextOne.style.display = "block";
            navTextTwo.style.display = "block";
        }, 200);

        $(".content-body").animate({
            marginLeft: 220
        }, 200);

        $("#main-menu-hidden").animate({
            width: 220
        }, 200);

        $('#main-menu-hidden').attr("id", "main-menu-visible");
    }
};

// Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Live Toasts
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
if (toastTrigger) {
    toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample)

        toast.show()
    })
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
    const thisVal = document.getElementById('rule-selector').value
    if (!thisVal) return;
    const thisText = document.getElementById('rule-selector').options[thisVal].text.split('- ');
    document.getElementById('rule-input').value = thisText[1]
}