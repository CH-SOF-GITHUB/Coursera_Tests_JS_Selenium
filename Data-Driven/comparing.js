const fs = require("fs");
const csv = require("csv-parser");
const { Builder, By } = require("selenium-webdriver");

let saveData = [];

//Read data from CSV tite
fs.createReadStream("books.csv")
  .pipe(csv())
  .on("data", (row) => {
    saveData.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    // proceed with the testing after reading the CSV file
    runPriceVerificationTest();
  });

async function runPriceVerificationTest() {
  // Initialize the web driver for Chrome
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // array to hold current website data
    let currentData = [];

    // loop through  the first two pages
    for (let page = 1; page <= 2; page++) {
      // navigate to the wevsite or next page
      if (page === 1) {
        await driver.navigate().to("https://books.toscrape.com/");
      } else {
        await driver
          .navigate()
          .to(`https://books.toscrape.com/catalogue/page-${page}.html`);
      }

      // wait for the page to load
      await driver.sleep(2000);
      // find all the book elements
      const bookTitles = await driver.findElements(By.css('article.product_pod'));
      // extract title and price from each book
      for (let book of bookTitles) {
        let titleElement = await book.findElement(By.css('h3 > a'));
        let title = await titleElement.getAttribute('title');
        let priceElement = await book.findElement(By.css('p.price_color'));
        let price = await priceElement.getText();
        currentData.push({ Title: title, Price: price });
      }

      // compare the current data with the saved data
      let discrepancies = [];
      for (let i = 0; i < saveData.length; i++) {
        let savedBook = saveData[i];
        let currentBook = currentData.find((book) => book.Title === savedBook.title);
        if (currentBook) {
          if (currentBook.Price !== savedBook.price) {
            discrepancies.push({
              title: currentBook.Title,
              savedPrice: savedBook.price,
              currentPrice: currentBook.Price,
            });
            console.log(
              `Price discrepency found for ${currentBook.title}: Saved Price = ${savedBook.price}, Current Price = ${currentBook.price}`
            );
          } else {
            console.log(
              `Price verified for "${savedBook.title}" : ${savedBook.price}`
            );
          }
        } else {
          console.log(
            `Book "${savedBook.title}" not found on the current page.`
          );
        }
      }
      // Opyionally, write the discrepancies to a file
      if (discrepancies.length > 0) {
        let discrepancyContent = `Title, SavedPrice, CurrentPrice\n`;
        for (let item of discrepancyContent) {
          discrepancyContent += `"${item.title}","${item.savedPrice}","${item.currentPrice}"\n`;
        }
        fs.writeFileSync("discrepancies_price.csv", discrepancyContent);
        console.log("Discrepancies saved to discrepancies_price.csv");
      } else {
        console.log("No discrepancies price found.");
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    // close the browser
    await driver.quit();
  }
}
