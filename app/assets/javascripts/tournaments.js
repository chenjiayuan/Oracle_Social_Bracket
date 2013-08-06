$(document).ready(function() {
    $('img').load(function() {
        $('.round').css({'height':($('.round-1').height()+'px')});

        $('#filler').height($('.round_container').height());
    });
    $('#filler').height($('.round_container').height());
    $('.round:last .matches-row .match-border').css('border', 'none');
    $('.matches-list').on("click", ".tournament_match_winner_btn", update_tournament_start_page);
    $('#container').on("click", "#new_tournament_btn", tour_form_show)
        .on("click", "#tournament_cancel_btn", tour_form_hide)
        .on("submit", "#tournament-dialog-form", send_tournament_form)
        .on("keyup", "input#tournament_search", search_tournament)
        .on("click", "#add_tournament_player_button", add_tournament_player_form)
        .on('click', '#edit_tournament_name_button', edit_tournament_name_popup_show)
        .on('submit', '#edit_tournament_name_form', send_edit_tournament_name_form);
});

function update_tournament_start_page(event) {
    var el = $(event.currentTarget);
    var this_button = $(this);
    event.preventDefault();
    $.ajax({
        type: 'POST',
        data: { 'match-id': el.data('match-id'), 'player-id': el.data('player-id'), 'round-id': el.data('round-id'), 'match-number': el.data('match-number')},
        url: 'winner',
        dataType: "JSON",
        success: (function(data) {
            var li = this_button.closest('li');
            li.append('<img alt="' + data.winner_name + '" class="gravatar" src="' + li.find('button').find('img').attr('src') + 
            '">' + data.winner_name);
            li.addClass('match-winner');

            if(el.data('player-number') == 1) {
                temp = li.next();
                temp.append('<img alt="' + data.loser_name + '" class="gravatar" src="' + temp.find('button').find('img').attr('src') + 
                '">' + data.loser_name);
                temp.addClass('match-loser');
            }
            else {
                temp = li.prev();
                temp.append('<img alt="' + data.loser_name + '" class="gravatar" src="' + temp.find('button').find('img').attr('src') + 
                '">' + data.loser_name);
                temp.addClass('match-loser');
            }
            var winner_button = '<button class="winner_btn tournament_match_winner_btn"' +
                ' data-match-id="' + data.next_match_id + '" data-player-id="' + data.player.id +
                '" data-round-id="' + (el.data('round-id') + 1) + '" data-match-number="'
                + data.next_match_number + '" data-player-number="' + data.next_match_player + '"on-click="update_tournament_start_page">' + '<img alt="'
                 + el.find('img').attr('alt') + '" class="gravatar" src="' + el.find('img').attr('src') + '">' + data.winner_name + '</button>' ;
            $('#match-' + el.data('match-id')).find('button').remove();
            if(data.next_match_id != 0){
                if(data.next_match_player == 1)
                    $('#match-' + data.next_match_id).find('li').first().append(winner_button);
                else
                    $('#match-' + data.next_match_id).find('li').first().next().append(winner_button);
            }
            else{
                $('#tournament-winner').html('Winner: <a href="/players/' + data.player.id + '">' + data.winner_name + '</a>');
            }
        })
    });
}


function tour_form_show(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#new_tournament_btn').fadeToggle("fast", function() {
        $('.create_form_tournament').fadeToggle("fast");
        $("input#tournament_name").focus();
    });
}

function tour_form_hide(event) {
    event.preventDefault();
    event.stopPropagation();
    $('.create_form_tournament').fadeToggle("fast", function() {
        $("input[type=text]").val("");
        $('#new_tournament_btn').fadeToggle("fast");
    });
}

