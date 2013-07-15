$(document).ready(function (){
    $('#container').on("click", "#new_player_btn", player_form_show);
    //$('#container').on("click", "#player_cancel_btn", player_form_hide);
    //$('#container').on("submit", "#player-dialog-form", send_player_form);
    //$('#container').on("click", "#create_player_btn", create_player);

});

function player_form_show(event){
    event.preventDefault();
    event.stopPropagation();
    //$('body:not(#player-dialog-form)').fadeTo('2000', 0.6);

    //$('.create_form_player').show();
    var form = $("#player-dialog-form").dialog({
        autoOpen: false,
        modal: true,

        //dialogClass: 'nopjax',
        //draggable: false,
        height: 400,
        width: 350,

        buttons: {
            "Create Player": function() {

                send_player_form(event);
//                $.ajax({
//                    type: "POST",
//                    url: 'add_new_player'
//                });

                //addClass('create_player_btn');
                //alert('hi');
//                $('ui-button-text').click(function() {
//
//                });
            },

            Cancel: function() {

                $(this).dialog('close');
            }
        },

        close: function() {
            $('#player-dialog-form').find('input[type=text], input[type=email]').val("");
//            $('#player_first_name').attr('val', "");
//            $('#player_last_name').attr('val', "");
//            $('#player_email').attr('val', "");
//            $('#player_skill').attr('val', "");
            //console.log('hi');
            //$('body:not(#player-dialog-form)').fadeTo('2000', 1);
            form.dialog('close');
            $('.create_btn').show();
        }


    });

    form.dialog('open');

    form.dialog("widget").find(".ui-dialog-titlebar-close").hide();   // hide the close button



}

function player_form_hide(event){
    //event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    $("#player-dialog-form").hide();
    console.log('hi');
    alert('hi');

}

function send_player_form(event){
    event.preventDefault();



    $.ajax({
        type: "POST",
        url: 'players/add_new_player',
        data: {
            first_name: $('#player_first_name').val(),
            last_name: $('#player_last_name').val(),
            email: $('#player_email').val(),
            skill: $('#player_skill').val()
        },
        dataType: "JSON",
        success: function(data) {
            $.pjax({url: '/players?page=1', container: '#container'});
            $("#player-dialog-form").dialog('close');
            $('table tbody tr').first().hide().effect('highlight', {color: 'green'}).show();
            console.log(data);
        },
        error: function(xhr, textStatus, errorThrown){
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            var errors = "ERRORS -> \n";

            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });

            alert(errors);

            $('#new_player_btn').click();
        }
    });

}
