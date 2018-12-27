
$(document).ready(() => {

  //reference the article container div to append the articles
  const articleContainer = $(".article-container");

  //Adding event listeners for dynamically generated buttons for deleting articles,
  //pulling up article comments, saving article comments, and deleting article comments
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.comments", handleArticleComments);
  $(document).on("click", ".btn.save", handleCommentSave);
  $(document).on("click", ".btn.comment-delete", handleCommentDelete);
  $(".clear").on("click", handleArticleClear);

  const initPage = () => {
    // Run an AJAX request for any unsaved articles (use the 'saved' unique id set to false)
    $.get("/api/articles?saved=false").then((data) => {
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

  const renderCommentsList = data => {
    // This function handles rendering comment list items to our comments modal
    // Setting up an array of comments to render after finished
    // Also setting up a currentComment variable to temporarily store each comment
    const commentsToRender = [];
    const currentComment;
    if (!data.comments.length) {
      // If we have no comments, just display a message explaining this
      currentComment = $("<li class='list-group-item'>No comments for this article yet.</li>");
      commentsToRender.push(currentComment);
    } else {
      // If we do have comments, go through each one
      for (let i = 0; i < data.comments.length; i++) {
        // Constructs an li element to contain our commentText and a delete button
        currentComment = $("<li class='list-group-item comment'>")
          .text(data.comments[i].commentText)
          .append($("<button class='btn btn-danger comment-delete'>x</button>"));
        // Store the comment id on the delete button for easy access when trying to delete
        currentComment.children("button").data("_id", data.comments[i]._id);
        // Adding our currentComment to the commentsToRender array
        commentsToRender.push(currentComment);
      }
    }
    // Now append the commentsToRender to the comment-container inside the comment modal
    $(".comment-container").append(commentsToRender);
  }

  const handleArticleDelete = () => {
    // This function handles deleting articles/articles
    // We grab the id of the article to delete from the card element the delete button sits inside
    const articleToDelete = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    // Using a delete method here just to be semantic since we are deleting an article/headline
    $.ajax({
      method: "DELETE",
      url: "/api/articles/" + articleToDelete._id
    }).then((data) => {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }
  const handleArticleComments = event => {
    // This function handles opening the comments modal and displaying our comments
    // We grab the id of the article to get comments for from the card element the delete button sits inside
    const currentArticle = $(this)
      .parents(".card")
      .data();
    // Grab any comments with this headline/article id
    $.get("/api/comments/" + currentArticle._id).then((data) => {
      // Constructing our initial HTML to add to the comments modal
      const modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Comments For Article: " + currentArticle._id),
        $("<hr>"),
        $("<ul class='list-group comment-container'>"),
        $("<textarea placeholder='New Comment' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Comment</button>")
      );
      // Adding the formatted HTML to the comment modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      const commentData = {
        _id: currentArticle._id,
        comments: data || []
      };
      // Adding some information about the article and article comments to the save button for easy access
      // When trying to add a new comment
      $(".btn.save").data("article", commentData);
      // renderCommentsList will populate the actual comment HTML inside of the modal we just created/opened
      renderCommentsList(commentData);
    });
  }

  function handleCommentSave() {
    // This function handles what happens when a user tries to save a new comment for an article
    // Setting a constiable to hold some formatted data about our comment,
    // grabbing the comment typed into the input box
    const commentData;
    const newComment = $(".bootbox-body textarea")
      .val()
      .trim();
    // If we actually have data typed into the comment input field, format it
    // and post it to the "/api/comments" route and send the formatted commentData as well
    if (newComment) {
      commentData = { _headlineId: $(this).data("article")._id, commentText: newComment };
      $.post("/api/comments", commentData).then(() => {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleCommentDelete() {
    // This function handles the deletion of comments
    // First we grab the id of the comment we want to delete
    // We stored this data on the delete button when we created it
    const commentToDelete = $(this).data("_id");
    // Perform an DELETE request to "/api/comments/" with the id of the comment we're deleting as a parameter
    $.ajax({
      url: "/api/comments/" + commentToDelete,
      method: "DELETE"
    }).then(() => {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("api/clear")
      .then(() => {
        articleContainer.empty();
        initPage();
      });
  }
});
