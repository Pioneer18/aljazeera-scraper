//wait till document loads
$(document).ready(function() {
    
	// Grab the articles as a json when page loads, append to the page
	$.getJSON("/articles", function(data) {
	  // For each one
	  for (var i = 0; i < data.length; i++) {
	    // Display the information on the page
	    $("#scrape-results").prepend("<div class='result-div'><p class='result-text'>" + data[i].topic + "<br>" +data[i].title + "<br>" + `<a href="https://aljazeera.com/${data[i].link}">Link</a>`  + "<br>" + data[i].desc  + "<br>" + data[i].time  + "<br>" +
	    	"</p>");
	  }
	});

	// Save article button changes the saved property of the article model from false to true
	$(document).on("click", ".save-article", function() {
		// change icon to check mark
		$(this).children("span.icon").children("i.fa-bookmark").removeClass("fa-bookmark").addClass("fa-check-circle");
		// Get article id
		var articleID = $(this).attr("data-id");
		console.log(articleID);
		// Run a POST request to update the article to be saved
	  $.ajax({
	    method: "POST",
	    url: "/save/" + articleID,
	    data: {
	      saved: true
	    }
	  }).done(function(data) {
      // Log the response
      console.log("data: ", data);
		});
	});


});
