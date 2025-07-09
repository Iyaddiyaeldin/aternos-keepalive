const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // سجل الدخول
  await page.goto('https://aternos.org/accounts/', { waitUntil: 'networkidle2' });
  await page.type('#user', process.env.ATERNOS_USER);
  await page.type('#password', process.env.ATERNOS_PASS);
  await Promise.all([
    page.click('button[type=submit]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);

  // اضغط +1 دقيقة إذا ظهر
  await page.goto('https://aternos.org/server/', { waitUntil: 'networkidle2' });
  const btn = await page.$('button.btn.btn-green.btn-xs');
  if (btn) {
    console.log('🕒 Found +1 minute button, clicking...');
    await btn.click();
  } else {
    console.log('⌛ No button right now.');
  }

  await browser.close();
})();
