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


  /*this feels like overkill, should be able to pass the array to the index and helpers do the rest */
  const renderArticles = (articles) => {
    //this function relys on JQuery to dynamically render bootstrap cards to the page containing the articles
    //the initPage function passes all the unsaved articles in the db into the articleCards array
    const articleCards = [];
    // each article JSON object is passed to the createCard function
    for (const i = 0; i < articles.length; i++) {
      //articleCards.push(createCard(articles[i]));
      articleCards.push(articles[i]);
    }
    //append the array of articles to the articles container
    //the #each helper will neatly render each card to the page
    articleContainer.append(articleCards);
  }

  /*
  const createCard = (article) => {
  // constrcut article card from article json object
    const card = $("<div class='card'>");
    const cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='link' target='_blank' rel='link'>")
          .attr("href", article.link)
          .text(article.topic),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );

    const cardBody = $("<div class='card-body'>").text(article.desc);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }
  */

  const renderEmpty = () => {
    //Render this HTML to the page when there aren't any articles to display
    const emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>There aren't any new articles available at the momemnt.</h4>",
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
    // Appending the html to the page
    articleContainer.append(emptyAlert);
  }

  //event handler called when .btn.save class is clicked
  const handleArticleSave = () => {
    //grab the _id of this article (stored in the data-_id attribute)
    const articleToSave = $(this)
      .parents(".card") 
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    //change this articles saved boolean to true
    articleToSave.saved = true;
    
    //now update the db 
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
    }).catch((err) =>{
      //log error with morgan
      console.log(err);
    })
  }

  //event handler called when scrape-new class is clicked
  const handleArticleScrape = () => {
    //call on the axios route to scrape for articles (with the scrape Script)
    $.get("/api/axios").then(function (data) {
      //now reload the page with the newly scraped articles
      initPage();
    });
  }

  //event handler called when clear class clicked on
  const handleArticleClear = () => {
    $.get("api/clear").then(function () {
      articleContainer.empty();
      initPage();
    });
  }
});
