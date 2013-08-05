$(document).ready(function (){
    $('#container').on("click", "#new_player_btn", player_form_show)
        .on("keyup", "input#player_search", search_player)
        .on("click", "#edit_player_btn", player_edit_form_show)
        .on("click", '#checkall', function(){

        var checkall = $('#checkall').prop('checked');
        if (checkall) {
            //check all unchecked
            $('td input[type="checkbox"]:not(:checked)').prop('checked', true);
        } else {
            $('td input[type="checkbox"]').prop('checked', false);
        }
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

function player_edit_form_show(event){
    event.preventDefault();
    event.stopPropagation();

    var form = $("#player-dialog-form").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 350,
        buttons: {
            "Update Player": function() {
                send_player_edit_form(event);
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        close: function() {
            form.dialog('destroy');
        }
    });
    form.dialog('open').dialog("widget").find(".ui-dialog-titlebar-close").hide();
}

function send_player_edit_form(event){
    event.preventDefault();
    var el = $('#edit_player_btn');
    var player_id = el.data('player-id');
    var match_id = 0;
    var tournament_id = 0;

    if (typeof el.data('tournament-id') != 'undefined')
        tournament_id = el.data('tournament-id');
    else if (typeof el.data('match-id') != 'undefined')
        match_id = el.data('match-id');

    $.ajax({
        type: "POST",
        url: '/players/' + player_id + '/update_player_ajax',
        data: {
            first_name: $('#player_first_name').val(),
            last_name: $('#player_last_name').val(),
            email: $('#player_email').val(),
            skill: $('#player_skill').val(),
            player_id: player_id
        },
        dataType: "JSON",
        success: function(data){
            $("#player-dialog-form").dialog('close');
            $('form').remove();
            if (tournament_id != 0)
                $.pjax({url: '/tournaments/' + tournament_id + '/players/' + player_id, container: '#container'});
            else if(match_id != 0)
                $.pjax({url: '/matches/' + match_id + '/players/' + player_id, container: '#container'});
            else{
                $.pjax({url: '/players/' + player_id, container: '#container'});
            }
        },
        error: function(xhr, textStatus, errorThrown){
            var errors = "ERRORS -> \n";
            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });
            alert(errors);
            $('#edit_player_btn').click();
        }
    });
}
