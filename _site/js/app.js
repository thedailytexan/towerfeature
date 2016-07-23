'use strict';

// e: trigger, m: menu, t: icon

var toggleMenu = {
    init: function(e, m, t) {
        $(e).click(function() {
            $(m).toggle();
            if($(m).css('display') != 'none') {
                $(t).removeClass('fa-share').addClass('fa-close');
            } else {
                $(t).removeClass('fa-close').addClass('fa-share');
            }
        });
    }
};

var slideMenu = {
    init: function(e, m, t) {
        $(e).click(function() {
            $(m).menuSlideLeft(m);
        });
    }
};

var menuSlideLeft = function(menu) {
    $(menu);
};

$(document).ready(function(){
    toggleMenu.init('#share-menu-trigger', '.share-menu', '#share-btn');
    slideMenu.init('#contents-menu-trigger', '.contents-menu', '');
});