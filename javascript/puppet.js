const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Base URL for the site
const baseUrl = "https://www.footballdb.com";

// Categories of stats we need to capture
const categories = [
    "passing", "rushing", "receiving", "scoring",
    "kickoffreturns", "puntreturns", "punting",
    "fieldgoals", "interceptions", "sacks"
];

// Define a realistic user agent
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36';

// Create directory to store screenshots
const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

async function takeScreenshot(page, url, category) {
    console.log(`Capturing screenshot for ${category}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    const screenshotPath = path.join(screenshotDir, `${category}_screenshot.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot saved to ${screenshotPath}`);
}

async function main() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);
        await page.setViewport({ width: 1920, height: 1080 });

        for (const category of categories) {
            const url = `${baseUrl}/statistics/nfl/player-stats/${category}/2024/regular-season?sort=defsack&limit=25`;
            console.log(`\nProcessing category: ${category}`);
            console.log(`URL: ${url}`);
            await takeScreenshot(page, url, category);
            console.log("-------------------------------");
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

main();