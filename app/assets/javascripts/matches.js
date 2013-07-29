$(document).ready(function() {
    $('.matches-list').on("click", ".match_winner_btn", update_match);
    $('#container').on("click", "#new_match_btn", match_form_show);
    $('#container').on('keyup', 'input#match_search', search_match);
//    $('#container').on('click', '.add_match_player_picker', add_match_player_picker);
    $('#container').on('click', '.remove_match_player', remove_match_player);
    $('#container').on('click', '.add_match_player', add_player_click_listener);
    $('body').on('click', '.player_picker_entry', player_picker_entry_click_listener);
});

function update_match(event) {
    event.preventDefault();
    var el = $(event.currentTarget);
    var this_button = $(this);

    $.ajax({
        type: "POST",
        data: { 'match-id': el.data('match-id'), 'player-id': el.data('player-id'), 'round-id': el.data('round-id')},
        url: '/matches/' + el.data('match-id') + '/verdict',
        dataType: "JSON",
        success: (function(data) {
            console.log(data);

            var li = this_button.closest('li');
            li.append(data.winner_name);
            li.addClass('match-winner');

            if(el.data('player-number') == 1) {
                li.next().append(data.loser_name);
                li.next().addClass('match-loser');
            }
            else {
                li.prev().append(data.loser_name);
                li.prev().addClass('match-loser');
            }

            $('#match-' + el.data('match-id')).find('button').remove();


            $('#match-winner').html('Winner: <a href="/players/' + data.player.id + '">' + data.winner_name + '</a>');

        })
    });
}

function match_form_show(event) {
    event.preventDefault();
    event.stopPropagation();

//    console.log('hi');
    var form = $("#match-dialog-form").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 350,

        buttons: {
            "Create Match": function() {
                send_match_form(event);
                $('form').remove();
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },

        close: function() {
            $('#match-dialog-form').find('input[type=text]').val("");
            form.dialog('close');

         //   $('.create_btn').show();
        }
    });

    form.dialog('open');

    form.dialog("widget").find(".ui-dialog-titlebar-close").hide();   // hide the close button
}

function send_match_form(event){
    event.preventDefault();
    event.stopPropagation();

    $.ajax({
        type: "POST",
        url: 'matches/add_new_match',
        data: {
            name: $('input#match_name').val()
        },
        dataType: "JSON",
        success: function(data) {
            $.pjax({url: '/matches?page=1', container: '#container'});
            $("#match-dialog-form").dialog('close');
            $('table tbody tr').first().effect('highlight', {color: 'green', duration: 6000});
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

            $('#new_match_btn').click();
        }
    });
}

function search_match(event) {
    event.preventDefault();
    event.stopPropagation();
//    console.log('hi');

    $.ajax({
        type: "POST",
        url: 'matches/search_matches',
        dataType: "JSON",
        data: { search_term: $('input#match_search').val() },

        success: function(data) {
            console.log(data);
            var el= $('#matches_table');
            el.html("");
            var temp;

            for(var i = 0; i < data.search_result.length; i++){
                temp = data.search_result[i];
                el.append("<tr>" +
                    "<td><a href='/matches/" + temp.id + "'>" + temp.name + "</a></td>" +
                    "<td>" + (temp.player1_id == 0 ? "" : "<a href='/matches/" + temp.id + "/players/" + temp.player1_id +
                    "'>" + temp.player1_name + "</a>") + "</td>" +
                    "<td>" + (temp.player2_id == 0 ? "" : "<a href='/matches/" + temp.id + "/players/" + temp.player2_id +
                    "'>" + temp.player2_name + "</a>") + "</td>" +
                    "<td>" + (temp.winner_id == 0 ? "" : "<a href='/matches/" + temp.id + "/players/" + temp.winner_id +
                    "'>" + temp.winner_name + "</a>") + "</td>" +
                    "</tr>");
            }

        }
    })
}

function remove_match_player(event) {
    event.preventDefault();
    event.stopPropagation();
    var el = $(event.currentTarget);
    var player_id = el.data('player-id');
    var player_row = el.data('player-number');
    var match_id = el.data('match-id')
    var button = $(this);

    $.ajax({
        type: "POST",
        url: '/matches/' + el.data('match-id') + '/remove_match_player',
        dataType: "JSON",
        data: {
            match_id: match_id,
            player_id: player_id
        },
        success: function(data) {

            if(player_row == 1){
                $('table:first tbody').find(button).closest('tr').html("<td><button class='btn add_match_player' " +
                    "data-player-number='1' data-match-id='" + match_id + "'>Add Player</button></td>" +
                    "<td></td><td></td><td></td><td></td>");
            }
            else {
                $('table:first tbody').find(button).closest('tr').html("<td><button class='btn add_match_player' " +
                    "data-player-number='2' data-match-id='" + match_id + "'>Add Player</button></td>" +
                    "<td></td><td></td><td></td><td></td>");
            }

            if(!$('#add_new_player_button').is(":visible"))
                $('#add_new_player_button').show();

        }


    })

}

