// Add zoom to resource images
$(document).ready(function () {
    $(".post-body-wrapper img").slice(1).get().map(function (i) {
        $(i).addClass('img-expandable');
    });
    // Enable comment submit button when text is input
    $('.res-comment-box').keyup(function () {
        const input = document.getElementById('res-comment-box').value;
        if (input.length > 0) {
            $('.res-comment-btn').prop('disabled', false);
            $('.res-comment-btn').css('color', 'var(--text-accent)');
        } else {
            $('.res-comment-btn').prop('disabled', true);
            $('.res-comment-btn').css('color', '#bebebe');
        }
    })
})
$(function () {
    $('.img-expandable').on('click', function () {
        $('.imagepreview').attr('src', $(this).attr('src'))
        $('#imagemodal').modal('show');
    });
});
// Send comment with enter key
$('.res-comment-box').keypress(function (e) {
    if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        $('.res-comment-btn').click();
    }
});

// New resource post submit
function submitPost() {
    const title = document.getElementById('resource-title').value;
    const snippet = document.getElementById('resource-snippet').value;
    const body = tinyMCE.activeEditor.getContent();
    // Get all checked categories
    let categories = [];
    $('.category-selector input:checked').each(function () {
        categories.push($(this).attr('value'));
    });
    // If missing required fiels
    if (title === '') {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('a title');
        return toast.show();
    }
    if (snippet === '') {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('a snippet');
        return toast.show();
    }
    if (snippet.length < 50) {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('a snippet that is longer than 50 characters');
        return toast.show();
    }
    if (body === '') {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('a body');
        return toast.show();
    }
    $('.post-submit').html('Please wait..').prop('disabled', true);
    // Post
    $.post({
        url: `/resources/post`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json',
        data: JSON.stringify({ "title": title, "body": body, "snippet": snippet, "categories": categories })
    }, (data) => {
        if (data.status === 'ok') {
            window.location = `/resources/${data.slug}`;
        } else if (data.status === 'error') {
            const toast = new bootstrap.Toast(unknownToast);
            toast.show();
            $('.post-submit').prop('disabled', false);
        }
    });
}

// Resource edit buttons
function makeEditable() {
    $('.post-edit').css('display', 'none');
    $('.post-save').css('display', 'block');
    $('.post-cancel').css('display', 'block');
    $('.post-body-wrapper').attr('id', 'editable').css('border', '1px solid #000');
    const currentTitle = document.getElementById('post-title').innerHTML;
    var input = $('<input />', {
        'name': 'resource-title',
        'id': 'resource-title',
        'class': 'res-input',
        'value': currentTitle
    });
    $('.post-title').replaceWith(input);
    $('#title-label').css('margin-top', '54px');
    $('#resource-snippet').css('display', 'block');
    $('#title-label').css('display', 'block');
    $('#snippet-label').css('display', 'block');
    $('#category-selector').css('display', 'block');
    $('#category-label').css('display', 'block');
    $('.post__info').css('display', 'none');
    $('.post-publish').css('display', 'none');
    $('.post-delete').css('display', 'none');
    $('.res-footer-div').css('display', 'none');
    $('.res-comment').css('display', 'none');
    $('.comment-section').css('display', 'none');

    tinymce.init({
        selector: "#editable",
        plugins: 'preview importcss searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons',
        editimage_cors_hosts: ['picsum.photos'],
        menubar: 'file edit view insert format tools table help',
        toolbar: 'undo redo | bold italic underline strikethrough | fontsize blocks | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | fullscreen preview | image media template link anchor codesample | outdent indent |  numlist bullist | pagebreak | charmap emoticons | ltr rtl',
        toolbar_sticky: true,
        toolbar_sticky_offset: 60,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_ask_before_unload: false,
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        importcss_append: true,
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        height: 600,
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image table'
    });
}
// Save edit
function saveEdit(id) {
    const title = document.getElementById('resource-title').value;
    const snippet = document.getElementById('resource-snippet').value;
    const body = tinyMCE.activeEditor.getContent();
    const image = $('.post-body-wrapper').find('img').attr('src');
    // Get all checked categories
    let categories = [];
    $('.category-selector input:checked').each(function () {
        categories.push($(this).attr('value'));
    });
    // If missing required fiels
    if (title === '') {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('title');
        return toast.show();
    }
    if (snippet === '') {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('snippet');
        return toast.show();
    }
    if (snippet.length < 50) {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('snippet that is longer than 50 characters');
        return toast.show();
    }
    if (body === '') {
        const toast = new bootstrap.Toast(titleToast);
        $('.error-type').text('body');
        return toast.show();
    }
    $('.post-save').html('Saving..').prop('disabled', true);
    $.post({
        url: `/resources/edit`,
        type: 'POST',
        headers: { "Content-Type": "application/json" },
        dataType: 'json',
        data: JSON.stringify({ "id": id, "title": title, "body": body, "image": image, "snippet": snippet, "categories": categories })
    }, (data) => {
        if (data.status === 'ok') {
            $('.post-body-wrapper').removeAttr('id', 'editable').css('border', 'none');
            window.location = `/resources/${data.slug}`;
        } else if (data.status === 'error') {
            const toast = new bootstrap.Toast(unknownToast);
            toast.show();
            $('.post-save').html('Save').prop('disabled', false);
        } else {
            const toast = new bootstrap.Toast(errorToast);
            toast.show();
            $('.post-save').html('Save').prop('disabled', false);
        }
    });
}
// Delete
function deletePost(id) {
    if (confirm('Are you sure you want to permanently delete this post?') === true) {
        $.post({
            url: `/resources/delete`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "id": id })
        }, (data) => {
            if (data.status === 'ok') {
                window.location = '/resources';
            } else if (data.status === 'error') {
                const toast = new bootstrap.Toast(unknownToast);
                toast.show();
            }
        });
    }
}
// Publish
function publishToDiscord(id, title, snippet, status) {
    if (status === 'true') {
        const toast = new bootstrap.Toast(publishedToast);
        return toast.show();
    }
    if (confirm('Are you sure you want to publish this resource to Discord?') === true) {
        $.post({
            url: `/resources/publish`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "url": window.location.href, "id": id, "title": title, "snippet": snippet })
        }, (data) => {
            if (data.status === 'ok') {
                $('.post-publish').prop('disabled', true);
                const toast = new bootstrap.Toast(publishToast);
                toast.show();
            } else {
                const toast = new bootstrap.Toast(unknownToast);
                toast.show();
            }
        });
    }
}

