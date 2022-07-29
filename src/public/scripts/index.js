// Theme
const switchState = document.getElementById('theme-switch');
const switchTitle = document.getAnimations('theme-switch-title');
const currentColorText = localStorage.getItem('customColor') || 'Blue';

// If theme is currently dark mode
if (currentTheme === 'dark') {
    // Change theme button state
    $('#theme-switch').addClass('dark').removeClass('light');
    $('.form-check-input').prop('checked', false);
    $('.theme-switch-title').text('Lights Off');
    $('.current-color').text(currentColorText);
} else {
    // Change theme button state
    $('#theme-switch').addClass('light').removeClass('dark');
    $('.form-check-input').prop('checked', true);
    $('.theme-switch-title').text('Lights On');
    $('.current-color').text(currentColorText);
}

function toggleTheme() {
    const customColor = localStorage.getItem('customColor');
    // Remove custom colors
    if (body.classList.length > 1) {
        body.classList.forEach(color => {
            if (color !== 'light' && color !== 'dark') {
                body.classList.remove(color);
            }
        });
    }
    if (switchState.classList.contains('light')) {
        // Change theme to dark
        body.classList.replace('light', 'dark');
        body.classList.add(customColor);
        $('#theme-switch').addClass('dark').removeClass('light');
        $('.theme-switch-title').text('Lights Off');
        localStorage.setItem('currentTheme', 'dark');
        createCharts();
    } else {
        // Change theme to light
        body.classList.replace('dark', 'light');
        body.classList.add(`${customColor}-nav`);
        $('#theme-switch').addClass('light').removeClass('dark');
        $('.theme-switch-title').text('Lights On');
        localStorage.setItem('currentTheme', 'light');
        createCharts();
    }
}

function colorPrev() {
    const colors = ['red', 'orange', 'purple', 'pink', 'green', 'blue'];
    let currentIndex = parseInt(localStorage.getItem('currentIndex'));

    if (switchState.classList.contains('light')) {
        // Get the current color
        let currentColor;
        body.classList.forEach(color => {
            if (color !== 'light' && color !== 'dark') {
                currentColor = color;
            }
        });
        // Decrement the index
        if (currentIndex <= 0) currentIndex = colors.length;
        currentIndex--;
        // Remove other color choices
        body.classList.remove(currentColor);
        body.classList.add(`${colors[currentIndex]}-nav`);
        localStorage.setItem('customColor', colors[currentIndex]);
        localStorage.setItem('currentIndex', currentIndex);
        $('.current-color').text(colors[currentIndex]);
    } else {
        // Get the current color
        let currentColor;
        body.classList.forEach(color => {
            if (color !== 'light' && color !== 'dark') {
                currentColor = color;
            }
        });
        // Decrement the index
        if (currentIndex <= 0) currentIndex = colors.length;
        currentIndex--;
        // Remove other color choices
        body.classList.remove(currentColor);
        body.classList.add(colors[currentIndex]);
        localStorage.setItem('customColor', colors[currentIndex]);
        localStorage.setItem('currentIndex', currentIndex);
        $('.current-color').text(colors[currentIndex]);
    }
}

function colorNext() {
    const colors = ['red', 'orange', 'purple', 'pink', 'green', 'blue'];
    let currentIndex = parseInt(localStorage.getItem('currentIndex'));

    if (switchState.classList.contains('light')) {
        // Get the current color
        let currentColor;
        body.classList.forEach(color => {
            if (color !== 'light' && color !== 'dark') {
                currentColor = color;
            }
        });
        // Increment the index
        if (currentIndex >= colors.length - 1) currentIndex = -1;
        currentIndex++;
        // Remove other color choices
        body.classList.remove(currentColor);
        body.classList.add(`${colors[currentIndex]}-nav`);
        localStorage.setItem('customColor', colors[currentIndex]);
        localStorage.setItem('currentIndex', currentIndex)
        $('.current-color').text(colors[currentIndex]);
    } else {
        // Get the current color
        let currentColor;
        body.classList.forEach(color => {
            if (color !== 'light' && color !== 'dark') {
                currentColor = color;
            }
        });
        // Increment the index
        if (currentIndex >= colors.length - 1) currentIndex = -1;
        currentIndex++;

        // Remove other color choices
        body.classList.remove(currentColor);
        body.classList.add(colors[currentIndex]);
        localStorage.setItem('customColor', colors[currentIndex]);
        localStorage.setItem('currentIndex', currentIndex)
        $('.current-color').text(colors[currentIndex]);
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

// Navbar active pill
$(function ($) {
    let url = window.location.href;
    $('li a').each(function () {
        if (this.href === url) {
            $(this).closest('a').addClass('active');
        }
    });
});

// Topbar menu button
$('.navbar-toggler.collapsed').click(function () {
    $('.nav-menu-icon').toggleClass('fa-bars');
    $('.nav-menu-icon').toggleClass('fa-bars-staggered');
});

// Topbar profile dropdown
// const profileDropdownMenu = document.getElementById('dropdown-menu');

// document.body.addEventListener('click', () => {
//     setTimeout(() => {
//         if (profileDropdownMenu.className === 'dropdown-menu show') {
//             $("#profile-dropdown-chevron").addClass('rotated');
//         } else {
//             $("#profile-dropdown-chevron").removeClass('rotated');
//         }
//     }, 10);
// });

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