$(document).ready(function() {
    $('.matches-list').on("click", ".match_winner_btn", update_match);
    $('#container').on("click", "#new_match_btn", match_form_show);
    $('#container').on('keyup', 'input#match_search', search_match);
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

//    console.log('hi');
    var form = $("#match-dialog-form").dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 350,

        buttons: {
            "Create Match": function() {
                send_match_form(event);
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },

        close: function() {
            $('#match-dialog-form').find('input[type=text]').val("");
            form.dialog('close');
            $('form').remove();
//            $('.create_btn').show();
        }
    });

    form.dialog('open');

    form.dialog("widget").find(".ui-dialog-titlebar-close").hide();   // hide the close button
}

function send_match_form(event){
    event.preventDefault();

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
            $('table tbody tr').first().hide().effect('highlight', {color: 'green', duration: 1200}).show();
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