// Handle resource post comments
async function submitComment(id) {
    if (id) {
        const comment = document.getElementById('res-comment-box').value;
        if (comment === '') {
            const toast = new bootstrap.Toast(titleToast);
            $('.error-type').text('comment');
            return toast.show();
        }
        $('.res-comment-btn').prop('disabled', true);
        $.post({
            url: `/resources/comment`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "id": id, "comment": comment })
        }, (data) => {
            if (data.status === 'ok') {
                $('.res-comment').hide(250);
                $('.submit-success').show(250);
            } else {
                const toast = new bootstrap.Toast(errorToast);
                toast.show();
                $('.res-comment-btn').prop('disabled', false);
            }
        });
    } else {
        const suggestion = document.getElementById('res-comment-box').value;
        if (suggestion === '') {
            const toast = new bootstrap.Toast(titleToast);
            $('.error-type').text('suggestion');
            return toast.show();
        }
        $('.res-comment-btn').prop('disabled', true);
        $.post({
            url: `/resources/comment`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "suggestion": suggestion })
        }, (data) => {
            if (data.status === 'ok') {
                $('.res-comment').hide(250);
                $('.submit-success').show(250);
            } else {
                const toast = new bootstrap.Toast(errorToast);
                toast.show();
                $('.res-comment-btn').prop('disabled', false);
            }
        });
    }
}

// Resource pagination
let page = 1
function fetchMore(category) {
    if (!category) {
        $.post({
            url: `/resources/fetch`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "page": page })
        }, (data) => {
            page++;
            if (data.count < 8) $('.btn-load-more').prop('disabled', true).text('No more results');
            data.results.forEach(post => {
                $('.resource-wrapper').append(`
                <li class="col col--dense col--md-4 col--sm-6">
                <div class="slow-reveal" style="display: none;">
                <a href="/resources/${post.slug}" class="blog__item content__area">
                <div class="image-box">
                <div class="image-animation"> 
                <div class="image image--bg image--ratio-16x9 image--loaded" data-plugin="lazy-image" style="background-image: url('${post.image}');">
                <div class="image__cover"></div>
                <div class="post-gallery-item-in"></div>
                </div>
                </div>
                </div>
                <p class="blog__item__time h5">${new Date(post.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 class="blog__item__title">${post.title}</h3>
                <p class="blog__item__snippet">${post.snippet}..</p>
                </a>
                </div>
                </li>
                `);
            });
            $('.slow-reveal').fadeIn(250);
        });
    } else {
        $.post({
            url: `/resources/fetch`,
            type: 'POST',
            headers: { "Content-Type": "application/json" },
            dataType: 'json',
            data: JSON.stringify({ "category": category })
        }, (data) => {
            $('.col').each(() => {
                $('.col').hide();
            });
            if (data.results.length < 1) {
                $('.resource-wrapper').append(`
                <li class="col col--dense col--md-4 col--sm-6">
                    <div class="slow-reveal" style="display: none;">
                        <p style="color: #ccc">No results for ${category}</p>
                    </div>
                </li>
                `);
            }
            data.results.forEach(post => {
                $('.resource-wrapper').append(`
                <li class="col col--dense col--md-4 col--sm-6">
                <div class="slow-reveal" style="display: none;">
                <a href="/resources/${post.slug}" class="blog__item content__area">
                <div class="image-box">
                <div class="image-animation">    
                <div class="image image--bg image--ratio-16x9 image--loaded" data-plugin="lazy-image" style="background-image: url('${post.image}');">
                <div class="image__cover"></div>
                <div class="post-gallery-item-in"></div>
                </div>
                </div>
                </div>
                <p class="blog__item__time h5">${new Date(post.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 class="blog__item__title">${post.title}</h3>
                <p class="blog__item__snippet">${post.snippet}..</p>
                </a>
                </div>
                </li>
                `);
            });
            $('.slow-reveal').fadeIn(250);
        });
    }
}