$(document).ready(function() {
    $('.matches-list').on("click", ".match_winner_btn", update_match);
    $('#ncontainer').on("click", "#new_match_btn", show_match_form);
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

function show_match_form(event) {
    event.preventDefault();
}
