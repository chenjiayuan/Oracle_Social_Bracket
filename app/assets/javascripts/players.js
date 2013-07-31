$(document).ready(function (){
    $('#container').on("click", "#new_player_btn", player_form_show)
        .on("keyup", "input#player_search", search_player);
    $('#checkall').on("click", function(){
        $('td input[type="checkbox"]').click();
    });
});

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
            $('form').remove();
            $('table tbody tr').first().hide().effect('highlight', {color: 'green'}).show();
        },
        error: function(xhr, textStatus, errorThrown){
            var errors = "ERRORS -> \n";
            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });
            alert(errors);
            $('#new_player_btn').click();
        }
    });
}

function search_player(event){
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        type: "POST",
        url: 'players/search_players',
        dataType: "JSON",
        data: { search_term: $('input#player_search').val() },
        beforeSend: function() {
            $('#ajax_spinner').show();
        },
        success: function(data) {
            var el = $('#players_table');
            el.html("");
            var temp;
            for(var i = 0; i < data.search_result.length; i++){
                temp = data.search_result[i];
                el.append("<tr>" +
                    "<td><a href='/players/" + temp.id + "'>" + temp.first_name +
                    " " + temp.last_name + "</a></td>" +
                    "<td>" + temp.email + "</td>" +
                    "<td>" + temp.skill + "</td>" +
                    "<td>" + temp.matches_won + "</td>" +
                    "</tr>");
            }
        },
        complete: function(){
            $('#ajax_spinner').hide();
        }
    });
}

function player_form_show(event){
    event.preventDefault();
    event.stopPropagation();
    var form = $("#player-dialog-form").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 350,
        buttons: {
            "Create Player": function() {
                send_player_form(event);
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        close: function() {
            $('#player-dialog-form').find('input[type=text], input[type=email]').val("");
            form.dialog('destroy');
        }
    });
    form.dialog('open').dialog("widget").find(".ui-dialog-titlebar-close").hide();
}
