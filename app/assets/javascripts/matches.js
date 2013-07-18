$(document).ready(function() {
    $('.matches-list').on("click", ".match_winner_btn", update_match);
    $('#container').on("click", "#new_match_btn", match_form_show);
});

function update_match(event) {
    event.preventDefault();
    var el = $(event.currentTarget);
    var this_button = $(this);

    $.ajax({
        type: "POST",
        data: { 'match-id': el.data('match-id'), 'player-id': el.data('player-id'), 'round-id': el.data('round-id')},
        url: '../matches/' + el.data('match-id') + '/verdict',
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


            $('#match-winner').html("Winner: " + data.winner_name);

        })
    });
}

function match_form_show(event) {
    event.preventDefault();
    event.stopPropagation();

    //console.log('hi');
}
