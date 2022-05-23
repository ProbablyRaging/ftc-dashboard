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