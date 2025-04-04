const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");

async function scrapeBooks() {
  // Create a new Chrome browser instance and navigate to the website URL.
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://books.toscrape.com/");
    // array to store titles and prices
    let titles = [];
    let prices = [];
    // loop through the first 2 pages
    for (let page = 1; page <= 2; page++) {
      // wait for page to load
      await driver.sleep(2000);
      // find all books
        const bookTitles = await driver.findElements(By.css("article.product_pod"));
      // extract title and price from each book
      for(let book of bookTitles) {
        let titleElement = await book.findElement(By.css("h3 > a"));
        let title = await titleElement.getAttribute("title");
        let priceElement = await book.findElement(By.css("p.price_color"));
        let price = await priceElement.getText();
        titles.push(title);
        prices.push(price);
      }
      // navigate to the next page
        if (page < 2) {
            let nextButton = await driver.findElement(By.css("li.next > a"));
            await nextButton.click();
        }
    }
    // print the results
    for(let i = 0; i < titles.length; i++) {
        console.log(`Title: ${titles[i]}, Price: ${prices[i]}`);
    }

    // save the results into csv file
    let cvsContent = 'Title,Price\n';
    for(let i = 0; i < titles.length; i++) {
        cvsContent += `"${titles[i]}","${prices[i]}"\n`;
    }
    fs.writeFileSync("books.csv", cvsContent);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // close the browser
    await driver.quit();
  }
}

// call the function that scraping to gather data from 2 first pages
scrapeBooks();