function send_tournament_form(event) {
    event.preventDefault();
    var value = $('#tournament_name').val();
    $.ajax({
        type: 'POST',
        data: { name: value },
        url: 'tournaments/add_new_tournament',
        dataType: "JSON",
        success: (function(data) {
            $.pjax({url: '/tournaments?page=1', container: '#container'});
            var new_row = $("<tr data-tournament-id=" + data.tournament.id + ">" +
                "<td><a href='/tournaments/'" + data.tournament.id + ">" + data.tournament.name + "</td>" +
                "<td>0</td>" +
                "<td>Inactive</td>" +
                "<td></td>" +
                "</tr>");
            $('tbody').prepend(new_row.effect('highlight', {color: '#70ae21'}, '6000'));
        }),
        error: (function(xhr, textStatus, errorThrown) {
            var errors = "ERRORS -> \n";
            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });
            alert(errors);
            $('input#tournament_name').focus();
        })
    });
}

function search_tournament(event){
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        type: "POST",
        url: 'tournaments/search_tournaments',
        dataType: "JSON",
        data: { search_term: $('input#tournament_search').val() },
        beforeSend: function() {
            $('#ajax_spinner').show();
        },
        success: function(data) {
            var el = $('#tournaments_table');
            el.html("");
            var temp;
            for(var i = 0; i < data.search_result.length; i++){
                temp = data.search_result[i];
                el.append("<tr>" +
                    "<td><a href='/tournaments/" + temp.id + "'>" + temp.name + "</a></td>" +
                    "<td>" + temp.player_count + "</td>" +
                    "<td>" + temp.status + "</td>" +
                    "<td>" + (temp.winner_name == null ? "" : "<a href='/tournaments/" + temp.id
                    + "/players/" + temp.winner_id + "'>" + temp.winner_name + "</a>" ) + "</td>" +
                    "</tr>");
            }
        },
        complete: function(){
            $('#ajax_spinner').hide();
        }
    });
}

function add_tournament_player_form(event){
    event.preventDefault();
    event.stopPropagation();

    var form = $("#player-dialog-form").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 350,
        buttons: {
            "Create Player": function() {
                send_tournament_player_form(event);
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

function send_tournament_player_form(event){
    event.preventDefault();
    event.stopPropagation();

    $.ajax({
        type: "POST",
        url: '/players/add_new_player',
        data: {
            first_name: $('input#player_first_name').val(),
            last_name: $('input#player_last_name').val(),
            email: $('input#player_email').val(),
            skill: $('select#player_skill').val(),
            tournament_id: $('#add_tournament_player_button').data('tournament-id')
        },
        dataType: "JSON",
        success: function(data){
            $("#player-dialog-form").dialog('close');
            var new_html = '<tr><td><input id="player_ids_" name="player_ids[]" type="checkbox" value="' + data.player.id + '"></td>' +
                '<td><a href="/tournaments/' + data.tournament.id + '/players/' + data.player.id + '">' + data.player.full_name + '</a></td>' +
                '<td>' + data.player.email + '</td><td>' + data.player.skill  + '</td>' +
                '<td>' + data.player.matches_won + '</td>' +
                '</tr>';
            $('table tbody').append(new_html);
        },
        error: function(xhr, textStatus, errorThrown){
            var errors = "ERRORS -> \n";
            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });
            alert(errors);
            $('#add_tournament_player_button').click();
        }
    });
}

function edit_tournament_name_popup_show(event){
    event.preventDefault();
    event.stopPropagation();

    var form = $("#edit_tournament_name_form").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 350,
        title: "Edit Tournament Name",
        buttons: {
            "Update Tournament": function() {
                send_edit_tournament_name_form(event);
                $(this).remove();
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        close: function() {
            form.dialog('close');
        }
    });
    form.dialog('open').dialog("widget").find(".ui-dialog-titlebar-close").hide();   // hide the close button
}

function send_edit_tournament_name_form(event){
    event.preventDefault();
    var value = $('#tournament_name').val();
    var tournament_id = $('#edit_tournament_name_button').data('tournament-id');

    $.ajax({
        type: "PUT",
        data: {
            name: value,
            tournament_id: tournament_id
        },
        url: '/tournaments/' + tournament_id,
        dataType: "JSON",
        success: function(){
            $.pjax({url: '/tournaments/' + tournament_id, container: '#container'});
        },
        error: function(xhr, textStatus, errorThrown){
            var errors = "ERRORS -> \n";
            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });
            alert(errors);
            $('#edit_tournament_name_button').click();
        }
    })
}
