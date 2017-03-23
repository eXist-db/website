$(function () {

    $('#imprint').on('click', function (e) {
        var imprint = $('.band-imprint');
        if (imprint.hasClass('closed')) {
            imprint.removeClass("slideOutRight");
            imprint.removeClass("closed");
            imprint.addClass("slideInRight");
            imprint.addClass("opened");
        } else {
            imprint.removeClass("slideInRight");
            imprint.removeClass("opened");
            imprint.addClass("slideOutRight");
            imprint.addClass("closed");
        }
        $('html, body').animate({ scrollTop: $(imprint).offset().top -80 }, "1000");
        return false;
    });
});