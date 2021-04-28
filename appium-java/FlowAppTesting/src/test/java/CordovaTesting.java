import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import java.net.MalformedURLException;
import java.net.URL;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Edition004_Web_Testing {

    private static By EMAIL = By.id("contactEmail");
    private static By MESSAGE = By.id("contactText");
    private static By SEND = By.cssSelector("input[type=submit]");
    private static By ERROR = By.cssSelector(".contactResponse");

//    @Test
//    public void testAppiumProSite_iOS() throws MalformedURLException {
//        DesiredCapabilities capabilities = new DesiredCapabilities();
//        capabilities.setCapability("platformName", "iOS");
//        capabilities.setCapability("platformVersion", "11.2");
//        capabilities.setCapability("deviceName", "iPhone 7");
//        capabilities.setCapability("browserName", "Safari");
//
//        // Open up Safari
//        IOSDriver driver = new IOSDriver<>(new URL("http://localhost:4723/wd/hub"), capabilities);
//        actualTest(driver);
//    }

    @Test
    public void testAppiumProSite_Android() throws MalformedURLException {
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability("platformName", "Android");
        capabilities.setCapability("deviceName", "Android Emulator");
        capabilities.setCapability("browserName", "Chrome");

        // Open up Safari
        AndroidDriver driver = new AndroidDriver(new URL("http://localhost:4723/wd/hub"), capabilities);
        actualTest(driver);
    }

    public void actualTest(AppiumDriver driver) {
        // Set up default wait
        WebDriverWait wait = new WebDriverWait(driver, 10);

        try {
            driver.get("http://appiumpro.com/contact");
            wait.until(ExpectedConditions.visibilityOfElementLocated(EMAIL))
                .sendKeys("foo@foo.com");
            driver.findElement(MESSAGE).sendKeys("Hello!");
            driver.findElement(SEND).click();
            String response = wait.until(ExpectedConditions.visibilityOfElementLocated(ERROR)).getText();

            // validate that we get an error message involving a captcha, which we didn't fill out
            Assert.assertThat(response, CoreMatchers.containsString("Captcha"));
        } finally {
            driver.quit();
        }

    }
}


// import java.io.File;
// import java.net.MalformedURLException;
// import java.net.URL;
// import java.util.Set;
// import java.util.concurrent.TimeUnit;

// import io.appium.java_client.android.AndroidDriver;
// import io.appium.java_client.remote.MobileCapabilityType;

// import org.openqa.selenium.By;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.remote.CapabilityType;
// import org.openqa.selenium.remote.DesiredCapabilities;
// import org.openqa.selenium.support.ui.ExpectedCondition;
// import org.openqa.selenium.support.ui.WebDriverWait;

// public class CordovaTesting {
// 	public static AndroidDriver driver;

// 	public static void main(String[] args) throws InterruptedException, MalformedURLException {

// 		File app = new File("C:\\Users\\RBento\\Documents\\GitHub\\nx-workspace-mobileapps\\appium-java\\FlowAppTesting\\src\\app\\app-debug.apk");
// 		DesiredCapabilities capabilities = new DesiredCapabilities();
// 		capabilities.setCapability("automationName", "UiAutomator2");

// 		// capabilities.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
// 		capabilities.setCapability(MobileCapabilityType.PLATFORM_VERSION, "10.0");
// 		capabilities.setCapability(MobileCapabilityType.DEVICE_NAME, "97717a89");
//     capabilities.setCapability(CapabilityType.BROWSER_NAME, "Chrome");
// 		// capabilities.setCapability(MobileCapabilityType.APP, app.getAbsolutePath());

// 		driver = new AndroidDriver(new URL("http://127.0.0.1:4723/wd/hub"), capabilities);

// 		driver.get("http://google.com");
// 		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
// 		driver.findElement(By.name("q")).sendKeys("Hello Appium !!!");

// 		// Thread.sleep(3000);

// 		// driver.quit();


// 		// waitForElementPresent(By.cssSelector("#submit"), 40);
// 		// driver.findElement(By.cssSelector("#submit")).click();
// //		Thread.sleep(30000);
// //		System.out.println(driver.getPageSource());

// //		waitForElementPresent(By.id("ext-comp-1024"), 40);
// //		driver.findElement(By.id("ext-comp-1024")).click();
// //
// //		Thread.sleep(10000);
// //
// //		waitForElementPresent(By.cssSelector("div[data-index='1']"), 40);
// //		driver.findElement(By.cssSelector("div[data-index='1']")).click();
// //
// //		contextNames = driver.getContextHandles();
// //		for (String contextName : contextNames) {
// //			System.out.println(contextName);
// //			if (contextName.contains("NATIVEVIEW")) {
// //				driver.context(contextName);
// //			}
// //		}

// 	}

// 	public static void waitForElementPresent(final By by, int timeOutInSeconds) {
// 		WebDriverWait wait = new WebDriverWait(driver, timeOutInSeconds);

// 		wait.until(new ExpectedCondition<Boolean>() {

// 			public Boolean apply(WebDriver d) {
// 				// TODO Auto-generated method stub
// 				return d.findElement(by).isDisplayed();
// 			}
// 		});
// 	}
// }
