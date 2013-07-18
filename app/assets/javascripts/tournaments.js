$(document).ready(function() {

    $('.round').css({'height':($('.round-1').height()+'px')});

    $('.matches-list').on("click", ".tournament_match_winner_btn", update_start_page);

    $('#container').on("click", "#new_tournament_btn", tour_form_show);
    $('#container').on("click", "#tournament_cancel_btn", tour_form_hide);

    $('#container').on("submit", "#tournament-dialog-form", send_tournament_form);
    $('#filler').height($('.round_container').height());
    $('#container').on("keyup", "input#tournament_search", search_tournament);
});

function update_start_page(event) {
    var el = $(event.currentTarget);
    var this_button = $(this);
    event.preventDefault();

    $.ajax({
        type: 'POST',
        data: { 'match-id': el.data('match-id'), 'player-id': el.data('player-id'), 'round-id': el.data('round-id'), 'match-number': el.data('match-number')},
        url: 'winner',
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

            var winner_button = '<button class="winner_btn tournament_match_winner_btn"' +
                ' data-match-id="' + data.next_match_id + '" data-player-id="' + data.player.id +
                '" data-round-id="' + (el.data('round-id') + 1) + '" data-match-number="'
                + data.next_match_number + '" data-player-number="' + data.next_match_player + '"on-click="update_start_page">' + data.winner_name + '</button>';

            $('#match-' + el.data('match-id')).find('button').remove();


            if(data.next_match_id != 0){
                if(data.next_match_player == 1) {
                    $('#match-' + data.next_match_id).find('li').first().append(winner_button);

                }
                else{
                    $('#match-' + data.next_match_id).find('li').first().next().append(winner_button);
                }
            }
            else{
                $('#tournament-winner').html("Winner: " + data.winner_name);
            }

        })
    });
}


function tour_form_show(event) {
    console.log('show');
    event.preventDefault();
    event.stopPropagation();
    $('#new_tournament_btn').toggle("fast", function() {
        console.log('show_inner');
        $('.create_form_tournament').toggle("fast");
    });
}


function tour_form_hide(event) {
    console.log('hide');

    event.preventDefault();
    event.stopPropagation();
    $('.create_form_tournament').toggle("fast", function() {
        console.log('hide_inner');
        $(this).closest('form').find("input[type=text], textarea").val("");
        $('#new_tournament_btn').toggle("fast");
    });
}

function send_tournament_form(event) {
    event.preventDefault();
    var value = $('#tournament_name').val();
    var el = event.currentTarget;

    $.pjax({url: '/tournaments?page=1', container: '#container'});

    $.ajax({
        type: 'POST',
        data: { name: value },
        url: 'tournaments/add_new_tournament',
        dataType: "JSON",
        success: (function(data) {
            console.log(data);
            var repaginate = false

            if($('tbody tr').length == 5)
                repaginate = true;

            var new_row = $("<tr data-tournament-id=" + data.tournament.id + ">" +

                "<td><a href='/tournaments/'" + data.tournament.id + ">" + data.tournament.name + "</td>" +
                "<td>0</td>" +
                "<td>Inactive</td>" +
                "<td></td>" +
                "</tr>");

            $('tbody').prepend(new_row.effect('highlight', {color: '#70ae21'}, '6000'));

            if(repaginate)
                $('tbody tr').last().remove();
        }),
        error: (function(xhr, textStatus, errorThrown) {

            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);

            var errors = "ERRORS -> \n";

            $.each(xhr.responseJSON, function(key, value) {
                errors += key.toString().toLocaleUpperCase() + " " + value + "\n";
            });

            alert(errors);

            tour_form_show(event);

        })
    });
}

function createDialog(title, text, options) {
    return $("<div id='tournament-error-dialog' title='" + title + "'><p>" + text + "</p></div>").dialog(options);
}

function search_tournament(event){
    event.preventDefault();
    event.stopPropagation();

    $.ajax({
        type: "POST",
        url: 'tournaments/search_tournaments',
        dataType: "JSON",
        data: { search_term: $('input#tournament_search').val() },

        success: function(data) {
            console.log(data.search_result);
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
        }
    });
}

/*
 function showForm() {
 $('#dialog-form').submit(function(event) {
 event.preventDefault();
 var f = $(this);
 f.find('.ajax_message').html('Working...');
 f.find('input[type="submit"]').attr('disabled', true);
 $.ajax({
 url:  f.attr('action'),
 type: f.attr('method'),
 dataType: "html",
 data: f.serialize(),
 complete: function() {
 f.find('.ajax_message').html('&nbsp;');
 f.find('input[type="submit"]').attr('disabled', false);
 },
 success: function(data, textStatus, xhr) {
 $('#tournaments').append(data);
 f.find('input[type="text"], textarea').val('');
 },
 error: function() {
 alert("Please enter a tournament name.");
 }
 });
 });
 }
 */
