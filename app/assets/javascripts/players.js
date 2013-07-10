$(document).ready(function (){
    $('#container').on("click", "#new_player_btn", player_form_show);
    $('#container').on("click", "#player_cancel_btn", player_form_hide);
    $('#container').on("submit", "#player-dialog-form", send_player_form);

});

function player_form_show(event){
    event.preventDefault();
    event.stopPropagation();

    //$('.create_form_player').show();
    var form = $("#player-dialog-form");

    form.dialog({
        //autoOpen: false,
        //dialogClass: 'nopjax',
        //draggable: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {

        }
    });

    form.dialog('open');

    form.dialog("widget").find(".ui-dialog-titlebar-close").hide();   // hide the close button

    //$('body:not(#player-dialog-form)').fadeTo('2000', 0.6);

}

function player_form_hide(event){
    event.preventDefault();
    event.stopPropagation();
    $("#player-dialog-form").hide();
    console.log('hi');
    alert('hi');
}

function send_player_form(event){
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: 'add_new_player',
        data: {},
        dataType: "JSON",
        success: function(data) {

        }
    });

}