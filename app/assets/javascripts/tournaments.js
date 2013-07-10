$(document).ready(function() {
    //$('.create-tour-button').on("click", ajax_test);
    $('.round').css({'height':($('.round-1').height()+'px')});

    $('#matches-list').on("click", ".winner-button", update_start_page);

    $('#container').on("click", "#new_tournament_btn", tour_form_show);
    $('#container').on("click", "#tournament_cancel_btn", tour_form_hide);

    $('#container').on("submit", "#tournament-dialog-form", send_tournament_form);
    //$('.winner-button').click(update_start_page);
});

function update_start_page(event) {
    //alert(event.data.which_player);
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
            $('#match-' + el.data('match-id')).find('li').last().append(data.winner_name);

            var li = this_button.closest('li');
            li.addClass('match-winner');

            if(el.data('player-number') == 1) {
                li.next().addClass('match-loser');
            }

            else {
                li.prev().addClass('match-loser');
            }

            var winner_button = '<button class="winner-button"' +
                ' data-match-id="' + data.next_match_id + '" data-player-id="' + data.player.id +
                '" data-round-id="' + (el.data('round-id') + 1) + '" data-match-number="'
                + data.next_match_number + '" data-player-number="' + data.next_match_player + '"on-click="update_start_page">Winner?</button>';

            $('#match-' + el.data('match-id')).find('button').remove();


            if(data.next_match_id != 0){
                if(data.next_match_player == 1) {
                    $('#match-' + data.next_match_id).find('li').first().append(data.winner_name + " " + winner_button);

                }
                else{
                    $('#match-' + data.next_match_id).find('li').first().next().append(data.winner_name + " " + winner_button);
                }
            }
            else{
                $('#tournament-winner-' + data.tournament_id).append(data.winner_name);
            }

            this_button.remove();

        })
    });
}


function tour_form_show(event) {
    event.preventDefault();
    event.stopPropagation();
    //$('.create_form').slideToggle();
    $('.create_btn').fadeToggle("fast", function() {
        $('.create_form_tournament').fadeToggle("fast");
    });

    //$('.create_btn').sub
    //$('#dialog-form').show('slide', {direction: 'left'}, 1000);
    //return false;
}

function tour_form_hide(event) {
    event.preventDefault();
    event.stopPropagation();
    $('.create_form_tournament').fadeToggle("fast", function() {
        $(this).closest('form').find("input[type=text], textarea").val("");
        $('.create_btn').fadeToggle("fast");
    });
}

function send_tournament_form(event) {
    //alert('hi');
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
            var repaginate = false;

            if($('tbody tr').length == 5)
                repaginate = true;

            var new_row = $("<tr data-tournament-id=" + data.tournament.id + ">" +

                "<td><a href='/tournaments/'" + data.tournament.id + ">" + data.tournament.name + "</td>" +
                "<td>0</td>" +
                "<td>Inactive</td>" +
                "<td></td>" +
                "</tr>");

            $('tbody').prepend(new_row.hide().fadeIn());

            new_row.effect('highlight', {color: 'green'});

            //new_row.addClass('new-tournament-added');
            //new_row.removeClass('new-tournament-added');
            //$('#data-tournament-').first().fadeIn();

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

            //createDialog('hi', 'there', {show: 'blind', hide: 'explode'});

            tour_form_show(event);

            //$('#tournament-error-dialog').remove();
        })
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
