// Import the Builder class from selenium webdriver
const { Builder, By } = require("selenium-webdriver");

async function loginHerokuApp() {
    // create a new Chrome browser instance
    let driver = await new Builder().forBrowser("chrome").build();
    // navigate to Google home page
    await driver.navigate().to("https://the-internet.herokuapp.com/login");
    // make the browser window ful screen
    await driver.manage().window().maximize();
    // wait for 3 seconds
    await driver.sleep(3000);
    // find the username input field and enter the 'tomsmith'
    const usernameField = await driver.findElement(By.xpath("//*[@id='username']"));
    await usernameField.sendKeys("tomsmith");

    // find the password input field and enter the 'SuperSecretPassword!'
    const passwordField = await driver.findElement(By.xpath("//*[@id='password']"));
    await passwordField.sendKeys("SuperSecretPassword");

    // find the login button and click it
    const loginButton = await driver.findElement(By.xpath("//*[@id='login']/button"));
    await loginButton.click();
    
    // log and check if login was successful
    try {
        const successMessage = await driver.findElement({ css: ".flash.success" });
        console.log("Login success");
        await driver.takeScreenshot().then(image => {
            require("fs").writeFileSync("login_success.png", image, "base64");
        });
    } catch (error) {
        console.log("Login failed: ", error);
        await driver.takeScreenshot().then(image => {
            require("fs").writeFileSync("login_failed.png", image, "base64");
        });
    }

    // wait for 2 seconds after clicking to allow the page respond
    await driver.sleep(2000);

    // close the browser
    await driver.quit();

    // print message to console
    console.log("TC02: handle login passed");
}

// Call the function to test
loginHerokuApp();
