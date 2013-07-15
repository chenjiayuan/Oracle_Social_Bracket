$(document).ready(function() {
    //$('.create-tour-button').on("click", ajax_test);

    $('.round').css({'height':($('.round-1').height()+'px')});

    $('.matches-list').on("click", ".tournament_match_winner_btn", update_start_page);

    $('#container').on("click", "#new_tournament_btn", tour_form_show);
    $('#container').on("click", "#tournament_cancel_btn", tour_form_hide);

    $('#container').on("submit", "#tournament-dialog-form", send_tournament_form);
    $('#filler').height($('.round_container').height());
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
            //$('#match-' + el.data('match-id')).find('li').last().append(data.winner_name);

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

//            this_button.remove();

        })
    });
}


function tour_form_show(event) {
    console.log('show');
    event.preventDefault();
    event.stopPropagation();
    //$('.create_form').slideToggle();
    $('#new_tournament_btn').toggle("fast", function() {
        console.log('show_inner');
        $('.create_form_tournament').toggle("fast");
    });

    //$('.create_btn').sub
    //$('#dialog-form').show('slide', {direction: 'left'}, 1000);
    //return false;
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

//            new_row.effect('highlight', {color: 'green'});


//            $('tbody').prepend("<tr data-tournament-id=" + data.tournament.id + ">" +
//
//                "<td><a href='/tournaments/'" + data.tournament.id + ">" + data.tournament.name + "</td>" +
//                "<td>0</td>" +
//                "<td>Inactive</td>" +
//                "<td></td>" +
//                "</tr>");
            //$('tbody tr').fadeIn();

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

//            console.log(xhr);
//            console.log(textStatus);
//            console.log(errorThrown);
//
//            alert(xhr.responseText);


            //createDialog('hi', 'there', {show: 'blind', hide: 'explode'});
            //$('#tournament-error-dialog').remove();
        })
    });
}

function createDialog(title, text, options) {
    return $("<div id='tournament-error-dialog' title='" + title + "'><p>" + text + "</p></div>").dialog(options);
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
