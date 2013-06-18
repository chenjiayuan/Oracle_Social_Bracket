$(document).ready(function() {
    $('.create-tour-button').on("click", ajax_test);
});

function sayHi() {
    alert("hi");
}

function ajax_test() {
    ajaxrequest = new XMLHttpRequest();

    ajaxrequest.onreadystatechange = function() {
        alert("yo");
    }

    ajaxrequest.send(null);
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

