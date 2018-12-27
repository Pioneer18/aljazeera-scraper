//wait for document to load 
$(document).ready(function () {

  //reference the article container div to append the articles
  const articleContainer = $(".article-container");
  //save article event handler
  $(document).on("click", ".btn.save", handleArticleSave);
  //scrape for new articles event handler
  $(document).on("click", ".scrape-new", handleArticleScrape);
  //clear articles event handler
  $(".clear").on("click", handleArticleClear);

  const initPage = () => {
    // Run an AJAX request for any unsaved articles (use the 'saved' unique id set to false)
    $.get("/api/articles?saved=false").then(function (data) {
      //clear out the container before rendering the latest articles
      articleContainer.empty();
      // If we have articles, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  const renderArticles = (articles) => {
    //this function relys on JQuery to dynamically render bootstrap cards to the page containing the articles
    //the initPage function passes all the unsaved articles in the db into the articleCards array
    const articleCards = [];
    // each article JSON object is passed to the createCard function
    for (const i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    //append the array of articles to the articles container
    //the #each helper will neatly render each card to the page
    articleContainer.append(articleCards);
  }

  const createCard = (article) => {
  // constrcut article card from article json object
    const card = $("<div class='card'>");
    const cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.link)
          .text(article.article),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );

    const cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  const renderEmpty = () => {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    const emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  const handleArticleSave = () => {
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    const articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/articles/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      // If the data was saved successfully
      if (data.saved) {
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
  }

  const handleArticleScrape = () => {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/api/fetch").then(function (data) {
      // If we are able to successfully scrape the NYTIMES and compare the articles to those
      // already in our collection, re render the articles on the page
      // and let the user know how many unique articles we were able to save
      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  const handleArticleClear = () => {
    $.get("api/clear").then(function () {
      articleContainer.empty();
      initPage();
    });
  }
});
