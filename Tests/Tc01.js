// Import the Builder class from selenium webdriver
const { Builder, By } = require("selenium-webdriver");

// Function to open Google in Chrome
async function openGoogleInChrome() {
  // create a new Chrome browser instance
  let driver = await new Builder().forBrowser("chrome").build();
  // navigate to Google home page
  await driver.navigate().to("https://www.google.com/");
  // make the browser window ful screen
  await driver.manage().window().maximize();
  // wait for 3 seconds
  await driver.sleep(3000);
  // clicking on the Sign in button xpath selector
  try {
    const btn = await driver.findElement(
      By.xpath("//*[@id='gb']/div/div[2]/a")
    );
    btn.click();
    console.log("Connexion button clicked successfully");
  } catch (error) {
    console.log(error);
  }
  // wait for a short time after clicking to allow for any page changes
  await driver.sleep(1000);
  // close the browser
  await driver.quit();
  // print message to console
  console.log("TC01: Writing Your First Selenium Script passed");
}

// Call the function to open Google Chrome
openGoogleInChrome();