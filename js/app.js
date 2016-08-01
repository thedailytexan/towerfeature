/* FIXME:
    - minify and closure compile JS
    - check FB/twitter share links
    - check links + baseurl + stories
 */


(function ($) {

    /**
     * Copyright 2012, Digital Fusion
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author Sam Sehnert
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */
    var $w = $(window);
    $.fn.visible = function (partial, hidden, direction) {

        if (this.length < 1)
            return;

        var $t = this.length > 1 ? this.eq(0) : this,
            t = $t.get(0),
            vpWidth = $w.width(),
            vpHeight = $w.height(),
            direction = (direction) ? direction : 'both',
            clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;

        if (typeof t.getBoundingClientRect === 'function') {

            // Use this native browser method, if available.
            var rec = t.getBoundingClientRect(),
                tViz = rec.top >= 0 && rec.top < vpHeight,
                bViz = rec.bottom > 0 && rec.bottom <= vpHeight,
                lViz = rec.left >= 0 && rec.left < vpWidth,
                rViz = rec.right > 0 && rec.right <= vpWidth,
                vVisible = partial ? tViz || bViz : tViz && bViz,
                hVisible = partial ? lViz || rViz : lViz && rViz;

            if (direction === 'both')
                return clientSize && vVisible && hVisible;
            else if (direction === 'vertical')
                return clientSize && vVisible;
            else if (direction === 'horizontal')
                return clientSize && hVisible;
        } else {

            var viewTop = $w.scrollTop(),
                viewBottom = viewTop + vpHeight,
                viewLeft = $w.scrollLeft(),
                viewRight = viewLeft + vpWidth,
                offset = $t.offset(),
                _top = offset.top,
                _bottom = _top + $t.height(),
                _left = offset.left,
                _right = _left + $t.width(),
                compareTop = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom,
                compareLeft = partial === true ? _right : _left,
                compareRight = partial === true ? _left : _right;

            if (direction === 'both')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if (direction === 'vertical')
                return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if (direction === 'horizontal')
                return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
        }
    };

})(jQuery);

'use strict';

// t: trigger, m: menu, i: icon, s: scrim, c: close

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var toggleNavBar = {
    init: function(navbar, element) {
        var nav = navbar;
        var elem = element;
        if (!elem){
            $(nav).hide();
        }
        $(document).scroll(function(){
            if ($(elem).visible(true)) {
                $(nav).hide();
            } else {
                $(nav).show();
            }
        });
    }
};

var toggleMenu = {
    init: function (toggle, menu, icon) {
        $(toggle).click(function () {
            $(menu).toggle();
            if ($(menu).css('display') != 'none') {
                $(icon).removeClass('fa-share').addClass('fa-close');
            } else {
                $(icon).removeClass('fa-close').addClass('fa-share');
            }
        });
    },

    init_scrim: function (toggle, menu, scrim, close) {
        var linkList = $(menu).children('a');
        $(toggle).click(function () {
            $(scrim).show();
            $(menu).css('display', 'flex');
            $('body').css('overflow', 'hidden');
        });

        $(close).click(function () {
            $(scrim).hide();
            $(menu).css('display', 'none');
            $('body').css('overflow', 'auto');
        });

        $(scrim).click(function () {
            $(scrim).hide();
            $(menu).css('display', 'none');
            $('body').css('overflow', 'auto');
        });

        $(linkList).each(function() {
            $(this).click(function() {
                $(scrim).hide();
                $(menu).css('display', 'none');
                $('body').css('overflow', 'auto');
            });
        });
    }
};

var topButton = {
    init: function (button, element) {
        var btn = button;
        var elem = element;

        if(elem){
            $(document).scroll(function(){
                if ($(elem).visible(true)) {
                    $(btn).css('display', 'none');
                } else {
                    $(btn).css('display', 'initial');
                }
            });
        } else {
            $(document).scroll(function(){
                if ($(window).scrollTop() == 0) {
                    $(btn).css('display', 'none')
                } else {
                    $(btn).css('display', 'initial');
                }
            })
        }

    },
    back_to_top: function(button) {
        $(button).click(function(){
            $("html, body").animate({ scrollTop: 0 }, "slow");
            return false;
        })
    }
};

var copyLinkButton = {
    init: function(button) {
        var clipboard = new Clipboard(button);

        clipboard.on('success', function(e) {
            $('#copy-alert-text').text('Link copied to clipboard!');
            setTimeout(function() {
                $('#copy-alert').show();
            }, 3000);

            e.clearSelection();
        });

        clipboard.on('error', function(e) {
            $('#copy-alert-text').text('Use Ctrl-C + Ctrl-V to copy link!');
            setTimeout(function() {
                $('#copy-alert').show();
            }, 3000);
        });

    }
};

var responsiveDOM = {
    init: function(navbar){
        if(window.innerWidth > 375) {
            $(navbar).remove();
        }
    },
    navbar: function(navbar){
        var nav = $(navbar)[0];
        $(document).resize(function(){
            if(window.innerWidth > 375) {
                $(navbar).remove();
            } else {
                $('.navbar-top.small').append(nav);
            }
        });
    }
};

$(document).ready(function () {
    $('.navbar-top.fixed').hide();

    //initialize lazy-loader
    new Blazy({
        selector: '.lazy, img'
    });

    // init wow
    new WOW().init({
        mobile: false
    });
    // menu toggles

    toggleMenu.init('#share-menu-trigger', '.share-menu', '#share-btn');
    toggleMenu.init_scrim('#contents-menu-trigger', '.contents-menu', '.contents-menu-scrim', '#contents-menu-close');
    toggleMenu.init('#share-menu-trigger-fixed', '.share-menu', '#share-btn-fixed');
    toggleMenu.init_scrim('#contents-menu-trigger-fixed', '.contents-menu', '.contents-menu-scrim', '#contents-menu-close');

    // responsive triggers

    toggleMenu.init('#share-menu-trigger-small', '.share-menu', '#share-btn-small');
    toggleMenu.init_scrim('#contents-menu-trigger-small', '.contents-menu', '.contents-menu-scrim', '#contents-menu-close');
    toggleMenu.init('#share-menu-trigger-fixed-small', '.share-menu', '#share-btn-small-fixed');
    toggleMenu.init_scrim('#contents-menu-trigger-fixed-small', '.contents-menu', '.contents-menu-scrim', '#contents-menu-close');
    debounce(toggleNavBar.init('.navbar-top.fixed', '.homepage'), 200, true);
    debounce(topButton.init('#to-top', '.homepage'), 200, true);
    topButton.back_to_top('#to-top');
    copyLinkButton.init('.copy-link-btn');

    // Responsive DOM manipulation
    responsiveDOM.init('.navbar-top.fixed.small');
    responsiveDOM.navbar('.navbar-top.fixed.small:not(".article")');
});
