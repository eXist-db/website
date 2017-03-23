$(function () {

    $('.bxslider').bxSlider({
        mode:'horizontal',
        controls:false,
        auto:true,
        autoDelay:10000,
        pause:10000,
        autoHover:true,
        adaptiveHeight:true,
        randomStart:true
    });
    
    // $(window).on('load', function() {
    //     $('header .container').velocity({ 
    //         paddingTop : "20px",
    //         paddingBottom : "20px"
    //     }, {
    //         duration: 30,
    //     });
    // });
    // $(window).on('scroll load', function () {
    //     $('header .container').velocity("stop");
    //     $('navbar-brand').velocity("stop");
    //     $('.logo').velocity("stop");
    //     if ($(window).scrollTop() > 0) {

    //         $('banner').velocity({
    //           marginTop:"50px"
    //         });

    //         $('header .container').velocity({
    //             paddingTop: "0px",
    //             paddingBottom: "0px"
    //         }, {
    //             queue: false,
    //             duration: 300,
    //             easing:'easeOut'
    //         });
            

    //         $(".navbar-brand").velocity({
    //             width: "110px"
    //         }, {
    //             queue: false,
    //             easing:'easeOut'
    //         });

    //         $(".logo").velocity({
    //             marginTop: "-1px"
    //         }, {
    //             queue: false,
    //             easing:'easeOut'
    //         });
    //     }
    //     else {

    //         $('header .container').velocity({
    //             paddingTop: "30px",
    //             paddingBottom: "30px"
    //         }, {
    //             duration: 200,
    //             easing:'easeIn'
    //         });
            
    //         $('banner').velocity({
    //           marginTop:"112px"
    //         }, {
    //             queue: false
    //         });

    //         $(".navbar-brand").velocity({
    //             width: "150px"
    //         }, {
    //             queue: false,
    //             easing:'easeIn'
    //         });

    //         $(".logo").velocity({
    //             marginTop: "-8px"
    //         }, {queue: false,
    //             easing:'easeIn'
    //         });

    //     }
    // });



    $.get("news.xql", function (data) {
        console.log("news :", data, $(data));
        var news = data += "";
        $(".news").replaceWith(news);
        $(".news").fadeIn(1500);
    });

    var featureToggle = document.querySelector('.toggleFeatures .icon-more');
    if (featureToggle != null) {
        new svgIcon(featureToggle, svgIconConfig, {easing: mina.bounce});
    }
    var ltsToggle = document.querySelector('.toggleLTS .icon-more');
    if (ltsToggle != null) {
        new svgIcon(ltsToggle, svgIconConfig, {easing: mina.bounce});
    }


    $('.toggle-more').on('click', function (e) {
        toggleSlider($('.band-more'));
        $(this).toggleClass("closed");
        $('html, body').animate({scrollTop: $(".band-more").offset().top - 80}, 1000);
    });

    $('.toggle-lts').on('click', function (e) {
        toggleSlider($('.band-benefits'));
        toggleSlider($('.band-support'));
        $(this).toggleClass("closed");
        $('html, body').animate({scrollTop: $(".band-benefits").offset().top - 80, easing: 'easeOutExpo'}, 1000);

    });

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
        $('html, body').animate({scrollTop: $(imprint).offset().top - 80}, 1000);
        return false;
    });
});

/*
$('.logo').on('click', function (e) {
    $('html, body').animate({
        scrollTop: $("a[name='home']").offset().top - 100,
        easing: 'easeOutExpo'
    }, 1000);
    e.preventDefault();
});
*/

$('.downloadbtn').on('click', function (e) {
    $('html, body').animate({scrollTop: $("a[name='downloads']").offset().top - 80, easing: 'easeOutExpo'}, 1000);
    e.preventDefault();
});
$('a[href="#features"]').on('click', function (e) {
    $('html, body').animate({scrollTop: $("a[name='features']").offset().top - 80, easing: 'easeOutExpo'}, 1000);
    e.preventDefault();
});
$('a[href="#subscriptions"]').on('click', function (e) {
    $('html, body').animate({scrollTop: $("a[name='subscriptions']").offset().top - 80, easing: 'easeOutExpo'}, 1000);
    e.preventDefault();
});

var scrolltotop = {
    //startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
    //scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).
    setting: {startline: 100, scrollto: 0, scrollduration: 1000, fadeduration: [500, 100]},
    controlHTML: '<i class="fa fa-angle-up"></i>', //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
    controlattrs: {offsetx: 5, offsety: 5}, //offset of control relative to right/ bottom of window corner
    anchorkeyword: '#top', //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links

    state: {isvisible: false, shouldvisible: false},

    scrollup: function () {
        if (!this.cssfixedsupport) //if control is positioned using JavaScript
            this.$control.css({opacity: 0}) //hide control immediately after clicking it
        var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto)
        if (typeof dest == "string" && jQuery('#' + dest).length == 1) //check element set by string exists
            dest = jQuery('#' + dest).offset().top
        else
            dest = 0
        this.$body.animate({scrollTop: dest}, this.setting.scrollduration);
    },

    keepfixed: function () {
        var $window = jQuery(window)
        var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx
        var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety
        this.$control.css({left: controlx + 'px', top: controly + 'px'})
    },

    togglecontrol: function () {
        var scrolltop = jQuery(window).scrollTop()
        if (!this.cssfixedsupport)
            this.keepfixed()
        this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true : false
        if (this.state.shouldvisible && !this.state.isvisible) {
            this.$control.stop().animate({opacity: 1}, this.setting.fadeduration[0])
            this.state.isvisible = true
        }
        else if (this.state.shouldvisible == false && this.state.isvisible) {
            this.$control.stop().animate({opacity: 0}, this.setting.fadeduration[1])
            this.state.isvisible = false
        }
    },

    init: function () {
        jQuery(document).ready(function ($) {
            var mainobj = scrolltotop
            var iebrws = document.all
            mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest //not IE or IE7+ browsers in standards mode
            mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body')
            mainobj.$control = $('<div id="topcontrol">' + mainobj.controlHTML + '</div>')
                .css({
                    position: mainobj.cssfixedsupport ? 'fixed' : 'absolute',
                    bottom: mainobj.controlattrs.offsety,
                    right: mainobj.controlattrs.offsetx,
                    opacity: 0,
                    cursor: 'pointer'
                })
                .attr({title: 'Scroll Back to Top'})
                .click(function () {
                    mainobj.scrollup();
                    return false
                })
                .appendTo('body')
            if (document.all && !window.XMLHttpRequest && mainobj.$control.text() != '') //loose check for IE6 and below, plus whether control contains any text
                mainobj.$control.css({width: mainobj.$control.width()}) //IE6- seems to require an explicit width on a DIV containing text
            mainobj.togglecontrol()
            $('a[href="' + mainobj.anchorkeyword + '"]').click(function () {
                mainobj.scrollup()
                return false
            })
            $(window).bind('scroll resize', function (e) {
                mainobj.togglecontrol()
            })
        })
    }
}

scrolltotop.init()

function toggleSlider(toSlide) {
    console.log("toggled", toSlide);

    if (toSlide.hasClass('opened')) {
        /*toSlide.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e){
         console.log("laksdjflkj");
         $('.animated').addClass("closed");

         });*/
        toSlide.removeClass('opened');
        toSlide.removeClass('slideInLeft');
        toSlide.addClass('closed');
        toSlide.addClass('slideOutLeft');
    } else {
        toSlide.removeClass('closed');
        toSlide.removeClass('slideOutLeft');
        toSlide.addClass('slideInLeft');
        toSlide.addClass('opened');


    }
}