function add_player_click_listener(event){
    event.preventDefault();
    event.stopPropagation();

    var el = $(event.currentTarget);
    var match_id = el.data('match-id');

    console.log('hi');

    $.ajax({
        type: "GET",
        url: '/matches/' + el.data('match-id') + '/non_match_players',

        beforeSend: function() {
            $('#ajax_spinner').show();
        },
        success:function(data){
            var players_div = $('#match_player_picker_body');
//            players_div.append("<%= will_paginate" + data.players + " %>");
            console.log(data);
            for(var i = 0; i < data.players.length; i++){
                var temp = data.players[i];
                players_div.append('<tr class="player_picker_entry" data-player-id="' + temp.id + '" data-match-id="' + match_id + '"><td>' + temp.full_name + '</td><td>' + temp.skill + '</td></tr>');
            }
        },
        complete: function() {
            $('#ajax_spinner').hide();
        }
    });

    var form = $("#match_player_picker_wrapper").dialog({
        title: 'Add Existing Players',
        autoOpen: false,
        modal: true,
        width: 400,
        height: 400,
        draggable: false,
        buttons: {
            "Add Player": function() {
                if($('#match_player_picker tr').hasClass('highlightEntry')){
                    send_match_player_picker_form(event);
                    $(this).dialog('close');
                }
                else{
                    alert('No Player selected');
                }
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },

        close: function() {
            form.dialog('destroy');
//            $(this).dialog('destroy').dialog('widget').remove();
            $('#match_player_picker .highlightEntry').removeClass('highlightEntry');
            $('#match_player_picker_body').empty();
//            $('#match_player_picker').remove();
//          ('form').remove();
//            $('.create_btn').show();
        }
    });

    form.dialog('open');

    form.dialog("widget").find(".ui-dialog-titlebar-close").hide();   // hide the close button

}

function player_picker_entry_click_listener(event){
    event.preventDefault();
    event.stopPropagation();
    var el = $(event.currentTarget);
    var table_rows = $('#match_player_picker tr');
    var hasClass = $(this).hasClass('highlightEntry');

    $('#match_player_picker .highlightEntry').removeClass('highlightEntry');

    if(!hasClass)
        $(this).addClass('highlightEntry');

//    console.log('hi');

}

function send_match_player_picker_form(event){
    event.preventDefault();
    event.stopPropagation();

    var el = $('#match_player_picker .highlightEntry');
    var match_id = el.data('match-id');
    var player_id = el.data('player-id');

    $.ajax({
        type: "POST",
        data: {
            match_id: match_id,
            player_id: player_id
        },
        url: '/matches/' + el.data('match-id') + '/add_player_from_player_picker',
        dataType: "JSON",
        success: function(data){
            console.log(data);
            if(data.row == 1){
                $('table:first tbody tr:first').html("<td><a href='/matches/" + match_id +
                    "/players/" + player_id + "'>" + data.player.full_name + "</a></td><td>" + data.player.email + "</td>" +
                    "<td>" + data.player.skill + "</td><td>" + data.player.matches_won + "</td>" +
                    "<td>" + "<button class='btn remove_match_player' data-player-number='1' data-match-id='" + match_id + "' " +
                    "data-player-id='" + player_id + "'>Remove Player</button>" + "</td>");
            }
            else{
                $('table:first tbody tr:last').html("<td><a href='/matches/" + match_id +
                    "/players/" + player_id + "'>" + data.player.full_name + "</a></td><td>" + data.player.email + "</td>" +
                    "<td>" + data.player.skill + "</td><td>" + data.player.matches_won + "</td>" +
                    "<td>" + "<button class='btn remove_match_player' data-player-number='2' data-match-id='" + match_id + "' " +
                    "data-player-id='" + player_id + "'>Remove Player</button>" + "</td>");
            }

            if(data.player_count == 2)
                $('#add_new_player_button').hide();
        }
    });

}

