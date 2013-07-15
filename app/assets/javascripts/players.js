$(document).ready(function (){
    $('#container').on("click", "#new_player_btn", player_form_show);
    //$('#container').on("click", "#player_cancel_btn", player_form_hide);
    //$('#container').on("submit", "#player-dialog-form", send_player_form);
    //$('#container').on("click", "#create_player_btn", create_player);

    $('#checkall').on("click", function(){
        $('td input[type="checkbox"]').click();
    });

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

                $.ajax({
                    type: "POST",
                    url: 'add_new_player'
                });

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
//
//        open: function() {
//            $(".ui-dialog-buttonset")
//                .find(".ui-button:first") // the first button
//                .attr('id', "create_player_btn");
//        },
        close: function() {
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
        url: 'add_new_player',
        data: {},
        dataType: "JSON",
        success: function(data) {

        }
    });

}
