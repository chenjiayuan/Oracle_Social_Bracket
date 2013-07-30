// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//

//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require jquery.pjax
//= require_tree .

$.xhrPool = [];
$.xhrPool.abortAll = function() { // our abort function
    $(this).each(function(idx, jqXHR) {
        jqXHR.abort();
    });
    $.xhrPool.length = 0
};
$(document).ready(function() {
    $(this).pjax('a:not(.nopjax)', '#container');
    $(this).on('pjax:timeout', function(event) {
        event.preventDefault();
    });
    $('#ajax_spinner').hide();
}).on('pjax:beforeSend', function(jqXHR) {
        $.xhrPool.push(jqXHR);
    }).on('pjax:error', function(jqXHR){
        $.xhrPool.abortAll();
    }).on('pjax:complete', function(jqXHR){
        var index = $.xhrPool.indexOf(jqXHR);
        if (index > -1) {
            $.xhrPool.splice(index, 1);
        }
    });
