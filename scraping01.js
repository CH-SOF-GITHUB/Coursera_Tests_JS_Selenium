const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

async function webScraper() {
  // Create a new Chrome browser instance and navigate to the website URL.
  let driver = await new Builder().forBrowser("chrome").build();
  // make the browser window full screen
  await driver.manage().window().maximize();
  try {
    // navigate to website webscraper
    await driver.get(
      "https://webscraper.io/test-sites/e-commerce/static/computers/laptops"
    );
    // create 2 arrays to store titles and prices
    let titles = [];
    let prices = [];
    // loop through the first 2 pages
    for (let page = 1; page <= 2; page++) {
      // Added logic to detect and close the cookie banner using its id (cookieBanner) and a
      // button element inside it. Added a short delay  to ensure the banner disappears before proceeding.
      let cookieBannerFound = false;
      try {
        const cookieBanner = await driver.findElement(By.id("cookieBanner"));
        const closeButton = await cookieBanner.findElement(By.css("button"));
        if (cookieBanner.isEnabled()) {
          // Banner found
          cookieBannerFound = true;
          // take a screenshot of the cookie banner before closing it
          await driver.takeScreenshot().then((image) => {
            fs.writeFileSync(
              "Screenshots/cookie_banner_success.png",
              image,
              "base64"
            );
          });
          await closeButton.click();
          await driver.sleep(1000);
        } else {
          console.log("Cookie banner not found or already closed.");
          // take a screenshot of the cookie banner if it was found
          if (cookieBannerFound == false) {
            await driver.takeScreenshot().then((image) => {
              fs.writeFileSync(
                "Screenshots/cookie_banner_failed.png",
                image,
                "base64"
              );
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
      // wait for the page to load
      await driver.sleep(2000);
      // find all laptops elements
      const laptopElements = await driver.findElements(
        By.css(".container.test-site .card .card-body")
      );
      // extract title and price from each laptop
      for (let laptop of laptopElements) {
        let titleElement = await laptop.findElement(By.css("h4 > a"));
        let title = await titleElement.getText();
        let priceElement = await laptop.findElement(By.css("h4 > span"));
        let price = await priceElement.getText();
        titles.push(title);
        prices.push(price);
      }

      // navigate to the next page
      if (page < 2) {
        let next = await driver.findElement(By.linkText("2"));
        await next.click();
      }
    }
    // print the results
    for (let i = 0; i < titles.length; i++) {
      console.log(`Title: ${titles[i]}, Price: ${prices[i]}`);
    }
    // save the current results into a csv file
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // close the browser
    await driver.quit();
  }
}

// call the function that scraping to gather data from 2 first pages
webScraper();
