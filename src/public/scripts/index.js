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
    const duration = document.getElementById('length-selector').value;

    if (!age) {
        $('.age-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".age-title").offset().top
        }, 150);
        return;
    }

    if (!region) {
        $('.region-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".region-title").offset().top
        }, 150);
        return;
    }

    if (!about) {
        $('.about-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".about-title").offset().top
        }, 150);
        return;
    }

    if (!duration) {
        $('.length-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".length-title").offset().top
        }, 150);
        return;
    }

    // Maker sure a checkbox is selected from each category
    const q1 = $("input[name=q1]:checked").length;
    if (!q1) {
        $('.q1-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q1-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption1').checked) {
            q1Val = document.getElementById('checkOption1').value;
        } else if (document.getElementById('checkOption2').checked) {
            q1Val = document.getElementById('checkOption2').value;
        }
    }

    const q2 = $("input[name=q2]:checked").length;
    if (!q2) {
        $('.q2-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q2-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption3').checked) {
            q2Val = document.getElementById('checkOption3').value;
        } else if (document.getElementById('checkOption4').checked) {
            q2Val = document.getElementById('checkOption4').value;
        }
    }

    const q3 = $("input[name=q3]:checked").length;
    if (!q3) {
        $('.q3-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q3-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption5').checked) {
            q3Val = document.getElementById('checkOption5').value;
        } else if (document.getElementById('checkOption6').checked) {
            q3Val = document.getElementById('checkOption6').value;
        }
    }

    const q4 = $("input[name=q4]:checked").length;
    if (!q4) {
        $('.q4-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q4-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption7').checked) {
            q4Val = document.getElementById('checkOption7').value;
        } else if (document.getElementById('checkOption8').checked) {
            q4Val = document.getElementById('checkOption8').value;
        } else if (document.getElementById('checkOption9').checked) {
            q4Val = document.getElementById('checkOption9').value;
        } else if (document.getElementById('checkOption10').checked) {
            q4Val = document.getElementById('checkOption10').value;
        }
    }

    const q5 = $("input[name=q5]:checked").length;
    if (!q5) {
        $('.q5-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q5-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption11').checked) {
            q5Val = document.getElementById('checkOption11').value;
        } else if (document.getElementById('checkOption12').checked) {
            q5Val = document.getElementById('checkOption12').value;
        } else if (document.getElementById('checkOption13').checked) {
            q5Val = document.getElementById('checkOption13').value;
        } else if (document.getElementById('checkOption14').checked) {
            q5Val = document.getElementById('checkOption14').value;
        }
    }

    const q6 = $("input[name=q6]:checked").length;
    if (!q6) {
        $('.q6-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q6-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption15').checked) {
            q6Val = document.getElementById('checkOption15').value;
        } else if (document.getElementById('checkOption16').checked) {
            q6Val = document.getElementById('checkOption16').value;
        } else if (document.getElementById('checkOption17').checked) {
            q6Val = document.getElementById('checkOption17').value;
        } else if (document.getElementById('checkOption18').checked) {
            q6Val = document.getElementById('checkOption18').value;
        }
    }

    const q7 = $("input[name=q7]:checked").length;
    if (!q7) {
        $('.q7-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q7-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption19').checked) {
            q7Val = document.getElementById('checkOption19').value;
        } else if (document.getElementById('checkOption20').checked) {
            q7Val = document.getElementById('checkOption20').value;
        } else if (document.getElementById('checkOption21').checked) {
            q7Val = document.getElementById('checkOption21').value;
        } else if (document.getElementById('checkOption22').checked) {
            q7Val = document.getElementById('checkOption22').value;
        }
    }

    const q8 = $("input[name=q8]:checked").length;
    if (!q8) {
        $('.q8-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q8-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption23').checked) {
            q8Val = document.getElementById('checkOption23').value;
        } else if (document.getElementById('checkOption24').checked) {
            q8Val = document.getElementById('checkOption24').value;
        } else if (document.getElementById('checkOption25').checked) {
            q8Val = document.getElementById('checkOption25').value;
        } else if (document.getElementById('checkOption26').checked) {
            q8Val = document.getElementById('checkOption26').value;
        }
    }

    const q9 = $("input[name=q9]:checked").length;
    if (!q9) {
        $('.q9-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q9-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption27').checked) {
            q9Val = document.getElementById('checkOption27').value;
        } else if (document.getElementById('checkOption28').checked) {
            q9Val = document.getElementById('checkOption28').value;
        } else if (document.getElementById('checkOption29').checked) {
            q9Val = document.getElementById('checkOption29').value;
        } else if (document.getElementById('checkOption30').checked) {
            q9Val = document.getElementById('checkOption30').value;
        }
    }

    const q10 = $("input[name=q10]:checked").length;
    if (!q10) {
        $('.q10-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q10-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption31').checked) {
            q10Val = document.getElementById('checkOption31').value;
        } else if (document.getElementById('checkOption32').checked) {
            q10Val = document.getElementById('checkOption32').value;
        } else if (document.getElementById('checkOption33').checked) {
            q10Val = document.getElementById('checkOption33').value;
        } else if (document.getElementById('checkOption34').checked) {
            q10Val = document.getElementById('checkOption34').value;
        }
    }

    const q11 = $("input[name=q11]:checked").length;
    if (!q11) {
        $('.q11-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q11-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption35').checked) {
            q11Val = document.getElementById('checkOption35').value;
        } else if (document.getElementById('checkOption36').checked) {
            q11Val = document.getElementById('checkOption36').value;
        } else if (document.getElementById('checkOption37').checked) {
            q11Val = document.getElementById('checkOption37').value;
        } else if (document.getElementById('checkOption38').checked) {
            q11Val = document.getElementById('checkOption38').value;
        }
    }

    const q12 = $("input[name=q12]:checked").length;
    if (!q12) {
        $('.q12-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q12-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption39').checked) {
            q12Val = document.getElementById('checkOption39').value;
        } else if (document.getElementById('checkOption40').checked) {
            q12Val = document.getElementById('checkOption40').value;
        } else if (document.getElementById('checkOption41').checked) {
            q12Val = document.getElementById('checkOption41').value;
        } else if (document.getElementById('checkOption42').checked) {
            q12Val = document.getElementById('checkOption42').value;
        }
    }

    const q13 = $("input[name=q13]:checked").length;
    if (!q13) {
        $('.q13-title').css('color', '#fe6060');
        $('html, body').animate({
            scrollTop: $(".q13-title").offset().top
        }, 150);
        return;
    } else {
        if (document.getElementById('checkOption43').checked) {
            q13Val = document.getElementById('checkOption43').value;
        } else if (document.getElementById('checkOption44').checked) {
            q13Val = document.getElementById('checkOption44').value;
        } else if (document.getElementById('checkOption45').checked) {
            q13Val = document.getElementById('checkOption45').value;
        } else if (document.getElementById('checkOption46').checked) {
            q13Val = document.getElementById('checkOption46').value;
        }
    }

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
            "duration": `${duration}`,
            "q1": `${q1Val}`,
            "q2": `${q2Val}`,
            "q3": `${q3Val}`,
            "q4": `${q4Val}`,
            "q5": `${q5Val}`,
            "q6": `${q6Val}`,
            "q7": `${q7Val}`,
            "q8": `${q8Val}`,
            "q9": `${q9Val}`,
            "q10": `${q10Val}`,
            "q11": `${q11Val}`,
            "q12": `${q12Val}`,
            "q13": `${q13Val}`,
        })
    }, (data) => {
        if (data.status === 'ok') {
            // Show success toast
            const toast = new bootstrap.Toast(successToast);
            toast.show();

            // Hide the form and show the success div
            $('.app-form').hide(100);
            $('.app-success').show(100);
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

// Collapsible application
$(function () {
    $(".app-wrapper").click(function (event) {
        console.log('test')
        // event.stopPropagation();
        var $target = $(event.target);
        $target.closest(".app-wrapper").find('.app-body').slideToggle(150)
        $target.closest(".app-wrapper").find("i").toggleClass("fa-plus");
        $target.closest(".app-wrapper").find("i").toggleClass("fa-minus");
    });
});