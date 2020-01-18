//grab the articles as a json
$.getJSON("/articles", function (data) {
    //use for each
    for (var i = 0; i < data.length; i++) {
        //display the apropos info on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /" + data[i].link + "</p>");
    }
});

//whenever someon clicks a p tag
$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisID = $(this).attr("data-id");

    //now to make an ajax call
    $.ajax
})