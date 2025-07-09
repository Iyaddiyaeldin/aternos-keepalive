// keep-alive.js
const puppeteer = require('puppeteer');
const axios = require('axios');

const USERNAME = process.env.ATERNOS_USER;
const PASSWORD = process.env.ATERNOS_PASS;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // Optional
const SERVER_URL = 'https://aternos.org/server/';

async function sendDiscordMessage(message) {
  if (!WEBHOOK_URL) return;
  await axios.post(WEBHOOK_URL, { content: message });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/', { waitUntil: 'networkidle2' });

  // تسجيل الدخول
  await page.goto('https://aternos.org/servers/', { waitUntil: 'networkidle2' });
  await page.type('#user', USERNAME);
  await page.type('#password', PASSWORD);
  await page.click('#login');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await page.goto(SERVER_URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#start');

  const isOnline = await page.evaluate(() => {
    return document.querySelector('#statuslabel.online') !== null;
  });

  if (isOnline) {
    console.log("السيرفر مفتوح.");
    await sendDiscordMessage("✅ السيرفر بالفعل مفتوح على Aternos!");
  } else {
    console.log("السيرفر مغلق، سيتم تشغيله...");
    await page.click('#start');
    await page.waitForTimeout(5000);
    await sendDiscordMessage("🟢 تم تشغيل السيرفر على Aternos!");
  }

  await browser.close();
})();
