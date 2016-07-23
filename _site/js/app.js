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
    init: function (t, m, i) {
        $(t).click(function () {
            $(m).toggle();
            if ($(m).css('display') != 'none') {
                $(i).removeClass('fa-share').addClass('fa-close');
            } else {
                $(i).removeClass('fa-close').addClass('fa-share');
            }
        });
    },

    init_scrim: function (t, m, s, c) {
        $(t).click(function () {
            $(s).show();
            $(m).css('display', 'flex');
        });

        $(c).click(function () {
            $(s).hide();
            $(m).css('display', 'none');
        });

        $(s).click(function () {
            $(s).hide();
            $(m).css('display', 'none');
        });
    }
};

var showButton = {
    init: function (button, element) {
        var btn = button;
        var elem = element;
        $(document).scroll(function(){
            if ($(elem).visible(true)) {
                $(btn).css('display', 'none');
            } else {
                $(btn).css('display', 'initial');
            }
        });
    }
}


$(document).ready(function () {
    $('.navbar-top.fixed').hide();
    toggleMenu.init('#share-menu-trigger', '.share-menu', '#share-btn');
    toggleMenu.init_scrim('#contents-menu-trigger', '.contents-menu', '.contents-menu-scrim', '#contents-menu-close');
    toggleMenu.init('#share-menu-trigger-fixed', '.share-menu', '#share-btn');
    toggleMenu.init_scrim('#contents-menu-trigger-fixed', '.contents-menu', '.contents-menu-scrim', '#contents-menu-close');
    debounce(toggleNavBar.init('.navbar-top.fixed', '.homepage'), 200, top);
    debounce(showButton.init('#to-top', '.homepage'), 200, false);
});
