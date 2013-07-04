$(document).ready(function() {
    //$('.create-tour-button').on("click", ajax_test);
    $('.winner-button').click(update_start_page);
});

function update_start_page(event) {
    //alert(event.data.which_player);
    var el = $(event.currentTarget);
    event.preventDefault();

    $.ajax({
        type: 'POST',
        data: { 'match-id': el.data('match-id'), 'player-id': el.data('player-id'), 'round-id': el.data('round-id'), 'match-number': el.data('match-number')},
        url: 'winner',
        dataType: "JSON",
        success: (function(data) {
            console.log(data);
            $('#match-' + el.data('match-id')).find('li').last().append(data.winner_name);

            if(data.next_match_id != 0){
                if(data.next_match_player == 1)
                    $('#match-' + data.next_match_id).find('li').first().append(data.winner_name);
                else
                    $('#match-' + data.next_match_id).find('li').first().next().append(data.winner_name);
            }
            else{
                $('#tournament-winner-' + data.tournament_id).append(data.winner_name);
            }

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

