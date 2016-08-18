var undef;
var $ = jQuery = require('jquery');
window.$ = $;

// global vars
window.isMobile = false;
window.isTouch = 'ontouchstart' in document.documentElement; // TODO: use modernizer for that

window.ifInsideIFrame = function() {
    // return true;
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// dom ready
$(document).ready(function(){

    // set logo
    var hostname = window.location.hostname;
    hostname = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1); // extract domain name from host (crops subdomains like interaktiv.)
    $('body').addClass('host-'+hostname.split('.')[0]);
    $('#header a.logo').attr('href', 'http://'+hostname);

    // set up environnement
    if (window.ifInsideIFrame()){
        $('body').addClass('in-iframe');
        $('.standalone-only').remove();
    }else{
        $('.standalone-only').show();
    }

    if ($(window).width() < 800){
        window.isMedium = true;
        $('body').addClass('medium');
    }

    if ($(window).width() < 500){
        window.isMobile = true;
        $('body').addClass('mobile');
    }

    // init app
    window.app = new window.InteractiveApp();
    $('#wrapper').show().find(' > .content > .clearfix').append(window.app.$el);

    window.app.initRouter();

});
