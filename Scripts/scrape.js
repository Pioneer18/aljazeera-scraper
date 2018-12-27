//the scrape script
//scrape the aljazeera website for the latest articles

//Dependencies 
const axios = require('axios');
const cheerio = require('cheerio');

//function to scrape aljazeera.com
const scrape = () => {
    return axios.get('https://www.aljazeera.com').then((res) => {
        
        //load the HTML  into cheerio and save it to a variable
        const $ = cheerio.load(response.data);

         // Make an empty array to save collected article info
        const articles = [];

        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("div.top-section-lt").each(function (i, element) {

            // Save the text of the element in a "title" variable
            const topic = $(element).find("div.top-feature-overlay-cont").find("p.big-image-label").text().trim();

            // In the currently selected element, look at its child elements (i.e., its a-tags),
            // then save the values for any "href" attributes that the child elements may have
            const title = $(element).find("div.top-feature-overlay-cont").find("a").find("h2.top-sec-title").text().trim();
            //find the article description
            const link = $(element).find("div.top-feature-overlay-cont").find("a").next("a").attr("href");

            const desc = $(element).find("div.top-feature-overlay-cont").find("p.top-sec-desc").text().trim();

            //if a title and desc have been grabbed
            if(desc && title) {
                //Use regular expressions and the trim function to clean up the title and summary
                //This is removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
                var titleNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var descNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
            }

            //create an object to hold scraped variables
            const newArticle = {
                topic: topic,
                title: titleNeat,
                desc: descNeat,
                link: link
            };

            articles.push(newArticle);
        });
        return articles;
    });
};

//export the scrape function so that the axios route can use it
module.exports = scrape;